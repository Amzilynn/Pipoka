import React from 'react';

export default function Logo({ size = 'md', tone = 'ink', className = '' }) {
  const base = `${import.meta.env.BASE_URL}assets/brand/`;
  return (
    <span className={`bublii-logo bublii-logo--${size} bublii-logo--${tone} ${className}`} role="img" aria-label="Boblii">
      <img className="bublii-logo__mascot" src={`${base}boblii-mascot.png`} alt="" width="94" height="111" draggable="false" />
      <img className="bublii-logo__wordmark" src={`${base}boblii-wordmark.png`} alt="" width="311" height="118" draggable="false" />
    </span>
  );
}
