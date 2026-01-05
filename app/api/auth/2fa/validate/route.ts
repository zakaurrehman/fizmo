import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import { ensureDefaultBroker, requireBrokerId } from "@/lib/broker";
import speakeasy from "speakeasy";
import type { ApiResponse, AuthResponse } from "@/types/api";

// POST - Validate 2FA token and complete login
export async function POST(request: NextRequest) {
  try {
    // Ensure default broker exists
    const defaultBroker = await ensureDefaultBroker();

    // Try to get broker from headers, fallback to default broker
    let brokerId: string;
    try {
      brokerId = await requireBrokerId();
    } catch (error) {
      console.log("No broker found in headers, using default broker");
      brokerId = defaultBroker.id;
    }

    const body = await request.json();
    const { userId, token } = body;

    if (!userId || !token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User ID and token are required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Two-factor authentication is not enabled for this user",
        },
        { status: 400 }
      );
    }

    // Verify the token or backup code
    let verified = false;

    // Check if it's a TOTP token
    verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

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
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid token or backup code",
        },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = await createSession(user.id, user.email, user.role, brokerId);

    // Return success response
    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          token: sessionToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            kycStatus: user.kycStatus,
          },
        },
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("2FA validation error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
