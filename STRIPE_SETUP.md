# Stripe Payment Setup Guide

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete business verification

## Step 2: Get Your API Keys

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`) - Keep this secret!
4. Test keys vs Live keys:
   - **Test mode**: Use test cards, no real charges
   - **Live mode**: Real payments

## Step 3: Set Environment Variables

Add to your `.env.local` (development) and production environment:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Webhook Secret (get from Step 4)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**For Production:**
- Use **Live keys** (start with `sk_live_` and `pk_live_`)
- Set these in your hosting platform's environment variables

## Step 4: Set Up Webhook

Webhooks notify your app when payment events happen.

### Local Development (using Stripe CLI):

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe  # macOS
   # or visit https://stripe.com/docs/stripe-cli
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   
   This gives you a webhook secret (starts with `whsec_`)

### Production:

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 5: Test Payments

### Test Card Numbers (Test Mode):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, any postal code.

### Testing Flow:

1. Click "Upgrade Now" on Premium page
2. Use test card: `4242 4242 4242 4242`
3. Complete checkout
4. Check webhook events in Stripe Dashboard
5. Verify user gets premium access

## Step 6: View Payments & Revenue

### Stripe Dashboard:

- **Payments**: [dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- **Subscriptions**: [dashboard.stripe.com/subscriptions](https://dashboard.stripe.com/subscriptions)
- **Customers**: [dashboard.stripe.com/customers](https://dashboard.stripe.com/customers)
- **Revenue**: [dashboard.stripe.com/payments/overview](https://dashboard.stripe.com/payments/overview)

### Your Admin Dashboard:

- Visit `/admin` to see app statistics
- Requires admin email (set `NEXT_PUBLIC_ADMIN_EMAIL`)

## Step 7: Go Live

When ready for real payments:

1. Switch to **Live mode** in Stripe Dashboard
2. Get **Live API keys**
3. Update environment variables with live keys
4. Update webhook endpoint to production URL
5. Test with real card (small amount first!)

## Pricing

- **Transaction fee**: 2.9% + $0.30 per transaction (US)
- **No monthly fee** for Standard account
- **Payout**: Funds appear in your bank account 2-7 days after payment

## Important Security Notes

⚠️ **Never commit API keys to git**
⚠️ **Always use environment variables**
⚠️ **Use webhook signatures to verify requests**
⚠️ **Keep secret keys secret**

## Troubleshooting

**Payments not working?**
- Check API keys are correct
- Verify webhook is configured
- Check webhook events in Stripe Dashboard
- Verify webhook secret matches

**Webhook not receiving events?**
- Check endpoint URL is correct
- Verify webhook secret in env vars
- Check Stripe Dashboard → Webhooks → Recent events

**User not getting premium after payment?**
- Check webhook is firing (Stripe Dashboard)
- Verify webhook handler updates user status
- Check browser console for errors

For more help: [Stripe Documentation](https://stripe.com/docs)

