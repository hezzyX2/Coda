# 🚀 Quick Deploy Guide (5 Steps)

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/coda-app.git
git push -u origin main
```

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New Project"
3. Import your repository
4. Click "Deploy"
5. **Copy your URL:** `https://your-project.vercel.app`

## Step 3: Add Environment Variables in Vercel
Settings → Environment Variables → Add:
```
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_ADMIN_EMAIL=your@email.com
```
**Click "Redeploy"**

## Step 4: Create Stripe Account
1. [stripe.com](https://stripe.com) → Sign up
2. Use your Vercel URL as business website
3. Get API keys from Dashboard → API keys
4. Add to Vercel:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```
5. **Redeploy**

## Step 5: Set Up Webhook
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-project.vercel.app/api/stripe/webhook`
3. Select events: checkout.session.completed, customer.subscription.*, invoice.*
4. Copy webhook secret
5. Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`
6. **Redeploy**

**Done!** Test with card: `4242 4242 4242 4242`

For detailed steps, see `DEPLOY_STEPS.md`

