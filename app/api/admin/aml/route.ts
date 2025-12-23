import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// AML risk thresholds
const LARGE_TRANSACTION_THRESHOLD = 10000; // $10,000
const RAPID_TURNOVER_HOURS = 24;
const STRUCTURING_THRESHOLD = 9000; // Multiple transactions just under $10k
const STRUCTURING_COUNT = 3; // Within 7 days

// GET - Fetch AML monitoring data (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check here

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all deposits and withdrawals for analysis
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
        where: {
          createdAt: { gte: last30Days },
        },
        include: {
          account: {
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  country: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.withdrawal.findMany({
        where: {
          createdAt: { gte: last30Days },
        },
        include: {
          account: {
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  country: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const amlAlerts: any[] = [];

    // 1. Detect Large Transactions
    deposits.forEach((deposit) => {
      if (deposit.amount >= LARGE_TRANSACTION_THRESHOLD && deposit.status === "COMPLETED") {
        amlAlerts.push({
          id: `LT-${deposit.id}`,
          clientId: deposit.account.client.id,
          clientName: `${deposit.account.client.firstName} ${deposit.account.client.lastName}`,
          riskLevel: deposit.amount >= 50000 ? "HIGH" : "MEDIUM",
          alertType: "Large Deposit",
          amount: deposit.amount,
          currency: "USD",
          flaggedAt: deposit.createdAt,
          description: `Deposit of $${deposit.amount.toLocaleString()} exceeds monitoring threshold`,
          status: deposit.amount >= 50000 ? "PENDING" : "LOW_PRIORITY",
          transactionId: deposit.id,
          transactionType: "DEPOSIT",
        });
      }
    });

    withdrawals.forEach((withdrawal) => {
      if (
        withdrawal.amount >= LARGE_TRANSACTION_THRESHOLD &&
        withdrawal.status === "COMPLETED"
      ) {
        amlAlerts.push({
          id: `LT-${withdrawal.id}`,
          clientId: withdrawal.account.client.id,
          clientName: `${withdrawal.account.client.firstName} ${withdrawal.account.client.lastName}`,
          riskLevel: withdrawal.amount >= 50000 ? "HIGH" : "MEDIUM",
          alertType: "Large Withdrawal",
          amount: withdrawal.amount,
          currency: "USD",
          flaggedAt: withdrawal.createdAt,
          description: `Withdrawal of $${withdrawal.amount.toLocaleString()} exceeds monitoring threshold`,
          status: withdrawal.amount >= 50000 ? "PENDING" : "LOW_PRIORITY",
          transactionId: withdrawal.id,
          transactionType: "WITHDRAWAL",
        });
      }
    });

    // 2. Detect Rapid Turnover (deposit and withdrawal within 24 hours)
    const clientTransactions = new Map<string, { deposits: any[]; withdrawals: any[] }>();

    deposits.forEach((d) => {
      const clientId = d.account.client.id;
      if (!clientTransactions.has(clientId)) {
        clientTransactions.set(clientId, { deposits: [], withdrawals: [] });
      }
      clientTransactions.get(clientId)!.deposits.push(d);
    });

    withdrawals.forEach((w) => {
      const clientId = w.account.client.id;
      if (!clientTransactions.has(clientId)) {
        clientTransactions.set(clientId, { deposits: [], withdrawals: [] });
      }
      clientTransactions.get(clientId)!.withdrawals.push(w);
    });

    clientTransactions.forEach((transactions, clientId) => {
      transactions.deposits.forEach((deposit) => {
        transactions.withdrawals.forEach((withdrawal) => {
          const timeDiff = Math.abs(
            new Date(withdrawal.createdAt).getTime() - new Date(deposit.createdAt).getTime()
          );
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          if (hoursDiff <= RAPID_TURNOVER_HOURS && deposit.status === "COMPLETED" && withdrawal.status === "COMPLETED") {
            amlAlerts.push({
              id: `RT-${deposit.id}-${withdrawal.id}`,
              clientId: deposit.account.client.id,
              clientName: `${deposit.account.client.firstName} ${deposit.account.client.lastName}`,
              riskLevel: "MEDIUM",
              alertType: "Rapid Turnover",
              amount: Math.min(deposit.amount, withdrawal.amount),
              currency: "USD",
              flaggedAt: withdrawal.createdAt,
              description: `Deposit ($${deposit.amount.toLocaleString()}) and withdrawal ($${withdrawal.amount.toLocaleString()}) within ${hoursDiff.toFixed(1)} hours`,
              status: "PENDING",
              transactionId: `${deposit.id},${withdrawal.id}`,
              transactionType: "MULTIPLE",
            });
          }
        });
      });
    });

    // 3. Detect Potential Structuring (multiple deposits just under threshold)
    clientTransactions.forEach((transactions, clientId) => {
      const recentDeposits = transactions.deposits.filter(
        (d) =>
          new Date(d.createdAt) >= last7Days &&
          d.amount >= STRUCTURING_THRESHOLD - 2000 &&
          d.amount < LARGE_TRANSACTION_THRESHOLD &&
          d.status === "COMPLETED"
      );

      if (recentDeposits.length >= STRUCTURING_COUNT) {
        const totalAmount = recentDeposits.reduce((sum, d) => sum + d.amount, 0);
        const client = recentDeposits[0].account.client;

        amlAlerts.push({
          id: `ST-${clientId}`,
          clientId: client.id,
          clientName: `${client.firstName} ${client.lastName}`,
          riskLevel: "HIGH",
          alertType: "Potential Structuring",
          amount: totalAmount,
          currency: "USD",
          flaggedAt: recentDeposits[0].createdAt,
          description: `${recentDeposits.length} deposits totaling $${totalAmount.toLocaleString()} just under $10k threshold in 7 days`,
          status: "PENDING",
          transactionId: recentDeposits.map((d) => d.id).join(","),
          transactionType: "MULTIPLE",
        });
      }
    });

    // Sort alerts by flagged date (most recent first)
    amlAlerts.sort(
      (a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime()
    );

    // Calculate statistics
    const highRiskCount = amlAlerts.filter((a) => a.riskLevel === "HIGH").length;
    const mediumRiskCount = amlAlerts.filter((a) => a.riskLevel === "MEDIUM").length;
    const lowRiskCount = amlAlerts.filter((a) => a.riskLevel === "LOW").length;
    const pendingCount = amlAlerts.filter((a) => a.status === "PENDING").length;

    // Get total clients for risk distribution
    const totalClients = await prisma.client.count();

    // Calculate risk distribution (simplified - in real system would have risk scores stored)
    const clientsWithAlerts = new Set(amlAlerts.map((a) => a.clientId)).size;
    const highRiskClients = new Set(
      amlAlerts.filter((a) => a.riskLevel === "HIGH").map((a) => a.clientId)
    ).size;
    const mediumRiskClients = new Set(
      amlAlerts.filter((a) => a.riskLevel === "MEDIUM").map((a) => a.clientId)
    ).size;
    const lowRiskClients = totalClients - clientsWithAlerts;

    return NextResponse.json({
      alerts: amlAlerts,
      statistics: {
        highRiskAlerts: highRiskCount,
        mediumRiskAlerts: mediumRiskCount,
        lowRiskAlerts: lowRiskCount,
        pendingScreening: pendingCount,
        totalAlerts: amlAlerts.length,
      },
      riskDistribution: {
        highRisk: highRiskClients,
        mediumRisk: mediumRiskClients,
        lowRisk: lowRiskClients,
        total: totalClients,
      },
    });
  } catch (error: any) {
    console.error("AML monitoring fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
