import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Send email verification link to user
 */
export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  try {
    console.log(`[Email] Attempting to send verification email to: ${email}`);
    console.log(`[Email] FROM_EMAIL: ${FROM_EMAIL}`);

    const { data, error } = await resend.emails.send({
      from: `Fizmo <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address - Fizmo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Fizmo!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Thank you for registering with Fizmo, your trusted Forex trading platform.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #667eea; word-break: break-all;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with Fizmo, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('[Email] Resend API error:', error);
      return { success: false, error };
    }

    console.log('[Email] Resend API response - Email ID:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('[Email] Failed to send verification email:', error);
    return { success: false, error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: `Fizmo <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your password - Fizmo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>We received a request to reset your Fizmo account password.</p>
              <p>Click the button below to reset your password:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #667eea; word-break: break-all;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <p>This link expires in 1 hour for your security.</p>
                <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

/**
 * Send deposit confirmation email
 */
export async function sendDepositConfirmation(
  email: string,
  amount: number,
  accountNumber: string,
  name?: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo <${FROM_EMAIL}>`,
      to: email,
      subject: 'Deposit Confirmed - Fizmo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 36px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Deposit Successful!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Your deposit has been successfully processed and credited to your trading account.</p>
              <div class="amount">$${amount.toFixed(2)}</div>
              <div class="details">
                <div class="detail-row">
                  <span><strong>Account:</strong></span>
                  <span>${accountNumber}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Amount:</strong></span>
                  <span>$${amount.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Status:</strong></span>
                  <span style="color: #10b981;">Completed</span>
                </div>
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${new Date().toLocaleString()}</span>
                </div>
              </div>
              <p>You can now start trading with your deposited funds.</p>
              <center>
                <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send deposit confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send withdrawal confirmation email
 */
export async function sendWithdrawalConfirmation(
  email: string,
  amount: number,
  accountNumber: string,
  status: string,
  name?: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo <${FROM_EMAIL}>`,
      to: email,
      subject: `Withdrawal ${status === 'COMPLETED' ? 'Completed' : 'Pending'} - Fizmo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 36px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
            .info { background: #e0e7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${status === 'COMPLETED' ? '✓ Withdrawal Completed' : 'Withdrawal Request Received'}</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Your withdrawal request has been ${status === 'COMPLETED' ? 'processed successfully' : 'received and is being processed'}.</p>
              <div class="amount">$${amount.toFixed(2)}</div>
              <div class="details">
                <div class="detail-row">
                  <span><strong>Account:</strong></span>
                  <span>${accountNumber}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Amount:</strong></span>
                  <span>$${amount.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Status:</strong></span>
                  <span style="color: ${status === 'COMPLETED' ? '#10b981' : '#f59e0b'};">${status}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${new Date().toLocaleString()}</span>
                </div>
              </div>
              ${
                status === 'PENDING'
                  ? `<div class="info">
                <strong>ℹ️ Processing Time:</strong>
                <p>Withdrawals typically take 1-3 business days to process. You will receive another email once the funds are transferred.</p>
              </div>`
                  : '<p>The funds have been transferred to your designated account.</p>'
              }
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send withdrawal confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send support ticket notification to user
 */
export async function sendSupportTicketEmail(
  email: string,
  ticketId: string,
  subject: string,
  message: string,
  name?: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo Support <${FROM_EMAIL}>`,
      to: email,
      subject: `Support Ticket #${ticketId} Created - Fizmo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Support Ticket Created</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Your support ticket has been successfully created. Our team will review your request and respond as soon as possible.</p>
              <div class="ticket">
                <p><strong>Ticket ID:</strong> #${ticketId}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Your Message:</strong></p>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
              </div>
              <p>We typically respond to support tickets within 24 hours during business days.</p>
              <center>
                <a href="${APP_URL}/dashboard/support" class="button">View Ticket</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send support ticket email:', error);
    return { success: false, error };
  }
}

/**
 * Send admin alert for new deposits
 */
export async function sendAdminDepositAlert(
  adminEmail: string,
  userEmail: string,
  amount: number,
  accountNumber: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo Alerts <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `New Deposit Alert - $${amount.toFixed(2)} - Fizmo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 New Deposit Alert</h1>
            </div>
            <div class="content">
              <h2>New Deposit Received</h2>
              <div class="alert">
                <p><strong>User:</strong> ${userEmail}</p>
                <p><strong>Account:</strong> ${accountNumber}</p>
                <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <center>
                <a href="${APP_URL}/admin" class="button">View in Admin Panel</a>
              </center>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send admin deposit alert:', error);
    return { success: false, error };
  }
}

/**
 * Send admin alert for new withdrawal requests
 */
export async function sendAdminWithdrawalAlert(
  adminEmail: string,
  userEmail: string,
  amount: number,
  accountNumber: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo Alerts <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `New Withdrawal Request - $${amount.toFixed(2)} - Fizmo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ New Withdrawal Request</h1>
            </div>
            <div class="content">
              <h2>Withdrawal Pending Approval</h2>
              <div class="alert">
                <p><strong>User:</strong> ${userEmail}</p>
                <p><strong>Account:</strong> ${accountNumber}</p>
                <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> PENDING APPROVAL</p>
              </div>
              <p>Please review and approve/reject this withdrawal request in the admin panel.</p>
              <center>
                <a href="${APP_URL}/admin/withdrawals" class="button">Review Withdrawal</a>
              </center>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send admin withdrawal alert:', error);
    return { success: false, error };
  }
}

/**
 * Send KYC status update email to user
 */
export async function sendKycStatusEmail(
  email: string,
  status: string,
  rejectionReason?: string,
  name?: string
) {
  try {
    const isApproved = status === "APPROVED";
    const header = isApproved
      ? "✓ KYC Verification Approved!"
      : status === "REJECTED"
        ? "✗ KYC Verification Not Approved"
        : "KYC Verification Update";

    const headerGradient = isApproved
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";

    const messageText = isApproved
      ? "Congratulations! Your KYC verification has been approved. You can now access all features of your trading account."
      : rejectionReason
        ? `Your KYC verification was not approved. Reason: ${rejectionReason}. Please submit corrected documents for review.`
        : "Your KYC verification has been updated. Please check the details below.";

    await resend.emails.send({
      from: `Fizmo Verification <${FROM_EMAIL}>`,
      to: email,
      subject: `KYC ${status} - Fizmo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${headerGradient}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${isApproved ? "#10b981" : "#ef4444"}; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${header}</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>${messageText}</p>
              <div class="info">
                <p><strong>Verification Status:</strong> ${status}</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              ${
                isApproved
                  ? `<center>
                <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
              </center>`
                  : `<center>
                <a href="${APP_URL}/dashboard/profile" class="button">Resubmit Documents</a>
              </center>`
              }
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send KYC status email:", error);
    return { success: false, error };
  }
}

/**
 * Send MT5 account data email to client
 */
export async function sendMT5DataEmail(
  email: string,
  accountId: string,
  mt5Login: number,
  leverage: number,
  name?: string
) {
  try {
    await resend.emails.send({
      from: `Fizmo Trading <${FROM_EMAIL}>`,
      to: email,
      subject: "Your MT5 Trading Account Details - Fizmo",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .detail-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .label { color: #6b7280; font-size: 14px; }
            .value { font-weight: bold; color: #111827; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MT5 Account Details</h1>
              <p>Your trading account information</p>
            </div>
            <div class="content">
              <p>Hello ${name || "Trader"},</p>
              <p>Here are your MT5 trading account details:</p>
              <div class="detail-box">
                <div class="detail-row">
                  <span class="label">Account ID</span>
                  <span class="value">${accountId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">MT5 Login</span>
                  <span class="value">${mt5Login || "N/A"}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Leverage</span>
                  <span class="value">1:${leverage}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Server</span>
                  <span class="value">Fizmo-Live</span>
                </div>
              </div>
              <p>Please keep this information secure and do not share it with anyone.</p>
              <p>If you did not request this email, please contact support immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Fizmo. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send MT5 data email:", error);
    return { success: false, error };
  }
}
