# ⚡ Quick Stripe Setup - 5 Minutes

## What You Need:
- ✅ Stripe Secret Key (you have it!)
- ✅ Stripe Publishable Key (get from Stripe Dashboard)

## Step 1: Add Keys to `.env.local` (2 min)

Create or edit `.env.local` in your project root:

```bash
STRIPE_SECRET_KEY=sk_test_paste_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_paste_your_publishable_key_here
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find keys:**
- Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
- Copy **Secret key** → Replace `sk_test_paste_your_secret_key_here`
- Copy **Publishable key** → Replace `pk_test_paste_your_publishable_key_here`

## Step 2: Test Locally (2 min)

```bash
npm run dev
```

1. Visit `http://localhost:3000`
2. Sign up → Go to Premium
3. Use test card: `4242 4242 4242 4242`
4. Complete payment

## Step 3: Deploy to Vercel (1 min)

1. [vercel.com](https://vercel.com) → Import GitHub repo
2. Add environment variables (same as `.env.local`)
3. Deploy

## Step 4: Set Up Webhook (2 min)

1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: checkout.session.completed, customer.subscription.*, invoice.*
4. Copy webhook secret → Add to Vercel env vars
5. Redeploy

**Done! Your app accepts payments! 💰**

See `STRIPE_SETUP_NOW.md` for detailed instructions.

