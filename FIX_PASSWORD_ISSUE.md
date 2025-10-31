# 🔧 Fix Password Login Issues

## 🎯 What I Fixed

If you created accounts before the password hashing update, your passwords might be stored in plain text, which caused login issues. I've added automatic migration that:

1. **Detects old plain text passwords**
2. **Migrates them to hashed passwords automatically**
3. **Lets you log in with your original password**

---

## ✅ Try Logging In Again

1. **Go to your site:** [https://coda-tg2u.vercel.app/login](https://coda-tg2u.vercel.app/login)

2. **Enter your credentials:**
   - Email (the one you used to sign up)
   - Password (your original password)

3. **The system will:**
   - Detect if it's an old plain text password
   - Automatically convert it to a secure hash
   - Log you in successfully

---

## 🔄 If It Still Doesn't Work

### Option 1: Reset Password (Create New Account)

Since passwords are hashed and secure, you can't easily reset them. Instead:

1. **Sign up with a NEW email** (or the same email if you don't mind losing old data)
2. **Create a new account**
3. **Set `NEXT_PUBLIC_ADMIN_EMAIL` to this new email** if you want admin access

### Option 2: Clear All Data and Start Fresh

If you want to completely reset:

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Run this command:**
   ```javascript
   localStorage.clear();
   ```
3. **Refresh the page**
4. **Sign up again** with fresh accounts

---

## 🔐 Password Requirements (For New Accounts)

When creating new accounts, passwords must have:
- ✅ At least 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 number
- ✅ At least 1 special character (!@#$%^&*)

---

## 🆘 Still Having Issues?

**If login still doesn't work:**

1. **Check your email:**
   - Make sure you're using the exact email you signed up with
   - Check for typos

2. **Check your password:**
   - Make sure you're entering it correctly
   - Check if Caps Lock is on
   - Try typing it in a text editor first, then copy/paste

3. **Check rate limiting:**
   - If you tried too many times, wait 15 minutes
   - Or clear rate limit data (see below)

---

## 🔧 Clear Rate Limiting (If Locked Out)

If you're locked out due to too many failed attempts:

1. **Open browser console** (F12)
2. **Run:**
   ```javascript
   localStorage.removeItem('coda.login_attempts');
   ```
3. **Try logging in again**

---

## ✅ Solution Implemented

The code now:
- ✅ Automatically detects old plain text passwords
- ✅ Migrates them to secure hashes on login
- ✅ Works with both old and new accounts
- ✅ Maintains security for all passwords

**Try logging in now - it should work! 🎯**

