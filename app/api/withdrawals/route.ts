import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch all withdrawals for the logged-in user
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

    // Get all withdrawals for this client's accounts
    const withdrawals = await prisma.withdrawal.findMany({
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

    return NextResponse.json({ withdrawals });
  } catch (error: any) {
    console.error("Withdrawals fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new withdrawal request
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, amount, paymentMethod, paymentDetails } = body;

    // Validate input
    if (!accountId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 50 || amountNum > 10000) {
      return NextResponse.json(
        { error: "Amount must be between $50 and $10,000" },
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

    // Check if account has sufficient balance
    if (account.balance < amountNum) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create the withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        accountId: account.id,
        amount: amountNum,
        paymentMethod,
        paymentDetails: paymentDetails || "",
        status: "PENDING",
      },
      include: {
        account: true,
      },
    });

    // Deduct amount from account (put on hold)
    await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: { decrement: amountNum },
        equity: { decrement: amountNum },
      },
    });

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (error: any) {
    console.error("Withdrawal creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
