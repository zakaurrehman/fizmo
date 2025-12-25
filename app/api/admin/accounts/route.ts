import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all accounts (Admin view)
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

    // Get all accounts within this broker
    const accounts = await prisma.account.findMany({
      where: {
        brokerId,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            status: true,
            kycStatus: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            deposits: true,
            withdrawals: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate account statistics
    const stats = {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.status === "ACTIVE").length,
      demoAccounts: accounts.filter((a) => a.accountType === "DEMO").length,
      liveAccounts: accounts.filter((a) => a.accountType === "LIVE").length,
      totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
      totalEquity: accounts.reduce((sum, a) => sum + a.equity, 0),
    };

    // Format accounts for response
    const accountsData = accounts.map((account) => ({
      id: account.id,
      accountId: account.accountId,
      accountType: account.accountType,
      balance: account.balance,
      equity: account.equity,
      currency: account.currency,
      leverage: account.leverage,
      status: account.status,
      createdAt: account.createdAt,
      clientName: `${account.client.firstName} ${account.client.lastName}`,
      clientEmail: account.client.user.email,
      clientStatus: account.client.status,
      kycStatus: account.client.kycStatus,
      depositCount: account._count.deposits,
      withdrawalCount: account._count.withdrawals,
    }));

    return NextResponse.json({
      accounts: accountsData,
      stats,
    });
  } catch (error: any) {
    console.error("Admin accounts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
