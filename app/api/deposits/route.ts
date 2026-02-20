import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { sendDepositConfirmation, sendAdminDepositAlert } from "@/lib/email";

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

    // Get all deposits for this client
    const deposits = await prisma.deposit.findMany({
      where: {
        clientId: client.id,
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

// POST - Create a new deposit (for bank transfers - card/crypto use /api/payments/*)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, paymentMethod = "BANK_TRANSFER" } = body;

    // Validate input
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
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
      include: {
        accounts: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Create the deposit linked to client (not account)
    const deposit = await prisma.deposit.create({
      data: {
        brokerId: client.brokerId,
        clientId: client.id,
        amount: amountNum,
        currency: "USD",
        paymentMethod: paymentMethod,
        status: "PENDING",
      },
    });

    // For demo accounts, auto-approve deposits
    if (client.accounts.length > 0 && client.accounts[0].accountType === "DEMO") {
      await prisma.deposit.update({
        where: { id: deposit.id },
        data: { status: "COMPLETED" },
      });

      // Update account balance
      await prisma.account.update({
        where: { id: client.accounts[0].id },
        data: {
          balance: { increment: amountNum },
          equity: { increment: amountNum },
        },
      });

      // Send confirmation email for completed deposit
      await sendDepositConfirmation(
        user.email,
        amountNum,
        client.accounts[0].accountId,
        client.firstName || undefined
      );
    } else if (client.accounts.length > 0) {
      // For live accounts, send pending confirmation email
      await sendDepositConfirmation(
        user.email,
        amountNum,
        client.accounts[0].accountId,
        client.firstName || undefined
      );
    }

    // Send admin alert for all deposits
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true },
    });

    if (adminUsers.length > 0) {
      await sendAdminDepositAlert(
        adminUsers[0].email,
        user.email,
        amountNum,
        client.accounts[0]?.accountId || "N/A"
      );
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
