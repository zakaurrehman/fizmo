import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/super-admin/admins
 * Get all admin users across all brokers (SUPER_ADMIN only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can view all admins
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPER_ADMIN"],
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
      orderBy: { createdAt: "desc" },
    });

    const adminsWithDetails = admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      kycStatus: admin.kycStatus,
      createdAt: admin.createdAt,
      broker: admin.broker
        ? {
            id: admin.broker.id,
            name: admin.broker.name,
            slug: admin.broker.slug,
          }
        : null,
      profile: admin.client
        ? {
            firstName: admin.client.firstName,
            lastName: admin.client.lastName,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      admins: adminsWithDetails,
      total: adminsWithDetails.length,
    });
  } catch (error: any) {
    console.error("Fetch all admins error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
