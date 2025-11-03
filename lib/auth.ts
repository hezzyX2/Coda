"use client";
import { migrateUserData } from "./storage";
import {
  hashPassword,
  verifyPassword,
  isValidEmail,
  validatePasswordStrength,
  checkRateLimit,
  recordFailedLogin,
  clearFailedLogins,
  generateSessionToken,
} from "./security";

export interface User {
  email: string;
  name: string;
  createdAt: string;
  isPremium: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionExpiresAt?: string;
  authProvider?: "email" | "google";
  googleId?: string;
  profileImage?: string;
}

const AUTH_KEY = "codak.auth.v1";
const SESSION_TOKEN_KEY = "codak.session_token";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const auth = localStorage.getItem(AUTH_KEY);
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  
  // Both auth and token must exist
  if (!auth || !token) return false;
  
  // Verify session is still valid
  return verifySession();
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

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  // Sanitize email input
  const sanitizedEmail = email.trim().toLowerCase();

  // Validate email format
  if (!isValidEmail(sanitizedEmail)) {
    return { success: false, error: "Invalid email address format" };
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(sanitizedEmail);
  if (!rateLimit.allowed) {
    const lockoutMinutes = rateLimit.lockoutUntil
      ? Math.ceil((rateLimit.lockoutUntil - Date.now()) / 60000)
      : 15;
    return {
      success: false,
      error: `Too many failed login attempts. Please try again in ${lockoutMinutes} minutes.`,
    };
  }

  // Check if user exists
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === sanitizedEmail);
  
  if (!user) {
    console.error(`[Auth] User not found: ${sanitizedEmail}`);
    recordFailedLogin(sanitizedEmail);
    return { success: false, error: "Invalid email or password" };
  }

  // Google OAuth users don't have passwords
  if (user.authProvider === "google") {
    return { success: false, error: "This account uses Google sign-in. Please sign in with Google." };
  }

  // Verify password - check multiple possible storage formats
  const passwordKey = `codak.password.${sanitizedEmail}`;
  let storedPasswordHash = localStorage.getItem(passwordKey);
  
  // Try legacy key format for migration
  if (!storedPasswordHash) {
    const legacyKey = `coda.password.${sanitizedEmail}`;
    storedPasswordHash = localStorage.getItem(legacyKey);
    if (storedPasswordHash) {
      // Migrate to new key format
      localStorage.setItem(passwordKey, storedPasswordHash);
      localStorage.removeItem(legacyKey);
    }
  }
  
  if (!storedPasswordHash) {
    console.error(`[Auth] No password found for email: ${sanitizedEmail}`);
    recordFailedLogin(sanitizedEmail);
    return { success: false, error: "Invalid email or password. Please check your credentials." };
  }

  // Check if password is stored as hash (SHA-256 = 64 hex chars)
  let passwordValid: boolean;
  
  if (storedPasswordHash.length === 64 && /^[a-f0-9]{64}$/.test(storedPasswordHash)) {
    // It's a hash - verify normally
    passwordValid = await verifyPassword(password, storedPasswordHash);
  } else {
    // It might be plain text (old account) - migrate it
    const inputHash = await hashPassword(password);
    if (storedPasswordHash === password) {
      // Password matches plain text - migrate to hash
      localStorage.setItem(passwordKey, inputHash);
      passwordValid = true;
      console.log(`[Auth] Migrated plain text password to hash for: ${sanitizedEmail}`);
    } else {
      passwordValid = false;
    }
  }

  if (!passwordValid) {
    console.error(`[Auth] Password verification failed for: ${sanitizedEmail}`);
    recordFailedLogin(sanitizedEmail);
    return { success: false, error: "Invalid email or password" };
  }

  // Clear failed login attempts on success
  clearFailedLogins(sanitizedEmail);

  // Generate secure session token
  const sessionToken = generateSessionToken();
  localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);

  // Set current session (with sanitized email)
  const currentUser = { ...user, email: sanitizedEmail };
  localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  
  // Migrate any old global data to user-specific storage
  migrateUserData(sanitizedEmail);
  
  console.log(`[Auth] Successful login for: ${sanitizedEmail}`);
  return { success: true };
}

