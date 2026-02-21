import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get broker information
    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
      },
    });

    // Get total clients count within this broker
    const totalClients = await prisma.client.count({ where: { brokerId } });

    // Get total deposits in last 24h within this broker
    const last24h = new Date(Date.now() - 86400000);
    const depositsLast24h = await prisma.deposit.findMany({
      where: {
        brokerId,
        createdAt: { gte: last24h },
        status: "COMPLETED",
      },
    });
    const totalDeposits = depositsLast24h.reduce((sum, d) => sum + Number(d.amount), 0);

    // Get total withdrawals in last 24h within this broker
    const withdrawalsLast24h = await prisma.withdrawal.findMany({
      where: {
        brokerId,
        createdAt: { gte: last24h },
        status: "COMPLETED",
      },
    });
    const totalWithdrawals = withdrawalsLast24h.reduce((sum, w) => sum + Number(w.amount), 0);

    // Calculate net revenue (deposits - withdrawals)
    const netRevenue = totalDeposits - totalWithdrawals;

    // Get active traders (clients with at least one account) within this broker
    const activeTraders = await prisma.client.count({
      where: {
        brokerId,
        accounts: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    });

    // Get pending alerts count within this broker
    const pendingDeposits = await prisma.deposit.count({
      where: { brokerId, status: "PENDING" },
    });
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { brokerId, status: "PENDING" },
    });
    const pendingAlerts = pendingDeposits + pendingWithdrawals;

    // Get recent activity (last 10 transactions - deposits + withdrawals) within this broker
    const recentDeposits = await prisma.deposit.findMany({
      where: { brokerId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            clientId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const recentWithdrawals = await prisma.withdrawal.findMany({
      where: { brokerId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            clientId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Combine and sort recent activities
    const recentActivity = [
      ...recentDeposits.map((d) => ({
        id: d.id,
        type: "Deposit",
        clientName: `${d.client.firstName} ${d.client.lastName}`,
        accountId: d.client.clientId,
        amount: Number(d.amount),
        currency: d.currency,
        status: d.status,
        createdAt: d.createdAt,
      })),
      ...recentWithdrawals.map((w) => ({
        id: w.id,
        type: "Withdrawal",
        clientName: `${w.client.firstName} ${w.client.lastName}`,
        accountId: w.client.clientId,
        amount: Number(w.amount),
        currency: w.currency,
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
        brokerId,
        createdAt: { gte: last6Months },
        status: "COMPLETED",
      },
    });

    const monthlyWithdrawals = await prisma.withdrawal.findMany({
      where: {
        brokerId,
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
        .reduce((sum, d) => sum + Number(d.amount), 0);

      const withdrawalsInMonth = monthlyWithdrawals
        .filter((w) => new Date(w.createdAt) >= monthStart && new Date(w.createdAt) <= monthEnd)
        .reduce((sum, w) => sum + Number(w.amount), 0);

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
          brokerId,
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
      broker,
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
