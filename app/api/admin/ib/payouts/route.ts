import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all commission payouts
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

    const payouts = await prisma.commissionPayout.findMany({
      where: { brokerId },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with IB details
    const payoutsWithIBs = await Promise.all(
      payouts.map(async (payout) => {
        const ib = await prisma.introducingBroker.findFirst({
          where: { ibId: payout.ibId },
        });

        return {
          id: payout.id,
          ibId: payout.ibId,
          ibName: ib?.name || "Unknown IB",
          amount: Number(payout.amount),
          period: payout.period,
          status: payout.status,
          paidAt: payout.paidAt
            ? payout.paidAt.toISOString().replace("T", " ").split(".")[0]
            : null,
        };
      })
    );

    return NextResponse.json({ success: true, payouts: payoutsWithIBs });
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 }
    );
  }
}

// POST - Create/process payout
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

    const { ibId, period, amount } = await request.json();

    if (!ibId || !period || !amount) {
      return NextResponse.json(
        { error: "ibId, period, and amount are required" },
        { status: 400 }
      );
    }

    // Check for duplicate within this broker
    const existing = await prisma.commissionPayout.findFirst({
      where: {
        brokerId,
        ibId,
        period,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Payout for this period already exists" },
        { status: 400 }
      );
    }

    const payout = await prisma.commissionPayout.create({
      data: {
        brokerId,
        ibId,
        period,
        amount,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payout created successfully",
      payout,
    });
  } catch (error) {
    console.error("Error creating payout:", error);
    return NextResponse.json(
      { error: "Failed to create payout" },
      { status: 500 }
    );
  }
}

// PUT - Mark payout as paid
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Payout ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.commissionPayout.findFirst({
      where: { id, brokerId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    if (existing.status === "PAID") {
      return NextResponse.json(
        { error: "Payout already processed" },
        { status: 400 }
      );
    }

    const updated = await prisma.commissionPayout.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Update IB's lastPayout date (scoped to broker)
    await prisma.introducingBroker.updateMany({
      where: { ibId: existing.ibId, brokerId },
      data: {
        lastPayout: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payout marked as paid",
      payout: updated,
    });
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}

// Seed default payouts
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if payouts already exist
    const existing = await prisma.commissionPayout.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Payouts already initialized" },
        { status: 400 }
      );
    }

    const defaultPayouts = [
      {
        ibId: "IB-10001",
        amount: 4250.0,
        period: "November 2024",
        status: "PAID",
        paidAt: new Date("2024-12-15T09:30:00"),
      },
      {
        ibId: "IB-10002",
        amount: 2100.0,
        period: "November 2024",
        status: "PAID",
        paidAt: new Date("2024-12-15T09:30:00"),
      },
      {
        ibId: "IB-10003",
        amount: 950.0,
        period: "December 2024",
        status: "PENDING",
        paidAt: null,
      },
    ];

    await prisma.commissionPayout.createMany({
      data: defaultPayouts.map((p) => ({
        ...p,
        status: p.status as any,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Default payouts initialized",
      count: defaultPayouts.length,
    });
  } catch (error) {
    console.error("Error seeding payouts:", error);
    return NextResponse.json(
      { error: "Failed to seed payouts" },
      { status: 500 }
    );
  }
}
