import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/admin/settings
 * Fetch all system settings grouped by category
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

    // Fetch all settings from database
    const settings = await prisma.systemSetting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    // Group settings by category
    const grouped = settings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push({
        id: setting.id,
        key: setting.key,
        value: parseSettingValue(setting.value, setting.dataType),
        label: setting.label,
        description: setting.description,
        dataType: setting.dataType,
        updatedAt: setting.updatedAt,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      settings: grouped,
    });
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update multiple settings at once
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body; // Array of {key, value}

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 }
      );
    }

    // Update each setting
    const updatePromises = settings.map(async (setting: any) => {
      const existing = await prisma.systemSetting.findUnique({
        where: { key: setting.key },
      });

      if (!existing) {
        // Create if doesn't exist
        return prisma.systemSetting.create({
          data: {
            category: setting.category || "General",
            key: setting.key,
            value: stringifySettingValue(setting.value, setting.dataType),
            label: setting.label || setting.key,
            description: setting.description,
            dataType: setting.dataType || "string",
            updatedBy: user.id,
          },
        });
      }

      // Update existing
      return prisma.systemSetting.update({
        where: { key: setting.key },
        data: {
          value: stringifySettingValue(setting.value, existing.dataType),
          updatedBy: user.id,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings/seed
 * Initialize default settings (run once)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if settings already exist
    const existing = await prisma.systemSetting.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Settings already initialized" },
        { status: 400 }
      );
    }

    // Create default settings
    const defaultSettings = getDefaultSettings();

    await prisma.systemSetting.createMany({
      data: defaultSettings.map((s) => ({
        category: s.category,
        key: s.key,
        value: s.value,
        label: s.label,
        description: s.description,
        dataType: s.dataType,
        updatedBy: user.id,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Default settings initialized",
      count: defaultSettings.length,
    });
  } catch (error: any) {
    console.error("Settings seed error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper functions
function parseSettingValue(value: string, dataType: string): any {
  try {
    switch (dataType) {
      case "boolean":
        return value === "true" || value === "1";
      case "number":
        return parseFloat(value);
      case "json":
        return JSON.parse(value);
      default:
        return value;
    }
  } catch {
    return value;
  }
}

function stringifySettingValue(value: any, dataType?: string): string {
  if (dataType === "json" || typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function getDefaultSettings() {
  return [
    // General Settings
    {
      category: "General",
      key: "company_name",
      value: "Fizmo Trading",
      label: "Company Name",
      description: "Legal company name",
      dataType: "string",
    },
    {
      category: "General",
      key: "platform_name",
      value: "Fizmo",
      label: "Platform Name",
      description: "Platform display name",
      dataType: "string",
    },
    {
      category: "General",
      key: "timezone",
      value: "UTC",
      label: "Timezone",
      description: "Default platform timezone",
      dataType: "string",
    },
    {
      category: "General",
      key: "default_language",
      value: "en",
      label: "Default Language",
      description: "Default platform language",
      dataType: "string",
    },
    // Trading Settings
    {
      category: "Trading",
      key: "default_leverage",
      value: "100",
      label: "Default Leverage",
      description: "Default leverage for new accounts",
      dataType: "number",
    },
    {
      category: "Trading",
      key: "max_leverage",
      value: "500",
      label: "Maximum Leverage",
      description: "Maximum allowed leverage",
      dataType: "number",
    },
    {
      category: "Trading",
      key: "margin_call_level",
      value: "80",
      label: "Margin Call Level (%)",
      description: "Margin level that triggers margin call",
      dataType: "number",
    },
    {
      category: "Trading",
      key: "stop_out_level",
      value: "50",
      label: "Stop Out Level (%)",
      description: "Margin level that triggers stop out",
      dataType: "number",
    },
    // Financial Settings
    {
      category: "Financial",
      key: "min_deposit",
      value: "50",
      label: "Minimum Deposit ($)",
      description: "Minimum deposit amount",
      dataType: "number",
    },
    {
      category: "Financial",
      key: "max_deposit",
      value: "50000",
      label: "Maximum Deposit ($)",
      description: "Maximum deposit amount per transaction",
      dataType: "number",
    },
    {
      category: "Financial",
      key: "min_withdrawal",
      value: "10",
      label: "Minimum Withdrawal ($)",
      description: "Minimum withdrawal amount",
      dataType: "number",
    },
    {
      category: "Financial",
      key: "withdrawal_fee_percent",
      value: "0",
      label: "Withdrawal Fee (%)",
      description: "Percentage fee for withdrawals",
      dataType: "number",
    },
    // Security Settings
    {
      category: "Security",
      key: "password_min_length",
      value: "8",
      label: "Minimum Password Length",
      description: "Minimum characters for passwords",
      dataType: "number",
    },
    {
      category: "Security",
      key: "require_uppercase",
      value: "true",
      label: "Require Uppercase",
      description: "Password must contain uppercase letter",
      dataType: "boolean",
    },
    {
      category: "Security",
      key: "require_number",
      value: "true",
      label: "Require Number",
      description: "Password must contain number",
      dataType: "boolean",
    },
    {
      category: "Security",
      key: "session_timeout",
      value: "3600",
      label: "Session Timeout (seconds)",
      description: "Auto-logout after inactivity",
      dataType: "number",
    },
    // Compliance Settings
    {
      category: "Compliance",
      key: "kyc_required",
      value: "true",
      label: "KYC Required",
      description: "Require KYC verification",
      dataType: "boolean",
    },
    {
      category: "Compliance",
      key: "kyc_documents_required",
      value: "2",
      label: "KYC Documents Required",
      description: "Minimum number of documents",
      dataType: "number",
    },
  ];
}

export const dynamic = "force-dynamic";
