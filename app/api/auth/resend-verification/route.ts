import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json(
        {
          message: "If an account exists with this email, a verification email has been sent.",
          success: true,
        },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      },
    });

    // Get user's name from client profile
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      verificationToken,
      client?.firstName || undefined
    );

    console.log(`Verification email resent to: ${user.email}`);
    if (emailResult.success) {
      console.log(`✅ Verification email sent successfully to: ${user.email}`);
    } else {
      console.error(`❌ Failed to send verification email to: ${user.email}`, emailResult.error);
      console.error("Check RESEND_API_KEY and FROM_EMAIL environment variables");
    }

    return NextResponse.json(
      {
        message: "Verification email has been sent.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
