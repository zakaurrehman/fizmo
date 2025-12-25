# Email Setup Guide - Fizmo Trader

## Issue: Not Receiving Verification or Password Reset Emails

If you're not receiving verification emails after registration or password reset emails, follow this guide to configure email service properly.

## Root Cause

The application uses **Resend** as the email service provider. Emails won't be sent if:
1. `RESEND_API_KEY` is not configured in environment variables
2. `FROM_EMAIL` is not set or using invalid domain
3. Email domain is not verified in Resend dashboard

## Solution: Configure Resend Email Service

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key

1. Log into Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Fizmo Production")
5. Copy the API key (starts with `re_...`)

### Step 3: Add Domain (For Production)

For production, you need to verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `fizmo.com`)
4. Add the DNS records shown to your domain provider:
   - SPF Record
   - DKIM Records
   - DMARC Record (optional but recommended)
5. Wait for verification (usually 5-30 minutes)

**For Development/Testing:**
- You can use `onboarding@resend.dev` (Resend's test domain)
- This only works for sending to verified email addresses in your Resend account
- Add your test email in Resend dashboard → Settings → Verified Emails

### Step 4: Configure Environment Variables

#### Local Development (.env.local)

```bash
# Email Configuration
RESEND_API_KEY="re_your_actual_api_key_here"

# For development/testing - use Resend's test domain
FROM_EMAIL="onboarding@resend.dev"

# OR for production with your verified domain
# FROM_EMAIL="noreply@yourdomain.com"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Vercel Production

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

3. **Important:** Make sure to set these for the **Production** environment
4. Redeploy your application after adding environment variables

### Step 5: Verify Email Sending

#### Check Application Logs

**Local Development:**
```bash
npm run dev
# Try to register or reset password
# Look for these log messages:
✅ Verification email sent successfully to: user@example.com
# OR
❌ Failed to send verification email to: user@example.com
```

**Vercel Production:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → Functions → Runtime Logs
3. Trigger registration or password reset
4. Look for email success/failure logs

#### Check Resend Dashboard

1. Go to Resend dashboard → **Emails** tab
2. You should see all sent emails with their status:
   - ✅ **Delivered** - Email sent successfully
   - ⏳ **Queued** - Being processed
   - ❌ **Failed** - Check error message

### Step 6: Test Email Delivery

1. **Register a new account** with your real email address
2. Check your inbox (and spam folder!) for verification email
3. Click the verification link
4. Test **Forgot Password** flow:
   - Go to `/forgot-password`
   - Enter your email
   - Check inbox for password reset email

## Troubleshooting

### Issue 1: "Failed to send verification email" in logs

**Check:**
- RESEND_API_KEY is correctly set in environment variables
- API key is active and not revoked
- FROM_EMAIL matches a verified domain in Resend

**Solution:**
```bash
# Verify environment variables are loaded
# In your API route, temporarily add:
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
```

### Issue 2: Emails sent but not received

**Check:**
1. **Spam folder** - Resend emails often land in spam initially
2. **Domain verification** - If using custom domain, ensure DNS records are verified
3. **Recipient email** - If using `onboarding@resend.dev`, only verified emails in Resend can receive

**Solution for Development:**
- Add your test email in Resend → Settings → Verified Emails
- Or use a custom verified domain

### Issue 3: "Invalid API key" error

**Solution:**
- Double-check the API key in Resend dashboard
- Ensure no extra spaces or quotes in .env file
- API key should start with `re_`
- Create a new API key if the old one was revoked

### Issue 4: Domain not verified

**Solution:**
1. Go to Resend → Domains
2. Click on your domain
3. Verify all DNS records are added correctly:
   ```
   Type: TXT
   Name: resend._domainkey.yourdomain.com
   Value: [provided by Resend]

   Type: TXT
   Name: _dmarc.yourdomain.com
   Value: [provided by Resend]
   ```
4. Wait 5-30 minutes for DNS propagation
5. Click "Verify Domain" in Resend dashboard

### Issue 5: Rate limits exceeded

**Free Tier Limits:**
- 100 emails/day
- 3,000 emails/month

**Solution:**
- Upgrade to paid plan if needed
- Or use a different email service (requires code changes)

## Alternative: Using Development Mode Without Email

If you don't want to set up email service for development, you can:

1. **Disable email verification requirement** (not recommended for production):

```typescript
// In app/api/auth/register/route.ts
const user = await prisma.user.create({
  data: {
    // ...
    emailVerified: true, // Set to true for dev
    verificationToken: null, // No token needed
  }
});
```

2. **Use console logging** - Verification tokens are logged to console:
```bash
# Look for:
User registered: user@example.com
Verification token: abc123...
```

Copy the token and manually construct the verification URL:
```
http://localhost:3000/verify-email?token=abc123...
```

## Email Templates Included

The application includes beautiful HTML email templates for:

1. ✅ **Email Verification** - Welcome email with verification link
2. 🔑 **Password Reset** - Secure password reset link (1 hour expiry)
3. 💰 **Deposit Confirmation** - Transaction successful notification
4. 💸 **Withdrawal Notification** - Withdrawal status updates
5. 🎫 **Support Ticket** - Support ticket creation confirmation
6. 📊 **Admin Alerts** - Deposit/withdrawal alerts for admins

All templates are mobile-responsive and professionally designed.

## Production Checklist

Before deploying to production:

- [ ] Resend API key added to Vercel environment variables
- [ ] Custom domain verified in Resend dashboard
- [ ] FROM_EMAIL set to your domain (e.g., noreply@yourdomain.com)
- [ ] NEXT_PUBLIC_APP_URL set to production URL
- [ ] Test email sending after deployment
- [ ] Check Resend dashboard for email delivery status
- [ ] Add SPF, DKIM, and DMARC records to improve deliverability
- [ ] Monitor email logs for failures

## Support

If you continue to experience issues:

1. Check Resend status page: https://resend.com/status
2. Review Resend documentation: https://resend.com/docs
3. Check application logs in Vercel for detailed error messages
4. Contact Resend support if API issues persist

## Cost

**Resend Pricing:**
- Free tier: 3,000 emails/month, 100 emails/day
- Pro: $20/month for 50,000 emails
- Enterprise: Custom pricing

For most startups, the free tier is sufficient for initial development and testing.
