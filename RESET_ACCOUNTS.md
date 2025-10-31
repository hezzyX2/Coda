# 🔄 Reset Accounts - Quick Fix

## 🎯 Quick Solution: Clear and Recreate

If you're still having login issues, here's how to reset everything:

### Option 1: Clear All Data (Start Fresh)

1. **Visit your site:** [https://coda-tg2u.vercel.app](https://coda-tg2u.vercel.app)

2. **Open browser console:**
   - **Chrome/Edge:** Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - **Firefox:** Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)
   - **Safari:** Press `Cmd+Option+C`

3. **Go to Console tab**

4. **Run this command:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

5. **All accounts and data will be cleared**

6. **Sign up again** with fresh accounts

### Option 2: Clear Just Login Attempts (If Locked Out)

If you're locked out due to too many failed attempts:

1. **Open browser console** (same as above)
2. **Run:**
   ```javascript
   localStorage.removeItem('coda.login_attempts');
   ```
3. **Try logging in again**

---

## ✅ What I Fixed

The code now automatically:
- ✅ Detects old plain text passwords
- ✅ Migrates them to secure hashes on login
- ✅ Works with both old and new accounts
- ✅ Maintains security

---

## 🔐 Try Logging In Now

1. **Go to:** [https://coda-tg2u.vercel.app/login](https://coda-tg2u.vercel.app/login)
2. **Enter your email and password**
3. **It should work now!**

---

## 📝 For New Accounts

When creating new accounts, passwords must have:
- At least 8 characters
- 1 uppercase letter
- 1 lowercase letter  
- 1 number
- 1 special character (!@#$%^&*)

---

## 🆘 Still Having Issues?

**If login still doesn't work:**

1. **Clear all data** (Option 1 above)
2. **Sign up with fresh accounts**
3. **Use strong passwords** (meet the requirements above)

---

**The fix is deployed - try logging in now! 🎯**

