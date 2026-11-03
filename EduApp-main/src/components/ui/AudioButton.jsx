import React from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';

export default function AudioButton({ text, className = '', size = 40 }) {
  const { speak } = useSpeech();

  return (
    <motion.button
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => speak(text)}
      className={`inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text)] shadow-[var(--shadow-sm)] border-2 border-white/40 ${className}`}
      style={{ width: size, height: size }}
      title="Écouter / استمع"
      aria-label="Play audio"
    >
      <span style={{ fontSize: size * 0.45 }}>🔊</span>
    </motion.button>
  );
}
