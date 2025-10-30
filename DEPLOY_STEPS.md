# Step-by-Step Deployment Guide

## 🎯 Goal: Deploy App → Get Public URL → Setup Stripe

**Order:** GitHub → Deploy → Stripe Setup

---

## Step 1: Set Up GitHub (Source Control)

### 1.1 Create GitHub Account (if needed)
- Go to [github.com](https://github.com) and sign up

### 1.2 Create New Repository
1. Click "+" in top right → "New repository"
2. Name: `coda-app` (or any name)
3. Description: "AI-powered student organizer"
4. Set to **Private** (recommended) or Public
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click "Create repository"

### 1.3 Push Your Code to GitHub

Open terminal in your project folder and run:

```bash
# Make sure you're in the project directory
cd "/Users/ryanpolicicchio/Coda Website V1"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Coda app ready for deployment"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/coda-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll be asked for GitHub username and password. Use a **Personal Access Token** instead of password:
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate new token (classic) with `repo` permission
- Use that as password

---

## Step 2: Deploy to Vercel (Get Public URL)

### 2.1 Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. **Choose "Continue with GitHub"** (easiest way)
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Repository
1. In Vercel dashboard, click "Add New Project"
2. Import your `coda-app` repository from GitHub
3. Vercel will auto-detect it's a Next.js app
4. Click "Deploy" (don't change settings yet)

### 2.3 First Deployment
- Wait 2-3 minutes for build to complete
- You'll get a URL like: `https://coda-app-xyz.vercel.app`
- **This is your public URL!** 🎉

### 2.4 Add Environment Variables
1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these (you'll get Stripe keys in next step):

```
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

**Don't add Stripe keys yet** - we'll do that after Stripe setup.

4. Click "Redeploy" after adding variables

---

## Step 3: Set Up Stripe Account

### 3.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" / "Sign up"
3. Complete business information:
   - Business name
   - Business type
   - Country
   - **Business website URL:** Use your Vercel URL: `https://your-project.vercel.app`
   - Business description: "AI-powered student productivity app"

### 3.2 Get Your API Keys
1. Go to [Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)
2. You'll see **Test mode** keys (use these first for testing)
3. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

### 3.3 Add Stripe Keys to Vercel
1. Back in Vercel, go to **Settings** → **Environment Variables**
2. Add:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```
3. Click "Save"
4. **Redeploy** your app (Deployments → ... → Redeploy)

---

## Step 4: Set Up Stripe Webhook (Critical!)

### 4.1 Add Webhook Endpoint
1. In Stripe Dashboard, go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://your-project-name.vercel.app/api/stripe/webhook`
   - Replace `your-project-name` with your actual Vercel project name
4. **Description:** "Coda Premium Subscriptions"

### 4.2 Select Events to Listen For
Click "Select events" and check:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

Click "Add events"

### 4.3 Get Webhook Secret
1. After creating endpoint, click on it
2. Find **"Signing secret"** section
3. Click **"Reveal"** or **"Click to reveal"**
4. Copy the secret (starts with `whsec_`)

### 4.4 Add Webhook Secret to Vercel
1. Back in Vercel → **Environment Variables**
2. Add:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```
3. Click "Save"
4. **Redeploy** again

---

## Step 5: Test Everything

### 5.1 Test Your App
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Sign up for an account
3. Go to Premium page
4. Click "Upgrade Now"

### 5.2 Test Payment (Test Mode)
1. You'll be redirected to Stripe Checkout
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date (e.g., 12/34)
4. Any 3-digit CVC (e.g., 123)
5. Any postal code
6. Complete payment

### 5.3 Verify Webhook Works
1. Go to Stripe Dashboard → **Webhooks**
2. Click on your webhook endpoint
3. Check **"Recent events"** - you should see `checkout.session.completed`

### 5.4 Verify User Gets Premium
1. After test payment, check your app
2. User should now have Premium access
3. Chat and Journal AI should be unlocked

---

## Step 6: Go Live (Real Payments)

### 6.1 Switch Stripe to Live Mode
1. In Stripe Dashboard, toggle **"Test mode"** OFF (top right)
2. Get **Live API keys** (starts with `sk_live_` and `pk_live_`)

### 6.2 Update Production Webhook
1. Create a **new webhook endpoint** for live mode
2. Use same URL: `https://your-project.vercel.app/api/stripe/webhook`
3. Select same events
4. Copy the **live webhook secret** (different from test)

### 6.3 Update Vercel Environment Variables
1. Update to live keys:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret_here
   ```
2. **Redeploy**

### 6.4 Test with Real Card
- Use your real card with a small amount first
- Verify payment appears in Stripe Dashboard
- Check funds appear in your Stripe account

---

## ✅ Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel account created and linked to GitHub
- [ ] App deployed to Vercel (got public URL)
- [ ] Environment variables added to Vercel (OpenAI, admin email)
- [ ] Stripe account created with business URL
- [ ] Stripe test API keys added to Vercel
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to Vercel
- [ ] Test payment completed successfully
- [ ] Webhook events firing in Stripe Dashboard
- [ ] User getting premium access after payment
- [ ] Switched to Stripe Live mode
- [ ] Live keys added to Vercel
- [ ] Production webhook configured
- [ ] Tested with real payment

---

## 🆘 Common Issues

**"Build failed" in Vercel?**
- Check environment variables are set
- Check Node.js version (should be 18+)
- Look at build logs in Vercel

**"Stripe not configured" error?**
- Verify `STRIPE_SECRET_KEY` is in Vercel environment variables
- Make sure you **redeployed** after adding variables

**Webhook not receiving events?**
- Verify webhook URL is correct (matches your Vercel URL)
- Check webhook secret is correct
- Make sure events are selected in Stripe Dashboard
- Look at webhook logs in Stripe Dashboard

**User not getting premium?**
- Check webhook fired in Stripe Dashboard
- Verify webhook secret matches
- Check Vercel function logs

---

## 📊 After Deployment

**View Your App Stats:**
1. Set `NEXT_PUBLIC_ADMIN_EMAIL` to your email
2. Log in with that email
3. Visit `/admin` page

**View Payments:**
- Stripe Dashboard → Payments
- Stripe Dashboard → Subscriptions

**Custom Domain (Optional):**
1. In Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

---

**You're all set!** Your app is live and ready to accept payments. 💰

