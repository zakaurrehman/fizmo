import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// PATCH - Restore a soft-deleted client (Super Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only SUPER_ADMIN can restore deleted clients
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Super Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("id");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Fetch the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if client is actually deleted
    if (client.status !== "DELETED") {
      return NextResponse.json(
        { error: "Client is not deleted. Current status: " + client.status },
        { status: 400 }
      );
    }

    // Restore: Update client status to ACTIVE
    await prisma.client.update({
      where: { id: clientId },
      data: {
        status: "ACTIVE",
      },
    });

    // Also restore user status to ACTIVE
    await prisma.user.update({
      where: { id: client.user.id },
      data: {
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Client restored successfully",
      clientId,
      email: client.user.email,
      status: "ACTIVE",
    });
  } catch (error: any) {
    console.error("Restore client error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
