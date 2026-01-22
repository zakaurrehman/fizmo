import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyDeposit } from "@/lib/notifications";

// POST - Handle CoinGate Webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // CoinGate sends: id, order_id, status, price_amount, price_currency, receive_amount, receive_currency, etc.
    const { id, order_id, status, price_amount } = body;

    console.log("CoinGate webhook received:", { id, order_id, status });

    // Find the deposit by order_id (which is our deposit.id)
    const deposit = await prisma.deposit.findUnique({
      where: { id: order_id },
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
      console.error("Deposit not found for order:", order_id);
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    // Handle different statuses
    // CoinGate statuses: new, pending, confirming, paid, invalid, expired, canceled, refunded
    switch (status) {
      case "paid":
      case "confirming": {
        // Payment successful
        await prisma.deposit.update({
          where: { id: deposit.id },
          data: {
            status: "COMPLETED",
            metadata: {
              ...(deposit.metadata as any),
              coinGateStatus: status,
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

        console.log(`Crypto deposit ${deposit.id} completed`);
        break;
      }

      case "expired":
      case "canceled":
      case "invalid": {
        // Payment failed
        await prisma.deposit.update({
          where: { id: deposit.id },
          data: {
            status: "FAILED",
            metadata: {
              ...(deposit.metadata as any),
              coinGateStatus: status,
              failedAt: new Date().toISOString(),
            },
          },
        });

        console.log(`Crypto deposit ${deposit.id} failed: ${status}`);
        break;
      }

      case "pending":
      case "new": {
        // Still processing, keep as pending
        console.log(`Crypto deposit ${deposit.id} is ${status}`);
        break;
      }

      default:
        console.log(`Unknown CoinGate status: ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("CoinGate webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
