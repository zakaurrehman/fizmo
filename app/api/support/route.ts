import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// GET - Fetch all tickets for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          // Return all messages for ticket detail view
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("Tickets fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new support ticket
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, category, priority, message } = body;

    // Validate input
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Generate ticket ID (TKT-123456 format)
    const ticketCount = await prisma.ticket.count();
    const ticketId = `TKT-${(100000 + ticketCount + 1).toString()}`;

    // Get broker ID from user
    const userWithBroker = await prisma.user.findUnique({
      where: { id: user.id },
      select: { brokerId: true },
    });

    // Create ticket with first message in a transaction
    const ticket = await prisma.ticket.create({
      data: {
        brokerId: userWithBroker?.brokerId,
        userId: user.id,
        ticketId,
        subject,
        category: category || "GENERAL",
        priority: priority || "MEDIUM",
        status: "OPEN",
        messages: {
          create: {
            userId: user.id,
            message,
            isStaff: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: any) {
    console.error("Ticket creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
