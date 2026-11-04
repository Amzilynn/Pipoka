import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Local illustrations matched to each action or item
const EVENING_STEPS = [
  {
    id: 'ranger',
    step: 1,
    title: 'Ranger ses jouets',
    text: 'Je range mes jeux.',
    image: '/assets/images/grow/ranger.svg',
  },
  {
    id: 'pyjama',
    step: 2,
    title: 'Mettre son pyjama',
    text: 'J\'enfile mon pyjama.',
    image: '/assets/images/grow/pyjama.svg',
  },
  {
    id: 'histoire',
    step: 3,
    title: 'L\'histoire du soir',
    text: 'J\'écoute une histoire calme.',
    image: '/assets/images/grow/histoire.svg',
  },
  {
    id: 'dodo',
    step: 4,
    title: 'Bonne nuit !',
    text: 'Je ferme les yeux et je m\'endors.',
    image: '/assets/images/grow/dodo.svg',
  },
];

export default function GrowEveningActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = EVENING_STEPS[currentStepIndex] || EVENING_STEPS[0];

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentStep.title}. ${currentStep.text}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentStepIndex, isAudioEnabled, isFinished, currentStep]);

  const handleNextStep = () => {
    speakText('Bravo !', isAudioEnabled);
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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#F5A623]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-50 border-4 border-[#F5A623] flex items-center justify-center text-4xl font-black text-[#F5A623]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#F5A623] mb-1">
            Bonne nuit !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Tu as bien fait ta routine du soir.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-5xl">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>
        <button type="button" onClick={handleFinish} className="btn-tactile btn-tactile--grow w-full text-xl cursor-pointer">
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
          Étape {currentStep.step} / {EVENING_STEPS.length}
        </span>
        <div className="flex items-center gap-2">
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

      {/* Main step card — big photo */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md">
        <div className="relative h-52 sm:h-64 bg-slate-100">
          <img
            src={currentStep.image}
            alt={currentStep.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-5">
            <p className="font-['Fredoka'] text-white text-2xl sm:text-3xl font-black drop-shadow">
              {currentStep.title}
            </p>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <p className="font-['Fredoka'] text-lg text-slate-800 font-bold leading-snug">
            {currentStep.text}
          </p>
          <TTSButton text={`${currentStep.title}. ${currentStep.text}`} />
        </div>
      </div>

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleNextStep}
        className="btn-tactile btn-tactile--grow w-full min-h-[64px] text-xl cursor-pointer flex items-center justify-center gap-3"
      >
        <span>C'est fait !</span>
        <span>✓</span>
      </button>

      {/* Visual sequence strip */}
      <div className="grid grid-cols-4 gap-2">
        {EVENING_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`rounded-xl overflow-hidden border-2 transition-all ${
              idx === currentStepIndex
                ? 'border-[#F5A623] shadow-xs ring-2 ring-[#F5A623]/30'
                : idx < currentStepIndex
                ? 'border-emerald-400 opacity-70'
                : 'border-slate-200 opacity-40'
            }`}
          >
            <div className="h-14 bg-slate-100">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="bg-white px-1.5 py-1 text-center">
              <span className="font-['Fredoka'] text-[10px] font-bold text-slate-700 leading-tight block truncate">
                {idx < currentStepIndex ? '✓ ' : ''}{step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
