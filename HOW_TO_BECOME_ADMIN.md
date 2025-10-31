# 👑 How to Sign In as Admin

## 🎯 Step-by-Step Guide

### Step 1: Set Your Admin Email in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Coda** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
NEXT_PUBLIC_ADMIN_EMAIL
Value: your-email@example.com
```

**Important:** Use the **exact email** you'll use to sign up/login!

5. **Redeploy** your app:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **"Redeploy"**
   - Wait for it to finish

### Step 2: Sign Up / Log In with That Email

1. **Visit your live site:** [https://coda-tg2u.vercel.app](https://coda-tg2u.vercel.app)

2. **If you don't have an account yet:**
   - Click "Sign up"
   - Use the **same email** you set in `NEXT_PUBLIC_ADMIN_EMAIL`
   - Create your account

3. **If you already have an account:**
   - Make sure you're logged in with the **same email** you set in `NEXT_PUBLIC_ADMIN_EMAIL`
   - If not, log out and sign up with that email

### Step 3: Access Admin Dashboard

Once logged in with your admin email:

1. **Look at the navigation bar** - you should see an **"Admin"** link
2. **OR visit directly:** [https://coda-tg2u.vercel.app/admin](https://coda-tg2u.vercel.app/admin)

---

## ✅ Quick Checklist

- [ ] Added `NEXT_PUBLIC_ADMIN_EMAIL` to Vercel environment variables
- [ ] Set it to your email address
- [ ] Redeployed the app
- [ ] Signed up/logged in with that email
- [ ] See "Admin" link in navigation
- [ ] Can access `/admin` page

---

## 🔍 How It Works

The app checks if:
1. You're logged in
2. Your email matches `NEXT_PUBLIC_ADMIN_EMAIL`
3. If yes → Shows "Admin" link in navigation

---

## 📍 Admin Dashboard Features

Once you're in as admin, you can:
- ✅ View total users
- ✅ View premium users
- ✅ See revenue statistics
- ✅ View total tasks and journal entries
- ✅ Check conversion rates
- ✅ Access Stripe Dashboard links

---

## 🆘 Troubleshooting

**Don't see "Admin" link?**
1. Make sure `NEXT_PUBLIC_ADMIN_EMAIL` is set in Vercel
2. Make sure you **redeployed** after adding it
3. Make sure you're logged in with the **exact same email**
4. Check email is spelled correctly (case-sensitive)

**Can't access `/admin` page?**
- Make sure you're logged in with admin email
- Clear browser cache and try again
- Make sure environment variable was set correctly

**Email doesn't match?**
- The email must be **exactly** the same
- Check for typos
- Make sure you're using the same email you set in `NEXT_PUBLIC_ADMIN_EMAIL`

---

## 🎯 Direct Link

Once set up, you can always access admin at:

**https://coda-tg2u.vercel.app/admin**

(But you must be logged in with the admin email first!)

---

**Set the environment variable, redeploy, and you're good to go! 👑**

