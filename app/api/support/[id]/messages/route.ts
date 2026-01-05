import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// POST - Add a message to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, attachments } = body;

    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Verify ticket exists and user owns it
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Create message
    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        userId: user.id,
        message,
        attachments: attachments || [],
        isStaff: false,
      },
    });

    // Update ticket's updatedAt timestamp
    await prisma.ticket.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message: ticketMessage }, { status: 201 });
  } catch (error: any) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
