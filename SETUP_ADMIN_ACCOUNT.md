# 🔐 Setup Admin Account

## Quick Setup Instructions

Your admin email is configured as: **ryan.policicchio@gmail.com**

### Option 1: Sign Up Normally (Recommended)

1. Go to the signup page: `/signup`
2. Enter:
   - **Email:** `ryan.policicchio@gmail.com`
   - **Password:** `pinEapple14!`
   - **Name:** Your name
3. Click "Sign Up"
4. You'll automatically be logged in with admin access!

### Option 2: Manual Setup (If account already exists)

If you already have an account with that email but different password, you can manually set the password hash:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this code:

```javascript
// Hash the password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Set password hash
hashPassword('pinEapple14!').then(hash => {
  localStorage.setItem('codak.password.ryan.policicchio@gmail.com', hash);
  localStorage.setItem('coda.password.ryan.policicchio@gmail.com', hash);
  console.log('✅ Password hash set!');
  console.log('Hash:', hash);
});
```

4. Then update your user account (if it exists):

```javascript
// Get all users
const users = JSON.parse(localStorage.getItem('codak.users.v1') || '[]');

// Find your user
const userIndex = users.findIndex(u => u.email.toLowerCase() === 'ryan.policicchio@gmail.com');

if (userIndex !== -1) {
  // User exists - update it
  users[userIndex] = {
    ...users[userIndex],
    email: 'ryan.policicchio@gmail.com',
    name: users[userIndex].name || 'Ryan Policicchio'
  };
} else {
  // Create new user
  users.push({
    email: 'ryan.policicchio@gmail.com',
    name: 'Ryan Policicchio',
    createdAt: new Date().toISOString(),
    isPremium: false
  });
}

// Save users
localStorage.setItem('codak.users.v1', JSON.stringify(users));
console.log('✅ User account updated!');
```

5. Log out and log back in with:
   - Email: `ryan.policicchio@gmail.com`
   - Password: `pinEapple14!`

---

## ✅ Verify Admin Access

After logging in, you should see:
- **"Admin"** link in navigation
- **"Users"** link in navigation  
- **"Login Logs"** link in navigation

You can access:
- `/admin` - Admin dashboard
- `/admin/users` - View all users
- `/admin/logins` - View login logs

---

## 🔧 Environment Configuration

The admin email is set in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_EMAIL=ryan.policicchio@gmail.com
```

**Important:** Make sure this file exists and contains your email. The app checks this environment variable to grant admin access.

---

## 🚨 Troubleshooting

### "I don't see Admin links"
- Make sure you're logged in with `ryan.policicchio@gmail.com`
- Check that `.env.local` has `NEXT_PUBLIC_ADMIN_EMAIL=ryan.policicchio@gmail.com`
- Restart your dev server: `npm run dev`

### "Password doesn't work"
- Make sure you're using the exact password: `pinEapple14!`
- Check browser console for any errors
- Try the manual setup option above

### "Account doesn't exist"
- Sign up with the email and password
- Or use the manual setup to create the account

---

## 📝 Notes

- Admin access is granted based on email match (case-insensitive)
- Password is hashed using SHA-256 before storage
- Admin access persists across sessions
- Only the email in `NEXT_PUBLIC_ADMIN_EMAIL` gets admin access

