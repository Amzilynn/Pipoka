import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  pulse = false,
  size = 'md',
  ...props
}) {
  const base = `
    inline-flex items-center justify-center gap-2 font-black
    cursor-pointer select-none border-0 outline-none
    transition-all duration-100 active:translate-y-1
    focus:outline-none focus:ring-4 focus:ring-blue-400/30
  `;

  const sizes = {
    sm: 'px-5 py-2.5 text-lg rounded-[20px]',
    md: 'px-8 py-3.5 text-xl rounded-[24px]',
    lg: 'px-10 py-5 text-2xl rounded-[32px]',
  };

  const variants = {
    primary: `bg-[var(--color-primary)] text-[var(--color-text)] border-b-4 border-black/10
              shadow-[var(--shadow-md)]
              active:border-b-0 active:translate-y-[4px]
              hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `bg-[var(--color-surface)] text-[var(--color-text)] border-b-4 border-black/5
                shadow-[var(--shadow-sm)]
                active:border-b-0 active:translate-y-[4px]
                hover:bg-[var(--color-surface-hover)] disabled:opacity-50`,
    danger: `bg-[var(--color-accent)] text-white border-b-4 border-black/15
             shadow-[var(--shadow-md)]
             hover:brightness-110 active:border-b-0 active:translate-y-[4px]`,
    ghost: `bg-transparent text-[var(--color-text)] hover:bg-black/5`,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${pulse && !disabled ? 'pulse-cta' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
