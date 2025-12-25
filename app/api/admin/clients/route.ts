import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all clients (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get brokerId from JWT token
    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    // TODO: Add admin role check here
    // For now, allow all authenticated users

    // Get all clients within this broker
    const clients = await prisma.client.findMany({
      where: {
        brokerId,
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        accounts: {
          select: {
            id: true,
            accountId: true,
            accountType: true,
            balance: true,
            currency: true,
            status: true,
          },
        },
        _count: {
          select: {
            accounts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total balance for each client
    const clientsWithStats = clients.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.user.email,
      phone: client.phone,
      country: client.country,
      status: client.status,
      kycStatus: client.kycStatus,
      createdAt: client.createdAt,
      accountsCount: client._count.accounts,
      totalBalance: client.accounts.reduce((sum, acc) => sum + acc.balance, 0),
      accounts: client.accounts,
    }));

    return NextResponse.json({ clients: clientsWithStats });
  } catch (error: any) {
    console.error("Admin clients fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
