import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: any
) {
  try {
    // Get user's broker ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { brokerId: true },
    });

    const notification = await prisma.notification.create({
      data: {
        userId,
        brokerId: user?.brokerId,
        type,
        title,
        message,
        metadata,
        isRead: false,
      },
    });

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

/**
 * Notify user about account creation
 */
export async function notifyAccountCreated(userId: string, accountId: string, accountType: string) {
  return createNotification(
    userId,
    "ACCOUNT",
    "Trading Account Created",
    `Your ${accountType} account (${accountId}) has been created successfully.`,
    { accountId, accountType }
  );
}

/**
 * Notify user about deposit
 */
export async function notifyDeposit(
  userId: string,
  amount: number,
  status: string,
  depositId: string
) {
  const title =
    status === "COMPLETED"
      ? "Deposit Successful"
      : status === "PENDING"
      ? "Deposit Pending"
      : "Deposit Failed";

  const message =
    status === "COMPLETED"
      ? `Your deposit of $${amount.toFixed(2)} has been credited to your account.`
      : status === "PENDING"
      ? `Your deposit of $${amount.toFixed(2)} is being processed.`
      : `Your deposit of $${amount.toFixed(2)} has failed.`;

  return createNotification(userId, "DEPOSIT", title, message, {
    amount,
    status,
    depositId,
  });
}

/**
 * Notify user about withdrawal
 */
export async function notifyWithdrawal(
  userId: string,
  amount: number,
  status: string,
  withdrawalId: string
) {
  const title =
    status === "COMPLETED"
      ? "Withdrawal Processed"
      : status === "PENDING"
      ? "Withdrawal Pending"
      : "Withdrawal Failed";

  const message =
    status === "COMPLETED"
      ? `Your withdrawal of $${amount.toFixed(2)} has been processed.`
      : status === "PENDING"
      ? `Your withdrawal of $${amount.toFixed(2)} is being processed.`
      : `Your withdrawal of $${amount.toFixed(2)} has failed.`;

  return createNotification(userId, "WITHDRAWAL", title, message, {
    amount,
    status,
    withdrawalId,
  });
}

/**
 * Notify user about KYC status change
 */
export async function notifyKYCStatus(userId: string, status: string, reason?: string) {
  const title =
    status === "APPROVED"
      ? "KYC Verified"
      : status === "REJECTED"
      ? "KYC Rejected"
      : "KYC Under Review";

  const message =
    status === "APPROVED"
      ? "Your identity verification has been approved. You can now access all features."
      : status === "REJECTED"
      ? `Your identity verification was rejected. ${reason || "Please resubmit your documents."}`
      : "Your KYC documents are currently under review.";

  return createNotification(userId, "KYC", title, message, { status, reason });
}

/**
 * Notify user about support ticket update
 */
export async function notifyTicketUpdate(
  userId: string,
  ticketId: string,
  status: string,
  message: string
) {
  return createNotification(
    userId,
    "SUPPORT",
    `Ticket ${ticketId} Updated`,
    `${message} Status: ${status}`,
    { ticketId, status }
  );
}

/**
 * Notify user about trade
 */
export async function notifyTrade(
  userId: string,
  symbol: string,
  profit: number,
  tradeId: string
) {
  const title = profit >= 0 ? "Trade Closed - Profit" : "Trade Closed - Loss";
  const message = `Your ${symbol} trade closed with ${profit >= 0 ? "profit" : "loss"} of $${Math.abs(profit).toFixed(2)}`;

  return createNotification(userId, "TRADE", title, message, {
    symbol,
    profit,
    tradeId,
  });
}
