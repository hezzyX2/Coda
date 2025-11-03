"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { DiamondLogo } from "@/components/DiamondLogo";
import Link from "next/link";
import { logLoginEvent } from "@/lib/verification";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "verification">("credentials");
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Password is correct, now send verification code
        await sendVerificationCode();
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function sendVerificationCode() {
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStep("verification");
        setCodeSent(true);
        setLoading(false);
        setError("");
        
        // In development, show code in console
        if (data.devCode) {
          console.log(`[DEV] Your verification code: ${data.devCode}`);
          setError(`[DEV MODE] Check browser console for verification code: ${data.devCode}`);
        }
      } else {
        setError(data.error || "Failed to send verification code");
        setLoading(false);
      }
    } catch (err: any) {
      setError("Failed to send verification code. Please try again.");
      setLoading(false);
    }
  }

  async function handleVerificationSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/send-verification?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`);
      const data = await response.json();

      if (data.success) {
        logLoginEvent({
          id: crypto.randomUUID(),
          email: email.toLowerCase(),
          timestamp: new Date().toISOString(),
          type: "login_success",
          success: true,
        });

        // Small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Invalid verification code");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (step === "verification") {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="auth-brand-text">Cod</span>
              <DiamondLogo size={48} animated={true} />
              <span className="auth-brand-text">k</span>
            </div>
            <h1>Verify Your Email</h1>
            <p>We sent a 6-digit code to {email}</p>
          </div>

          <form className="auth-form" onSubmit={handleVerificationSubmit}>
            {error && (
              <div className="auth-error">{error}</div>
            )}

            {codeSent && !error && (
              <div style={{ 
                background: "rgba(88, 176, 140, 0.15)", 
                border: "1px solid var(--accent)", 
                borderRadius: "12px", 
                padding: "14px 18px", 
                color: "var(--accent)",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                ✓ Verification code sent! Check your email.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                className="input"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                disabled={loading}
                maxLength={6}
                style={{ textAlign: "center", fontSize: "24px", letterSpacing: "8px" }}
              />
              <small className="form-hint">
                Enter the 6-digit code from your email
              </small>
            </div>

            <button
              type="submit"
              className="btn primary large auth-submit"
              disabled={loading || !verificationCode || verificationCode.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => {
                setStep("credentials");
                setCodeSent(false);
                setVerificationCode("");
                setError("");
              }}
              disabled={loading}
              style={{ marginTop: "12px" }}
            >
              ← Back to Login
            </button>

            <button
              type="button"
              className="btn"
              onClick={sendVerificationCode}
              disabled={loading || codeSent}
              style={{ marginTop: "8px", fontSize: "14px" }}
            >
              Resend Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-brand-text">Cod</span>
            <DiamondLogo size={48} animated={true} />
            <span className="auth-brand-text">k</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form className="auth-form" onSubmit={handleCredentialsSubmit}>
          {error && (
            <div className="auth-error">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn primary large auth-submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
