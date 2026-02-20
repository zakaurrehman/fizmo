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

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count of all transactions (deposits + withdrawals)
    const [depositCount, withdrawalCount] = await Promise.all([
      prisma.deposit.count({ where: { brokerId } }),
      prisma.withdrawal.count({ where: { brokerId } }),
    ]);
    const total = depositCount + withdrawalCount;

    // Get paginated deposits and withdrawals
    const [deposits, withdrawals] = await Promise.all([
      prisma.deposit.findMany({
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
        take: limit,
        skip,
      }),
      prisma.withdrawal.findMany({
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
        take: limit,
        skip,
      }),
    ]);

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
      totalTransactions: total,
      totalDeposits: deposits.reduce((sum, d) => sum + d.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, w) => sum + w.amount, 0),
      pendingCount: transactions.filter((t) => t.status === "PENDING").length,
      completedCount: transactions.filter((t) => t.status === "COMPLETED").length,
      rejectedCount: transactions.filter((t) => t.status === "REJECTED").length,
    };

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      transactions,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Admin transactions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
