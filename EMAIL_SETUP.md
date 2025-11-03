# 📧 Email Verification Setup Guide

This guide shows you how to set up email verification for Codak login.

## Quick Setup with Resend (Recommended)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### Step 2: Get API Key

1. After logging in, go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: `Codak Production`
4. Select permissions: "Sending access"
5. Copy the API key (starts with `re_...`)
6. ⚠️ **Save it now - you can't see it again!**

### Step 3: Verify Domain (Optional but Recommended)

For production, verify your domain:
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `codak.app`)
4. Add the DNS records shown
5. Wait for verification (usually 5-10 minutes)

### Step 4: Add to Environment Variables

#### Local Development (.env.local)

Create or edit `.env.local` in your project root:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**For testing without domain verification, use:**
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### Vercel Production

1. Go to https://vercel.com/dashboard
2. Select your Codak project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:
   - `RESEND_API_KEY` = `re_your_api_key_here`
   - `RESEND_FROM_EMAIL` = `noreply@yourdomain.com` (or `onboarding@resend.dev` for testing)
5. Select environments: Production, Preview, Development
6. Click **Save**
7. Redeploy your app

### Step 5: Test It

1. Restart your dev server: `npm run dev`
2. Try logging in
3. Check your email for the verification code
4. Enter the code to complete login

## How It Works

1. **User enters email/password** → Password is verified
2. **System sends 6-digit code** → Sent to user's email
3. **User enters code** → Code is verified
4. **User logged in** → Session created

## Development Mode

If `RESEND_API_KEY` is not set, the app will:
- Still work normally
- Show verification code in browser console
- Allow testing without email setup

## Security Features

✅ **6-digit codes** - Secure random codes  
✅ **10-minute expiry** - Codes expire quickly  
✅ **5 attempt limit** - Prevents brute force  
✅ **One-time use** - Codes are deleted after use  
✅ **Login logging** - All attempts are logged  
✅ **Admin dashboard** - View all login events

## Troubleshooting

### "Failed to send verification email"
- Check `RESEND_API_KEY` is set correctly
- Verify API key has "Sending" permissions
- Check Resend dashboard for errors

### "Code expired"
- Codes expire after 10 minutes
- Click "Resend Code" to get a new one

### "Too many attempts"
- Maximum 5 attempts per code
- Request a new code

### Emails going to spam
- Verify your domain in Resend
- Use a custom domain email address
- Check spam folder initially

## Admin Access

To view login logs:
1. Set `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`:
   ```env
   NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
   ```
2. Log in with that email
3. Click "Login Logs" in navigation
4. View all login attempts, successes, and failures

## Cost

- **Resend Free Tier**: 100 emails/day
- **Resend Pro**: $20/month for 50,000 emails
- Perfect for starting out!

---

**Need help?** Check Resend docs: https://resend.com/docs

