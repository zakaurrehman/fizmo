import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * DELETE /api/super-admin/delete-admin
 * Delete an admin user (SUPER_ADMIN only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can delete admins
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("id");

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      );
    }

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      include: { client: true },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prevent deleting SUPER_ADMIN users
    if (adminUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete SUPER_ADMIN users" },
        { status: 400 }
      );
    }

    // Only allow deleting ADMIN role users
    if (adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Can only delete ADMIN users" },
        { status: 400 }
      );
    }

    // Delete associated client profile first if exists
    if (adminUser.client) {
      await prisma.client.delete({
        where: { id: adminUser.client.id },
      });
    }

    // Delete any sessions for this user
    await prisma.session.deleteMany({
      where: { userId: adminId },
    });

    // Delete the admin user
    await prisma.user.delete({
      where: { id: adminId },
    });

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
