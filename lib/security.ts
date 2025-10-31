"use client";

/**
 * Security utilities for password hashing and validation
 * Note: For production, passwords should be hashed server-side
 * This is a client-side implementation for the MVP
 */

// Rate limiting for login attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const LOGIN_ATTEMPTS_KEY = "coda.login_attempts";

interface LoginAttempt {
  email: string;
  attempts: number;
  lockoutUntil: number | null;
}

/**
 * Simple password hashing using Web Crypto API
 * For production, use server-side bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Check if email is valid format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Check rate limiting for login attempts
 */
export function checkRateLimit(email: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutUntil: number | null;
} {
  if (typeof window === "undefined") {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockoutUntil: null };
  }

  const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];

  const userAttempt = attempts.find(a => a.email === email);
  const now = Date.now();

  // Check if user is locked out
  if (userAttempt?.lockoutUntil && now < userAttempt.lockoutUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutUntil: userAttempt.lockoutUntil,
    };
  }

  // Reset if lockout expired
  if (userAttempt?.lockoutUntil && now >= userAttempt.lockoutUntil) {
    userAttempt.attempts = 0;
    userAttempt.lockoutUntil = null;
  }

  const remainingAttempts = userAttempt
    ? Math.max(0, MAX_LOGIN_ATTEMPTS - (userAttempt.attempts || 0))
    : MAX_LOGIN_ATTEMPTS;

  return {
    allowed: remainingAttempts > 0,
    remainingAttempts,
    lockoutUntil: userAttempt?.lockoutUntil || null,
  };
}

/**
 * Record failed login attempt
 */
export function recordFailedLogin(email: string): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];

  let userAttempt = attempts.find(a => a.email === email);
  if (!userAttempt) {
    userAttempt = { email, attempts: 0, lockoutUntil: null };
    attempts.push(userAttempt);
  }

  userAttempt.attempts += 1;

  // Lock out after max attempts
  if (userAttempt.attempts >= MAX_LOGIN_ATTEMPTS) {
    userAttempt.lockoutUntil = Date.now() + LOCKOUT_DURATION;
  }

  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

/**
 * Clear failed login attempts (on successful login)
 */
export function clearFailedLogins(email: string): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
  const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];

  const filtered = attempts.filter(a => a.email !== email);
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(filtered));
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validate session token format
 */
export function isValidSessionToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