export async function signup(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  if (!email || !password || !name) {
    return { success: false, error: "All fields are required" };
  }

  // Sanitize inputs
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = name.trim();

  // Validate email format
  if (!isValidEmail(sanitizedEmail)) {
    return { success: false, error: "Invalid email address format" };
  }

  // Validate name
  if (sanitizedName.length < 2) {
    return { success: false, error: "Name must be at least 2 characters" };
  }

  if (sanitizedName.length > 50) {
    return { success: false, error: "Name must be less than 50 characters" };
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: passwordValidation.errors.join(". "),
    };
  }

  // Check if user already exists (case-insensitive)
  const users = getAllUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === sanitizedEmail);
  if (existingUser) {
    console.log(`[Auth] User already exists: ${sanitizedEmail}`);
    return { success: false, error: "Email already registered. Please sign in instead." };
  }

  // Hash password before storing
  const passwordHash = await hashPassword(password);

  // Create new user (default to free tier)
  const newUser: User = {
    email: sanitizedEmail,
    name: sanitizedName,
    createdAt: new Date().toISOString(),
    isPremium: false,
    authProvider: "email"
  };

  // Store user and hashed password
  users.push(newUser);
  localStorage.setItem("codak.users.v1", JSON.stringify(users));
  
  // Store password hash with consistent key format
  const passwordKey = `codak.password.${sanitizedEmail}`;
  localStorage.setItem(passwordKey, passwordHash);
  
  // Migrate from legacy keys if they exist
  const legacyUserKey = "coda.users.v1";
  const legacyPasswordKey = `coda.password.${sanitizedEmail}`;
  const legacyUsers = localStorage.getItem(legacyUserKey);
  if (legacyUsers) {
    try {
      const oldUsers = JSON.parse(legacyUsers);
      const oldUser = oldUsers.find((u: any) => u.email?.toLowerCase() === sanitizedEmail);
      if (oldUser) {
        // User exists in old format, migrate
        const oldPassword = localStorage.getItem(legacyPasswordKey);
        if (oldPassword) {
          localStorage.setItem(passwordKey, oldPassword);
        }
      }
    } catch (e) {
      console.error("[Auth] Error migrating legacy users:", e);
    }
  }
  
  console.log(`[Auth] Created account for: ${sanitizedEmail}, password hash stored at: ${passwordKey}`);

  // Generate secure session token
  const sessionToken = generateSessionToken();
  localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  
  // Initialize user-specific data storage
  migrateUserData(sanitizedEmail);

  return { success: true };
}

export async function signInWithGoogle(googleUser: {
  email: string;
  name: string;
  googleId: string;
  profileImage?: string;
}): Promise<{ success: boolean; error?: string }> {
  const sanitizedEmail = googleUser.email.trim().toLowerCase();
  
  if (!isValidEmail(sanitizedEmail)) {
    return { success: false, error: "Invalid email address" };
  }

  const users = getAllUsers();
  let user = users.find(u => u.email.toLowerCase() === sanitizedEmail);
  
  if (user) {
    // User exists - update if needed
    if (user.authProvider !== "google" && !user.googleId) {
      // Existing email user - link Google account
      user.authProvider = "google";
      user.googleId = googleUser.googleId;
      if (googleUser.profileImage) user.profileImage = googleUser.profileImage;
      
      const userIndex = users.findIndex(u => u.email.toLowerCase() === sanitizedEmail);
      users[userIndex] = user;
      localStorage.setItem("codak.users.v1", JSON.stringify(users));
    } else if (user.googleId !== googleUser.googleId) {
      return { success: false, error: "This Google account is already linked to another email." };
    }
  } else {
    // New user - create account
    user = {
      email: sanitizedEmail,
      name: googleUser.name,
      createdAt: new Date().toISOString(),
      isPremium: false,
      authProvider: "google",
      googleId: googleUser.googleId,
      profileImage: googleUser.profileImage
    };
    
    users.push(user);
    localStorage.setItem("codak.users.v1", JSON.stringify(users));
  }

  // Generate secure session token
  const sessionToken = generateSessionToken();
  localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
  
  // Set current session
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  
  // Initialize user-specific data storage
  migrateUserData(sanitizedEmail);
  
  console.log(`[Auth] Google sign-in successful for: ${sanitizedEmail}`);
  return { success: true };
}

export function logout(): void {
  if (typeof window === "undefined") return;
  
  // Clear current session and token
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_TOKEN_KEY);
  
  // Clear any temporary data (from when user wasn't logged in)
  localStorage.removeItem("coda.tasks.temp");
  localStorage.removeItem("coda.journal.temp");
  localStorage.removeItem("coda.prefs.temp");
}

/**
 * Verify current session is valid and check if user still exists
 */
export function verifySession(): boolean {
  if (typeof window === "undefined") return false;
  
  const auth = localStorage.getItem(AUTH_KEY);
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  
  if (!auth || !token) {
    return false;
  }

  try {
    const user = JSON.parse(auth) as User;
    if (!user || !user.email) return false;
    
    // Verify user still exists in the users list
    const users = getAllUsers();
    const userExists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    
    if (!userExists) {
      // User was deleted, clear session
      logout();
      return false;
    }
    
    // Sync user data from users list (in case premium status changed)
    const updatedUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (updatedUser) {
      // Sync all fields
      const syncedUser = { ...updatedUser, email: user.email };
      if (JSON.stringify(syncedUser) !== JSON.stringify(user)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(syncedUser));
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  
  // Try new key first
  let stored = localStorage.getItem("codak.users.v1");
  if (!stored) {
    // Try legacy key
    stored = localStorage.getItem("coda.users.v1");
    if (stored) {
      // Migrate to new key
      localStorage.setItem("codak.users.v1", stored);
    }
  }
  
  if (!stored) return [];
  try {
    const users = JSON.parse(stored) as User[];
    // Migrate old users without isPremium field
    return users.map(u => ({
      ...u,
      isPremium: u.isPremium ?? false,
      authProvider: u.authProvider ?? "email"
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
    localStorage.setItem("codak.users.v1", JSON.stringify(users));
  }

  return { success: true };
}
