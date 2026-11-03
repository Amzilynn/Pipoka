import React from 'react';

/**
 * Expressive cartoon-style person icons for the Alphabet activity family list.
 * Each icon has a distinct face, hair, and outfit to be recognizable to young children.
 */

export function MamanIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair (long, pink) */}
      <ellipse cx="40" cy="22" rx="18" ry="14" fill="#E91E8C" />
      <rect x="22" y="22" width="5" height="22" rx="2.5" fill="#E91E8C" />
      <rect x="53" y="22" width="5" height="22" rx="2.5" fill="#E91E8C" />
      <ellipse cx="40" cy="36" rx="5" ry="7" fill="#E91E8C" />
      {/* Face */}
      <circle cx="40" cy="26" r="14" fill="#FFCBA4" />
      {/* Eyes */}
      <ellipse cx="35" cy="24" rx="2.5" ry="3" fill="#2D2D2D" />
      <ellipse cx="45" cy="24" rx="2.5" ry="3" fill="#2D2D2D" />
      <circle cx="36" cy="23" r="1" fill="white" />
      <circle cx="46" cy="23" r="1" fill="white" />
      {/* Rosy cheeks */}
      <ellipse cx="32" cy="28" rx="3" ry="2" fill="#FFAACC" opacity="0.7" />
      <ellipse cx="48" cy="28" rx="3" ry="2" fill="#FFAACC" opacity="0.7" />
      {/* Smile */}
      <path d="M35 30 Q40 34 45 30" stroke="#C05" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Body (dress) */}
      <path d="M27 48 Q28 38 40 38 Q52 38 53 48 L58 72 H22 Z" fill="#F06292" />
      {/* Arms */}
      <ellipse cx="19" cy="54" rx="5" ry="9" fill="#F06292" transform="rotate(-15 19 54)" />
      <ellipse cx="61" cy="54" rx="5" ry="9" fill="#F06292" transform="rotate(15 61 54)" />
      {/* Hands */}
      <circle cx="17" cy="62" r="4" fill="#FFCBA4" />
      <circle cx="63" cy="62" r="4" fill="#FFCBA4" />
      {/* Heart on dress */}
      <path d="M37 54 Q37 50 40 52 Q43 50 43 54 L40 58 Z" fill="white" opacity="0.6" />
      {/* Hair bow */}
      <ellipse cx="33" cy="14" rx="5" ry="3" fill="#FF80B0" transform="rotate(-30 33 14)" />
      <ellipse cx="47" cy="14" rx="5" ry="3" fill="#FF80B0" transform="rotate(30 47 14)" />
      <circle cx="40" cy="15" r="3" fill="#FF4499" />
    </svg>
  );
}

export function PapaIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair (short, brown) */}
      <ellipse cx="40" cy="16" rx="16" ry="8" fill="#5D4037" />
      <rect x="24" y="16" width="32" height="8" fill="#5D4037" />
      {/* Face */}
      <circle cx="40" cy="26" r="14" fill="#FFCBA4" />
      {/* Eyebrows */}
      <path d="M33 20 Q36 18 38 20" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 20 Q44 18 47 20" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="35.5" cy="24" rx="2.5" ry="2.5" fill="#2D2D2D" />
      <ellipse cx="44.5" cy="24" rx="2.5" ry="2.5" fill="#2D2D2D" />
      <circle cx="36.5" cy="23" r="1" fill="white" />
      <circle cx="45.5" cy="23" r="1" fill="white" />
      {/* Cheeks */}
      <ellipse cx="31" cy="28" rx="3" ry="2" fill="#FFAAAA" opacity="0.5" />
      <ellipse cx="49" cy="28" rx="3" ry="2" fill="#FFAAAA" opacity="0.5" />
      {/* Smile / moustache */}
      <path d="M35 31 Q40 36 45 31" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Subtle moustache */}
      <path d="M36 30 Q38 28 40 30 Q42 28 44 30" fill="#795548" />
      {/* Body (shirt + tie) */}
      <rect x="24" y="39" width="32" height="32" rx="6" fill="#1565C0" />
      <path d="M40 39 L42 48 L40 54 L38 48 Z" fill="#D32F2F" />
      {/* Collar */}
      <path d="M33 39 L40 45 L47 39" fill="white" />
      {/* Arms */}
      <rect x="13" y="40" width="12" height="8" rx="4" fill="#1565C0" />
      <rect x="55" y="40" width="12" height="8" rx="4" fill="#1565C0" />
      {/* Hands */}
      <circle cx="17" cy="53" r="4" fill="#FFCBA4" />
      <circle cx="63" cy="53" r="4" fill="#FFCBA4" />
    </svg>
  );
}

