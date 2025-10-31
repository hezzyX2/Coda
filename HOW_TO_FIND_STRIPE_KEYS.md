# 🔑 How to Find Your Stripe API Keys

## Step-by-Step Guide

### Step 1: Sign Up / Log In to Stripe

1. Go to [stripe.com](https://stripe.com)
2. Click **"Sign up"** (if new) or **"Sign in"** (if you have account)
3. Complete account setup if needed

### Step 2: Access the API Keys Page

**Direct Link:** [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

Or navigate manually:
1. Once logged in, you'll see the **Dashboard**
2. Look at the **left sidebar**
3. Click **"Developers"** (it's near the bottom, has a code icon `</> `)
4. Then click **"API keys"**

### Step 3: Get Your Keys

You'll see a page with two sections:

#### 📌 **Test Mode Keys** (Start Here!)

**Toggle:** Make sure **"Test mode"** is ON (toggle in top right)

**1. Publishable key**
- Starts with `pk_test_...`
- Usually visible immediately
- **Copy this key**

**2. Secret key**
- Starts with `sk_test_...`
- Usually hidden by default
- Click the **"Reveal test key"** button
- **Copy this key** (this is the one you need most!)

#### 🚀 **Live Mode Keys** (For Later)

- Only visible after you activate your account
- Starts with `pk_live_...` and `sk_live_...`
- Use these after testing is complete

---

## ✅ What You Need Right Now

For local testing and initial setup, you need:

1. **Secret key** - `sk_test_51...` (the long one)
   - This is the most important one!
   - Used in your `.env.local` file
   
2. **Publishable key** - `pk_test_51...` (shorter)
   - Good to have but not required for basic setup
   - Used for client-side Stripe.js (we handle it server-side)

---

## 📋 Quick Checklist

- [ ] Logged into Stripe Dashboard
- [ ] Clicked "Developers" in left sidebar
- [ ] Clicked "API keys"
- [ ] Made sure "Test mode" toggle is ON
- [ ] Found "Secret key" section
- [ ] Clicked "Reveal test key"
- [ ] Copied the secret key (starts with `sk_test_`)
- [ ] Ready to add to `.env.local` file

---

## 🎯 Visual Guide

```
Stripe Dashboard
├── Left Sidebar
│   ├── Payments
│   ├── Customers
│   ├── Products
│   ├── ...
│   └── Developers ⬅️ Click here!
│       └── API keys ⬅️ Then click here!
│
└── API Keys Page
    ├── Test mode toggle (top right) ⬅️ Make sure ON
    ├── Publishable key (pk_test_...)
    └── Secret key (sk_test_...) ⬅️ Click "Reveal" button
```

---

## 🔍 Can't Find It?

### If you don't see "Developers" in sidebar:
1. Make sure you're logged into your Stripe account
2. Complete any account setup steps if prompted
3. Check if you're in the correct dashboard (not a partner dashboard)

### If you see a different interface:
1. Make sure you're at: `dashboard.stripe.com`
2. You might be in a different view - look for "Developers" or "Settings"

### If you only see "Buy Link":
- A "Buy Link" is a payment link (different from API keys)
- You still need API keys to integrate payments into your app
- Follow the steps above to get to the API keys section

---

## 💡 Pro Tips

1. **Always use Test keys first** - Test mode uses fake cards, no real charges
2. **Keep keys secret** - Never share your secret key publicly
3. **Test mode vs Live mode** - Toggle in top right of Dashboard
4. **Keys are different** - Test keys ≠ Live keys

---

## 🚀 Once You Have Your Keys

1. Copy your **Secret key** (`sk_test_...`)
2. Open `.env.local` file
3. Add: `STRIPE_SECRET_KEY=sk_test_your_key_here`
4. Save the file
5. Restart your dev server: `npm run dev`
6. Test the payment flow!

---

## 📞 Need Help?

If you're still having trouble:
1. Make sure you're logged into the correct Stripe account
2. Check if you need to verify your email or complete account setup
3. Try the direct link: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

---

**Once you have your keys, we'll add them to your app! 🎯**

