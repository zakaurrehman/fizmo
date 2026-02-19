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
    const totalAssets = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Get total deposits
    const deposits = await prisma.deposit.findMany({
      where: {
        clientId: client.id,
        status: "COMPLETED",
      },
    });

    const totalDeposits = deposits.reduce((sum, dep) => sum + Number(dep.amount), 0);

    // Get recent transactions (last 5 deposits)
    const recentTransactions = await prisma.deposit.findMany({
      where: {
        clientId: client.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Build 6-month portfolio balance history from deposits
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const allDeposits = await prisma.deposit.findMany({
      where: { clientId: client.id, status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
    });

    // Build cumulative monthly totals for last 6 months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const portfolioHistory = [];
    let cumulativeBalance = 0;

    // Sum deposits before the 6-month window as starting balance
    for (const dep of allDeposits) {
      if (new Date(dep.createdAt) < sixMonthsAgo) {
        cumulativeBalance += Number(dep.amount);
      }
    }

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthDeposits = allDeposits
        .filter((d) => {
          const date = new Date(d.createdAt);
          return date >= monthDate && date <= monthEnd;
        })
        .reduce((sum, d) => sum + Number(d.amount), 0);

      cumulativeBalance += monthDeposits;
      portfolioHistory.push({
        name: monthNames[monthDate.getMonth()],
        value: cumulativeBalance,
      });
    }

    // Calculate APY based on deposit growth (simplified)
    const firstMonthValue = portfolioHistory[0]?.value || 0;
    const lastMonthValue = portfolioHistory[portfolioHistory.length - 1]?.value || 0;
    const apy = firstMonthValue > 0
      ? Number((((lastMonthValue - firstMonthValue) / firstMonthValue) * 100).toFixed(1))
      : 0;

    return NextResponse.json({
      broker: client.broker,
      totalAssets,
      totalDeposits,
      apy,
      portfolioHistory,
      accountsCount: accounts.length,
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        type: "Deposit",
        amount: Number(tx.amount),
        currency: tx.currency,
        status: tx.status,
        date: tx.createdAt,
      })),
      accounts: accounts.map((acc) => ({
        id: acc.id,
        accountId: acc.accountId,
        balance: Number(acc.balance),
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
