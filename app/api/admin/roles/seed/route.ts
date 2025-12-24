import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * POST /api/admin/roles/seed
 * Initialize default roles
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if roles already exist
    const existing = await prisma.role.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Roles already initialized" },
        { status: 400 }
      );
    }

    // Create default roles
    const defaultRoles = [
      {
        name: "ADMIN",
        description: "Full system access with all permissions",
        isSystem: true,
        permissions: [
          "clients.view",
          "clients.edit",
          "clients.delete",
          "accounts.view",
          "accounts.edit",
          "accounts.delete",
          "transactions.view",
          "transactions.approve",
          "deposits.view",
          "deposits.approve",
          "withdrawals.view",
          "withdrawals.approve",
          "reports.view",
          "reports.generate",
          "settings.view",
          "settings.edit",
          "audit.view",
          "roles.view",
          "roles.edit",
        ],
      },
      {
        name: "Support Agent",
        description: "Customer support with limited financial access",
        isSystem: false,
        permissions: [
          "clients.view",
          "accounts.view",
          "transactions.view",
          "deposits.view",
          "withdrawals.view",
          "tickets.view",
          "tickets.respond",
        ],
      },
      {
        name: "Compliance Officer",
        description: "AML/KYC monitoring and compliance oversight",
        isSystem: false,
        permissions: [
          "clients.view",
          "kyc.view",
          "kyc.approve",
          "kyc.reject",
          "aml.view",
          "aml.investigate",
          "transactions.view",
          "reports.view",
          "audit.view",
        ],
      },
      {
        name: "Accountant",
        description: "Financial reporting and reconciliation",
        isSystem: false,
        permissions: [
          "transactions.view",
          "deposits.view",
          "withdrawals.view",
          "reports.view",
          "reports.generate",
          "ledger.view",
        ],
      },
    ];

    await prisma.role.createMany({
      data: defaultRoles,
    });

    return NextResponse.json({
      success: true,
      message: "Default roles initialized",
      count: defaultRoles.length,
    });
  } catch (error: any) {
    console.error("Roles seed error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
