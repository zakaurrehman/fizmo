import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { notifyWithdrawal } from "@/lib/notifications";
import { sendWithdrawalConfirmation } from "@/lib/email";
import { auditWithdrawalChange } from "@/lib/audit";

// GET - Fetch all withdrawals (Admin only)
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

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.withdrawal.count({
      where: { brokerId },
    });

    // Get paginated withdrawals
    const withdrawals = await prisma.withdrawal.findMany({
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
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Admin withdrawals fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Approve/Reject withdrawal
export async function PATCH(request: NextRequest) {
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
    const { withdrawalId, status } = body;

    if (!withdrawalId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the withdrawal with client info (verify it belongs to this broker)
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        id: withdrawalId,
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

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { error: "Withdrawal already processed" },
        { status: 400 }
      );
    }

    // Update withdrawal status
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status },
    });

    // If rejected, return funds to first active account balance
    if (status === "REJECTED" && withdrawal.client.accounts.length > 0) {
      const account = withdrawal.client.accounts[0];
      await prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { increment: withdrawal.amount },
          equity: { increment: withdrawal.amount },
        },
      });
    }

    // Send confirmation email to user
    if (withdrawal.client.accounts.length > 0) {
      await sendWithdrawalConfirmation(
        withdrawal.client.user.email,
        Number(withdrawal.amount),
        withdrawal.client.accounts[0].accountId,
        status,
        withdrawal.client.firstName || undefined
      );
    }

    // Log audit trail
    await auditWithdrawalChange(
      brokerId,
      user.id,
      withdrawalId,
      status as "COMPLETED" | "REJECTED",
      Number(withdrawal.amount),
      withdrawal.client.user.email
    );

    // Send notification to user
    await notifyWithdrawal(
      withdrawal.client.user.id,
      Number(withdrawal.amount),
      status,
      withdrawal.id
    );

    return NextResponse.json({ withdrawal: updatedWithdrawal });
  } catch (error: any) {
    console.error("Admin withdrawal update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
