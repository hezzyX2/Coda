"use client";
import { useState, useEffect } from "react";
import { upgradeToPremium, isPremium, getCurrentUser } from "@/lib/auth";
import { DiamondLogo } from "@/components/DiamondLogo";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const user = getCurrentUser();
  const isUserPremium = isPremium();

  useEffect(() => {
    // Handle Stripe redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccess(true);
      setTimeout(() => {
        router.push("/?upgraded=true");
        router.refresh();
      }, 2000);
    }
    if (params.get("canceled") === "true") {
      setError("Payment canceled. You can try again anytime.");
    }
  }, [router]);

  async function handleUpgrade() {
    setLoading(true);
    setError("");

    try {
      // Check if Stripe is configured
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          userId: user?.email, // Use email as user ID for now
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Payment is required - no free upgrades
        if (data.error?.includes("Stripe not configured")) {
          setError("Payment system is not available. Please contact support or try again later.");
        } else {
          setError(data.error || "Failed to create checkout session. Please try again.");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Upgrade error:", err);
      setError(err.message || "Failed to start checkout. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="page fade-in">
        <div className="premium-status-card">
          <div className="premium-badge-large">✨ Premium</div>
          <h1>Payment Successful!</h1>
          <p>Your subscription is being activated. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="page fade-in">
        <div className="premium-status-card">
          <div className="premium-badge-large">✨ Premium</div>
          <h1>You're a Premium Member!</h1>
          <p>Thank you for supporting Coda. Enjoy all premium features:</p>
          <ul className="premium-features-list">
            <li>✅ AI Journal Analysis</li>
            <li>✅ AI Chat with Coda</li>
            <li>✅ Enhanced, detailed AI advice</li>
            <li>✅ Priority support</li>
          </ul>
          <Link href="/" className="btn primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="premium-page">
        <div className="premium-header">
          <div className="premium-logo">
            <DiamondLogo size={64} animated={true} />
          </div>
          <h1 className="premium-title">Upgrade to Premium</h1>
          <p className="premium-subtitle">Unlock the full power of Coda AI</p>
        </div>

        <div className="premium-comparison">
          <div className="plan-card free-plan">
            <h3>Free</h3>
            <div className="plan-price">$0<span>/month</span></div>
            <ul className="plan-features">
              <li>✅ Task management</li>
              <li>✅ Planning tools</li>
              <li>✅ Journal prompts</li>
              <li>✅ Basic AI tips</li>
              <li className="disabled">❌ AI Chat</li>
              <li className="disabled">❌ Journal Analysis</li>
              <li className="disabled">❌ Enhanced AI advice</li>
            </ul>
          </div>

          <div className="plan-card premium-plan featured">
            <div className="popular-badge">Most Popular</div>
            <h3>Premium</h3>
            <div className="plan-price">$9.99<span>/month</span></div>
            <ul className="plan-features">
              <li>✅ Everything in Free</li>
              <li>✅ AI Chat with Coda</li>
              <li>✅ Journal AI Analysis</li>
              <li>✅ Enhanced, detailed AI advice</li>
              <li>✅ Priority support</li>
              <li>✅ Advanced features</li>
            </ul>
            <button
              className="btn primary large"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <div className="premium-benefits">
          <h2>What you get with Premium</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💬</div>
              <h3>AI Chat</h3>
              <p>Get unlimited access to chat with Coda about anything - academics, relationships, personal growth, and more.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Journal Analysis</h3>
              <p>Deep AI analysis of your journal entries to discover patterns, insights, and personalized growth advice.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>Enhanced Advice</h3>
              <p>Receive more detailed, comprehensive AI guidance tailored specifically to your needs and goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

