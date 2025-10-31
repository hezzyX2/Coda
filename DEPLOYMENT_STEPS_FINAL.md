# 🚀 Final Deployment Steps - Let's Go Live!

## ✅ Step 1: Test Locally (2 minutes)

Make sure everything works before deploying:

```bash
npm run dev
```

1. **Visit:** `http://localhost:3000`
2. **Sign up** for an account
3. **Go to Premium page** → Click "Upgrade Now"
4. **Should redirect to Stripe Checkout** ✅

**Test with fake card:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/34` (any future date)
- CVC: `123` (any 3 digits)
- ZIP: `12345` (any 5 digits)

**If it works:** You'll see Stripe's payment page! ✅

---

## 🌐 Step 2: Deploy to Vercel (5 minutes)

### A. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"** (easiest way)
4. Authorize Vercel to access your GitHub

### B. Import Your Repository

1. In Vercel dashboard, click **"Add New Project"**
2. Find and select your **`Coda`** repository
3. Click **"Import"**

### C. Configure Project

Vercel will auto-detect it's Next.js - **DON'T change settings yet!**

Just click **"Deploy"** and wait 2-3 minutes.

### D. Get Your URL

After deployment completes, you'll see:
```
✅ Your project is ready!
https://your-project-name.vercel.app
```

**Copy this URL** - this is your live website! 🎉

---

## 🔐 Step 3: Add Environment Variables to Vercel (3 minutes)

1. In your Vercel project, go to **Settings** → **Environment Variables**

2. Add each variable one by one (click "Add" after each):

```
OPENAI_API_KEY
Value: sk-your-openai-key-here
(You already have this in .env.local)
```

```
STRIPE_SECRET_KEY
Value: sk_test_your_stripe_key_here
(Copy from your .env.local)
```

```
NEXT_PUBLIC_SITE_URL
Value: https://your-project-name.vercel.app
(Use the URL Vercel gave you)
```

```
NEXT_PUBLIC_ADMIN_EMAIL
Value: your-email@example.com
(Your email for admin dashboard access)
```

3. **After adding all variables:**
   - Go to **Deployments** tab
   - Click the **three dots** (`...`) on latest deployment
   - Click **"Redeploy"**
   - Wait for it to finish

---

## 🔗 Step 4: Set Up Stripe Webhook (3 minutes)

### A. Create Webhook Endpoint in Stripe

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://your-project-name.vercel.app/api/stripe/webhook`
   - Replace `your-project-name` with your actual Vercel project name
4. **Description:** "Coda Premium Subscriptions"

### B. Select Events

Click **"Select events"** and check these:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

Then click **"Add events"**

### C. Create Endpoint

Click **"Add endpoint"** at the bottom

### D. Get Webhook Secret

1. After creating, click on your webhook endpoint
2. Find **"Signing secret"** section
3. Click **"Reveal"** or **"Click to reveal"**
4. **Copy the secret** (starts with `whsec_`)

### E. Add to Vercel

1. Back in Vercel → **Settings** → **Environment Variables**
2. Add:
   ```
   STRIPE_WEBHOOK_SECRET
   Value: whsec_your_webhook_secret_here
   ```
3. **Save**
4. **Redeploy** your app (Deployments → ... → Redeploy)

---

## ✅ Step 5: Test Your Live Site (2 minutes)

1. **Visit your live URL:** `https://your-project-name.vercel.app`

2. **Test the full flow:**
   - Sign up for an account
   - Create a task
   - Write a journal entry
   - Go to Premium page
   - Click "Upgrade Now"
   - Should redirect to Stripe Checkout ✅

3. **Test payment:**
   - Use test card: `4242 4242 4242 4242`
   - Complete payment
   - Should redirect back to your app
   - User should get Premium access ✅

4. **Verify in Stripe:**
   - Go to [dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
   - Should see your test payment ✅
   - Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - Click on your endpoint → **"Recent events"**
   - Should see `checkout.session.completed` event ✅

---

## 🎉 Step 6: You're Live!

Your app is now:
- ✅ **Live on the internet**
- ✅ **Accepting payments**
- ✅ **Processing subscriptions**
- ✅ **Fully functional**

**Share your URL:** `https://your-project-name.vercel.app`

---

## 📊 Step 7: Access Admin Dashboard

1. Make sure `NEXT_PUBLIC_ADMIN_EMAIL` is set to your email
2. Log in with that email
3. Visit: `https://your-project-name.vercel.app/admin`
4. View your app statistics and revenue!

---

## 🔄 Step 8: Going Live with Real Payments

When ready for real money:

1. **Switch to Live Mode** in Stripe Dashboard (toggle top right)
2. **Get Live API Keys** from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
3. **Update Vercel environment variables:**
   - Replace `STRIPE_SECRET_KEY` with live key (`sk_live_...`)
4. **Create Live Webhook** (same steps, but in Live mode)
5. **Update `STRIPE_WEBHOOK_SECRET`** with live webhook secret
6. **Redeploy**
7. **Test with real card** (small amount first!)

---

## ✅ Final Checklist

- [ ] Tested payment locally ✅
- [ ] Deployed to Vercel ✅
- [ ] Added all environment variables ✅
- [ ] Redeployed after adding variables ✅
- [ ] Created Stripe webhook endpoint ✅
- [ ] Added webhook secret to Vercel ✅
- [ ] Tested payment on live site ✅
- [ ] Verified webhook events in Stripe ✅
- [ ] Admin dashboard accessible ✅
- [ ] Everything working! 🎉

---

## 🆘 Troubleshooting

**Payment redirect not working?**
- Check `STRIPE_SECRET_KEY` is correct in Vercel
- Make sure you redeployed after adding variables
- Check browser console for errors

**Webhook not receiving events?**
- Verify webhook URL is correct (matches your Vercel URL)
- Check webhook secret matches in Vercel
- Make sure events are selected in Stripe
- Check Stripe Dashboard → Webhooks → Recent events

**User not getting Premium after payment?**
- Check webhook fired (Stripe Dashboard)
- Verify webhook secret is correct
- Check Vercel function logs

---

**You're almost there! Follow these steps and your app will be live! 🚀**

