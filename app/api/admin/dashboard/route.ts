import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check here

    // Get total clients count
    const totalClients = await prisma.client.count();

    // Get total deposits in last 24h
    const last24h = new Date(Date.now() - 86400000);
    const depositsLast24h = await prisma.deposit.findMany({
      where: {
        createdAt: { gte: last24h },
        status: "COMPLETED",
      },
    });
    const totalDeposits = depositsLast24h.reduce((sum, d) => sum + d.amount, 0);

    // Get total withdrawals in last 24h
    const withdrawalsLast24h = await prisma.withdrawal.findMany({
      where: {
        createdAt: { gte: last24h },
        status: "COMPLETED",
      },
    });
    const totalWithdrawals = withdrawalsLast24h.reduce((sum, w) => sum + w.amount, 0);

    // Calculate net revenue (deposits - withdrawals)
    const netRevenue = totalDeposits - totalWithdrawals;

    // Get active traders (clients with at least one account)
    const activeTraders = await prisma.client.count({
      where: {
        accounts: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    });

    // Get pending alerts count
    const pendingDeposits = await prisma.deposit.count({
      where: { status: "PENDING" },
    });
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { status: "PENDING" },
    });
    const pendingAlerts = pendingDeposits + pendingWithdrawals;

    // Get recent activity (last 10 transactions - deposits + withdrawals)
    const recentDeposits = await prisma.deposit.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        account: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const recentWithdrawals = await prisma.withdrawal.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        account: {
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Combine and sort recent activities
    const recentActivity = [
      ...recentDeposits.map((d) => ({
        id: d.id,
        type: "Deposit",
        clientName: `${d.account.client.firstName} ${d.account.client.lastName}`,
        accountId: d.account.accountId,
        amount: d.amount,
        status: d.status,
        createdAt: d.createdAt,
      })),
      ...recentWithdrawals.map((w) => ({
        id: w.id,
        type: "Withdrawal",
        clientName: `${w.account.client.firstName} ${w.account.client.lastName}`,
        accountId: w.account.accountId,
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Get fund flow data (last 6 months)
    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);

    const monthlyDeposits = await prisma.deposit.findMany({
      where: {
        createdAt: { gte: last6Months },
        status: "COMPLETED",
      },
    });

    const monthlyWithdrawals = await prisma.withdrawal.findMany({
      where: {
        createdAt: { gte: last6Months },
        status: "COMPLETED",
      },
    });

    // Group by month for fund flow chart
    const fundFlowData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthName = monthDate.toLocaleString("default", { month: "short" });

      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const depositsInMonth = monthlyDeposits
        .filter((d) => new Date(d.createdAt) >= monthStart && new Date(d.createdAt) <= monthEnd)
        .reduce((sum, d) => sum + d.amount, 0);

      const withdrawalsInMonth = monthlyWithdrawals
        .filter((w) => new Date(w.createdAt) >= monthStart && new Date(w.createdAt) <= monthEnd)
        .reduce((sum, w) => sum + w.amount, 0);

      fundFlowData.push({
        month: monthName,
        revenue: depositsInMonth - withdrawalsInMonth,
      });
    }

    // Get client growth data (last 6 months)
    const clientGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthName = monthDate.toLocaleString("default", { month: "short" });

      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const clientsInMonth = await prisma.client.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      clientGrowthData.push({
        month: monthName,
        clients: clientsInMonth,
      });
    }

    return NextResponse.json({
      kpis: {
        totalClients,
        totalDeposits,
        totalWithdrawals,
        netRevenue,
        activeTraders,
        pendingAlerts,
      },
      recentActivity,
      fundFlowData,
      clientGrowthData,
    });
  } catch (error: any) {
    console.error("Admin dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
