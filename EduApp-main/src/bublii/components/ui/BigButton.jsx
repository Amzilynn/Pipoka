import React from 'react';

/**
 * BigButton — a large, accessible button component.
 * Used throughout Bublii for primary actions.
 * Colours can be set via variant prop or CSS custom properties.
 */
export function BigButton({ variant = 'primary', size = 'md', className = '', onClick, children, disabled }) {
  const sizeMap = {
    sm: 'min-height: 44px; padding: 0 16px; font-size: 0.875rem;',
    md: 'min-height: 50px; padding: 0 24px; font-size: 1rem;',
    lg: 'min-height: 56px; padding: 0 32px; font-size: 1.125rem;',
  };

  const variantStyles = {
    primary:
      'background: var(--module-learn); color: #FFFFFF;',
    secondary:
      'background: var(--module-communicate); color: #FFFFFF;',
    ghost: 'background: transparent; color: var(--ink); border: 1px solid var(--line);',
    outline:
      'background: var(--card); color: var(--ink); border: 1px solid var(--module-learn);',
  };

  const style = {
    ...(sizeMap[size] || sizeMap.md),
    ...(variantStyles[variant] || variantStyles.primary),
    margin: 0,
    width: '100%',
    ...(disabled && { opacity: 0.45, cursor: 'not-allowed' }),
  };

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled ? 'true' : 'false'}
      role="button"
    >
      {children}
    </button>
  );
}