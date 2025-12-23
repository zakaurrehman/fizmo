import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch individual client details (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check here

    const { id } = params;

    // Fetch client with all related data
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        accounts: {
          include: {
            deposits: {
              orderBy: { createdAt: "desc" },
            },
            withdrawals: {
              orderBy: { createdAt: "desc" },
            },
            _count: {
              select: {
                deposits: true,
                withdrawals: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        kycDocuments: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Calculate statistics
    const totalBalance = client.accounts.reduce(
      (sum, acc) => sum + acc.balance,
      0
    );
    const totalEquity = client.accounts.reduce(
      (sum, acc) => sum + acc.equity,
      0
    );

    // Get all deposits across all accounts
    const allDeposits = client.accounts.flatMap((acc) =>
      acc.deposits.map((d) => ({
        id: d.id,
        accountId: acc.mt5Id,
        type: "DEPOSIT" as const,
        amount: d.amount,
        currency: d.currency,
        status: d.status,
        paymentMethod: d.paymentMethod,
        timestamp: d.createdAt,
      }))
    );

    // Get all withdrawals across all accounts
    const allWithdrawals = client.accounts.flatMap((acc) =>
      acc.withdrawals.map((w) => ({
        id: w.id,
        accountId: acc.mt5Id,
        type: "WITHDRAWAL" as const,
        amount: w.amount,
        currency: w.currency,
        status: w.status,
        paymentMethod: w.paymentMethod,
        timestamp: w.createdAt,
      }))
    );

    // Combine and sort transactions
    const allTransactions = [...allDeposits, ...allWithdrawals].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate totals
    const totalDeposits = allDeposits.reduce((sum, d) => sum + (d.status === "COMPLETED" ? d.amount : 0), 0);
    const totalWithdrawals = allWithdrawals.reduce((sum, w) => sum + (w.status === "COMPLETED" ? w.amount : 0), 0);

    // Format client data
    const clientData = {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.user.email,
      country: client.country,
      phone: client.phone,
      address: client.address,
      dateOfBirth: client.dateOfBirth,
      kycStatus: client.kycStatus,
      labels: client.labels,
      registeredAt: client.user.createdAt,
      accounts: client.accounts.map((acc) => ({
        id: acc.id,
        mt5Id: acc.mt5Id,
        accountType: acc.accountType,
        currency: acc.currency,
        balance: acc.balance,
        equity: acc.equity,
        leverage: acc.leverage,
        status: acc.status,
        createdAt: acc.createdAt,
        depositCount: acc._count.deposits,
        withdrawalCount: acc._count.withdrawals,
      })),
      kycDocuments: client.kycDocuments,
      transactions: allTransactions,
      statistics: {
        totalBalance,
        totalEquity,
        totalDeposits,
        totalWithdrawals,
        netDeposits: totalDeposits - totalWithdrawals,
        accountCount: client.accounts.length,
        transactionCount: allTransactions.length,
      },
    };

    return NextResponse.json({ client: clientData });
  } catch (error: any) {
    console.error("Admin client detail fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
