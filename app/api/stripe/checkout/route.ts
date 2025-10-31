import { NextRequest } from "next/server";
import Stripe from "stripe";

// Initialize Stripe only if key exists
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, userId } = body;

    if (!userEmail || !userId) {
      return Response.json({ error: "Missing user information" }, { status: 400 });
    }

    // Check if Stripe is configured with better error messaging
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[Stripe Checkout] STRIPE_SECRET_KEY environment variable is not set");
      return Response.json({ 
        error: "Stripe not configured. STRIPE_SECRET_KEY environment variable is missing. Please add it in Vercel environment variables." 
      }, { status: 500 });
    }

    if (!stripe) {
      console.error("[Stripe Checkout] Stripe initialization failed. Check if STRIPE_SECRET_KEY is valid.");
      return Response.json({ 
        error: "Stripe not configured. Please check your STRIPE_SECRET_KEY in Vercel environment variables." 
      }, { status: 500 });
    }

    // Create or retrieve Stripe customer
    let customer;
    const existingCustomers = await stripe!.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe!.customers.create({
        email: userEmail,
        metadata: { userId },
      });
    }

    // Create checkout session
    const session = await stripe!.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Coda Premium",
              description: "Unlock AI Chat, Journal Analysis, and Enhanced AI Advice",
            },
            recurring: {
              interval: "month",
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: (() => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const url = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
        return `${url}/premium?success=true`;
      })(),
      cancel_url: (() => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const url = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
        return `${url}/premium?canceled=true`;
      })(),
      metadata: {
        userId,
        userEmail,
      },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("[Stripe Checkout] Error:", err);
    return Response.json({ error: err?.message || "Failed to create checkout session" }, { status: 500 });
  }
}