export function FilleIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair (pigtails, golden) */}
      <ellipse cx="40" cy="18" rx="18" ry="11" fill="#FFB300" />
      {/* Pigtail left */}
      <ellipse cx="21" cy="22" rx="5" ry="10" fill="#FFB300" transform="rotate(-20 21 22)" />
      {/* Pigtail right */}
      <ellipse cx="59" cy="22" rx="5" ry="10" fill="#FFB300" transform="rotate(20 59 22)" />
      {/* Face */}
      <circle cx="40" cy="27" r="13" fill="#FFE0C2" />
      {/* Eyes (big, sparkly) */}
      <ellipse cx="35" cy="25" rx="3" ry="3.5" fill="#2D2D2D" />
      <ellipse cx="45" cy="25" rx="3" ry="3.5" fill="#2D2D2D" />
      <circle cx="36.5" cy="23.5" r="1.2" fill="white" />
      <circle cx="46.5" cy="23.5" r="1.2" fill="white" />
      {/* Eyelashes */}
      <line x1="34" y1="21" x2="33" y2="19" stroke="#2D2D2D" strokeWidth="1" />
      <line x1="35.5" y1="21" x2="35" y2="19" stroke="#2D2D2D" strokeWidth="1" />
      <line x1="44.5" y1="21" x2="44" y2="19" stroke="#2D2D2D" strokeWidth="1" />
      <line x1="46" y1="21" x2="47" y2="19" stroke="#2D2D2D" strokeWidth="1" />
      {/* Cheeks */}
      <ellipse cx="31" cy="29" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.8" />
      <ellipse cx="49" cy="29" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.8" />
      {/* Big smile */}
      <path d="M34 31 Q40 37 46 31" stroke="#C05" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Teeth */}
      <path d="M35.5 31.5 Q40 35.5 44.5 31.5" fill="white" />
      {/* Body (colorful dress) */}
      <path d="M28 48 Q29 39 40 39 Q51 39 52 48 L58 74 H22 Z" fill="#9C27B0" />
      {/* Dress star */}
      <text x="40" y="65" fontSize="14" textAnchor="middle">⭐</text>
      {/* Arms */}
      <ellipse cx="19" cy="52" rx="5" ry="9" fill="#9C27B0" transform="rotate(-10 19 52)" />
      <ellipse cx="61" cy="52" rx="5" ry="9" fill="#9C27B0" transform="rotate(10 61 52)" />
      <circle cx="16" cy="61" r="4" fill="#FFE0C2" />
      <circle cx="64" cy="61" r="4" fill="#FFE0C2" />
      {/* Hair ribbons */}
      <circle cx="21" cy="13" r="4" fill="#F44336" />
      <circle cx="59" cy="13" r="4" fill="#F44336" />
    </svg>
  );
}

