# 🔍 Login Flow - Where Credentials Are Checked

## 📍 Exact Storage Locations

When a user tries to log in, the program checks credentials in these specific locations:

---

## 🔐 Step-by-Step Login Process

### **Step 1: User Enters Credentials**
- User goes to `/login` page
- Enters email and password
- Clicks "Sign In"

### **Step 2: Login Function Called**
**Location:** `lib/auth.ts` → `login()` function

```typescript
export async function login(email: string, password: string)
```

### **Step 3: Check if User Exists**

**Code Location:** `lib/auth.ts` lines 77-84

**What it checks:**
```typescript
const users = getAllUsers();
const user = users.find(u => u.email.toLowerCase() === sanitizedEmail);
```

**Storage Location:**
- **Primary:** `localStorage.getItem("codak.users.v1")`
- **Fallback:** `localStorage.getItem("coda.users.v1")` (legacy)

**What it's looking for:**
- An array of user objects
- Each user has: `{ email, name, createdAt, isPremium, ... }`
- Searches for a user with matching email (case-insensitive)

**If user NOT found:**
- Returns error: `"Invalid email or password"`
- Login fails ❌

---

### **Step 4: Check Password Hash**

**Code Location:** `lib/auth.ts` lines 86-126

**What it checks:**
```typescript
const passwordKey = `codak.password.${sanitizedEmail}`;
const legacyPasswordKey = `coda.password.${sanitizedEmail}`;

let storedPasswordHash = localStorage.getItem(passwordKey) || 
                         localStorage.getItem(legacyPasswordKey);
```

**Storage Locations (checked in order):**
1. **Primary:** `localStorage.getItem("codak.password.{email}")`
2. **Legacy:** `localStorage.getItem("coda.password.{email}")`
3. **Alternative formats:** Tries different email casing variations
4. **Last resort:** Searches all password keys for matching email

**What it's looking for:**
- A 64-character hexadecimal string (SHA-256 hash)
- Example: `"2da81ac3c9eb9459037f1135c64d6a5b1e63b68dbf127b0d20d00ac98d6a249e"`

**If password hash NOT found:**
- Returns error: `"Invalid email or password. Please check your credentials."`
- Login fails ❌

---

### **Step 5: Verify Password**

**Code Location:** `lib/auth.ts` lines 138-155

**What it does:**
```typescript
// Hash the input password
const inputHash = await hashPassword(password);

// Compare with stored hash
passwordValid = await verifyPassword(password, storedPasswordHash);
```

**Process:**
1. Takes the password user entered
2. Hashes it using SHA-256
3. Compares the hash with the stored hash
4. If they match → password is correct ✅
5. If they don't match → password is wrong ❌

**If password wrong:**
- Returns error: `"Invalid email or password"`
- Login fails ❌

---

### **Step 6: Create Session (If Successful)**

**Code Location:** `lib/auth.ts` lines 163-178

**What it does:**
```typescript
// Generate session token
const sessionToken = generateSessionToken();
localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);

// Set current session
localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
```

**Storage Locations:**
- `localStorage.setItem("codak.session_token", token)`
- `localStorage.setItem("codak.auth.v1", userObject)`

**Result:**
- User is logged in ✅
- Session is active
- User redirected to dashboard

---

## 📊 Complete Storage Map

### **User Accounts**
```
Key: "codak.users.v1"
Type: Array of user objects
Example:
[
  {
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "isPremium": false
  }
]
```

### **Password Hashes**
```
Key: "codak.password.{email}"
Type: String (64-char hex hash)
Example: "2da81ac3c9eb9459037f1135c64d6a5b1e63b68dbf127b0d20d00ac98d6a249e"
```

### **Current Session**
```
Key: "codak.auth.v1"
Type: User object
Example:
{
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "isPremium": false
}
```

### **Session Token**
```
Key: "codak.session_token"
Type: String (UUID)
Example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## 🔍 How to View in Browser

### **Check All Users:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem("codak.users.v1"))
```

### **Check Specific User's Password Hash:**
```javascript
// In browser console:
localStorage.getItem("codak.password.user@example.com")
```

### **Check Current Session:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem("codak.auth.v1"))
```

### **Check Session Token:**
```javascript
// In browser console:
localStorage.getItem("codak.session_token")
```

---

## 🔄 Complete Login Flow Diagram

```
User enters email/password
         ↓
login() function called (lib/auth.ts)
         ↓
Check: localStorage.getItem("codak.users.v1")
         ↓
Find user with matching email
         ↓
Check: localStorage.getItem("codak.password.{email}")
         ↓
Hash input password (SHA-256)
         ↓
Compare hashes
         ↓
If match:
  - Create session token
  - Store in localStorage
  - Set current user
  - Redirect to dashboard ✅
  
If no match:
  - Return error ❌
```

---

## 🎯 Key Functions

### **getAllUsers()**
**Location:** `lib/auth.ts` lines 326-355

**What it does:**
- Retrieves all users from localStorage
- Tries `codak.users.v1` first
- Falls back to `coda.users.v1` (legacy)
- Returns array of user objects

### **hashPassword()**
**Location:** `lib/security.ts`

**What it does:**
- Takes plain text password
- Hashes it using SHA-256
- Returns 64-character hex string

### **verifyPassword()**
**Location:** `lib/security.ts`

**What it does:**
- Takes plain text password and stored hash
- Hashes the password
- Compares with stored hash
- Returns true/false

---

## ✅ Summary

**When a user logs in, the program checks:**

1. **User Account:** `localStorage.getItem("codak.users.v1")`
   - Looks for user with matching email

2. **Password Hash:** `localStorage.getItem("codak.password.{email}")`
   - Retrieves stored password hash

3. **Password Verification:**
   - Hashes input password
   - Compares with stored hash
   - If match → login successful ✅

**All checks happen in:** `lib/auth.ts` → `login()` function

**All data stored in:** Browser's `localStorage`

**Storage is:** Client-side only (in user's browser)

