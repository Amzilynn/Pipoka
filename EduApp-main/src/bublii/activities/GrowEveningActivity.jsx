import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const EVENING_STEPS = [
  { id: 'ranger', step: 1, title: 'Ranger ses jouets', emoji: '🧸', text: 'Je range mes jeux dans leurs bacs pour une chambre calme et propre.' },
  { id: 'pyjama', step: 2, title: 'Mettre son pyjama', emoji: '🩱', text: 'J’enfile mon pyjama tout doux et confortable.' },
  { id: 'histoire', step: 3, title: 'L’histoire du soir', emoji: '📖', text: 'J’écoute une histoire calme avec maman, papa ou tout seul.' },
  { id: 'dodo', step: 4, title: 'Éteindre et s’endormir', emoji: '😴', text: 'Je pose ma tête sur l’oreiller et je fais de doux rêves.' },
];

export default function GrowEveningActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = EVENING_STEPS[currentStepIndex] || EVENING_STEPS[0];

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`Étape ${currentStep.step} : ${currentStep.title}. ${currentStep.text}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentStepIndex, isAudioEnabled, isFinished, currentStep]);

  const handleNextStep = () => {
    speakText(`Bravo pour l'étape : ${currentStep.title} !`, isAudioEnabled);
    if (currentStepIndex + 1 < EVENING_STEPS.length) {
      setCurrentStepIndex((idx) => idx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Ma routine du soir',
      module: 'grow',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#F5A623]/30 shadow-xl">
        <div className="text-7xl mb-4">🌙</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#F5A623] mb-2">
          Bonne nuit et doux rêves !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as accompli toute ta routine du soir dans le calme.
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
          className="btn-tactile btn-tactile--grow w-full text-lg cursor-pointer"
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
          Étape {currentStep.step} sur {EVENING_STEPS.length}
        </span>
        <div className="flex gap-2">
          {EVENING_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i < currentStepIndex
                  ? 'bg-[#F5A623] text-white'
                  : i === currentStepIndex
                  ? 'bg-[#F5A623] text-white ring-4 ring-[#F5A623]/25 scale-110'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i < currentStepIndex ? '✓' : s.step}
            </span>
          ))}
        </div>
      </div>

      {/* Main Routine Stage */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-3 border-[#F5A623]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(245, 166, 35, 0.15)' }}>
        <span className="text-xs font-black uppercase tracking-wider text-[#F5A623] bg-[#FFFDF0] px-3.5 py-1 rounded-full inline-block mb-3">
          Rituel du soir & Apaisement
        </span>

        <div className="text-8xl sm:text-9xl my-4 select-none animate-bounce-short">
          {currentStep.emoji}
        </div>

        <h3 className="font-['Fredoka'] text-3xl font-bold text-[#2D3748] mb-2">
          {currentStep.title}
        </h3>

        <p className="text-base text-[#6B7A8C] max-w-md mx-auto font-semibold leading-relaxed mb-6">
          {currentStep.text}
        </p>

        <button
          type="button"
          onClick={handleNextStep}
          className="btn-tactile btn-tactile--grow w-full max-w-sm mx-auto text-lg cursor-pointer"
        >
          <span>J'ai fait cette étape !</span>
          <span>✓</span>
        </button>
      </div>

      {/* Steps Strip Preview */}
      <div className="grid grid-cols-4 gap-2">
        {EVENING_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`p-3 rounded-2xl border-2 text-center ${
              idx === currentStepIndex
                ? 'bg-[#FFFDF0] border-[#F5A623] shadow-xs'
                : 'bg-white border-slate-200 opacity-60'
            }`}
          >
            <span className="text-2xl block mb-1">{step.emoji}</span>
            <span className="font-['Fredoka'] text-[11px] font-bold text-[#2D3748] line-clamp-1">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

