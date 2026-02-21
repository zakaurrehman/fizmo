import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { sendMT5DataEmail } from "@/lib/email";

/**
 * POST /api/admin/users/resend-mt5-data
 * Resend MT5 account credentials email to a client
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

    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        user: { select: { email: true } },
        accounts: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!client.accounts.length) {
      return NextResponse.json({ error: "Client has no active trading accounts" }, { status: 400 });
    }

    const account = client.accounts[0];

    await sendMT5DataEmail(
      client.user.email,
      account.accountId,
      account.mt4Login || account.mt5Login || 0,
      account.leverage,
      client.firstName || "Client"
    );

    return NextResponse.json({ success: true, message: "MT5 data email sent" });
  } catch (error: any) {
    console.error("Resend MT5 data error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/admin/users/resend-mt5-data
 * List clients with active MT5 accounts
 */
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

    const clients = await prisma.client.findMany({
      where: {
        brokerId,
        accounts: { some: { status: "ACTIVE" } },
      },
      include: {
        user: { select: { email: true } },
        accounts: {
          where: { status: "ACTIVE" },
          select: { accountId: true, accountType: true, mt4Login: true, mt5Login: true, leverage: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ clients });
  } catch (error: any) {
    console.error("List MT5 clients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
