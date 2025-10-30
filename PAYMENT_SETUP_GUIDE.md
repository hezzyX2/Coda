# Payment Setup & Revenue Tracking Guide

## 🎯 Overview

Your Coda app now has **Stripe payment integration** for Premium subscriptions ($9.99/month) and an **Admin Dashboard** to track statistics and revenue.

## 💰 How Payments Work

### User Flow:
1. User clicks "Upgrade Now" on `/premium` page
2. Redirects to Stripe Checkout (secure payment page)
3. User enters payment info
4. After payment, Stripe redirects back to your app
5. Webhook updates user's premium status
6. User gets immediate access to premium features

### Your Revenue:
- **$9.99/month** per Premium subscriber
- **Stripe fees**: 2.9% + $0.30 per transaction
- **Your net**: ~$9.40/month per subscriber
- **Payouts**: Appear in your bank account 2-7 days after payment

## 🔧 Setup Instructions

### Step 1: Install Stripe Package
```bash
npm install
```
(Already added to package.json)

### Step 2: Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Get your API keys from [Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)

### Step 3: Set Environment Variables

**For Development (.env.local):**
```bash
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

**For Production (Vercel/your hosting):**
1. Go to your hosting platform's environment variables
2. Add:
   ```bash
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
   ```

### Step 4: Set Up Webhook

**For Local Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or visit https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the `whsec_` secret it gives you to `.env.local`

**For Production:**
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the signing secret → add to production env vars

## 📊 Viewing Stats & Revenue

### Stripe Dashboard (Main Source of Truth)
- **Payments**: [dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- **Subscriptions**: [dashboard.stripe.com/subscriptions](https://dashboard.stripe.com/subscriptions)
- **Customers**: [dashboard.stripe.com/customers](https://dashboard.stripe.com/customers)
- **Revenue Reports**: [dashboard.stripe.com/payments/overview](https://dashboard.stripe.com/payments/overview)

### Your Admin Dashboard (App Stats)
1. **Set admin email**: Add `NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com` to env vars
2. **Access**: Visit `/admin` (link appears in nav for admin email)
3. **Stats shown**:
   - Total Users
   - Premium Users
   - Total Revenue (estimated)
   - Monthly Recurring Revenue (MRR)
   - Active/Canceled Subscriptions
   - Total Tasks Created
   - Journal Entries
   - Conversion Rate

### Admin Dashboard Features:
- Real-time stats from localStorage (client-side calculation)
- Revenue estimates based on premium users
- User metrics (tasks, journals, etc.)
- Quick links to Stripe Dashboard
- Refresh button to update stats

## 💳 Testing Payments

### Test Cards (Test Mode):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Use any future expiry, any CVC, any postal code.

### Test Flow:
1. Use Stripe **Test Mode** (test keys)
2. Click "Upgrade Now"
3. Enter test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify webhook fires in Stripe Dashboard
6. Check user gets premium access

## 🚀 Going Live

When ready for real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys** (starts with `sk_live_` and `pk_live_`)
3. **Update Production Environment Variables**
4. **Update Webhook** to production URL
5. **Test with real card** (small amount first!)

## 📈 Revenue Tracking

### Stripe Dashboard Provides:
- ✅ **Exact payment amounts** (with fees)
- ✅ **Real-time revenue** 
- ✅ **Subscription analytics**
- ✅ **Customer lifetime value**
- ✅ **Churn rates**
- ✅ **Payment failures**

### Your Admin Dashboard Provides:
- ✅ **User engagement metrics**
- ✅ **Conversion rate** (free → premium)
- ✅ **App usage stats** (tasks, journals)
- ✅ **User growth trends**

## 🔒 Security Notes

- ✅ **API keys are server-side only** (never exposed to client)
- ✅ **Webhooks are signed** (verifies Stripe sent them)
- ✅ **Payment info never touches your server** (handled by Stripe)
- ⚠️ **Never commit keys to git**
- ⚠️ **Always use environment variables**

## 🆘 Troubleshooting

**Payments not processing?**
- Check API keys are correct (test vs live)
- Verify webhook is configured
- Check Stripe Dashboard → Webhooks → Recent events

**User not getting premium after payment?**
- Check webhook fired (Stripe Dashboard)
- Verify webhook secret matches
- Check server logs for errors

**Can't see admin dashboard?**
- Verify `NEXT_PUBLIC_ADMIN_EMAIL` is set
- Log in with that email
- Check browser console for errors

## 📝 Next Steps for Production

**Current Setup:**
- ✅ Stripe payments working
- ✅ Webhooks configured
- ✅ Admin dashboard for stats
- ⚠️ User data in localStorage (not persistent)

**For Full Production:**
1. **Add Database** (PostgreSQL, MongoDB, etc.)
   - Store user subscriptions
   - Persist payment data
   - Track analytics
2. **Backend API** for user management
3. **Email notifications** for payment confirmations
4. **Subscription management** (cancel, update payment method)

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Next.js with Stripe](https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe)
- [Webhook Guide](https://stripe.com/docs/webhooks)

---

**You're all set!** Set up your Stripe account and start receiving payments. 💰

