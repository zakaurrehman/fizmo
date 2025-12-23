import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// First, let's create a Notification model (we'll need to add this to schema later)
// For now, we'll return mock data structure that matches the frontend

// GET - Fetch user notifications
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: When Notification table is added to schema, replace with real query
    // const notifications = await prisma.notification.findMany({
    //   where: { userId: user.id },
    //   orderBy: { createdAt: "desc" },
    //   take: 50,
    // });

    // For now, generate notifications from recent activity
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
      include: {
        deposits: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        withdrawals: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Build notifications from deposits and withdrawals
    const notifications: any[] = [];

    client.deposits.forEach((deposit) => {
      notifications.push({
        id: `deposit-${deposit.id}`,
        title: deposit.status === "COMPLETED" ? "Deposit Successful" : "Deposit Pending",
        message: `Your deposit of $${deposit.amount} is ${deposit.status.toLowerCase()}`,
        type: "TRANSACTION",
        category: "Financial",
        priority: deposit.status === "COMPLETED" ? "LOW" : "MEDIUM",
        read: false,
        createdAt: deposit.createdAt,
      });
    });

    client.withdrawals.forEach((withdrawal) => {
      notifications.push({
        id: `withdrawal-${withdrawal.id}`,
        title: withdrawal.status === "COMPLETED" ? "Withdrawal Processed" : "Withdrawal Pending",
        message: `Your withdrawal of $${withdrawal.amount} is ${withdrawal.status.toLowerCase()}`,
        type: "TRANSACTION",
        category: "Financial",
        priority: withdrawal.status === "PENDING" ? "HIGH" : "LOW",
        read: false,
        createdAt: withdrawal.createdAt,
      });
    });

    // Sort by creation date
    notifications.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      success: true,
    });
  } catch (error: any) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, read } = body;

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    // TODO: When Notification table is added
    // await prisma.notification.update({
    //   where: {
    //     id: notificationId,
    //     userId: user.id, // Ensure notification belongs to user
    //   },
    //   data: { read },
    // });

    return NextResponse.json({
      message: "Notification updated",
      success: true,
    });
  } catch (error: any) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { message: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 }
      );
    }

    // TODO: When Notification table is added
    // await prisma.notification.delete({
    //   where: {
    //     id: notificationId,
    //     userId: user.id, // Ensure notification belongs to user
    //   },
    // });

    return NextResponse.json({
      message: "Notification deleted",
      success: true,
    });
  } catch (error: any) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { message: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
