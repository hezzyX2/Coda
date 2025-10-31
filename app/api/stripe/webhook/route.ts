import { NextRequest } from "next/server";
import Stripe from "stripe";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return Response.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  if (!stripe) {
    return Response.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSubscriptionCreated(session, stripe);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, stripe);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription, stripe);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, stripe);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, stripe);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (err: any) {
    console.error("[Stripe Webhook] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session, stripe: Stripe) {
  const userEmail = session.customer_email || session.metadata?.userEmail;
  if (!userEmail) return;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Update user in storage (in production, use a database)
  updateUserSubscription(userEmail, {
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    isPremium: true,
    subscriptionStatus: subscription.status as any,
    subscriptionExpiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, stripe: Stripe) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const userEmail = typeof customer === "object" && !customer.deleted ? customer.email : null;
  if (!userEmail) return;

  updateUserSubscription(userEmail, {
    isPremium: subscription.status === "active" || subscription.status === "trialing",
    subscriptionStatus: subscription.status as any,
    subscriptionExpiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription, stripe: Stripe) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const userEmail = typeof customer === "object" && !customer.deleted ? customer.email : null;
  if (!userEmail) return;

  updateUserSubscription(userEmail, {
    isPremium: false,
    subscriptionStatus: "canceled",
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, stripe: Stripe) {
  // Track successful payment
  trackPayment("success", invoice);
}

async function handlePaymentFailed(invoice: Stripe.Invoice, stripe: Stripe) {
  const customer = await stripe.customers.retrieve(invoice.customer as string);
  const userEmail = typeof customer === "object" && !customer.deleted ? customer.email : null;
  if (userEmail) {
    updateUserSubscription(userEmail, {
      subscriptionStatus: "past_due",
    });
  }
  trackPayment("failed", invoice);
}

function updateUserSubscription(userEmail: string, updates: Partial<any>) {
  // In production, update in database
  // For now, log and update localStorage structure would need to be done client-side
  // This is a placeholder - in production you'd update a database here
  console.log(`[Subscription Update] ${userEmail}:`, updates);
  
  // Note: In production, use a database (PostgreSQL, MongoDB, etc.)
  // Store subscription status, customer ID, subscription ID, etc.
}

function trackPayment(status: string, invoice: Stripe.Invoice) {
  // Track payment events for analytics
  console.log(`[Payment ${status}] Invoice:`, invoice.id, "Amount:", invoice.amount_paid);
}

