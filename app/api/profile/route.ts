import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch profile data
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
        kycStatus: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        email: userData?.email || "",
        firstName: client?.firstName || "",
        lastName: client?.lastName || "",
        phone: client?.phone || "",
        country: client?.country || "",
        kycStatus: userData?.kycStatus || "NOT_STARTED",
        twoFactorEnabled: userData?.twoFactorEnabled || false,
        labels: client?.labels || [],
        metadata: client?.metadata || {},
      },
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT - Update profile data
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, country } = body;

    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    await prisma.client.update({
      where: { id: client.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(country !== undefined && { country }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
