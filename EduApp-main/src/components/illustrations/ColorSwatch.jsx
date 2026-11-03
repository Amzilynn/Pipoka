import React from 'react';

/**
 * Inline SVG color swatch illustrations
 * Bold, rounded circles with shine effect
 */
function isLightColor(hex) {
  if (!hex) return false;
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 210;
}

export default function ColorSwatch({ color = '#FF4444', size = 80, label }) {
  const light = isLightColor(color);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Subtle shadow behind swatch for light colors */}
      {light && <circle cx="50" cy="50" r="46" fill="#E0E0E0" />}
      <circle cx="50" cy="50" r="44" fill={color} stroke={light ? '#AAAAAA' : '#2D2D2D'} strokeWidth={light ? '4' : '5.5'} />
      {/* Shine highlight — skip for light colors */}
      {!light && (
        <ellipse cx="34" cy="34" rx="14" ry="10" fill="rgba(255,255,255,0.40)" transform="rotate(-30 34 34)" />
      )}
      {/* Bottom shadow */}
      <ellipse cx="62" cy="68" rx="10" ry="7" fill="rgba(0,0,0,0.10)" />
    </svg>
  );
}
