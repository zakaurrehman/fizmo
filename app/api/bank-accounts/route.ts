import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/bank-accounts
 * Get all bank accounts for the logged-in client
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all bank accounts for this client
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { clientId: client.id },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      bankAccounts,
    });
  } catch (error: any) {
    console.error("Bank accounts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bank-accounts
 * Add a new bank account
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bankName,
      accountHolderName,
      accountNumber,
      routingNumber,
      swiftCode,
      iban,
      country,
      currency = "USD",
      isPrimary = false,
    } = body;

    // Validate required fields
    if (!bankName || !accountHolderName || !accountNumber || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // If this is set as primary, unset other primary accounts
    if (isPrimary) {
      await prisma.bankAccount.updateMany({
        where: {
          clientId: client.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create the bank account
    const bankAccount = await prisma.bankAccount.create({
      data: {
        clientId: client.id,
        bankName,
        accountHolderName,
        accountNumber,
        routingNumber,
        swiftCode,
        iban,
        country,
        currency,
        isPrimary,
        isVerified: false, // Admin must verify
      },
    });

    return NextResponse.json({
      success: true,
      bankAccount,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Bank account creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bank-accounts
 * Delete a bank account
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bankAccountId = searchParams.get("id");

    if (!bankAccountId) {
      return NextResponse.json(
        { error: "Bank account ID required" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Verify bank account belongs to client
    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id: bankAccountId,
        clientId: client.id,
      },
    });

    if (!bankAccount) {
      return NextResponse.json(
        { error: "Bank account not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Delete the bank account
    await prisma.bankAccount.delete({
      where: { id: bankAccountId },
    });

    return NextResponse.json({
      success: true,
      message: "Bank account deleted successfully",
    });
  } catch (error: any) {
    console.error("Bank account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
