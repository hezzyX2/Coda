# 🔑 Where to Find Your Stripe Keys

## Step-by-Step Guide to Get Your Stripe API Keys

### Step 1: Sign Up / Log In to Stripe
1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up" or "Log in"
3. Complete account setup if needed

### Step 2: Go to API Keys Page
1. Once logged in, you'll see the **Dashboard**
2. In the left sidebar, click **"Developers"**
3. Then click **"API keys"**

**Direct Link:** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

### Step 3: Get Your Keys

You'll see two sections:

#### 📌 **Test Mode** (For Testing)
- **Publishable key** - Starts with `pk_test_...`
  - Click "Reveal test key" if hidden
  - Copy this key
  
- **Secret key** - Starts with `sk_test_...`
  - ⚠️ **IMPORTANT:** Click "Reveal test key" to see it
  - This is what you need for `STRIPE_SECRET_KEY`
  - **Keep this secret!** Never share it publicly

#### 🚀 **Live Mode** (For Real Payments)
- Only visible after you activate your account
- Starts with `pk_live_...` and `sk_live_...`
- Use these for production after testing

---

## 📋 What Keys Do You Need?

For your app, you need these **3 keys**:

### 1. **STRIPE_SECRET_KEY** (Required)
- **Location:** Developers → API keys → Secret key
- **Test:** `sk_test_51...`
- **Live:** `sk_live_51...` (after going live)
- **Where to add:** Vercel Environment Variables

### 2. **STRIPE_WEBHOOK_SECRET** (Required)
- **Location:** Developers → Webhooks → Your endpoint → Signing secret
- **Starts with:** `whsec_...`
- **How to get:**
  1. Go to Developers → Webhooks
  2. Create endpoint (see webhook setup guide)
  3. Click on your endpoint
  4. Click "Reveal" on "Signing secret"
  5. Copy the secret
- **Where to add:** Vercel Environment Variables

### 3. **STRIPE_PUBLISHABLE_KEY** (Optional - for future features)
- **Location:** Developers → API keys → Publishable key
- **Starts with:** `pk_test_...` or `pk_live_...`
- Not needed for current setup, but good to have

---

## 🔐 How to Copy Your Keys Safely

1. **Click "Reveal"** button next to the key
2. **Click the copy icon** (or select and Cmd/Ctrl+C)
3. **Paste directly into Vercel** (don't save in notes/files)
4. **Never commit to GitHub** - keys are in `.env.local` which is ignored

---

## ⚠️ Security Tips

- ✅ **Never share** your secret keys publicly
- ✅ **Use test keys** first to make sure everything works
- ✅ **Switch to live keys** only when ready for real payments
- ✅ **Keep keys in environment variables** (Vercel), not in code
- ✅ If a key is exposed, **regenerate it immediately** in Stripe Dashboard

---

## 📍 Quick Navigation in Stripe Dashboard

```
Stripe Dashboard
├── Developers
│   ├── API keys          ← Secret & Publishable keys
│   ├── Webhooks          ← Webhook secret
│   └── Logs              ← View API requests
├── Payments              ← See all payments
├── Customers             ← View customers
└── Subscriptions         ← Manage subscriptions
```

---

## 🎯 For Your App Setup

**Add these to Vercel Environment Variables:**

```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Test it with card:** `4242 4242 4242 4242`

---

**Need help?** Check `STRIPE_SETUP.md` for complete setup guide.

