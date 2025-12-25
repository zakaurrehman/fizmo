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

// DELETE - Soft delete a client (Admin/Super Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN or SUPER_ADMIN
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Get brokerId from JWT token
    const brokerId = await getBrokerIdFromToken(request);

    // Fetch the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        accounts: {
          select: {
            id: true,
            balance: true,
            status: true,
          },
        },
        deposits: {
          where: {
            status: "PENDING",
          },
        },
        withdrawals: {
          where: {
            status: "PENDING",
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // If user is ADMIN (not SUPER_ADMIN), verify client belongs to their broker
    if (user.role === "ADMIN" && client.brokerId !== brokerId) {
      return NextResponse.json({ error: "Cannot delete client from another broker" }, { status: 403 });
    }

    // Prevent deleting admin users
    if (client.user.role === "ADMIN" || client.user.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot delete admin or super admin users" }, { status: 400 });
    }

    // Safety checks
    const totalBalance = client.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    if (totalBalance > 0) {
      return NextResponse.json(
        { error: `Cannot delete client with balance. Current balance: $${totalBalance}` },
        { status: 400 }
      );
    }

    const hasActiveAccounts = client.accounts.some((acc) => acc.status === "ACTIVE");
    if (hasActiveAccounts) {
      return NextResponse.json(
        { error: "Cannot delete client with active accounts. Please close all accounts first." },
        { status: 400 }
      );
    }

    if (client.deposits.length > 0 || client.withdrawals.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete client with pending transactions. Please complete or cancel them first." },
        { status: 400 }
      );
    }

    // Soft delete: Update client status to DELETED
    await prisma.client.update({
      where: { id: clientId },
      data: {
        status: "DELETED",
      },
    });

    // Also update user status to DELETED
    await prisma.user.update({
      where: { id: client.user.id },
      data: {
        status: "DELETED",
      },
    });

    // Delete all active sessions for this user
    await prisma.session.deleteMany({
      where: { userId: client.user.id },
    });

    return NextResponse.json({
      message: "Client soft-deleted successfully",
      clientId,
      email: client.user.email,
    });
  } catch (error: any) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
