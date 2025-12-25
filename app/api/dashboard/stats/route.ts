import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info with broker details
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
      include: {
        broker: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all accounts for this client
    const accounts = await prisma.account.findMany({
      where: { clientId: client.id },
    });

    // Calculate total assets (sum of all account balances)
    const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Get total deposits
    const deposits = await prisma.deposit.findMany({
      where: {
        account: {
          clientId: client.id,
        },
        status: "COMPLETED",
      },
    });

    const totalDeposits = deposits.reduce((sum, dep) => sum + dep.amount, 0);

    // Get recent transactions (last 5)
    const recentTransactions = await prisma.deposit.findMany({
      where: {
        account: {
          clientId: client.id,
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        account: true,
      },
    });

    // Get portfolio performance (mock APY for now)
    const apy = 12.3;

    return NextResponse.json({
      broker: client.broker,
      totalAssets,
      totalDeposits,
      apy,
      accountsCount: accounts.length,
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        type: "Deposit",
        amount: tx.amount,
        currency: tx.account.currency,
        status: tx.status,
        date: tx.createdAt,
      })),
      accounts: accounts.map((acc) => ({
        id: acc.id,
        accountId: acc.accountId,
        balance: acc.balance,
        currency: acc.currency,
        accountType: acc.accountType,
        status: acc.status,
      })),
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
