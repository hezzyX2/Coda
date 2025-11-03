"use client";
import { useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export function GoogleSignIn({ onSuccess, onError }: { 
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      // Check if Google Sign-In is available
      if (!window.google?.accounts) {
        // Load Google Sign-In script
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(() => reject(new Error("Timeout loading Google Sign-In")), 10000);
        });
      }

      // Initialize Google Sign-In
      window.google!.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        callback: async (response: any) => {
          try {
            // Decode JWT token (simplified - in production, verify server-side)
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            // Import and use client-side signInWithGoogle
            const { signInWithGoogle } = await import("@/lib/auth");
            const result = await signInWithGoogle({
              email: payload.email,
              name: payload.name,
              googleId: payload.sub,
              profileImage: payload.picture,
            });

            if (result.success) {
              onSuccess?.();
              window.location.href = "/";
              window.location.reload();
            } else {
              onError?.(result.error || "Google sign-in failed");
            }
          } catch (err: any) {
            console.error("Google sign-in error:", err);
            onError?.(err.message || "Failed to sign in with Google");
          } finally {
            setLoading(false);
          }
        },
      });

      // Prompt user to sign in
      window.google!.accounts.id.prompt();
      setLoading(false);
    } catch (err: any) {
      console.error("Google Sign-In setup error:", err);
      onError?.("Failed to initialize Google Sign-In. Please use email sign-in instead.");
      setLoading(false);
    }
  }

  // Don't show button if not configured - fail gracefully
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <button
      type="button"
      className="btn google-sign-in"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: "8px" }}>
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.158 6.656 3.58 9 3.58z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </button>
  );
}

