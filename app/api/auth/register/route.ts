import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { RegisterRequest, ApiResponse, AuthResponse } from "@/types/api";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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
        email: email.toLowerCase(),
        passwordHash,
        role: "CLIENT",
        verificationToken,
        emailVerified: false,
        client: {
          create: {
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

    // TODO: Send verification email
    // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verificationToken}`;
    // await sendEmail({
    //   to: user.email,
    //   subject: "Verify Your Email Address",
    //   html: `Welcome to Fizmo! Click here to verify your email: ${verifyUrl}`,
    // });

    console.log(`User registered: ${user.email}`);
    console.log(`Verification token: ${verificationToken}`);

    // Create session
    const token = await createSession(user.id, user.email, user.role);

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
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
