# 📦 Where User Login Data is Stored

## Current Storage System

Your Codak app stores all user login credentials and account data in the browser's **localStorage**. Here's exactly where everything is saved:

---

## 🔐 User Accounts Storage

### **All Users List**
**Location:** `localStorage.getItem("codak.users.v1")`

**Contains:**
- Array of all registered users
- Each user object includes:
  - `email` - User's email address
  - `name` - User's full name
  - `createdAt` - Account creation timestamp
  - `isPremium` - Premium subscription status
  - `stripeCustomerId` - Stripe customer ID (if premium)
  - `stripeSubscriptionId` - Stripe subscription ID (if premium)
  - `subscriptionStatus` - Subscription status
  - `subscriptionExpiresAt` - When subscription expires

**Example:**
```json
[
  {
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "isPremium": false
  },
  {
    "email": "sarah@university.edu",
    "name": "Sarah Smith",
    "createdAt": "2024-01-20T14:22:00.000Z",
    "isPremium": true,
    "stripeCustomerId": "cus_xxx",
    "subscriptionStatus": "active"
  }
]
```

---

## 🔑 Password Storage

### **Password Hashes**
**Location:** `localStorage.getItem("codak.password.{email}")`

**How it works:**
- Passwords are **NEVER stored in plain text**
- Passwords are hashed using **SHA-256** before storage
- Each user's password hash is stored separately
- Keys are formatted as: `codak.password.{email}` (email is sanitized)

**Example:**
- User: `john@example.com`
- Storage key: `codak.password.john@example.com`
- Value: `a3f5b8c9d2e1f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1` (64-character hash)

**Security:**
- ✅ Passwords are hashed (SHA-256)
- ✅ Cannot be reversed to original password
- ✅ Stored in both `codak.password.{email}` and `coda.password.{email}` for compatibility

---

## 🎫 Session Storage

### **Current User Session**
**Location:** `localStorage.getItem("codak.auth.v1")`

**Contains:**
- Currently logged-in user object
- Same structure as user in users list
- Cleared on logout

### **Session Token**
**Location:** `localStorage.getItem("codak.session_token")`

**Contains:**
- Secure random token for session validation
- Generated on login
- Cleared on logout

---

## 📊 User-Specific Data Storage

Each user's personal data is stored separately:

### **Tasks**
- Key: `codak.tasks.{userEmail}` (email sanitized)
- Contains: All tasks for that user

### **Journal Entries**
- Key: `codak.journal.{userEmail}`
- Contains: All journal entries for that user

### **Preferences**
- Key: `codak.prefs.{userEmail}`
- Contains: Theme, focus blocks, break duration, etc.

### **Habits**
- Key: `codak.habits.{userEmail}`
- Contains: All habit tracking data

### **Profile**
- Key: `codak.profile.{userEmail}`
- Contains: Bio, school, goals, interests, etc.

---

## ✅ How It Works

### **When User Signs Up:**
1. User enters email, password, name
2. Password is hashed (SHA-256)
3. User object added to `codak.users.v1` array
4. Password hash stored in `codak.password.{email}`
5. User automatically logged in
6. Session created in `codak.auth.v1`

### **When User Logs In:**
1. User enters email and password
2. System finds user in `codak.users.v1`
3. System retrieves password hash from `codak.password.{email}`
4. Input password is hashed and compared
5. If match, session created
6. User's data automatically loads from their storage keys

### **When User Logs Out:**
1. Session cleared (`codak.auth.v1` and `codak.session_token`)
2. User data remains saved (for next login)
3. User redirected to login page

### **When User Returns:**
1. User enters same email/password
2. System finds their account in `codak.users.v1`
3. Password verified against stored hash
4. Session created
5. **All their previous data automatically loads:**
   - ✅ All their tasks
   - ✅ All their journal entries
   - ✅ Their preferences
   - ✅ Their habits
   - ✅ Their profile

---

## 🔍 How to View Stored Data

### **In Browser Console:**

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Click on your domain
5. You'll see all the keys:
   - `codak.users.v1` - All users
   - `codak.password.{email}` - Password hashes
   - `codak.auth.v1` - Current session
   - `codak.tasks.{email}` - User tasks
   - etc.

### **View All Users:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem("codak.users.v1"))
```

### **View Specific User's Password Hash:**
```javascript
// In browser console:
localStorage.getItem("codak.password.john@example.com")
```

---

## ⚠️ Important Notes

### **Browser Storage:**
- Data is stored in browser's localStorage
- Persists across browser sessions
- Cleared if user clears browser data
- **Per-device** - data on one device doesn't sync to another

### **Security:**
- ✅ Passwords are hashed (cannot be reversed)
- ✅ Each user's data is isolated
- ✅ Session tokens for security
- ⚠️ localStorage is client-side only (not encrypted at rest)

### **Limitations:**
- Data is stored locally in browser
- If user clears browser data, accounts are lost
- No cloud sync (would need backend database)
- No password recovery (would need email system)

---

## 🚀 Future Enhancements (Optional)

If you want to improve this system:

1. **Backend Database** - Store users in database (MongoDB, PostgreSQL)
2. **Cloud Sync** - Sync data across devices
3. **Password Recovery** - Email-based password reset
4. **Encryption** - Encrypt sensitive data before storage
5. **Admin Dashboard** - View all users from admin panel

---

## ✅ Current Status

**Your system is working correctly!**

- ✅ All user accounts are stored in `codak.users.v1`
- ✅ All passwords are hashed and stored securely
- ✅ Users can log in with their credentials
- ✅ User data persists across sessions
- ✅ Each user's data is isolated and separate

Users can sign up, log in, and their data will be remembered when they return!

