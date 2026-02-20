import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { notifyDeposit } from "@/lib/notifications";
import { sendDepositConfirmation } from "@/lib/email";
import { auditDepositChange } from "@/lib/audit";

// GET - Fetch all deposits (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get brokerId from JWT token
    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.deposit.count({
      where: { brokerId },
    });

    // Get paginated deposits
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
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      deposits,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Admin deposits fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a manual deposit (Admin only)
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
    const { clientId, amount, currency, paymentMethod, referenceNumber } = body;

    if (!clientId || !amount) {
      return NextResponse.json({ error: "Client ID and amount are required" }, { status: 400 });
    }

    // Verify client belongs to this broker
    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId },
      include: {
        user: true,
        accounts: { where: { status: "ACTIVE" }, take: 1 },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Create deposit as COMPLETED (admin manual deposit)
    const deposit = await prisma.deposit.create({
      data: {
        brokerId,
        clientId,
        amount,
        currency: currency || "USD",
        paymentMethod: paymentMethod || "BANK_TRANSFER",
        referenceNumber: referenceNumber || `ADMIN-${Date.now()}`,
        provider: "Manual",
        status: "COMPLETED",
      },
    });

    // Update first active account balance
    if (client.accounts.length > 0) {
      await prisma.account.update({
        where: { id: client.accounts[0].id },
        data: {
          balance: { increment: amount },
          equity: { increment: amount },
        },
      });
    }

    // Send notification
    await notifyDeposit(client.user.id, Number(amount), "COMPLETED", deposit.id);

    return NextResponse.json({ success: true, deposit }, { status: 201 });
  } catch (error: any) {
    console.error("Admin manual deposit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Approve/Reject deposit
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

      // Send confirmation email to user
      await sendDepositConfirmation(
        deposit.client.user.email,
        Number(deposit.amount),
        account.accountId,
        deposit.client.firstName || undefined
      );
    }

    // Log audit trail
    await auditDepositChange(
      brokerId,
      user.id,
      depositId,
      status as "COMPLETED" | "REJECTED",
      Number(deposit.amount),
      deposit.client.user.email
    );

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
