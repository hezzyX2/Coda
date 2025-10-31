# 📍 Exact Locations of Stripe Keys

## Direct Links (Click These!)

### 🔗 API Keys Page
**[dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)**

This takes you directly to where your keys are!

---

## Navigation Path

If you need to navigate manually:

```
1. Go to stripe.com
2. Sign in
3. Dashboard (main page)
4. Left Sidebar → "Developers" (bottom of sidebar)
5. Submenu → "API keys"
```

---

## What You'll See

When you reach the API Keys page:

```
┌─────────────────────────────────────────┐
│  Stripe Dashboard              [Test▼] │  ← Toggle (keep ON)
├─────────────────────────────────────────┤
│                                         │
│  Publishable key                       │
│  ┌───────────────────────────────────┐ │
│  │ pk_test_51AbC...                  │ │  ← Copy this (optional)
│  └───────────────────────────────────┘ │
│                                         │
│  Secret key                            │
│  ┌───────────────────────────────────┐ │
│  │ ••••••••••••••••••••••••••••••   │ │
│  └───────────────────────────────────┘ │
│  [Reveal test key] ⬅️ CLICK THIS BUTTON│
│                                         │
│  After clicking, you'll see:           │
│  ┌───────────────────────────────────┐ │
│  │ sk_test_51XyZ...                  │ │  ← Copy THIS!
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 The Key You Need

**Secret key** - `sk_test_...`
- This is what you'll add to `.env.local`
- It's hidden by default (click "Reveal" to see it)
- Starts with `sk_test_` (for test mode)
- About 100+ characters long

---

## ⚠️ Important Notes

1. **Make sure "Test mode" is ON** (toggle in top right)
   - Test mode = safe testing with fake cards
   - Live mode = real payments (use later)

2. **Secret key is sensitive**
   - Don't share it publicly
   - Only add to `.env.local` (which is git-ignored)

3. **Two keys available:**
   - **Publishable key** (`pk_test_...`) - Less sensitive, can be in frontend
   - **Secret key** (`sk_test_...`) - Very sensitive, server-side only ✅

---

## 🔄 If You Don't Have Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up"
3. Enter email and create account
4. Verify email
5. Complete business information
6. Then follow steps above to get keys

---

**Click the link above to get your keys! 🔑**

