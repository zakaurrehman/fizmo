import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { notifyDeposit } from "@/lib/notifications";

// GET - Fetch all deposits (Admin only)
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

    // Get all deposits within this broker
    const deposits = await prisma.deposit.findMany({
      where: {
        brokerId,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ deposits });
  } catch (error: any) {
    console.error("Admin deposits fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Approve/Reject deposit
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { depositId, status } = body;

    if (!depositId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the deposit with client info (verify it belongs to this broker)
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: depositId,
        brokerId,
      },
      include: {
        client: {
          include: {
            user: true,
            accounts: {
              where: { status: "ACTIVE" },
              take: 1,
            },
          },
        },
      },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        { error: "Deposit already processed" },
        { status: 400 }
      );
    }

    // Update deposit status
    const updatedDeposit = await prisma.deposit.update({
      where: { id: depositId },
      data: { status },
    });

    // If approved, update first active account balance
    if (status === "COMPLETED" && deposit.client.accounts.length > 0) {
      const account = deposit.client.accounts[0];
      await prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { increment: deposit.amount },
          equity: { increment: deposit.amount },
        },
      });
    }

    // Send notification to user
    await notifyDeposit(
      deposit.client.user.id,
      Number(deposit.amount),
      status,
      deposit.id
    );

    return NextResponse.json({ deposit: updatedDeposit });
  } catch (error: any) {
    console.error("Admin deposit update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
