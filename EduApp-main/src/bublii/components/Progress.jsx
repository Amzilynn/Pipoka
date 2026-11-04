import React from 'react';
import Icon from './Icon';

export function ProgressBar({ value = 0, max = 100, color, soft, height, label, showValue = false, valueLabel }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div className="progress-block">
      {(label || showValue) && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{valueLabel || `${Math.round(pct)} %`}</span>
        </div>
      )}
      <div
        className={`progress ${height === 'sm' ? 'progress--sm' : height === 'lg' ? 'progress--lg' : ''}`}
        style={{ background: soft || undefined, '--bar-color': color || 'var(--brand)' }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progression'}
      >
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value = 0, size = 86, stroke = 9, color = 'var(--brand)', track = '#eee7dc', children }) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 0.8, 0.32, 1)' }}
        />
      </svg>
      <div className="ring-center">{children ?? <><strong>{Math.round(pct)}%</strong><span>progression</span></>}</div>
      <span className="sr-only">Progression : {Math.round(pct)} %</span>
    </div>
  );
}

export function StarRating({ value = 0, max = 3, size = 18, className = '' }) {
  return (
    <span className={`stars ${className}`} role="img" aria-label={`${value} étoile${value > 1 ? 's' : ''} sur ${max}`} style={{ fontSize: size }}>
      {Array.from({ length: max }).map((_, index) => (
        <Icon key={index} name="star" size={size} filled className={index < value ? 'star-on' : 'star-off'} />
      ))}
    </span>
  );
}

export function LevelDots({ level = 1, max = 3, label = true }) {
  return (
    <span className="row gap-2" title={label ? `Niveau ${level} sur ${max}` : undefined}>
      <span className="level-dots" aria-hidden="true">
        {Array.from({ length: max }).map((_, index) => (
          <i key={index} className={index < level ? 'on' : ''} />
        ))}
      </span>
      {label && <span className="tiny muted strong">Niveau {level}</span>}
    </span>
  );
}
