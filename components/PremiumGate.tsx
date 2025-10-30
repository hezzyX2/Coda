"use client";
import Link from "next/link";
import { isPremium } from "@/lib/auth";
import { DiamondLogo } from "./DiamondLogo";

export function PremiumGate({ feature, children }: { feature: string; children: React.ReactNode }) {
  if (isPremium()) {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate">
      <div className="premium-gate-content">
        <DiamondLogo size={48} animated={true} />
        <h3>Premium Feature</h3>
        <p>{feature} is available for Premium members only.</p>
        <Link href="/premium" className="btn primary">
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}

