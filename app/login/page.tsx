"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { DiamondLogo } from "@/components/DiamondLogo";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
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

        <form className="auth-form" onSubmit={handleSubmit}>
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

        <div className="auth-divider">
          <span>or</span>
        </div>

        <GoogleSignIn 
          onSuccess={() => {
            setLoading(false);
          }}
          onError={(error) => {
            setError(error);
            setLoading(false);
          }}
        />

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

