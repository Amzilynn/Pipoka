import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const DIRECTIONS = [
  { id: 'up', label: 'En haut !', emoji: '⬆️', hint: 'Lève les bras ou étire-toi vers le plafond !', arrowIcon: '▲' },
  { id: 'left', label: 'À gauche !', emoji: '⬅️', hint: 'Penche ton corps ou montre la gauche !', arrowIcon: '◀' },
  { id: 'right', label: 'À droite !', emoji: '➡️', hint: 'Penche ton corps ou montre la droite !', arrowIcon: '▶' },
  { id: 'down', label: 'En bas !', emoji: '⬇️', hint: 'Baisse-toi ou touche tes genoux !', arrowIcon: '▼' },
];

export default function MoveDirectionActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentDir = DIRECTIONS[currentRound] || DIRECTIONS[0];

  useEffect(() => {
    setIsSuccessRound(false);
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentDir.label} ${currentDir.hint}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentDir]);

  const handleTriggerDirection = (dirId) => {
    if (dirId === currentDir.id) {
      setIsSuccessRound(true);
      speakText(`Super direction ! C'était bien ${currentDir.label}`, isAudioEnabled);

      setTimeout(() => {
        if (currentRound + 1 < DIRECTIONS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Regarde bien la flèche. C'est ${currentDir.label}`, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Suivre les directions',
      module: 'move',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl">
        <div className="text-7xl mb-4">🧭</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-2">
          Sens de l'orientation au top !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as su reconnaître et suivre toutes les directions dans l'espace.
        </p>

        <div className="flex items-center justify-center gap-3 text-5xl mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-tactile btn-tactile--move w-full text-lg cursor-pointer"
        >
          Enregistrer ma victoire et continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border-2 border-slate-200 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-[#6B7A8C]">
          Direction {currentRound + 1} / {DIRECTIONS.length}
        </span>
        <div className="flex gap-2">
          {DIRECTIONS.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentRound ? 'bg-[#22a06b]' : i === currentRound ? 'bg-[#22a06b] ring-4 ring-[#22a06b]/20 scale-110' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Target Direction Display */}
      <div className="bg-white rounded-3xl p-8 text-center border-3 border-[#22a06b]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(34, 160, 107, 0.15)' }}>
        <span className="text-xs font-black uppercase tracking-wider text-[#22a06b] bg-[#E6FFFA] px-3.5 py-1 rounded-full inline-block mb-3">
          Orientation Spatiale
        </span>

        {/* Big Animated Direction Indicator */}
        <div className="text-8xl sm:text-9xl my-4 select-none animate-bounce-short">
          {currentDir.emoji}
        </div>

        <h3 className="font-['Fredoka'] text-3xl font-bold text-[#2D3748]">
          {currentDir.label}
        </h3>
        <p className="text-base text-[#6B7A8C] mt-1 font-semibold">
          {currentDir.hint}
        </p>
      </div>

      {/* 4 Direction Pad (Tactile D-Pad for Motor Orientation) */}
      <div className="max-w-xs mx-auto grid grid-cols-3 gap-3 p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-sm text-center">
        {/* Row 1: UP */}
        <div />
        <button
          type="button"
          onClick={() => handleTriggerDirection('up')}
          className="min-h-[64px] rounded-2xl bg-slate-100 hover:bg-[#22a06b] hover:text-white font-['Fredoka'] text-2xl font-bold border-2 border-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          aria-label="Direction Haut"
        >
          ▲
        </button>
        <div />

        {/* Row 2: LEFT, CENTER, RIGHT */}
        <button
          type="button"
          onClick={() => handleTriggerDirection('left')}
          className="min-h-[64px] rounded-2xl bg-slate-100 hover:bg-[#22a06b] hover:text-white font-['Fredoka'] text-2xl font-bold border-2 border-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          aria-label="Direction Gauche"
        >
          ◀
        </button>
        <div className="flex items-center justify-center text-xs font-bold text-[#6B7A8C]">
          Bouge !
        </div>
        <button
          type="button"
          onClick={() => handleTriggerDirection('right')}
          className="min-h-[64px] rounded-2xl bg-slate-100 hover:bg-[#22a06b] hover:text-white font-['Fredoka'] text-2xl font-bold border-2 border-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          aria-label="Direction Droite"
        >
          ▶
        </button>

        {/* Row 3: DOWN */}
        <div />
        <button
          type="button"
          onClick={() => handleTriggerDirection('down')}
          className="min-h-[64px] rounded-2xl bg-slate-100 hover:bg-[#22a06b] hover:text-white font-['Fredoka'] text-2xl font-bold border-2 border-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          aria-label="Direction Bas"
        >
          ▼
        </button>
        <div />
      </div>

      <p className="text-center text-xs font-bold text-[#6B7A8C]">
        Fais le geste dans la pièce et touche la bonne flèche sur la manette.
      </p>
    </div>
  );
}
