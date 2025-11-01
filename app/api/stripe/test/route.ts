import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Test endpoint to check Stripe configuration
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  const keyLength = process.env.STRIPE_SECRET_KEY?.length || 0;
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 10) || "none";

  return Response.json({
    configured: hasKey,
    keyPresent: hasKey,
    keyLength: keyLength,
    keyPrefix: hasKey ? `${keyPrefix}...` : "not set",
    message: hasKey 
      ? "Stripe is configured. Key is present." 
      : "STRIPE_SECRET_KEY is missing in environment variables.",
    nextSteps: hasKey
      ? "Check if key is valid in Stripe Dashboard."
      : "Add STRIPE_SECRET_KEY to Vercel environment variables and redeploy."
  });
}

