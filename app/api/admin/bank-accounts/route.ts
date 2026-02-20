import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

/**
 * GET /api/admin/bank-accounts
 * Get all bank accounts (admin only)
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

    const bankAccounts = await prisma.bankAccount.findMany({
      where: { brokerId },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      bankAccounts,
    });
  } catch (error: any) {
    console.error("Admin bank accounts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/bank-accounts
 * Verify/unverify a bank account (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const body = await request.json();
    const { bankAccountId, isVerified } = body;

    if (!bankAccountId || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "Bank account ID and verification status required" },
        { status: 400 }
      );
    }

    // Verify ownership before updating
    const existing = await prisma.bankAccount.findFirst({
      where: { id: bankAccountId, brokerId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bank account not found" }, { status: 404 });
    }

    const bankAccount = await prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: { isVerified },
    });

    return NextResponse.json({
      success: true,
      bankAccount,
    });
  } catch (error: any) {
    console.error("Bank account verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
