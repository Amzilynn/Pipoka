import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import MovementPicture from '../components/MovementPicture';

// Real situational photos — child demonstrating each body part
const BODY_PARTS = [
  {
    id: 'head',
    name: 'La Tête',
    instruction: 'Touche le haut de ta tête',
    color: '#2A6FB5',
  },
  {
    id: 'shoulders',
    name: 'Les Épaules',
    instruction: 'Pose tes mains sur tes épaules',
    color: '#22A06B',
  },
  {
    id: 'hands',
    name: 'Les Mains',
    instruction: 'Ouvre grand tes mains',
    color: '#F5A623',
  },
  {
    id: 'knees',
    name: 'Les Genoux',
    instruction: 'Baisse-toi et touche tes genoux',
    color: '#E84545',
  },
];

export default function MoveBodyPartsActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentPart = BODY_PARTS[currentRound] || BODY_PARTS[0];

  useEffect(() => {
    setIsSuccessRound(false);
    setSelectedId(null);
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentPart.name}. ${currentPart.instruction}.`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentPart]);

  const handleConfirmAction = (partId) => {
    if (selectedId !== null) return;
    setSelectedId(partId);

    if (partId === currentPart.id) {
      setIsSuccessRound(true);
      speakText(`Bravo ! ${currentPart.name} !`, isAudioEnabled);

      setTimeout(() => {
        if (currentRound + 1 < BODY_PARTS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1400);
    } else {
      speakText('Essaie encore.', isAudioEnabled);
      setTimeout(() => setSelectedId(null), 800);
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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 border-4 border-[#22a06b] flex items-center justify-center text-4xl font-black text-[#22a06b]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-1">
            Bravo !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Tu connais bien toutes les parties de ton corps !
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-5xl">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>
        <button type="button" onClick={handleFinish} className="btn-tactile btn-tactile--move w-full text-xl cursor-pointer">
          Continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Partie {currentRound + 1} / {BODY_PARTS.length}
        </span>
        <div className="flex gap-2">
          {BODY_PARTS.map((_, i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < currentRound
                  ? 'bg-[#22a06b]'
                  : i === currentRound
                  ? 'bg-[#22a06b] ring-4 ring-[#22a06b]/20 scale-110'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main instruction card with real photo */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-md text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-slate-900">
            {currentPart.name}
          </h2>
          <TTSButton text={`${currentPart.name}. ${currentPart.instruction}`} />
        </div>

        <p className="text-base text-slate-600 font-bold">{currentPart.instruction}</p>

        <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
          <MovementPicture pose={currentPart.id} title={currentPart.instruction} bodyPart />
          <AnimatePresence>
            {isSuccessRound && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 right-2 bg-emerald-700 px-3 py-2 rounded-2xl"
              >
                <span className="font-['Fredoka'] text-xl font-black text-white">Bravo !</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tactile choice grid — real photos of each part */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BODY_PARTS.map((part) => {
          const isSelected = selectedId === part.id;
          const isCorrectSelected = isSelected && part.id === currentPart.id;
          const isWrongSelected = isSelected && part.id !== currentPart.id;

          return (
            <motion.button
              key={part.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleConfirmAction(part.id)}
              disabled={selectedId !== null}
              className={`min-h-[100px] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer border-3 transition-all ${
                isCorrectSelected
                  ? 'bg-emerald-50 border-[#22a06b] shadow-md'
                  : isWrongSelected
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-slate-200 hover:border-[#22a06b] hover:bg-emerald-50/30 shadow-xs'
              }`}
            >
              <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden border-2 border-slate-200">
                <MovementPicture pose={part.id} title={part.name} bodyPart />
              </div>
              <span className="font-['Fredoka'] text-sm font-bold text-slate-800 text-center leading-tight">
                {part.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
