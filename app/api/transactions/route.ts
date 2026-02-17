import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Fetch deposits and withdrawals in parallel
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.withdrawal.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    // Also fetch internal transfers from ledger
    const accounts = await prisma.account.findMany({
      where: { clientId: client.id },
      select: { id: true, accountId: true },
    });
    const accountIds = accounts.map((a) => a.id);

    const transferEntries = await prisma.ledgerEntry.findMany({
      where: {
        accountId: { in: accountIds },
        type: { in: ["TRANSFER_IN", "TRANSFER_OUT"] },
      },
      include: {
        account: { select: { accountId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Build unified transaction list
    const transactions: any[] = [];

    for (const d of deposits) {
      transactions.push({
        id: d.id,
        type: "DEPOSIT",
        method: d.paymentMethod.replace("_", " "),
        amount: Number(d.amount),
        currency: d.currency,
        status: d.status,
        date: d.createdAt,
        reference: d.providerTx || d.referenceNumber || "-",
      });
    }

    for (const w of withdrawals) {
      transactions.push({
        id: w.id,
        type: "WITHDRAWAL",
        method: w.paymentMethod.replace("_", " "),
        amount: Number(w.amount),
        currency: w.currency,
        status: w.status,
        date: w.createdAt,
        reference: w.providerTx || "-",
      });
    }

    // Group transfer entries by txRef (pairs of IN/OUT)
    const seen = new Set<string>();
    for (const entry of transferEntries) {
      if (!entry.txRef || seen.has(entry.txRef)) continue;
      seen.add(entry.txRef);
      transactions.push({
        id: entry.txRef,
        type: "INTERNAL_TRANSFER",
        method: "Internal",
        amount: Math.abs(Number(entry.amount)),
        currency: entry.currency,
        status: "COMPLETED",
        date: entry.createdAt,
        reference: entry.description || "-",
      });
    }

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate summary
    const completedDeposits = deposits.filter((d) => d.status === "COMPLETED");
    const completedWithdrawals = withdrawals.filter((w) => w.status === "COMPLETED");
    const pendingItems = [...deposits, ...withdrawals].filter((t) => t.status === "PENDING");

    const summary = {
      totalDeposits: completedDeposits.reduce((sum, d) => sum + Number(d.amount), 0),
      depositCount: completedDeposits.length,
      totalWithdrawals: completedWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0),
      withdrawalCount: completedWithdrawals.length,
      pendingAmount: pendingItems.reduce((sum, t) => sum + Number(t.amount), 0),
      pendingCount: pendingItems.length,
    };

    return NextResponse.json({
      success: true,
      data: { transactions, summary },
    });
  } catch (error: any) {
    console.error("Transactions error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
