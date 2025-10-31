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
}

const AUTH_KEY = "coda.auth.v1";
const SESSION_TOKEN_KEY = "coda.session_token";

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
    // Record failed attempt even if user doesn't exist (prevents email enumeration)
    recordFailedLogin(sanitizedEmail);
    return { success: false, error: "Invalid email or password" };
  }

  // Verify password (hashed or plain text for migration)
  const storedPasswordHash = localStorage.getItem(`coda.password.${sanitizedEmail}`);
  if (!storedPasswordHash) {
    recordFailedLogin(sanitizedEmail);
    return { success: false, error: "Invalid email or password" };
  }

  // Check if password is stored as hash (starts with characters that indicate hash)
  // or plain text (for accounts created before hashing was implemented)
  let passwordValid: boolean;
  
  if (storedPasswordHash.length === 64 && /^[a-f0-9]{64}$/.test(storedPasswordHash)) {
    // It's a hash - verify normally
    passwordValid = await verifyPassword(password, storedPasswordHash);
  } else {
    // It's plain text (old account) - migrate it
    const inputHash = await hashPassword(password);
    if (storedPasswordHash === password) {
      // Password matches plain text - migrate to hash
      localStorage.setItem(`coda.password.${sanitizedEmail}`, inputHash);
      passwordValid = true;
    } else {
      passwordValid = false;
    }
  }

  if (!passwordValid) {
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

  // Check if user already exists
  const users = getAllUsers();
  if (users.find(u => u.email.toLowerCase() === sanitizedEmail)) {
    return { success: false, error: "Email already registered" };
  }

  // Hash password before storing
  const passwordHash = await hashPassword(password);

  // Create new user (default to free tier)
  const newUser: User = {
    email: sanitizedEmail,
    name: sanitizedName,
    createdAt: new Date().toISOString(),
    isPremium: false
  };

  // Store user and hashed password
  users.push(newUser);
  localStorage.setItem("coda.users.v1", JSON.stringify(users));
  localStorage.setItem(`coda.password.${sanitizedEmail}`, passwordHash);
  
  // Generate secure session token
  const sessionToken = generateSessionToken();
  localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  
  // Initialize user-specific data storage
  migrateUserData(sanitizedEmail);

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
 * Verify current session is valid
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
    return !!(user && user.email);
  } catch {
    return false;
  }
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

