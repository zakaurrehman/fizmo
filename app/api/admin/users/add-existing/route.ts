import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

/**
 * POST /api/admin/users/add-existing
 * Link an existing user (by email) to this broker as a client
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
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { client: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    // Check if already a client for this broker
    if (existingUser.client?.brokerId === brokerId) {
      return NextResponse.json({ error: "User is already a client for this broker" }, { status: 409 });
    }

    const clientId = `CLI-${Date.now()}`;

    const client = await prisma.client.create({
      data: {
        brokerId,
        userId: existingUser.id,
        clientId,
        firstName: existingUser.client?.firstName || "",
        lastName: existingUser.client?.lastName || "",
        phone: existingUser.client?.phone || null,
        country: existingUser.client?.country || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Existing user added as client",
      clientId: client.clientId,
    });
  } catch (error: any) {
    console.error("Add existing client error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
