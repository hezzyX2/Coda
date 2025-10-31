# ✅ Add Your Stripe Keys - Step by Step

## 📝 Quick Instructions

You have your Stripe key - now let's add it to your app!

### Option 1: Edit `.env.local` File Manually (Recommended)

1. **Open `.env.local` in your code editor**
   - It's in the root folder: `/Users/ryanpolicicchio/Coda Website V1/.env.local`

2. **Add these lines** (replace with YOUR actual keys):

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE

# Optional: For local webhook testing
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Site URL (for local testing)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin email (optional)
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

3. **Replace the placeholders:**
   - `sk_test_YOUR_ACTUAL_SECRET_KEY_HERE` → Your actual Stripe secret key
   - `pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE` → Your Stripe publishable key
   - Remove the `#` comments when you add real values

### Option 2: Use Terminal

```bash
cd "/Users/ryanpolicicchio/Coda Website V1"

# Add your Stripe secret key (replace with actual key)
echo "STRIPE_SECRET_KEY=sk_test_your_actual_key" >> .env.local

# Add your Stripe publishable key (replace with actual key)
echo "STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key" >> .env.local

# Add site URL
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> .env.local
```

---

## 🔑 Where to Find Your Stripe Keys

1. Go to: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Find:
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"
   - **Publishable key** (starts with `pk_test_`) - Already visible

---

## ✅ After Adding Keys

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test it:**
   - Visit `http://localhost:3000`
   - Sign up for an account
   - Go to Premium page
   - Click "Upgrade Now"
   - Should redirect to Stripe Checkout!

3. **Test payment with card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits

---

## 🚀 Next: Deploy to Vercel

Once local testing works:

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Add environment variables:**
   - `OPENAI_API_KEY` (you have this)
   - `STRIPE_SECRET_KEY` (your Stripe key)
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL - auto-filled)
4. **Deploy!**

---

## 📋 Checklist

- [ ] Opened `.env.local` file
- [ ] Added `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Added `STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested payment locally ✅
- [ ] Ready to deploy to Vercel

---

**Once you've added your keys, let me know and we'll test it! 🎯**

