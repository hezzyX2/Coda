"use client";
import { useEffect, useState } from "react";

export function DiamondLogo({ size = 40, animated = true }: { size?: number; animated?: boolean }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 16); // ~60fps for smooth spinning
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display: "inline-block",
        transform: animated ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center center"
      }}
      className="diamond-logo"
    >
      <defs>
        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b87f5" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff78b4" stopOpacity="1" />
          <stop offset="100%" stopColor="#7aa2ff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="diamondShadow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#9b87f5" floodOpacity="0.6" />
        </filter>
      </defs>
      
      {/* Main diamond shape */}
      <path
        d="M 50 10 L 85 50 L 50 90 L 15 50 Z"
        fill="url(#diamondGradient)"
        filter="url(#diamondShadow)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      
      {/* Shine effect */}
      <path
        d="M 50 10 L 70 35 L 50 50 Z"
        fill="url(#diamondShine)"
        opacity="0.7"
      />
      
      {/* Facet lines for depth */}
      <line x1="50" y1="10" x2="50" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="50" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="50" y1="50" x2="15" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="50" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      
      {/* Sparkle effects */}
      <circle cx="30" cy="25" r="2" fill="#fff" opacity="0.9" filter="url(#glow)" />
      <circle cx="70" cy="25" r="1.5" fill="#fff" opacity="0.8" filter="url(#glow)" />
      <circle cx="75" cy="70" r="2" fill="#fff" opacity="0.9" filter="url(#glow)" />
      <circle cx="25" cy="70" r="1.5" fill="#fff" opacity="0.8" filter="url(#glow)" />
    </svg>
  );
}

