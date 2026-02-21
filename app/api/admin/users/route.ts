import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { hashPassword } from "@/lib/auth/password";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * POST /api/admin/users
 * Admin creates a new user + client record
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

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const body = await request.json();
    const { email, password, firstName, lastName, phone, country } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const clientId = `CLI-${Date.now()}`;

    // Create user + client in transaction
    const newClient = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "CLIENT",
          brokerId,
          verificationToken,
          emailVerified: false,
        },
      });

      const client = await tx.client.create({
        data: {
          brokerId,
          userId: newUser.id,
          clientId,
          firstName: firstName || "",
          lastName: lastName || "",
          phone: phone || null,
          country: country || null,
        },
      });

      return client;
    });

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(email, verificationToken, firstName);
    } catch (e) {
      console.error("Failed to send verification email:", e);
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      clientId: newClient.clientId,
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

/**
 * GET /api/admin/users
 * List all users for this broker
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const clients = await prisma.client.findMany({
      where: {
        brokerId,
        ...(search ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { clientId: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: {
        user: {
          select: { id: true, email: true, status: true, kycStatus: true, emailVerified: true, createdAt: true },
        },
        _count: { select: { accounts: true, deposits: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ users: clients });
  } catch (error: any) {
    console.error("List users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