export function GarconIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair (short, spiky, dark) */}
      <ellipse cx="40" cy="16" rx="15" ry="8" fill="#3E2723" />
      {/* Spikes */}
      <polygon points="30,16 32,8 34,16" fill="#3E2723" />
      <polygon points="37,14 40,6 43,14" fill="#3E2723" />
      <polygon points="46,16 48,8 50,16" fill="#3E2723" />
      {/* Face */}
      <circle cx="40" cy="27" r="13" fill="#FFCC99" />
      {/* Eyes (round, expressive) */}
      <ellipse cx="35.5" cy="25" rx="2.8" ry="2.8" fill="#2D2D2D" />
      <ellipse cx="44.5" cy="25" rx="2.8" ry="2.8" fill="#2D2D2D" />
      <circle cx="37" cy="24" r="1" fill="white" />
      <circle cx="46" cy="24" r="1" fill="white" />
      {/* Eyebrows (raised, expressive) */}
      <path d="M32.5 21 Q35.5 19 38.5 21" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M41.5 21 Q44.5 19 47.5 21" stroke="#3E2723" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <ellipse cx="31" cy="29" rx="3.5" ry="2" fill="#FFA07A" opacity="0.6" />
      <ellipse cx="49" cy="29"rx="3.5" ry="2" fill="#FFA07A" opacity="0.6" />
      {/* Big goofy smile */}
      <path d="M34 31 Q40 38 46 31" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M35.5 31.5 Q40 36.5 44.5 31.5" fill="white" />
      {/* Body (T-shirt) */}
      <rect x="25" y="39" width="30" height="32" rx="5" fill="#EF5350" />
      {/* T-shirt collar */}
      <path d="M33 39 Q40 46 47 39" fill="none" stroke="white" strokeWidth="2" />
      {/* Star on shirt */}
      <text x="40" y="60" fontSize="13" textAnchor="middle">⚡</text>
      {/* Arms */}
      <rect x="13" y="40" width="13" height="8" rx="4" fill="#EF5350" />
      <rect x="54" y="40" width="13" height="8" rx="4" fill="#EF5350" />
      <circle cx="16" cy="52" r="4" fill="#FFCC99" />
      <circle cx="64" cy="52" r="4" fill="#FFCC99" />
    </svg>
  );
}

export function AmiIcon({ size = 60 }) {
  // Two friends side by side, waving at each other
  return (
    <svg width={size} height={size} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Friend 1 - left (girl) */}
      {/* Hair */}
      <ellipse cx="24" cy="16" rx="13" ry="9" fill="#FFB300" />
      <ellipse cx="13" cy="20" rx="4" ry="8" fill="#FFB300" transform="rotate(-15 13 20)" />
      {/* Face */}
      <circle cx="24" cy="22" r="10" fill="#FFE0C2" />
      <ellipse cx="20" cy="21" rx="2" ry="2.2" fill="#2D2D2D" />
      <ellipse cx="28" cy="21" rx="2" ry="2.2" fill="#2D2D2D" />
      <circle cx="21" cy="20" r="0.8" fill="white" />
      <circle cx="29" cy="20" r="0.8" fill="white" />
      <ellipse cx="18" cy="24" rx="3" ry="1.5" fill="#FFB6C1" opacity="0.8" />
      <ellipse cx="30" cy="24" rx="3" ry="1.5" fill="#FFB6C1" opacity="0.8" />
      <path d="M21 26 Q24 29 27 26" stroke="#C05" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M16 42 Q17 32 24 32 Q31 32 32 42 L35 60 H13 Z" fill="#9C27B0" />
      {/* Waving arm (right, toward friend) */}
      <line x1="32" y1="35" x2="48" y2="25" stroke="#9C27B0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="49" cy="24" r="4" fill="#FFE0C2" />

      {/* Friend 2 - right (boy) */}
      {/* Hair */}
      <ellipse cx="76" cy="16" rx="13" ry="9" fill="#3E2723" />
      <ellipse cx="87" cy="20" rx="4" ry="8" fill="#3E2723" transform="rotate(15 87 20)" />
      {/* Face */}
      <circle cx="76" cy="22" r="10" fill="#FFCC99" />
      <ellipse cx="72" cy="21" rx="2" ry="2.2" fill="#2D2D2D" />
      <ellipse cx="80" cy="21" rx="2" ry="2.2" fill="#2D2D2D" />
      <circle cx="73" cy="20" r="0.8" fill="white" />
      <circle cx="81" cy="20" r="0.8" fill="white" />
      <ellipse cx="70" cy="24" rx="3" ry="1.5" fill="#FFA07A" opacity="0.6" />
      <ellipse cx="82" cy="24" rx="3" ry="1.5" fill="#FFA07A" opacity="0.6" />
      <path d="M73 26 Q76 30 79 26" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M68 42 Q69 32 76 32 Q83 32 84 42 L87 60 H65 Z" fill="#EF5350" />
      {/* Waving arm (left, toward friend) */}
      <line x1="68" y1="35" x2="52" y2="25" stroke="#EF5350" strokeWidth="5" strokeLinecap="round" />
      <circle cx="51" cy="24" r="4" fill="#FFCC99" />

      {/* Heart between them */}
      <path d="M50 18 Q50 14 53 16 Q56 14 56 18 L53 22 Z" fill="#FF4499" opacity="0.9" />
    </svg>
  );
}
