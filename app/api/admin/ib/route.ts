import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all IBs with calculated stats
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const ibs = await prisma.introducingBroker.findMany({
      where: { brokerId },
      orderBy: { joinDate: "desc" },
    });

    // Calculate stats for each IB
    const ibsWithStats = await Promise.all(
      ibs.map(async (ib) => {
        // Count referred clients
        const relations = await prisma.ibRelation.findMany({
          where: { ibId: ib.ibId },
        });
        const clientsReferred = relations.length;

        // Count active clients (those with accounts)
        const activeClientIds = await prisma.client.findMany({
          where: {
            id: { in: relations.map((r) => r.clientId) },
          },
          select: { id: true },
        });
        const activeClients = activeClientIds.length;

        // Calculate 30-day volume
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const clientAccountIds = await prisma.account.findMany({
          where: {
            clientId: { in: relations.map((r) => r.clientId) },
          },
          select: { accountId: true },
        });

        const trades = await prisma.trade.findMany({
          where: {
            accountId: { in: clientAccountIds.map((a) => a.accountId) },
            openTime: { gte: thirtyDaysAgo },
          },
        });

        const totalVolume = trades.reduce((sum, trade) => {
          return sum + Number(trade.volume);
        }, 0);

        // Calculate total commission earned
        const allCommissions = await prisma.commission.findMany({
          where: { ibId: ib.ibId },
        });

        const totalCommission = allCommissions.reduce((sum, comm) => {
          return sum + Number(comm.amount);
        }, 0);

        // Calculate pending commission
        const pendingCommissions = await prisma.commission.findMany({
          where: {
            ibId: ib.ibId,
            paidStatus: "PENDING",
          },
        });

        const pendingCommission = pendingCommissions.reduce((sum, comm) => {
          return sum + Number(comm.amount);
        }, 0);

        return {
          id: ib.id,
          ibId: ib.ibId,
          name: ib.name,
          email: ib.email,
          tier: ib.tier,
          commissionRate: Number(ib.commissionRate),
          clientsReferred,
          activeClients,
          totalVolume,
          totalCommission,
          pendingCommission,
          status: ib.status,
          joinDate: ib.joinDate.toISOString().split("T")[0],
          lastPayout: ib.lastPayout
            ? ib.lastPayout.toISOString().split("T")[0]
            : null,
        };
      })
    );

    return NextResponse.json({ success: true, ibs: ibsWithStats });
  } catch (error) {
    console.error("Error fetching IBs:", error);
    return NextResponse.json(
      { error: "Failed to fetch IBs" },
      { status: 500 }
    );
  }
}

// POST - Create new IB
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const { name, email, tier, commissionRate } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email within this broker
    const existing = await prisma.introducingBroker.findFirst({
      where: { email, brokerId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "IB with this email already exists" },
        { status: 400 }
      );
    }

    // Generate IB ID (scoped to this broker)
    const lastIb = await prisma.introducingBroker.findFirst({
      where: { brokerId },
      orderBy: { ibId: "desc" },
    });

    let nextNumber = 10001;
    if (lastIb && lastIb.ibId.startsWith("IB-")) {
      const lastNumber = parseInt(lastIb.ibId.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const ibId = `IB-${nextNumber}`;

    // Set commission rate based on tier
    const tierRates: Record<string, number> = {
      PLATINUM: 35,
      GOLD: 30,
      SILVER: 25,
      BRONZE: 20,
    };

    const finalCommissionRate =
      commissionRate || tierRates[tier || "BRONZE"] || 20;

    const ib = await prisma.introducingBroker.create({
      data: {
        brokerId,
        ibId,
        name,
        email,
        tier: tier || "BRONZE",
        commissionRate: finalCommissionRate,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "IB created successfully",
      ib: {
        id: ib.id,
        ibId: ib.ibId,
        name: ib.name,
        email: ib.email,
        tier: ib.tier,
        commissionRate: Number(ib.commissionRate),
      },
    });
  } catch (error) {
    console.error("Error creating IB:", error);
    return NextResponse.json(
      { error: "Failed to create IB" },
      { status: 500 }
    );
  }
}

// PUT - Update IB
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const { id, name, email, tier, commissionRate, status } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "IB ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.introducingBroker.findFirst({
      where: { id, brokerId },
    });

    if (!existing) {
      return NextResponse.json({ error: "IB not found" }, { status: 404 });
    }

    // Check for email conflict within this broker
    if (email && email !== existing.email) {
      const duplicate = await prisma.introducingBroker.findFirst({
        where: { email, brokerId },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.introducingBroker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(tier && { tier }),
        ...(commissionRate !== undefined && { commissionRate }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "IB updated successfully",
      ib: updated,
    });
  } catch (error) {
    console.error("Error updating IB:", error);
    return NextResponse.json(
      { error: "Failed to update IB" },
      { status: 500 }
    );
  }
}

// DELETE - Delete IB
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "IB ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.introducingBroker.findFirst({
      where: { id, brokerId },
    });

    if (!existing) {
      return NextResponse.json({ error: "IB not found" }, { status: 404 });
    }

    // Check for existing client relations
    const relations = await prisma.ibRelation.count({
      where: { ibId: existing.ibId },
    });

    if (relations > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete IB with ${relations} client relations. Please reassign clients first.`,
        },
        { status: 400 }
      );
    }

    await prisma.introducingBroker.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "IB deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting IB:", error);
    return NextResponse.json(
      { error: "Failed to delete IB" },
      { status: 500 }
    );
  }
}
