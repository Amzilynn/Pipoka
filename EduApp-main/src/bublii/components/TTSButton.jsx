import React, { useState } from 'react';
import { speakText } from '../utils/speech';

export default function TTSButton({
  text,
  className = '',
  size = 'md',
  label = 'Écouter',
  variant = 'default', // 'default' | 'pill' | 'minimal' | 'card'
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakText(text, true, () => {
      setIsPlaying(false);
    });
    // Fallback timer in case onend doesn't trigger
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const sizeClasses =
    size === 'lg'
      ? 'min-h-[56px] min-w-[56px] text-2xl p-3'
      : size === 'sm'
      ? 'min-h-[44px] min-w-[44px] text-lg p-2'
      : 'min-h-[48px] min-w-[48px] text-xl p-2.5';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`min-h-[48px] px-4 py-2 rounded-2xl bg-[#EBF4FF] hover:bg-[#2A6FB5] text-[#2A6FB5] hover:text-white border-2 border-[#2A6FB5]/30 font-['Fredoka'] text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${className}`}
        aria-label={`Écouter : ${text}`}
      >
        <span className={isPlaying ? 'animate-bounce text-xl' : 'text-xl'}>🔊</span>
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-3 rounded-2xl bg-white/90 hover:bg-white text-[#2A6FB5] border-2 border-[#2A6FB5]/30 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${className}`}
        aria-label={`Écouter : ${text}`}
        title="Écouter à voix haute"
      >
        <span className={`text-2xl ${isPlaying ? 'animate-bounce' : ''}`}>🔊</span>
        <span className="font-['Fredoka'] text-xs font-bold">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-2xl bg-white hover:bg-[#EBF4FF] text-[#2A6FB5] border-2 border-slate-300 hover:border-[#2A6FB5] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${sizeClasses} ${className}`}
      aria-label={`Écouter la consigne : ${text}`}
      title="Écouter à voix haute"
    >
      <span className={isPlaying ? 'scale-125 transition-transform' : ''}>
        🔊
      </span>
    </button>
  );
}
