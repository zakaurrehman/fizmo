import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { sendVerificationEmail } from "@/lib/email";
import { ensureDefaultBroker, requireBrokerId } from "@/lib/broker";
import type { RegisterRequest, ApiResponse, AuthResponse } from "@/types/api";
import crypto from "crypto";

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

    const body: RegisterRequest = await request.json();
    const { email, password, confirmPassword, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "All required fields must be filled",
        },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: passwordValidation.errors.join(", "),
        },
        { status: 400 }
      );
    }

    // Check if user already exists within this broker
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        brokerId,
      },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate unique client ID
    const clientId = `CL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user and client in a transaction
    const user = await prisma.user.create({
      data: {
        brokerId,
        email: email.toLowerCase(),
        passwordHash,
        role: "CLIENT",
        verificationToken,
        emailVerified: false,
        client: {
          create: {
            brokerId,
            clientId,
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        client: true,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken, firstName);

    console.log(`User registered: ${user.email}`);
    console.log(`Verification email sent to: ${user.email}`);

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
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
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
