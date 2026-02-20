import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (5 password reset requests per hour per IP)
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, 5, 3600000);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: "Too many password reset attempts. Please try again later." },
        { status: 429 }
      );
    }

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

    // Always return success (security best practice - don't reveal if email exists)
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Get user's name from client profile
      const client = await prisma.client.findUnique({
        where: { userId: user.id },
      });

      // Send password reset email
      const emailResult = await sendPasswordResetEmail(
        user.email,
        resetToken,
        client?.firstName || undefined
      );

      if (emailResult.success) {
        console.log(`✅ Password reset email sent successfully to: ${user.email}`);
      } else {
        console.error(`❌ Failed to send password reset email to: ${user.email}`, emailResult.error);
        console.error("Check RESEND_API_KEY and FROM_EMAIL environment variables");
      }
    }

    return NextResponse.json(
      {
        message: "If an account exists with this email, a password reset link has been sent.",
        success: true
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
