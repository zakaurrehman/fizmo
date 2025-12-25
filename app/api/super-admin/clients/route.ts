import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/super-admin/clients
 * Get all clients across all brokers (SUPER_ADMIN only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can view all clients
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const brokerId = searchParams.get("brokerId");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (brokerId) {
      where.brokerId = brokerId;
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          broker: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              email: true,
              kycStatus: true,
              createdAt: true,
            },
          },
          accounts: {
            select: {
              id: true,
              accountId: true,
              accountType: true,
              balance: true,
              status: true,
            },
          },
          _count: {
            select: {
              accounts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.client.count({ where }),
    ]);

    const clientsWithStats = clients.map((client) => ({
      id: client.id,
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      country: client.country,
      status: client.status,
      kycStatus: client.kycStatus,
      email: client.user?.email,
      createdAt: client.user?.createdAt,
      broker: client.broker
        ? {
            id: client.broker.id,
            name: client.broker.name,
            slug: client.broker.slug,
          }
        : null,
      accountsCount: client._count.accounts,
      totalBalance: client.accounts.reduce((sum, acc) => sum + acc.balance, 0),
      accounts: client.accounts,
    }));

    return NextResponse.json({
      success: true,
      clients: clientsWithStats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch all clients error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
