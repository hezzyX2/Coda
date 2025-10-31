"use client";

export interface User {
  email: string;
  name: string;
  createdAt: string;
  isPremium: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionExpiresAt?: string;
}

const AUTH_KEY = "coda.auth.v1";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const auth = localStorage.getItem(AUTH_KEY);
  return auth !== null;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return null;
  try {
    return JSON.parse(auth) as User;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  // Simple validation
  if (!email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  // Check if user exists
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, error: "User not found. Please sign up first." };
  }

  // Simple password check (in real app, this would hash/verify)
  const storedPassword = localStorage.getItem(`coda.password.${email}`);
  if (storedPassword !== password) {
    return { success: false, error: "Incorrect password" };
  }

  // Set current session
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  
  // Migrate any old global data to user-specific storage
  import("./storage").then(({ migrateUserData }) => {
    migrateUserData(user.email);
  });
  
  return { success: true };
}

export function signup(email: string, password: string, name: string): { success: boolean; error?: string } {
  if (!email || !password || !name) {
    return { success: false, error: "All fields are required" };
  }

  if (!email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  // Check if user already exists
  const users = getAllUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: "Email already registered" };
  }

  // Create new user (default to free tier)
  const newUser: User = {
    email,
    name,
    createdAt: new Date().toISOString(),
    isPremium: false
  };

  // Store user and password
  users.push(newUser);
  localStorage.setItem("coda.users.v1", JSON.stringify(users));
  localStorage.setItem(`coda.password.${email}`, password);
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  
  // Initialize user-specific data storage
  // User data will be saved when they start using the app
  
  // Migrate any old global data to user-specific storage
  import("./storage").then(({ migrateUserData }) => {
    migrateUserData(email);
  });

  return { success: true };
}

export function logout(): void {
  if (typeof window === "undefined") return;
  
  // Clear current session
  localStorage.removeItem(AUTH_KEY);
  
  // Clear any temporary data (from when user wasn't logged in)
  localStorage.removeItem("coda.tasks.temp");
  localStorage.removeItem("coda.journal.temp");
  localStorage.removeItem("coda.prefs.temp");
}

function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("coda.users.v1");
  if (!stored) return [];
  try {
    const users = JSON.parse(stored) as User[];
    // Migrate old users without isPremium field
    return users.map(u => ({
      ...u,
      isPremium: u.isPremium ?? false
    }));
  } catch {
    return [];
  }
}

export function isPremium(): boolean {
  const user = getCurrentUser();
  return user?.isPremium ?? false;
}

export function upgradeToPremium(): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Cannot upgrade" };
  
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Update user to premium
  const updatedUser: User = {
    ...user,
    isPremium: true
  };

  // Update current session
  localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

  // Update in users list
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === user.email);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem("coda.users.v1", JSON.stringify(users));
  }

  return { success: true };
}

