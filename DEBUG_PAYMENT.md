# 🔍 Debug Payment Issues

## 🎯 Quick Diagnosis Steps

### Step 1: Check Browser Console

1. Visit: [https://coda-tg2u.vercel.app/premium](https://coda-tg2u.vercel.app/premium)
2. Open browser console (F12 or Cmd+Option+I)
3. Go to **Network** tab
4. Click "Upgrade Now"
5. Look for `/api/stripe/checkout` request
6. Click on it → Check **Response** tab
7. See what error message it shows

### Step 2: Check Vercel Function Logs

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Coda** project
3. Go to **Logs** tab
4. Try payment again
5. Look for errors in the logs (especially `/api/stripe/checkout`)

### Step 3: Verify Environment Variables in Vercel

1. Vercel → Your Project → **Settings** → **Environment Variables**
2. Make sure you see:
   - ✅ `STRIPE_SECRET_KEY` = `sk_live_...` (or `sk_test_...`)
   - ✅ `NEXT_PUBLIC_SITE_URL` = `https://coda-tg2u.vercel.app`

3. **Check the value:**
   - No extra spaces
   - Key starts with `sk_live_` or `sk_test_`
   - Copy it and paste into a text editor to verify

### Step 4: Test the Stripe Key

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Verify your key is still valid
4. Make sure you're using the right mode (Test vs Live)

---

## 🔧 Common Issues & Fixes

### Issue 1: "Stripe not configured"

**Cause:** `STRIPE_SECRET_KEY` not in Vercel or invalid

**Fix:**
1. Add `STRIPE_SECRET_KEY` to Vercel environment variables
2. **Redeploy** after adding
3. Make sure no spaces in the key

### Issue 2: Stripe Key Invalid/Expired

**Cause:** Key was revoked or incorrect

**Fix:**
1. Go to Stripe Dashboard → API keys
2. Get fresh key
3. Update in Vercel
4. Redeploy

### Issue 3: Environment Variable Not Loading

**Cause:** Need to redeploy after adding variable

**Fix:**
1. Vercel → Deployments → ... → Redeploy
2. Wait for deployment
3. Clear browser cache
4. Try again

### Issue 4: URL Format Issues

**Cause:** `NEXT_PUBLIC_SITE_URL` format incorrect

**Fix:**
- Should be: `https://coda-tg2u.vercel.app`
- NOT: `coda-tg2u.vercel.app` (missing https)
- Update in Vercel and redeploy

---

## 🧪 Test Payment Flow Step-by-Step

1. **Check you're logged in:**
   - Visit [https://coda-tg2u.vercel.app](https://coda-tg2u.vercel.app)
   - Make sure you see navigation with your name

2. **Go to Premium page:**
   - Click "Upgrade" in nav or visit `/premium`
   - See pricing cards

3. **Click "Upgrade Now":**
   - Button should say "Processing..." briefly
   - Should redirect to Stripe Checkout
   - If error appears, check browser console

4. **In Browser Console (F12):**
   - Look at Network tab
   - Find `checkout` request
   - Check Response for error details

---

## 📋 What to Check

### In Vercel:
- [ ] `STRIPE_SECRET_KEY` is set
- [ ] `NEXT_PUBLIC_SITE_URL` is set correctly
- [ ] Environment is set to "All" (Production, Preview, Development)
- [ ] App was **redeployed** after adding variables

### In Stripe Dashboard:
- [ ] Key is still active (not revoked)
- [ ] Using correct mode (Test vs Live)
- [ ] Key matches what's in Vercel

### In Browser:
- [ ] No console errors
- [ ] Network request to `/api/stripe/checkout` exists
- [ ] Response shows error message

---

## 🆘 Share These Details for Help

If still not working, share:
1. **Browser console error** (Network tab → checkout request → Response)
2. **Vercel logs** (Logs tab → errors around checkout)
3. **Error message** you see on screen
4. **Stripe Dashboard** → Any errors shown?

---

**Let's get your payments working! 🔧**

