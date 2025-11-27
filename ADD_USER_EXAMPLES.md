# 👤 How to Add Users Programmatically

## 📍 Where Users Are Stored

**Storage Location:** Browser's `localStorage`

**Key:** `"codak.users.v1"`

**Format:** Array of user objects

**Example:**
```json
[
  {
    "email": "user1@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "isPremium": false
  },
  {
    "email": "user2@example.com",
    "name": "Jane Smith",
    "createdAt": "2024-01-20T14:22:00.000Z",
    "isPremium": true
  }
]
```

---

## 🚀 Method 1: Using Helper Functions (Recommended)

I've created helper functions in `lib/admin-utils.ts` that you can use:

### **Add a New User**

```typescript
import { addUser } from "@/lib/admin-utils";

// Add a regular user
const result = await addUser(
  "newuser@example.com",
  "password123",
  "New User",
  false  // isPremium
);

if (result.success) {
  console.log("User added successfully!");
} else {
  console.error("Error:", result.error);
}
```

### **Update a User**

```typescript
import { updateUser } from "@/lib/admin-utils";

// Update user's premium status
const result = updateUser("user@example.com", {
  isPremium: true,
  name: "Updated Name"
});
```

### **Change User Password**

```typescript
import { changeUserPassword } from "@/lib/admin-utils";

const result = await changeUserPassword(
  "user@example.com",
  "newPassword123"
);
```

### **Delete a User**

```typescript
import { deleteUser } from "@/lib/admin-utils";

const result = deleteUser("user@example.com");
```

---

## 🛠️ Method 2: Direct localStorage Manipulation

### **Add User Directly to localStorage**

```javascript
// In browser console or your code:

// 1. Get existing users
const users = JSON.parse(localStorage.getItem("codak.users.v1") || "[]");

// 2. Hash the password (in browser console)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3. Create new user object
const newUser = {
  email: "newuser@example.com",
  name: "New User",
  createdAt: new Date().toISOString(),
  isPremium: false
};

// 4. Add to users array
users.push(newUser);

// 5. Save users
localStorage.setItem("codak.users.v1", JSON.stringify(users));

// 6. Hash and store password
const passwordHash = await hashPassword("password123");
localStorage.setItem("codak.password.newuser@example.com", passwordHash);
localStorage.setItem("coda.password.newuser@example.com", passwordHash); // Legacy

console.log("✅ User added!");
```

---

## 📝 Method 3: Complete Example Script

Here's a complete script you can run in browser console:

```javascript
(async function addNewUser() {
  const email = "newuser@example.com";
  const password = "password123";
  const name = "New User";
  const isPremium = false;

  // Hash password
  async function hashPassword(pwd) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Get existing users
  let users = JSON.parse(localStorage.getItem("codak.users.v1") || "[]");

  // Check if user exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    console.error("❌ User already exists!");
    return;
  }

  // Create new user
  const newUser = {
    email: email.toLowerCase(),
    name: name,
    createdAt: new Date().toISOString(),
    isPremium: isPremium
  };

  // Add to users
  users.push(newUser);
  localStorage.setItem("codak.users.v1", JSON.stringify(users));
  localStorage.setItem("coda.users.v1", JSON.stringify(users)); // Legacy

  // Hash and store password
  const passwordHash = await hashPassword(password);
  localStorage.setItem(`codak.password.${email.toLowerCase()}`, passwordHash);
  localStorage.setItem(`coda.password.${email.toLowerCase()}`, passwordHash);

  console.log("✅ User added successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
})();
```

---

## 🎯 Method 4: Using the Signup Function

You can also use the existing signup function programmatically:

```typescript
import { signup } from "@/lib/auth";

const result = await signup(
  "newuser@example.com",
  "password123",
  "New User"
);

if (result.success) {
  console.log("User created!");
} else {
  console.error("Error:", result.error);
}
```

---

## 📊 User Object Structure

When adding a user, the object should have this structure:

```typescript
interface User {
  email: string;           // Required - user's email (lowercase)
  name: string;            // Required - user's full name
  createdAt: string;       // Required - ISO timestamp
  isPremium: boolean;      // Optional - default: false
  stripeCustomerId?: string;      // Optional - Stripe customer ID
  stripeSubscriptionId?: string;  // Optional - Stripe subscription ID
  subscriptionStatus?: string;     // Optional - "active" | "canceled" | etc.
  subscriptionExpiresAt?: string;  // Optional - ISO timestamp
}
```

---

## 🔍 Where to Add Code

### **In a React Component:**

```typescript
"use client";
import { addUser } from "@/lib/admin-utils";

export default function AdminPage() {
  async function handleAddUser() {
    const result = await addUser(
      "newuser@example.com",
      "password123",
      "New User"
    );
    
    if (result.success) {
      alert("User added!");
    } else {
      alert("Error: " + result.error);
    }
  }

  return <button onClick={handleAddUser}>Add User</button>;
}
```

### **In Browser Console:**

Just copy and paste any of the scripts above into the browser console.

### **In a Script File:**

Create a file like `scripts/add-user.ts` and import the functions.

---

## ✅ Quick Reference

**Users List Location:**
- `localStorage.getItem("codak.users.v1")` - Array of user objects

**Password Hash Location:**
- `localStorage.getItem("codak.password.{email}")` - 64-char hex string

**Helper Functions:**
- `addUser()` - Add new user
- `updateUser()` - Update existing user
- `changeUserPassword()` - Change user's password
- `deleteUser()` - Delete user
- `getUserByEmail()` - Get specific user
- `getAllUsers()` - Get all users

**All functions are in:** `lib/admin-utils.ts`

---

## 🚨 Important Notes

1. **Passwords are hashed** - Never store plain text passwords
2. **Email is lowercase** - System automatically converts to lowercase
3. **User must not exist** - Check before adding to avoid duplicates
4. **Password hash required** - Must store password hash in `codak.password.{email}`
5. **Both keys** - Store in both `codak.*` and `coda.*` keys for compatibility

---

## 📝 Example: Add Multiple Users

```javascript
const usersToAdd = [
  { email: "user1@example.com", password: "pass1", name: "User One" },
  { email: "user2@example.com", password: "pass2", name: "User Two" },
  { email: "user3@example.com", password: "pass3", name: "User Three" }
];

(async function addMultipleUsers() {
  async function hashPassword(pwd) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  let users = JSON.parse(localStorage.getItem("codak.users.v1") || "[]");

  for (const userData of usersToAdd) {
    const email = userData.email.toLowerCase();
    
    // Skip if exists
    if (users.find(u => u.email.toLowerCase() === email)) {
      console.log(`⏭️  Skipping ${email} - already exists`);
      continue;
    }

    // Add user
    users.push({
      email: email,
      name: userData.name,
      createdAt: new Date().toISOString(),
      isPremium: false
    });

    // Hash and store password
    const hash = await hashPassword(userData.password);
    localStorage.setItem(`codak.password.${email}`, hash);
    localStorage.setItem(`coda.password.${email}`, hash);
    
    console.log(`✅ Added ${email}`);
  }

  // Save all users
  localStorage.setItem("codak.users.v1", JSON.stringify(users));
  localStorage.setItem("coda.users.v1", JSON.stringify(users));
  
  console.log("🎉 All users added!");
})();
```

