import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch transfer history
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get client
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Get all accounts for this client
    const accounts = await prisma.account.findMany({
      where: { clientId: client.id },
      select: { id: true },
    });

    const accountIds = accounts.map((acc) => acc.id);

    // Get transfer history (TRANSFER_IN and TRANSFER_OUT from ledger)
    const transfers = await prisma.ledgerEntry.findMany({
      where: {
        accountId: { in: accountIds },
        type: { in: ["TRANSFER_IN", "TRANSFER_OUT"] },
      },
      include: {
        account: {
          select: {
            accountId: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to last 100 transfers
    });

    // Group transfers by txRef to pair TRANSFER_IN with TRANSFER_OUT
    const transferMap = new Map();

    transfers.forEach((transfer) => {
      if (!transfer.txRef) return;

      if (!transferMap.has(transfer.txRef)) {
        transferMap.set(transfer.txRef, {
          id: transfer.txRef,
          fromAccount: null,
          toAccount: null,
          amount: 0,
          createdAt: transfer.createdAt,
        });
      }

      const group = transferMap.get(transfer.txRef);

      if (transfer.type === "TRANSFER_OUT") {
        group.fromAccount = transfer.account.accountId;
        group.amount = Math.abs(Number(transfer.amount));
      } else if (transfer.type === "TRANSFER_IN") {
        group.toAccount = transfer.account.accountId;
      }
    });

    const transferHistory = Array.from(transferMap.values()).filter(
      (t) => t.fromAccount && t.toAccount
    );

    return NextResponse.json({
      transfers: transferHistory,
      success: true,
    });
  } catch (error: any) {
    console.error("Get transfers error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transfers" },
      { status: 500 }
    );
  }
}

// POST - Create internal transfer
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fromAccountId, toAccountId, amount } = body;

    // Validation
    if (!fromAccountId || !toAccountId || !amount) {
      return NextResponse.json(
        { message: "From account, to account, and amount are required" },
        { status: 400 }
      );
    }

    if (fromAccountId === toAccountId) {
      return NextResponse.json(
        { message: "Cannot transfer to the same account" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    // Get client
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Verify both accounts belong to this client
    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findFirst({
        where: { id: fromAccountId, clientId: client.id },
      }),
      prisma.account.findFirst({
        where: { id: toAccountId, clientId: client.id },
      }),
    ]);

    if (!fromAccount || !toAccount) {
      return NextResponse.json(
        { message: "One or both accounts not found or do not belong to you" },
        { status: 404 }
      );
    }

    // Check sufficient balance
    if (Number(fromAccount.balance) < amount) {
      return NextResponse.json(
        { message: "Insufficient balance in source account" },
        { status: 400 }
      );
    }

    // Generate transfer reference
    const txRef = `TRF-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    // Perform transfer using Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from source account
      const updatedFromAccount = await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Add to destination account
      const updatedToAccount = await tx.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create ledger entries for audit trail
      await tx.ledgerEntry.createMany({
        data: [
          {
            entryId: `${txRef}-OUT`,
            accountId: fromAccountId,
            type: "TRANSFER_OUT",
            amount: -amount,
            currency: fromAccount.currency,
            balanceAfter: updatedFromAccount.balance,
            txRef,
            description: `Transfer to ${toAccount.accountId}`,
          },
          {
            entryId: `${txRef}-IN`,
            accountId: toAccountId,
            type: "TRANSFER_IN",
            amount: amount,
            currency: toAccount.currency,
            balanceAfter: updatedToAccount.balance,
            txRef,
            description: `Transfer from ${fromAccount.accountId}`,
          },
        ],
      });

      return { updatedFromAccount, updatedToAccount };
    });

    return NextResponse.json({
      message: "Transfer completed successfully",
      transfer: {
        txRef,
        fromAccount: fromAccount.accountId,
        toAccount: toAccount.accountId,
        amount,
        fromBalance: Number(result.updatedFromAccount.balance),
        toBalance: Number(result.updatedToAccount.balance),
      },
      success: true,
    });
  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { message: "Transfer failed. Please try again." },
      { status: 500 }
    );
  }
}
