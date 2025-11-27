"use client";

/**
 * Admin utilities for managing users programmatically
 * Use these functions to add, update, or manage users directly
 */

import { hashPassword } from "./security";
import { User } from "./auth";

const USERS_KEY = "codak.users.v1";
const LEGACY_USERS_KEY = "coda.users.v1";

/**
 * Get all users from storage
 */
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  
  let stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    stored = localStorage.getItem(LEGACY_USERS_KEY);
    if (stored) {
      localStorage.setItem(USERS_KEY, stored);
    }
  }
  
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as User[];
  } catch {
    return [];
  }
}

/**
 * Save all users to storage
 */
function saveAllUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Also save to legacy key for compatibility
  localStorage.setItem(LEGACY_USERS_KEY, JSON.stringify(users));
}

/**
 * Add a new user programmatically
 * 
 * @param email - User's email address
 * @param password - User's password (will be hashed)
 * @param name - User's full name
 * @param isPremium - Whether user has premium access (default: false)
 * @returns Success status and any error message
 */
export async function addUser(
  email: string,
  password: string,
  name: string,
  isPremium: boolean = false
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot add user on server side" };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = name.trim();

  // Validate inputs
  if (!sanitizedEmail || !password || !sanitizedName) {
    return { success: false, error: "Email, password, and name are required" };
  }

  // Check if user already exists
  const users = getAllUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === sanitizedEmail);
  
  if (existingUser) {
    return { success: false, error: `User with email ${sanitizedEmail} already exists` };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create new user
  const newUser: User = {
    email: sanitizedEmail,
    name: sanitizedName,
    createdAt: new Date().toISOString(),
    isPremium: isPremium,
  };

  // Add to users array
  users.push(newUser);
  saveAllUsers(users);

  // Store password hash
  const passwordKey = `codak.password.${sanitizedEmail}`;
  const legacyPasswordKey = `coda.password.${sanitizedEmail}`;
  localStorage.setItem(passwordKey, passwordHash);
  localStorage.setItem(legacyPasswordKey, passwordHash);

  console.log(`[Admin] ✓ Added user: ${sanitizedEmail}`);
  return { success: true };
}

/**
 * Update an existing user
 * 
 * @param email - User's email address
 * @param updates - Fields to update
 * @returns Success status and any error message
 */
export function updateUser(
  email: string,
  updates: Partial<Omit<User, "email">>
): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot update user on server side" };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === sanitizedEmail);

  if (userIndex === -1) {
    return { success: false, error: `User with email ${sanitizedEmail} not found` };
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    email: sanitizedEmail, // Ensure email stays the same
  };

  saveAllUsers(users);
  console.log(`[Admin] ✓ Updated user: ${sanitizedEmail}`);
  return { success: true };
}

/**
 * Change a user's password
 * 
 * @param email - User's email address
 * @param newPassword - New password (will be hashed)
 * @returns Success status and any error message
 */
export async function changeUserPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot change password on server side" };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === sanitizedEmail);

  if (!user) {
    return { success: false, error: `User with email ${sanitizedEmail} not found` };
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Store password hash
  const passwordKey = `codak.password.${sanitizedEmail}`;
  const legacyPasswordKey = `coda.password.${sanitizedEmail}`;
  localStorage.setItem(passwordKey, passwordHash);
  localStorage.setItem(legacyPasswordKey, passwordHash);

  console.log(`[Admin] ✓ Changed password for: ${sanitizedEmail}`);
  return { success: true };
}

/**
 * Delete a user
 * 
 * @param email - User's email address
 * @returns Success status and any error message
 */
export function deleteUser(email: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Cannot delete user on server side" };
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.email.toLowerCase() !== sanitizedEmail);

  if (filteredUsers.length === users.length) {
    return { success: false, error: `User with email ${sanitizedEmail} not found` };
  }

  saveAllUsers(filteredUsers);

  // Remove password hash
  const passwordKey = `codak.password.${sanitizedEmail}`;
  const legacyPasswordKey = `coda.password.${sanitizedEmail}`;
  localStorage.removeItem(passwordKey);
  localStorage.removeItem(legacyPasswordKey);

  console.log(`[Admin] ✓ Deleted user: ${sanitizedEmail}`);
  return { success: true };
}

/**
 * Get a specific user by email
 */
export function getUserByEmail(email: string): User | null {
  const sanitizedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === sanitizedEmail) || null;
}

