import { NextRequest, NextResponse } from "next/server";
import { createCoinGateOrder } from "@/lib/coingate";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// POST - Create CoinGate payment order
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency = "USD" } = body;

    // Validate amount
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 50 || amountNum > 50000) {
      return NextResponse.json(
        { error: "Amount must be between $50 and $50,000" },
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

    // Create pending deposit record
    const deposit = await prisma.deposit.create({
      data: {
        brokerId: client.brokerId,
        clientId: client.id,
        amount: amountNum,
        currency,
        paymentMethod: "CRYPTO",
        provider: "coingate",
        status: "PENDING",
      },
    });

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create CoinGate order
    const order = await createCoinGateOrder({
      orderId: deposit.id,
      amount: amountNum,
      currency,
      title: "Trading Account Deposit",
      description: `Deposit to Fizmo Trader - ${user.email}`,
      callbackUrl: `${baseUrl}/api/payments/coingate/webhook`,
      cancelUrl: `${baseUrl}/dashboard/deposit?canceled=true`,
      successUrl: `${baseUrl}/dashboard/deposit?success=true&provider=coingate`,
    });

    // Update deposit with CoinGate order ID
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        providerTx: order.id.toString(),
        metadata: {
          coinGateOrderId: order.id,
          coinGateToken: order.token,
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      paymentUrl: order.payment_url,
      depositId: deposit.id,
    });
  } catch (error: any) {
    console.error("CoinGate checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create crypto payment", details: error.message },
      { status: 500 }
    );
  }
}
