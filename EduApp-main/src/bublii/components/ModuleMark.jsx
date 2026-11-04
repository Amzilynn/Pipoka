import React from 'react';

/**
 * Illustrated module marks. Each is a small scene rather than a generic icon,
 * which keeps the four universes visually distinct.
 */
export default function ModuleMark({ moduleId, size = 72, soft, color, className = '' }) {
  const palette = {
    apprendre: { main: color || '#3F8CFF', soft: soft || '#E8F1FF', deep: '#1B5BB5' },
    communiquer: { main: color || '#FF7A8A', soft: soft || '#FFE9ED', deep: '#B93E57' },
    bouger: { main: color || '#2FC48D', soft: soft || '#E2F9F0', deep: '#127A58' },
    grandir: { main: color || '#FF9F43', soft: soft || '#FFF1DE', deep: '#A45B06' },
  }[moduleId] || { main: '#6C5CE7', soft: '#EFECFF', deep: '#5646C9' };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`module-mark ${className}`}
      aria-hidden="true"
    >
      <rect width="120" height="120" rx="32" fill={palette.soft} />

      {moduleId === 'apprendre' && (
        <>
          <circle cx="94" cy="24" r="7" fill={palette.main} opacity="0.22" />
          <path d="M22 44c13-4 26-2 38 6 12-8 25-10 38-6v39c-13-4-26-2-38 6-12-8-25-10-38-6Z" fill="#fff" />
          <path d="M60 50v39" stroke={palette.main} strokeOpacity="0.25" strokeWidth="2" />
          <path d="M31 53c7-1 13 0 19 3M31 62c7-1 13 0 19 3M70 56c6-3 12-4 19-3M70 65c6-3 12-4 19-3" stroke={palette.main} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
          <circle cx="87" cy="32" r="13" fill={palette.main} />
          <text x="87" y="37" textAnchor="middle" fontFamily="Fredoka, Nunito, sans-serif" fontSize="15" fontWeight="600" fill="#fff">A</text>
          <path d="M30 32l2.4 6.2L39 41l-6.6 2.5L30 50l-2.4-6.5L21 41l6.6-2.8Z" fill="#FFC94A" />
          <path d="M35 86c3-3 6-4 9-3" stroke={palette.deep} strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {moduleId === 'communiquer' && (
        <>
          <path d="M28 34h50a13 13 0 0 1 13 13v15a13 13 0 0 1-13 13H52l-14 11v-11h-10a9 9 0 0 1-9-9V43a9 9 0 0 1 9-9Z" fill="#fff" />
          <path d="M96 56h2a9 9 0 0 1 9 9v10a9 9 0 0 1-9 9h-3v8l-10-8h-8" fill={palette.main} opacity="0.24" />
          <path d="M49 50c4-5 10-1 10 3 0 4-5 7-10 11-5-4-10-7-10-11 0-4 6-8 10-3Z" fill={palette.main} />
          <circle cx="35" cy="39" r="2.3" fill={palette.deep} opacity="0.3" />
          <circle cx="72" cy="89" r="4" fill={palette.main} opacity="0.35" />
          <path d="M86 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#FFC94A" />
        </>
      )}

      {moduleId === 'bouger' && (
        <>
          <path d="M18 70c8 4 12 10 13 19M102 54c-8-2-14-7-18-14" stroke={palette.main} strokeOpacity="0.28" strokeWidth="5" strokeLinecap="round" />
          <circle cx="22" cy="44" r="4" fill={palette.main} opacity="0.28" />
          <circle cx="98" cy="88" r="5" fill="#FFC94A" />
          <path d="M60 26l7.5 16 17.5 2.5-12.7 12.3 3 17.2L60 65.5 44.7 74l3-17.2L35 44.5 52.5 42Z" fill={palette.main} />
          <circle cx="54" cy="47" r="2.3" fill="#fff" />
          <circle cx="66" cy="47" r="2.3" fill="#fff" />
          <path d="M55 55c1.6 2.4 3.3 3.6 5 3.6s3.4-1.2 5-3.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="42" cy="95" rx="10" ry="4" fill={palette.deep} opacity="0.16" />
        </>
      )}

      {moduleId === 'grandir' && (
        <>
          <circle cx="88" cy="26" r="10" fill="#FFC94A" opacity="0.9" />
          <path d="M88 11v-4M88 45v-4M73 26h-4M107 26h-4M77 15l-3-3M99 37l3 3M99 15l3-3M77 37l-3 3" stroke="#FFC94A" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 62V39" stroke={palette.deep} strokeWidth="4" strokeLinecap="round" />
          <path d="M60 51C60 39 50 31 36 31c0 12 10 20 24 20Z" fill={palette.main} />
          <path d="M60 44c0-9 8-15 20-15 0 9-8 15-20 15Z" fill={palette.main} opacity="0.75" />
          <path d="M38 64h44l-5 30a6 6 0 0 1-6 5H49a6 6 0 0 1-6-5Z" fill="#fff" />
          <rect x="34" y="60" width="52" height="10" rx="5" fill={palette.main} opacity="0.2" />
          <path d="M50 79c4-3 9-3 13 0" stroke={palette.deep} strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
