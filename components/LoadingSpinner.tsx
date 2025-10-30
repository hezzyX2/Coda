"use client";
import { DiamondLogo } from "./DiamondLogo";

export function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="loading-spinner-container">
      <DiamondLogo size={48} animated={true} />
      <p className="loading-text">{message}</p>
    </div>
  );
}

