import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/super-admin/create-admin
 * Create a new admin user for a specific broker (SUPER_ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can create admin users
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      country,
      brokerId,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !brokerId) {
      return NextResponse.json(
        { error: "Email, password, first name, last name, and broker ID are required" },
        { status: 400 }
      );
    }

    // Verify broker exists
    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
    });

    if (!broker) {
      return NextResponse.json(
        { error: "Broker not found" },
        { status: 404 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique client ID
    const clientId = `ADMIN${Date.now()}`;

    // Create admin user with client profile
    const adminUser = await prisma.user.create({
      data: {
        brokerId,
        email,
        passwordHash,
        role: "ADMIN",
        kycStatus: "APPROVED", // Auto-approve admin users
        client: {
          create: {
            clientId,
            firstName,
            lastName,
            phone: phone || "",
            country: country || "",
            broker: {
              connect: { id: brokerId }
            },
          },
        },
      },
      include: {
        broker: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        broker: adminUser.broker,
        profile: adminUser.client,
        createdAt: adminUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
