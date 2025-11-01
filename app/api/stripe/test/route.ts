import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  // Test endpoint to check Stripe configuration
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  const keyLength = process.env.STRIPE_SECRET_KEY?.length || 0;
  const keyPrefix = hasKey ? process.env.STRIPE_SECRET_KEY?.substring(0, 12) : "none";
  const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  
  // Try to initialize Stripe to verify key is valid
  let stripeValid = false;
  let stripeError = null;
  
  if (hasKey) {
    try {
      const testStripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2024-10-28.acacia",
      });
      // Try a simple API call to verify key works
      await testStripe.customers.list({ limit: 1 });
      stripeValid = true;
    } catch (err: any) {
      stripeError = {
        type: err?.type,
        code: err?.code,
        message: err?.message,
      };
    }
  }

  return Response.json({
    configured: hasKey && stripeValid,
    keyPresent: hasKey,
    keyLength: keyLength,
    keyPrefix: hasKey ? `${keyPrefix}...` : "not set",
    keyValid: stripeValid,
    keyError: stripeError,
    webhookSecretPresent: hasWebhookSecret,
    nodeEnv: process.env.NODE_ENV,
    message: hasKey && stripeValid
      ? "✅ Stripe is configured and working!"
      : hasKey && !stripeValid
      ? `❌ Stripe key is present but invalid. Error: ${stripeError?.message || "Unknown error"}`
      : "❌ STRIPE_SECRET_KEY is missing in environment variables.",
    nextSteps: hasKey && stripeValid
      ? "Everything looks good! If payment isn't working, check Vercel logs."
      : hasKey && !stripeValid
      ? "Key is present but invalid. Check if key is correct in Stripe Dashboard. You may need a new key."
      : "Add STRIPE_SECRET_KEY to Vercel environment variables and redeploy."
  });
}

