# 🔗 Stripe Webhook URL - What to Enter

## 📍 The Webhook URL Format

Your Stripe webhook endpoint URL should be:

```
https://YOUR-VERCEL-PROJECT-NAME.vercel.app/api/stripe/webhook
```

## 🎯 Step-by-Step to Find Your URL

### Option 1: If You Haven't Deployed Yet

1. **Deploy to Vercel first** (see deployment steps)
2. After deployment, Vercel will give you a URL like:
   ```
   https://coda-abc123.vercel.app
   ```
3. Your webhook URL will be:
   ```
   https://coda-abc123.vercel.app/api/stripe/webhook
   ```

### Option 2: If You Already Deployed

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Coda** project
3. Look at the top - you'll see your domain:
   ```
   https://your-project-name.vercel.app
   ```
4. Your webhook URL is:
   ```
   https://your-project-name.vercel.app/api/stripe/webhook
   ```

---

## 📝 Exact Steps in Stripe

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. In the **"Endpoint URL"** field, paste:
   ```
   https://your-project-name.vercel.app/api/stripe/webhook
   ```
   ⚠️ **Replace `your-project-name` with your actual Vercel project name!**

4. **Description:** `Coda Premium Subscriptions`

5. Click **"Select events"** and check:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

6. Click **"Add events"** then **"Add endpoint"**

---

## ✅ Example URLs

**If your Vercel project is named `coda-app`:**
```
https://coda-app.vercel.app/api/stripe/webhook
```

**If your Vercel project is named `coda-student-organizer`:**
```
https://coda-student-organizer.vercel.app/api/stripe/webhook
```

**If Vercel auto-named it `coda-xyz123`:**
```
https://coda-xyz123.vercel.app/api/stripe/webhook
```

---

## 🔍 How to Find Your Exact URL

### After Deploying to Vercel:

1. **Vercel Dashboard** → Your Project
2. Look for **"Domains"** section
3. You'll see: `your-project.vercel.app`
4. Your webhook URL = `https://your-project.vercel.app/api/stripe/webhook`

---

## ⚠️ Important Notes

1. **Must include `/api/stripe/webhook`** at the end
2. **Must use `https://`** (not http)
3. **Must match your actual Vercel domain**
4. **Test mode vs Live mode:**
   - If testing: Use your Vercel URL
   - If live: Use your live domain (if you have custom domain)

---

## 🧪 For Local Testing (Optional)

If you want to test webhooks locally first:

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Run:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. **This gives you a webhook secret** for local testing
4. **But for production, use your Vercel URL!**

---

## 🎯 Quick Answer

**The webhook URL format is:**

```
https://YOUR-VERCEL-APP-NAME.vercel.app/api/stripe/webhook
```

**To find YOUR exact URL:**
1. Deploy to Vercel (or check if already deployed)
2. Look at your Vercel project's domain
3. Add `/api/stripe/webhook` to the end

---

## 📞 If You Need Help

**Can't find your Vercel URL?**
- Check your Vercel dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Look at your project → It shows the domain at the top

**Not sure if it's correct?**
- The URL should look like: `https://something.vercel.app/api/stripe/webhook`
- After setting it up, test a payment and check Stripe → Webhooks → Recent events

---

**Once you have your Vercel URL, add `/api/stripe/webhook` to the end and that's your webhook URL! 🎯**

