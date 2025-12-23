import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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

    // TODO: Send verification email
    // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verificationToken}`;
    // await sendEmail({
    //   to: user.email,
    //   subject: "Verify Your Email Address",
    //   html: `Click here to verify your email: ${verifyUrl}`,
    // });

    console.log(`Verification email resent to: ${user.email}`);
    console.log(`Verification token: ${verificationToken}`);

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
