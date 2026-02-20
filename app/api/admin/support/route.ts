import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch all support tickets (Admin only)
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

    const tickets = await prisma.ticket.findMany({
      where: { brokerId },
      include: {
        user: {
          select: {
            email: true,
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "OPEN").length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,
    };

    return NextResponse.json({ tickets, stats });
  } catch (error: any) {
    console.error("Admin tickets fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket status or assign (Admin only)
export async function PATCH(request: NextRequest) {
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
    const { ticketId, status, assignedTo } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, brokerId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    console.error("Admin ticket update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Reply to a ticket as staff (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const body = await request.json();
    const { ticketId, message } = body;

    if (!ticketId || !message) {
      return NextResponse.json({ error: "Ticket ID and message are required" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, brokerId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Create staff reply and update ticket status
    const [reply] = await prisma.$transaction([
      prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          userId: user.id,
          message,
          isStaff: true,
        },
      }),
      prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: "WAITING_USER" },
      }),
    ]);

    return NextResponse.json({ success: true, message: reply });
  } catch (error: any) {
    console.error("Admin ticket reply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
