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

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.account.count({
      where: { brokerId },
    });

    // Get paginated accounts
    const accounts = await prisma.account.findMany({
      where: {
        brokerId,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                status: true,
                kycStatus: true,
              },
            },
            _count: {
              select: {
                deposits: true,
                withdrawals: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Calculate account statistics
    const stats = {
      totalAccounts: total,
      activeAccounts: accounts.filter((a) => a.status === "ACTIVE").length,
      demoAccounts: accounts.filter((a) => a.accountType === "DEMO").length,
      liveAccounts: accounts.filter((a) => a.accountType === "LIVE").length,
      totalBalance: accounts.reduce((sum, a) => sum + Number(a.balance), 0),
      totalEquity: accounts.reduce((sum, a) => sum + Number(a.equity), 0),
    };

    const totalPages = Math.ceil(total / limit);

    // Format accounts for response
    const accountsData = accounts.map((account) => ({
      id: account.id,
      accountId: account.accountId,
      accountType: account.accountType,
      balance: Number(account.balance),
      equity: Number(account.equity),
      currency: account.currency,
      leverage: account.leverage,
      status: account.status,
      createdAt: account.createdAt,
      clientName: `${account.client.firstName} ${account.client.lastName}`,
      clientEmail: account.client.user.email,
      clientStatus: account.client.user.status,
      kycStatus: account.client.user.kycStatus,
      depositCount: account.client._count.deposits,
      withdrawalCount: account.client._count.withdrawals,
    }));

    return NextResponse.json({
      accounts: accountsData,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Admin accounts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new trading account for a client
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { clientId, accountType, currency, leverage } = body;

    if (!clientId || !accountType) {
      return NextResponse.json({ error: "Client ID and account type are required" }, { status: 400 });
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const prefix = accountType === "DEMO" ? "DEM" : "MT5";
    const accountId = `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    const account = await prisma.account.create({
      data: {
        brokerId,
        clientId,
        accountId,
        accountType: accountType as any,
        currency: currency || "USD",
        leverage: leverage || 100,
        balance: accountType === "DEMO" ? 10000 : 0,
        equity: accountType === "DEMO" ? 10000 : 0,
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        accountId: account.accountId,
        accountType: account.accountType,
        currency: account.currency,
        leverage: account.leverage,
        balance: Number(account.balance),
        status: account.status,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Admin account create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update account status or leverage
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { accountId, status, leverage } = body;

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const account = await prisma.account.findFirst({
      where: { id: accountId, brokerId },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (leverage) updateData.leverage = leverage;

    const updated = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      account: {
        id: updated.id,
        accountId: updated.accountId,
        status: updated.status,
        leverage: updated.leverage,
      },
    });
  } catch (error: any) {
    console.error("Admin account update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
