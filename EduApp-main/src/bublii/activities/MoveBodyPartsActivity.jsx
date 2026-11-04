import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const BODY_PARTS = [
  { id: 'head', name: 'La Tête', emoji: '🗣️', instruction: 'Touche le haut de ta tête avec les deux mains !', hint: 'Tout en haut de ton corps !' },
  { id: 'shoulders', name: 'Les Épaules', emoji: '💪', instruction: 'Pose tes mains sur tes deux épaules et fais des ronds !', hint: 'De chaque côté de ton cou !' },
  { id: 'hands', name: 'Les Mains', emoji: '👐', instruction: 'Ouvre grand tes mains et fais coucou !', hint: 'Au bout de tes bras !' },
  { id: 'knees', name: 'Les Genoux', emoji: '🦵', instruction: 'Baisse-toi et touche tes deux genoux !', hint: 'Au milieu de tes jambes !' },
];

export default function MoveBodyPartsActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentPart = BODY_PARTS[currentRound] || BODY_PARTS[0];

  useEffect(() => {
    setIsSuccessRound(false);
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentPart.name}. ${currentPart.instruction}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentPart]);

  const handleConfirmAction = (partId) => {
    if (partId === currentPart.id) {
      setIsSuccessRound(true);
      speakText(`Bravo ! Tu as bien bougé ${currentPart.name} !`, isAudioEnabled);

      setTimeout(() => {
        if (currentRound + 1 < BODY_PARTS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Regarde bien : nous cherchons ${currentPart.name}`, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Découvrir son corps',
      module: 'move',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl">
        <div className="text-7xl mb-4">🙌</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-2">
          Connaissance du corps au top !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu connais parfaitement toutes les parties de ton corps.
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
          Partie {currentRound + 1} / {BODY_PARTS.length}
        </span>
        <div className="flex gap-2">
          {BODY_PARTS.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentRound ? 'bg-[#22a06b]' : i === currentRound ? 'bg-[#22a06b] ring-4 ring-[#22a06b]/20 scale-110' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Target Body Part Display */}
      <div className="bg-white rounded-3xl p-8 text-center border-3 border-[#22a06b]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(34, 160, 107, 0.15)' }}>
        <span className="text-xs font-black uppercase tracking-wider text-[#22a06b] bg-[#E6FFFA] px-3.5 py-1 rounded-full inline-block mb-3">
          Schéma Corporel
        </span>

        <div className="text-8xl sm:text-9xl my-3 select-none animate-bounce-short">
          {currentPart.emoji}
        </div>

        <h3 className="font-['Fredoka'] text-3xl font-bold text-[#2D3748] mb-2">
          {currentPart.name}
        </h3>
        <p className="text-base text-[#6B7A8C] font-semibold max-w-md mx-auto leading-relaxed">
          {currentPart.instruction}
        </p>
      </div>

      {/* Choice Buttons Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BODY_PARTS.map((part) => {
          const isTarget = part.id === currentPart.id;

          return (
            <motion.button
              key={part.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleConfirmAction(part.id)}
              className="card-choice min-h-[96px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-4xl">{part.emoji}</span>
              <span className="font-['Fredoka'] text-sm sm:text-base font-bold text-[#2D3748]">
                {part.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs font-bold text-[#6B7A8C]">
        Touche la partie de ton corps demandée en vrai, puis valide sur l'écran.
      </p>
    </div>
  );
}

