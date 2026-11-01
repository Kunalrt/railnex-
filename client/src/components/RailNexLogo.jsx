import React from "react";

export default function RailNexLogo({ size = 48, className = "", animated = false }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-lg ${animated ? "animate-pulse" : ""}`}
      >
        <defs>
          {/* Outer Badge Gradient */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a" />
            <stop offset="50%" stop-color="#2563eb" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>

          {/* Locomotive Body Gradient */}
          <linearGradient id="trainBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#cbd5e1" />
          </linearGradient>

          {/* Vande Bharat Saffron Stripe */}
          <linearGradient id="saffronStripe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ea580c" />
            <stop offset="50%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#fbbf24" />
          </linearGradient>

          {/* Glowing Headlight Filter */}
          <filter id="headlightGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Rounded Squircle Frame */}
        <rect x="4" y="4" width="92" height="92" rx="24" fill="url(#shieldGrad)" />
        <rect x="4" y="4" width="92" height="92" rx="24" stroke="rgba(255,255,255,0.25)" stroke-width="2" />

        {/* Dynamic Speed Rays */}
        <line x1="8" y1="28" x2="20" y2="28" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.6" />
        <line x1="8" y1="50" x2="16" y2="50" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.4" />
        <line x1="8" y1="72" x2="22" y2="72" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.7" />

        {/* Aerodynamic Bullet Train Locomotive */}
        <g transform="translate(18, 14)">
          {/* Main Cabin */}
          <path
            d="M 12 10 C 12 2, 52 2, 52 10 L 56 48 C 56 56, 48 62, 40 62 L 24 62 C 16 62, 8 56, 8 48 Z"
            fill="url(#trainBodyGrad)"
          />

          {/* Panoramic Tinted Windshield */}
          <path
            d="M 16 12 C 16 6, 48 6, 48 12 L 50 26 C 50 30, 46 32, 40 32 L 24 32 C 18 32, 14 30, 14 26 Z"
            fill="#0f172a"
          />
          <path
            d="M 18 15 C 18 10, 46 10, 46 15 L 48 24 C 48 27, 44 28, 40 28 L 24 28 C 20 28, 16 27, 16 24 Z"
            fill="#1e293b"
          />
          <line x1="32" y1="12" x2="32" y2="30" stroke="#38bdf8" stroke-width="1.5" opacity="0.7" />

          {/* Saffron Speed Wing Stripe */}
          <rect x="10" y="34" width="44" height="5" rx="2" fill="url(#saffronStripe)" />

          {/* High-Beam LED Projector Headlights */}
          <circle cx="18" cy="46" r="3.5" fill="#fef08a" filter="url(#headlightGlow)" />
          <circle cx="18" cy="46" r="2" fill="#ffffff" />

          <circle cx="46" cy="46" r="3.5" fill="#fef08a" filter="url(#headlightGlow)" />
          <circle cx="46" cy="46" r="2" fill="#ffffff" />

          {/* Center Grille */}
          <rect x="27" y="44" width="10" height="4" rx="1.5" fill="#1e293b" />

          {/* Railway Tracks */}
          <path d="M 4 70 L 20 64 L 24 64 L 8 70 Z" fill="#94a3b8" />
          <path d="M 60 70 L 44 64 L 40 64 L 56 70 Z" fill="#94a3b8" />
          <line x1="12" y1="67" x2="52" y2="67" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />
        </g>
      </svg>
    </div>
  );
}
