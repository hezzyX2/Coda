"use client";

/**
 * Client-side Stripe helper (for displaying payment info)
 * Never expose secret keys here - they're server-side only
 */

export async function redirectToCheckout(userEmail: string, userId: string) {
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, userId }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create checkout");
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL received");
    }
  } catch (error: any) {
    throw new Error(error.message || "Checkout failed");
  }
}

