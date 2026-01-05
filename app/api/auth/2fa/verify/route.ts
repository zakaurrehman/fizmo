import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import speakeasy from "speakeasy";
import crypto from "crypto";

// POST - Verify token and enable 2FA
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Check if user has a secret set up
    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA setup not initialized. Please call /api/auth/2fa/setup first" },
        { status: 400 }
      );
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps before/after for clock drift
    });

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    // Generate backup codes (10 codes, 8 characters each)
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase()
    );

    // Enable 2FA and store backup codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        backupCodes: backupCodes, // Store as plaintext for now, encrypt in production
      },
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication has been enabled",
      backupCodes: backupCodes, // Return to user for safe storage
    });
  } catch (error: any) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
