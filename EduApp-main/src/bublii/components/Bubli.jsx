import React, { useId } from 'react';

/**
 * Bubli, the Bublii companion.
 * A soft, friendly character used to guide, encourage and celebrate.
 */
export default function Bubli({ size = 160, mood = 'happy', className = '', label }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bodyId = `bubli-body-${rawId}`;
  const bellyId = `bubli-belly-${rawId}`;
  const earId = `bubli-ear-${rawId}`;

  const celebrating = mood === 'celebrate';
  const calm = mood === 'calm';
  const thinking = mood === 'think';
  const waving = mood === 'wave';

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`bubli bubli--${mood} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A493FF" />
          <stop offset="55%" stopColor="#8172F0" />
          <stop offset="100%" stopColor="#6C5CE7" />
        </linearGradient>
        <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9EC" />
          <stop offset="100%" stopColor="#FFE9C7" />
        </linearGradient>
        <linearGradient id={earId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B6A9FF" />
          <stop offset="100%" stopColor="#8B7CF2" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="185" rx="54" ry="9" fill="#182139" opacity="0.09" />

      {/* Ears */}
      <circle cx="57" cy="61" r="21" fill={`url(#${earId})`} />
      <circle cx="143" cy="61" r="21" fill={`url(#${earId})`} />
      <circle cx="57" cy="61" r="10.5" fill="#D8D0FF" opacity="0.75" />
      <circle cx="143" cy="61" r="10.5" fill="#D8D0FF" opacity="0.75" />

      {/* Feet */}
      <ellipse cx="76" cy="173" rx="17" ry="9.5" fill="#5B4BCB" />
      <ellipse cx="124" cy="173" rx="17" ry="9.5" fill="#5B4BCB" />

      {/* Arms */}
      {celebrating ? (
        <>
          <path d="M46 117c-14-8-20-24-12-34" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <path d="M154 117c14-8 20-24 12-34" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <circle cx="33" cy="78" r="9" fill="#FFD9B8" />
          <circle cx="167" cy="78" r="9" fill="#FFD9B8" />
          <path d="M28 52l3 8 8 2-8 3-3 8-3-8-8-3 8-2Z" fill="#FFC94A" />
          <path d="M174 42l2.4 6.4 6.6 1.7-6.6 2.3-2.4 6.4-2.4-6.4-6.6-2.3 6.6-1.7Z" fill="#2FC48D" />
        </>
      ) : waving ? (
        <>
          <path d="M48 122c-13 5-19 15-19 27" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <path d="M152 111c10-12 14-27 8-39" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <circle cx="29" cy="154" r="9" fill="#FFD9B8" />
          <circle cx="162" cy="67" r="9" fill="#FFD9B8" />
        </>
      ) : thinking ? (
        <>
          <path d="M47 121c-12 4-18 13-19 24" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <path d="M150 124c9-2 15-8 17-16" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <circle cx="28" cy="150" r="9" fill="#FFD9B8" />
          <circle cx="168" cy="104" r="9" fill="#FFD9B8" />
        </>
      ) : (
        <>
          <path d="M47 121c-12 4-18 13-19 24" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <path d="M153 121c12 4 18 13 19 24" fill="none" stroke="#6C5CE7" strokeWidth="14" strokeLinecap="round" />
          <circle cx="28" cy="150" r="9" fill="#FFD9B8" />
          <circle cx="172" cy="150" r="9" fill="#FFD9B8" />
        </>
      )}

      {/* Body */}
      <path
        d="M100 37c36 0 62 26 62 65 0 40-27 64-62 64s-62-24-62-64c0-39 26-65 62-65Z"
        fill={`url(#${bodyId})`}
      />

      {/* Leaf */}
      <path d="M106 43c3-13 14-22 26-18 0 12-10 21-24 21Z" fill="#2FC48D" />
      <path d="M108 43c4-6 9-10 16-12" fill="none" stroke="#1E9E70" strokeWidth="2.2" strokeLinecap="round" />

      {/* Belly */}
      <ellipse cx="100" cy="137" rx="35" ry="29" fill={`url(#${bellyId})`} opacity="0.97" />
      <ellipse cx="100" cy="137" rx="35" ry="29" fill="none" stroke="#EBCF9F" strokeWidth="1.5" opacity="0.6" />

      {/* Cheeks */}
      <ellipse cx="63" cy="110" rx="8.5" ry="5" fill="#FF8FA3" opacity="0.55" />
      <ellipse cx="137" cy="110" rx="8.5" ry="5" fill="#FF8FA3" opacity="0.55" />

      {/* Eyes */}
      {calm ? (
        <>
          <path d="M69 91c4 4 9 6 14 6s10-2 14-6" fill="none" stroke="#342C63" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M103 91c4 4 9 6 14 6s10-2 14-6" fill="none" stroke="#342C63" strokeWidth="4.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="81" cy="92" rx="13.5" ry="15.5" fill="#fff" />
          <ellipse cx="119" cy="92" rx="13.5" ry="15.5" fill="#fff" />
          <circle cx={thinking ? 84 : 82.5} cy={thinking ? 88 : 94} r="6.4" fill="#332B63" />
          <circle cx={thinking ? 122 : 120.5} cy={thinking ? 88 : 94} r="6.4" fill="#332B63" />
          <circle cx={thinking ? 82 : 80} cy={thinking ? 86 : 92} r="2.1" fill="#fff" />
          <circle cx={thinking ? 120 : 118} cy={thinking ? 86 : 92} r="2.1" fill="#fff" />
        </>
      )}

      {/* Mouth */}
      {celebrating ? (
        <>
          <path d="M88 112c3 9 8 13 12 13s9-4 12-13Z" fill="#4A3480" />
          <path d="M96 121c2.5 2.5 5.5 2.5 8 0" fill="none" stroke="#FF8FA3" strokeWidth="2.6" strokeLinecap="round" />
        </>
      ) : thinking ? (
        <circle cx="100" cy="119" r="4" fill="#4A3480" opacity="0.85" />
      ) : (
        <path
          d={calm ? 'M92 116c3 2.6 5.6 3.8 8 3.8s5-1.2 8-3.8' : 'M88 114c3.6 6 8 9 12 9s8.4-3 12-9'}
          fill="none"
          stroke="#4A3480"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      )}

      {/* Whisker-like freckles for warmth */}
      <circle cx="74" cy="122" r="1.6" fill="#6C5CE7" opacity="0.35" />
      <circle cx="126" cy="122" r="1.6" fill="#6C5CE7" opacity="0.35" />
    </svg>
  );
}
