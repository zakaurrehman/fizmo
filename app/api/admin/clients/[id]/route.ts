import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

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

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    // Fetch client with all related data
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            status: true,
            kycStatus: true,
            createdAt: true,
          },
        },
        accounts: {
          orderBy: { createdAt: "desc" },
        },
        deposits: {
          orderBy: { createdAt: "desc" },
        },
        withdrawals: {
          orderBy: { createdAt: "desc" },
        },
        kycDocuments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Calculate statistics
    const totalBalance = client.accounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );
    const totalEquity = client.accounts.reduce(
      (sum, acc) => sum + Number(acc.equity),
      0
    );

    // Format deposits
    const allDeposits = client.deposits.map((d) => ({
      id: d.id,
      type: "DEPOSIT" as const,
      amount: Number(d.amount),
      currency: d.currency,
      status: d.status,
      paymentMethod: d.paymentMethod,
      timestamp: d.createdAt,
    }));

    // Format withdrawals
    const allWithdrawals = client.withdrawals.map((w) => ({
      id: w.id,
      type: "WITHDRAWAL" as const,
      amount: Number(w.amount),
      currency: w.currency,
      status: w.status,
      paymentMethod: w.paymentMethod,
      timestamp: w.createdAt,
    }));

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
      kycStatus: client.user.kycStatus,
      labels: client.labels,
      registeredAt: client.user.createdAt,
      accounts: client.accounts.map((acc) => ({
        id: acc.id,
        accountId: acc.accountId,
        accountType: acc.accountType,
        currency: acc.currency,
        balance: Number(acc.balance),
        equity: Number(acc.equity),
        leverage: acc.leverage,
        status: acc.status,
        createdAt: acc.createdAt,
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

// PATCH - Update client details (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const client = await prisma.client.findFirst({
      where: { id, brokerId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, country, labels, kycStatus } = body;

    // Update client fields
    const clientUpdate: any = {};
    if (firstName !== undefined) clientUpdate.firstName = firstName;
    if (lastName !== undefined) clientUpdate.lastName = lastName;
    if (phone !== undefined) clientUpdate.phone = phone;
    if (country !== undefined) clientUpdate.country = country;
    if (labels !== undefined) clientUpdate.labels = labels;

    if (Object.keys(clientUpdate).length > 0) {
      await prisma.client.update({
        where: { id },
        data: clientUpdate,
      });
    }

    // Update KYC status on User model if provided
    if (kycStatus) {
      await prisma.user.update({
        where: { id: client.userId },
        data: { kycStatus },
      });
    }

    return NextResponse.json({ success: true, message: "Client updated successfully" });
  } catch (error: any) {
    console.error("Admin client update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
