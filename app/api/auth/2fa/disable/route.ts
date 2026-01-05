import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import speakeasy from "speakeasy";

// POST - Disable 2FA
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
        { error: "Token is required to disable 2FA" },
        { status: 400 }
      );
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "Two-factor authentication is not enabled" },
        { status: 400 }
      );
    }

    // Verify the token or backup code
    let verified = false;

    // Check if it's a TOTP token
    if (user.twoFactorSecret) {
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: token,
        window: 2,
      });
    }

    // If TOTP failed, check if it's a backup code
    if (!verified && user.backupCodes.includes(token.toUpperCase())) {
      verified = true;
      // Remove used backup code
      await prisma.user.update({
        where: { id: user.id },
        data: {
          backupCodes: user.backupCodes.filter((code) => code !== token.toUpperCase()),
        },
      });
    }

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid token or backup code" },
        { status: 400 }
      );
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication has been disabled",
    });
  } catch (error: any) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
