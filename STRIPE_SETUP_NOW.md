# 🚀 Stripe Setup - Let's Do This!

## ✅ You Have Your Stripe Key - Let's Configure It

### Step 1: Add Stripe Keys to Local Development

**For testing locally:**

1. Open or create `.env.local` in your project root
2. Add your Stripe keys:

```bash
# Your Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Your OpenAI Key (if you have it)
OPENAI_API_KEY=sk-your-openai-key

# For local testing
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Your admin email (optional)
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

**Important:** 
- Replace `sk_test_your_key_here` with your actual **Secret key** from Stripe
- Replace `pk_test_your_key_here` with your actual **Publishable key** from Stripe
- These are your **TEST** keys (start with `sk_test_` and `pk_test_`)

### Step 2: Test Payment Flow Locally

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the payment:**
   - Go to `http://localhost:3000`
   - Sign up for an account
   - Go to Premium page
   - Click "Upgrade Now"
   - Use test card: `4242 4242 4242 4242`
   - Use any future expiry (e.g., 12/34)
   - Use any 3-digit CVC (e.g., 123)
   - Complete payment

3. **Verify it works:**
   - Check Stripe Dashboard → Payments (should see test payment)
   - Check your app (user should get Premium access)

### Step 3: Set Up Webhook (For Production)

**Option A: Local Testing with Stripe CLI**

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook secret** (starts with `whsec_`)

5. **Add to `.env.local`:**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

**Option B: Production Webhook (After Deployment)**

1. Deploy to Vercel first (get your URL)
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events (see Step 4 below)
5. Copy webhook secret
6. Add to Vercel environment variables

### Step 4: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub
   - Import your `Coda` repository

2. **Add Environment Variables in Vercel:**
   - Settings → Environment Variables
   - Add each one:
   
   ```
   OPENAI_API_KEY=sk-your-openai-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret (after webhook setup)
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app (auto-filled)
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your URL: `https://your-app.vercel.app`

### Step 5: Set Up Production Webhook

1. **Go to Stripe Dashboard:**
   - [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

2. **Click "Add endpoint"**

3. **Enter URL:**
   ```
   https://your-app.vercel.app/api/stripe/webhook
   ```
   (Replace with your actual Vercel URL)

4. **Select events to listen for:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. **Click "Add events" then "Add endpoint"**

6. **Copy the webhook secret:**
   - Click on your endpoint
   - Find "Signing secret"
   - Click "Reveal"
   - Copy it (starts with `whsec_`)

7. **Add to Vercel:**
   - Vercel → Your Project → Settings → Environment Variables
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_your_secret`
   - **Redeploy** your app

### Step 6: Test Production Payment

1. Visit your live URL
2. Sign up for account
3. Go to Premium page
4. Click "Upgrade Now"
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. Verify:
   - Payment appears in Stripe Dashboard
   - Webhook fires (check Stripe Dashboard → Webhooks → Recent events)
   - User gets Premium access

---

## 🎯 Quick Checklist

- [ ] Stripe keys added to `.env.local` (for local testing)
- [ ] Tested payment locally
- [ ] Deployed to Vercel
- [ ] Stripe keys added to Vercel environment variables
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to Vercel
- [ ] Redeployed Vercel app
- [ ] Tested payment on live site
- [ ] Verified webhook events in Stripe Dashboard

---

## 🆘 Troubleshooting

**Payment not working?**
- Check Stripe keys are correct (no extra spaces)
- Verify you're using TEST keys (start with `sk_test_`)
- Check browser console for errors
- Verify webhook secret matches

**Webhook not receiving events?**
- Check webhook URL is correct
- Verify webhook secret in Vercel env vars
- Check Stripe Dashboard → Webhooks → Recent events
- Make sure you redeployed after adding webhook secret

**User not getting Premium after payment?**
- Check Stripe Dashboard → Webhooks → Recent events
- Verify webhook fired successfully
- Check Vercel function logs for errors

---

## 🎉 Next Steps

Once everything works:
1. Switch to **LIVE mode** in Stripe
2. Get **LIVE keys** (start with `sk_live_`)
3. Update Vercel environment variables
4. Create **live webhook**
5. Test with real card (small amount first!)

---

**Let's get your app live! 🚀**

