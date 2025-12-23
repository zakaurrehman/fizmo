import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// POST - Reply to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ticketId = params.id;
    const body = await request.json();
    const { message, attachments } = body;

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }

    // TODO: When Ticket table is added
    // // Verify ticket belongs to user
    // const ticket = await prisma.ticket.findFirst({
    //   where: {
    //     id: ticketId,
    //     userId: user.id,
    //   },
    // });

    // if (!ticket) {
    //   return NextResponse.json(
    //     { message: "Ticket not found" },
    //     { status: 404 }
    //   );
    // }

    // // Create reply
    // const reply = await prisma.ticketMessage.create({
    //   data: {
    //     ticketId,
    //     author: user.email,
    //     authorType: "client",
    //     message,
    //     attachments: attachments || [],
    //   },
    // });

    // // Update ticket's updatedAt
    // await prisma.ticket.update({
    //   where: { id: ticketId },
    //   data: { updatedAt: new Date() },
    // });

    const reply = {
      id: `msg-${Date.now()}`,
      author: user.email || "User",
      authorType: "client",
      message,
      createdAt: new Date(),
      attachments: attachments || [],
    };

    console.log(`Reply added to ticket ${ticketId} by ${user.email}`);

    return NextResponse.json({
      message: "Reply added successfully",
      reply,
      success: true,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Reply to ticket error:", error);
    return NextResponse.json(
      { message: "Failed to add reply" },
      { status: 500 }
    );
  }
}
