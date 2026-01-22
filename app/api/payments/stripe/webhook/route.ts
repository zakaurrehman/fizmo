import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { notifyDeposit } from "@/lib/notifications";
import Stripe from "stripe";

// Disable body parsing for webhook (need raw body)
export const runtime = "nodejs";

// POST - Handle Stripe Webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleExpiredPayment(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const depositId = session.metadata?.depositId;

  if (!depositId) {
    console.error("No depositId in session metadata");
    return;
  }

  // Find the deposit
  const deposit = await prisma.deposit.findUnique({
    where: { id: depositId },
    include: {
      client: {
        include: {
          user: true,
          accounts: {
            where: { status: "ACTIVE" },
            take: 1,
          },
        },
      },
    },
  });

  if (!deposit) {
    console.error("Deposit not found:", depositId);
    return;
  }

  // Update deposit status
  await prisma.deposit.update({
    where: { id: depositId },
    data: {
      status: "COMPLETED",
      providerTx: session.payment_intent as string,
      metadata: {
        stripeSessionId: session.id,
        stripePaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
        completedAt: new Date().toISOString(),
      },
    },
  });

  // Credit the first active account
  if (deposit.client.accounts.length > 0) {
    const account = deposit.client.accounts[0];
    await prisma.account.update({
      where: { id: account.id },
      data: {
        balance: { increment: Number(deposit.amount) },
        equity: { increment: Number(deposit.amount) },
      },
    });

    console.log(
      `Credited ${deposit.amount} to account ${account.accountId}`
    );
  }

  // Send notification
  await notifyDeposit(
    deposit.client.user.id,
    Number(deposit.amount),
    "COMPLETED",
    deposit.id
  );

  console.log(`Deposit ${depositId} completed successfully`);
}

async function handleExpiredPayment(session: Stripe.Checkout.Session) {
  const depositId = session.metadata?.depositId;

  if (!depositId) {
    return;
  }

  // Update deposit status to FAILED
  await prisma.deposit.update({
    where: { id: depositId },
    data: {
      status: "FAILED",
      metadata: {
        stripeSessionId: session.id,
        expiredAt: new Date().toISOString(),
      },
    },
  });

  console.log(`Deposit ${depositId} expired`);
}
