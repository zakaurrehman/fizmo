import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch reports and analytics data (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    // Get date range from query params (default to 30 days)
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Calculate date ranges
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        previousEndDate.setDate(now.getDate() - 7);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        previousStartDate.setDate(now.getDate() - 180);
        previousEndDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        previousEndDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(now.getDate() - 60);
        previousEndDate.setDate(now.getDate() - 30);
    }

    // Fetch deposits for current and previous periods
    const [currentDeposits, previousDeposits] = await Promise.all([
      prisma.deposit.findMany({
        where: {
          brokerId,
          createdAt: { gte: startDate },
          status: "COMPLETED",
        },
      }),
      prisma.deposit.findMany({
        where: {
          brokerId,
          createdAt: { gte: previousStartDate, lt: previousEndDate },
          status: "COMPLETED",
        },
      }),
    ]);

    // Fetch withdrawals for current and previous periods
    const [currentWithdrawals, previousWithdrawals] = await Promise.all([
      prisma.withdrawal.findMany({
        where: {
          brokerId,
          createdAt: { gte: startDate },
          status: "COMPLETED",
        },
      }),
      prisma.withdrawal.findMany({
        where: {
          brokerId,
          createdAt: { gte: previousStartDate, lt: previousEndDate },
          status: "COMPLETED",
        },
      }),
    ]);

    // Calculate totals
    const totalDeposits = currentDeposits.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalWithdrawals = currentWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
    const netDeposits = totalDeposits - totalWithdrawals;

    const prevTotalDeposits = previousDeposits.reduce((sum, d) => sum + Number(d.amount), 0);
    const prevTotalWithdrawals = previousWithdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
    const prevNetDeposits = prevTotalDeposits - prevTotalWithdrawals;

    // Calculate growth percentages
    const depositsGrowth =
      prevTotalDeposits > 0
        ? ((totalDeposits - prevTotalDeposits) / prevTotalDeposits) * 100
        : 0;
    const withdrawalsGrowth =
      prevTotalWithdrawals > 0
        ? ((totalWithdrawals - prevTotalWithdrawals) / prevTotalWithdrawals) * 100
        : 0;
    const netDepositsGrowth =
      prevNetDeposits > 0 ? ((netDeposits - prevNetDeposits) / prevNetDeposits) * 100 : 0;

    // Get all accounts for total balance
    const accounts = await prisma.account.findMany({
      where: { brokerId },
      select: {
        balance: true,
        equity: true,
      },
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    const totalEquity = accounts.reduce((sum, acc) => sum + Number(acc.equity), 0);

    // Get client counts
    const [totalClients, activeClients] = await Promise.all([
      prisma.client.count({ where: { brokerId } }),
      prisma.client.count({
        where: {
          brokerId,
          accounts: {
            some: {
              status: "ACTIVE",
            },
          },
        },
      }),
    ]);

    // Get new clients in current period
    const newClients = await prisma.client.count({
      where: {
        brokerId,
        createdAt: { gte: startDate },
      },
    });

    const prevNewClients = await prisma.client.count({
      where: {
        brokerId,
        createdAt: { gte: previousStartDate, lt: previousEndDate },
      },
    });

    const clientsGrowth =
      prevNewClients > 0 ? ((newClients - prevNewClients) / prevNewClients) * 100 : 0;

    // Calculate average deposit per client
    const avgDepositPerClient = totalClients > 0 ? totalDeposits / totalClients : 0;

    // Payment method distribution
    const paymentMethodCounts = currentDeposits.reduce((acc: any, deposit) => {
      acc[deposit.paymentMethod] = (acc[deposit.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    const totalTransactions = currentDeposits.length + currentWithdrawals.length;
    const paymentMethodDistribution = Object.entries(paymentMethodCounts).map(
      ([method, count]) => ({
        method,
        percentage: totalTransactions > 0 ? ((count as number) / totalTransactions) * 100 : 0,
      })
    );

    // KYC statistics (kycStatus is on User model, not Client)
    const [kycApproved, kycUnderReview, kycRejected, kycPending] = await Promise.all([
      prisma.client.count({ where: { brokerId, user: { kycStatus: "APPROVED" } } }),
      prisma.client.count({ where: { brokerId, user: { kycStatus: "UNDER_REVIEW" } } }),
      prisma.client.count({ where: { brokerId, user: { kycStatus: "REJECTED" } } }),
      prisma.client.count({ where: { brokerId, user: { kycStatus: "PENDING" } } }),
    ]);

    // Calculate client lifetime value (total deposits per client)
    const clientsWithDeposits = await prisma.client.findMany({
      where: { brokerId },
      include: {
        deposits: {
          where: { status: "COMPLETED" },
        },
      },
    });

    const lifetimeValues = clientsWithDeposits.map((client) => {
      return client.deposits.reduce((sum, deposit) => sum + Number(deposit.amount), 0);
    });

    const avgLifetimeValue =
      lifetimeValues.length > 0
        ? lifetimeValues.reduce((sum, val) => sum + val, 0) / lifetimeValues.length
        : 0;

    return NextResponse.json({
      quickStats: {
        totalRevenue: netDeposits, // Using net deposits as revenue proxy
        revenueGrowth: netDepositsGrowth,
        netDeposits,
        netDepositsGrowth,
        activeClients,
        clientsGrowth,
        avgRevenuePerClient: activeClients > 0 ? netDeposits / activeClients : 0,
      },
      financial: {
        totalDeposits,
        depositsGrowth,
        totalWithdrawals,
        withdrawalsGrowth,
        netDeposits,
        netDepositsGrowth,
        totalBalance,
        totalEquity,
        paymentMethodDistribution,
      },
      clients: {
        totalClients,
        activeClients,
        newClients,
        clientsGrowth,
        avgLifetimeValue,
        avgDepositPerClient,
      },
      compliance: {
        kycPending: kycPending,
        kycApproved,
        kycUnderReview,
        kycRejected,
        complianceScore:
          totalClients > 0 ? ((kycApproved / totalClients) * 100).toFixed(1) : "0",
      },
    });
  } catch (error: any) {
    console.error("Admin reports fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
