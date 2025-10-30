"use client";
import { useEffect } from "react";
import Link from "next/link";
import { DiamondLogo } from "@/components/DiamondLogo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-content">
        <DiamondLogo size={80} animated={true} />
        <h1>Something went wrong!</h1>
        <h2>An error occurred</h2>
        <p>{error.message || "We're sorry, but something unexpected happened."}</p>
        <div className="error-actions">
          <button className="btn primary large" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn secondary large">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

