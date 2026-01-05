import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { ensureDefaultBroker, requireBrokerId } from "@/lib/broker";
import type { LoginRequest, ApiResponse, AuthResponse } from "@/types/api";

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

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user within this broker
    // SUPER_ADMIN can login from any broker subdomain
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        OR: [
          { brokerId },
          { role: "SUPER_ADMIN" },
        ],
      },
      include: {
        client: true,
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Account is ${user.status.toLowerCase()}. Please contact support.`,
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return 2FA required response
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "2FA_REQUIRED",
          message: "Two-factor authentication is required",
          data: {
            userId: user.id,
            email: user.email,
            requires2FA: true,
          },
        },
        { status: 200 } // Use 200 but with error field to indicate 2FA is needed
      );
    }

    // Create session
    const token = await createSession(user.id, user.email, user.role, brokerId);

    // Return success response
    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          token,
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
    console.error("Login error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
