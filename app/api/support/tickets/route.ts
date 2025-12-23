import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { sendSupportTicketEmail } from "@/lib/email";

// NOTE: This requires a Ticket model in Prisma schema
// For now, returning structured mock data that matches frontend expectations

// GET - Fetch user's tickets
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: When Ticket table is added to schema
    // const tickets = await prisma.ticket.findMany({
    //   where: { userId: user.id },
    //   include: {
    //     messages: {
    //       orderBy: { createdAt: "asc" },
    //     },
    //   },
    //   orderBy: { createdAt: "desc" },
    // });

    // Mock tickets data structure
    const tickets = [
      {
        id: "TKT-001",
        subject: "Unable to make deposit",
        category: "Deposit",
        priority: "High",
        status: "Open",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        messages: [
          {
            id: "msg-1",
            author: user.email || "User",
            authorType: "client",
            message: "I'm trying to make a deposit but getting an error. Can you help?",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            attachments: [],
          },
          {
            id: "msg-2",
            author: "Support Team",
            authorType: "support",
            message: "Thank you for contacting us. We're looking into this issue. Could you please provide the error message you're seeing?",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            attachments: [],
          },
        ],
      },
    ];

    return NextResponse.json({
      tickets,
      success: true,
    });
  } catch (error: any) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, category, priority, message, attachments } = body;

    // Validation
    if (!subject || !category || !priority || !message) {
      return NextResponse.json(
        { message: "Subject, category, priority, and message are required" },
        { status: 400 }
      );
    }

    // TODO: When Ticket table is added
    // const ticket = await prisma.ticket.create({
    //   data: {
    //     userId: user.id,
    //     subject,
    //     category,
    //     priority,
    //     status: "Open",
    //     messages: {
    //       create: {
    //         author: user.email,
    //         authorType: "client",
    //         message,
    //         attachments: attachments || [],
    //       },
    //     },
    //   },
    //   include: {
    //     messages: true,
    //   },
    // });

    const ticketId = `TKT-${Date.now()}`;

    // Mock ticket creation
    const ticket = {
      id: ticketId,
      subject,
      category,
      priority,
      status: "Open",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          author: user.email || "User",
          authorType: "client",
          message,
          createdAt: new Date(),
          attachments: attachments || [],
        },
      ],
    };

    console.log(`Ticket created: ${ticketId} by ${user.email}`);

    // Get user's name from client profile
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    // Send support ticket confirmation email
    await sendSupportTicketEmail(
      user.email,
      ticketId,
      subject,
      message,
      client?.firstName || undefined
    );

    return NextResponse.json({
      message: "Ticket created successfully",
      ticket,
      success: true,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
