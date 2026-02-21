import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * POST /api/admin/users/resend-verification
 * Resend email verification to a user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.emailVerified) {
      return NextResponse.json({ error: "User email is already verified" }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: userId },
      data: { verificationToken },
    });

    await sendVerificationEmail(targetUser.email, verificationToken);

    return NextResponse.json({ success: true, message: "Verification email sent" });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/admin/users/resend-verification
 * List users who have not verified their email
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

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const clients = await prisma.client.findMany({
      where: {
        brokerId,
        user: { emailVerified: false },
      },
      include: {
        user: { select: { id: true, email: true, emailVerified: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      users: clients.map((c) => ({
        userId: c.user.id,
        clientId: c.clientId,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.user.email,
        emailVerified: c.user.emailVerified,
        registeredAt: c.user.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("List unverified users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
