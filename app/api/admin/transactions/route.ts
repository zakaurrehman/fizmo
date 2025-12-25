import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all transactions (Admin view - combines deposits and withdrawals)
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

    // TODO: Add admin role check here

    // Get all deposits within this broker
    const deposits = await prisma.deposit.findMany({
      where: { brokerId },
      include: {
        account: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all withdrawals within this broker
    const withdrawals = await prisma.withdrawal.findMany({
      where: { brokerId },
      include: {
        account: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Combine and format transactions
    const transactions = [
      ...deposits.map((d) => ({
        id: d.id,
        txId: `TX-${d.id.substring(0, 13)}`,
        clientId: d.account.client.id,
        clientName: `${d.account.client.firstName} ${d.account.client.lastName}`,
        accountId: d.account.accountId,
        type: "DEPOSIT",
        method: d.paymentMethod,
        amount: d.amount,
        currency: "USD",
        status: d.status,
        timestamp: d.createdAt,
        fee: 0,
        reference: d.transactionId || "N/A",
      })),
      ...withdrawals.map((w) => ({
        id: w.id,
        txId: `TX-${w.id.substring(0, 13)}`,
        clientId: w.account.client.id,
        clientName: `${w.account.client.firstName} ${w.account.client.lastName}`,
        accountId: w.account.accountId,
        type: "WITHDRAWAL",
        method: w.paymentMethod,
        amount: w.amount,
        currency: "USD",
        status: w.status,
        timestamp: w.createdAt,
        fee: 0,
        reference: w.paymentDetails ? w.paymentDetails.substring(0, 20) : "N/A",
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalDeposits: deposits.reduce((sum, d) => sum + d.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, w) => sum + w.amount, 0),
      pendingCount: transactions.filter((t) => t.status === "PENDING").length,
      completedCount: transactions.filter((t) => t.status === "COMPLETED").length,
      rejectedCount: transactions.filter((t) => t.status === "REJECTED").length,
    };

    return NextResponse.json({
      transactions,
      stats,
    });
  } catch (error: any) {
    console.error("Admin transactions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
