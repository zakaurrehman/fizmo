import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch all deposits for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all deposits for this client's accounts
    const deposits = await prisma.deposit.findMany({
      where: {
        account: {
          clientId: client.id,
        },
      },
      include: {
        account: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ deposits });
  } catch (error: any) {
    console.error("Deposits fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new deposit
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, amount, paymentMethod } = body;

    // Validate input
    if (!accountId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 50 || amountNum > 50000) {
      return NextResponse.json(
        { error: "Amount must be between $50 and $50,000" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Verify account belongs to client
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        clientId: client.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Create the deposit
    const deposit = await prisma.deposit.create({
      data: {
        accountId: account.id,
        amount: amountNum,
        paymentMethod,
        status: "PENDING",
      },
      include: {
        account: true,
      },
    });

    // For demo purposes, auto-approve deposits to DEMO accounts
    if (account.accountType === "DEMO") {
      await prisma.deposit.update({
        where: { id: deposit.id },
        data: { status: "COMPLETED" },
      });

      // Update account balance
      await prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { increment: amountNum },
          equity: { increment: amountNum },
        },
      });
    }

    return NextResponse.json({ deposit }, { status: 201 });
  } catch (error: any) {
    console.error("Deposit creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
