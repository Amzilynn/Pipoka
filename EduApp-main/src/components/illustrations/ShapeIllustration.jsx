import React from 'react';

/**
 * Inline SVG shape illustrations for Level 4 activities
 * Friendly, rounded, cartoon-style shapes with personalities
 */
export default function ShapeIllustration({ shapeId = 'shape-cercle', size = 80 }) {
  const s = size;
  const stroke = "#2D2D2D";
  const strokeW = 4;

  const Face = () => (
    <>
      <circle cx="35" cy="45" r="4" fill={stroke} />
      <circle cx="65" cy="45" r="4" fill={stroke} />
      <path d="M 40 60 Q 50 68 60 60" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );

  switch (shapeId) {
    case 'shape-cercle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#FFD93D" stroke={stroke} strokeWidth={strokeW} />
          <Face />
        </svg>
      );
    case 'shape-rectangle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="10" y="25" width="80" height="50" rx="10" fill="#6BCB77" stroke={stroke} strokeWidth={strokeW} />
          <Face />
        </svg>
      );
    case 'shape-triangle':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <path d="M 50 10 L 90 85 L 10 85 Z" fill="#FF6B6B" stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          <g transform="translate(0, 10)">
            <Face />
          </g>
        </svg>
      );
    case 'shape-carre':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <rect x="15" y="15" width="70" height="70" rx="12" fill="#4D96FF" stroke={stroke} strokeWidth={strokeW} />
          <Face />
        </svg>
      );
    default:
      return <span>❓</span>;
  }
}
