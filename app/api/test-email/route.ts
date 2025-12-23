import { NextRequest, NextResponse } from "next/server";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendDepositConfirmation,
  sendWithdrawalConfirmation,
  sendSupportTicketEmail,
} from "@/lib/email";

/**
 * Test endpoint to verify email functionality
 * GET /api/test-email?type=verification|reset|deposit|withdrawal|support
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "verification";
    const testEmail = searchParams.get("email") || "zakarehmanai@gmail.com";

    let result;

    switch (type) {
      case "verification":
        result = await sendVerificationEmail(
          testEmail,
          "test-token-123456",
          "Test User"
        );
        break;

      case "reset":
        result = await sendPasswordResetEmail(
          testEmail,
          "reset-token-123456",
          "Test User"
        );
        break;

      case "deposit":
        result = await sendDepositConfirmation(
          testEmail,
          500.0,
          "ACC-12345678",
          "Test User"
        );
        break;

      case "withdrawal":
        result = await sendWithdrawalConfirmation(
          testEmail,
          200.0,
          "ACC-12345678",
          "PENDING",
          "Test User"
        );
        break;

      case "support":
        result = await sendSupportTicketEmail(
          testEmail,
          "TKT-123456",
          "Test Support Ticket",
          "This is a test support ticket message",
          "Test User"
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} email sent successfully`,
      result,
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
