import React from 'react';

function Mark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="bublii-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9E8CFF" />
          <stop offset="1" stopColor="#6C5CE7" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="19" fill="url(#bublii-logo-grad)" />
      <path d="M40 15c3.4-4.4 8.7-4.4 9.7-1.8 1.1 2.7-4.3 6.2-9.4 5.6Z" fill="#2FC48D" />
      <circle cx="22" cy="28" r="5.2" fill="#fff" />
      <circle cx="42" cy="28" r="5.2" fill="#fff" />
      <circle cx="22.8" cy="29" r="2.3" fill="#332B6B" />
      <circle cx="42.8" cy="29" r="2.3" fill="#332B6B" />
      <ellipse cx="17.5" cy="37" rx="3.4" ry="2.2" fill="#FF9AAE" opacity="0.65" />
      <ellipse cx="46.5" cy="37" rx="3.4" ry="2.2" fill="#FF9AAE" opacity="0.65" />
      <path d="M25 38c2.4 3.2 5.2 4.8 7 4.8s4.6-1.6 7-4.8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ size = 'md', tone = 'ink', className = '' }) {
  const markSize = size === 'lg' ? 46 : size === 'sm' ? 30 : 38;
  return (
    <span className={`bublii-logo bublii-logo--${size} bublii-logo--${tone} ${className}`}>
      <Mark size={markSize} />
      <span className="bublii-logo__word">bublii</span>
    </span>
  );
}
