import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { notifyAccountCreated } from "@/lib/notifications";

// GET - Fetch all accounts for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all accounts for this client
    const accounts = await prisma.account.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error("Accounts fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new account
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountType, currency, leverage } = body;

    // Validate input
    if (!accountType || !currency || !leverage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Generate account ID (MT5-XXXXXX format)
    const accountCount = await prisma.account.count();
    const accountId = `MT5-${(100000 + accountCount + 1).toString()}`;

    // Create the account
    const account = await prisma.account.create({
      data: {
        clientId: client.id,
        accountId,
        accountType,
        currency,
        leverage: parseInt(leverage),
        balance: accountType === "DEMO" ? 10000 : 0, // Demo accounts start with $10,000
        equity: accountType === "DEMO" ? 10000 : 0,
        status: "ACTIVE",
      },
    });

    // Send notification
    await notifyAccountCreated(user.id, accountId, accountType);

    return NextResponse.json({ account }, { status: 201 });
  } catch (error: any) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
