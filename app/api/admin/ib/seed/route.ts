import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if IBs already exist
    const existing = await prisma.introducingBroker.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "IBs already initialized" },
        { status: 400 }
      );
    }

    const defaultIBs = [
      {
        ibId: "IB-10001",
        name: "Global Trading Partners LLC",
        email: "contact@globaltradingpartners.com",
        tier: "PLATINUM",
        commissionRate: 35.0,
        status: "ACTIVE",
      },
      {
        ibId: "IB-10002",
        name: "FX Masters Network",
        email: "admin@fxmasters.io",
        tier: "GOLD",
        commissionRate: 30.0,
        status: "ACTIVE",
      },
      {
        ibId: "IB-10003",
        name: "Trading Academy Asia",
        email: "partnership@tradingacademy.asia",
        tier: "SILVER",
        commissionRate: 25.0,
        status: "ACTIVE",
      },
      {
        ibId: "IB-10004",
        name: "Crypto Bridge Partners",
        email: "info@cryptobridge.co",
        tier: "BRONZE",
        commissionRate: 20.0,
        status: "SUSPENDED",
      },
    ];

    await prisma.introducingBroker.createMany({
      data: defaultIBs.map((ib) => ({
        ...ib,
        tier: ib.tier as any,
        status: ib.status as any,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Default IBs initialized successfully",
      count: defaultIBs.length,
    });
  } catch (error) {
    console.error("Error seeding IBs:", error);
    return NextResponse.json(
      { error: "Failed to seed IBs" },
      { status: 500 }
    );
  }
}
