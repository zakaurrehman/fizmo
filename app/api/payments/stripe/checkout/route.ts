import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

// POST - Create Stripe Checkout Session
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
        paymentMethod: "CREDIT_CARD",
        provider: "stripe",
        status: "PENDING",
      },
    });

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Trading Account Deposit",
              description: `Deposit to Fizmo Trader Account`,
            },
            unit_amount: Math.round(amountNum * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dashboard/deposit?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/deposit?canceled=true`,
      customer_email: user.email,
      metadata: {
        depositId: deposit.id,
        userId: user.id,
        clientId: client.id,
      },
    });

    // Update deposit with Stripe session ID
    await prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        providerTx: session.id,
        metadata: { stripeSessionId: session.id },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      depositId: deposit.id,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error.message },
      { status: 500 }
    );
  }
}
