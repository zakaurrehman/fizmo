import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

/**
 * GET /api/admin/users/follow-up
 * Clients needing follow-up: no deposit, pending KYC, no account
 */
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

    const clients = await prisma.client.findMany({
      where: {
        brokerId,
        OR: [
          // Clients with no accounts
          { accounts: { none: {} } },
          // Clients with no completed deposits
          { deposits: { none: { status: "COMPLETED" } } },
          // Clients with pending KYC
          { user: { kycStatus: "PENDING" } },
        ],
      },
      include: {
        user: {
          select: { email: true, kycStatus: true, emailVerified: true, createdAt: true },
        },
        _count: { select: { accounts: true, deposits: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const followUpList = clients.map((c) => ({
      id: c.id,
      clientId: c.clientId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.user.email,
      kycStatus: c.user.kycStatus,
      emailVerified: c.user.emailVerified,
      accountsCount: c._count.accounts,
      depositsCount: c._count.deposits,
      registeredAt: c.user.createdAt,
      reason: !c._count.accounts
        ? "No Account"
        : !c._count.deposits
        ? "No Deposit"
        : "Pending KYC",
    }));

    return NextResponse.json({ clients: followUpList, total: followUpList.length });
  } catch (error: any) {
    console.error("Follow-up list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
