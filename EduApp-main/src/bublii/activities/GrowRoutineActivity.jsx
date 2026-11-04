import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Local illustrations matched to each action or item
const ROUTINE_STEPS = [
  {
    id: 'step-toothpaste',
    stepNumber: 1,
    title: 'Le dentifrice',
    instruction: 'Dépose une petite noisette de dentifrice sur la brosse.',
    image: '/assets/images/grow/toothpaste.svg',
    actionText: 'J’ai mis le dentifrice ! ✨',
  },
  {
    id: 'step-brush',
    stepNumber: 2,
    title: 'Brosser les dents',
    instruction: 'Fais des petits ronds avec la brosse en haut et en bas.',
    image: '/assets/images/grow/brush.svg',
    actionText: 'Je frotte mes dents (Touche 3 fois)',
    needsClicks: 3,
  },
  {
    id: 'step-rinse',
    stepNumber: 3,
    title: 'Rincer la bouche',
    instruction: 'Prends un verre d’eau pour bien rincer la bouche.',
    image: '/assets/images/grow/rinse.svg',
    actionText: 'J’ai rincé ma bouche ! 💧',
  },
  {
    id: 'step-smile',
    stepNumber: 4,
    title: 'Beau sourire propre !',
    instruction: 'Tout est propre et bien rangé. Bravo pour ton autonomie !',
    image: '/assets/images/grow/smile.svg',
    actionText: 'Terminer la routine ⭐',
  },
];

export default function GrowRoutineActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [brushClicks, setBrushClicks] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = ROUTINE_STEPS[currentStepIndex] || ROUTINE_STEPS[0];

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentStep.title}. ${currentStep.instruction}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentStepIndex, isAudioEnabled, isFinished, currentStep]);

  const handleAdvanceStep = () => {
    if (currentStep.needsClicks && brushClicks + 1 < currentStep.needsClicks) {
      const next = brushClicks + 1;
      setBrushClicks(next);
      speakText(`Encore un peu !`, isAudioEnabled);
      return;
    }

    speakText(`Bravo ! Étape réussie !`, isAudioEnabled);

    if (currentStepIndex + 1 < ROUTINE_STEPS.length) {
      setCurrentStepIndex((i) => i + 1);
      setBrushClicks(0);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Je me brosse les dents',
      module: 'grow',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#F5A623]/30 shadow-2xl space-y-6">
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-md ring-4 ring-[#F5A623]/30">
          <img
            src="/assets/images/grow/smile.svg"
            alt="Sourire"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#F5A623]">
          Dents toutes propres !
        </h2>
        <p className="text-base text-[#64748B] font-bold">
          Tu as réussi toutes les étapes comme un grand !
        </p>

        <div className="flex items-center justify-center gap-4 text-5xl py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-tactile btn-tactile--grow w-full min-h-[64px] text-xl font-['Fredoka'] cursor-pointer shadow-lg"
        >
          Continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border-3 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-[#1E293B]">
            Étape {currentStepIndex + 1} sur {ROUTINE_STEPS.length}
          </span>
          <div className="flex gap-2">
            {ROUTINE_STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i < currentStepIndex
                    ? 'bg-[#F5A623]'
                    : i === currentStepIndex
                    ? 'bg-[#F5A623] ring-4 ring-[#F5A623]/25 scale-110'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <TTSButton text={`${currentStep.title}. ${currentStep.instruction}`} size="sm" />
      </div>

      {/* Real Photo Card */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 text-center border-4 border-[#F5A623]/30 shadow-md">
        <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white mb-4 bg-slate-100">
          <img
            src={currentStep.image}
            alt={currentStep.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <h3 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#1E293B]">
            {currentStep.title}
          </h3>
          <TTSButton text={currentStep.instruction} size="sm" />
        </div>

        {currentStep.needsClicks && (
          <div className="flex justify-center gap-2 my-2">
            {Array.from({ length: currentStep.needsClicks }).map((_, idx) => (
              <span
                key={idx}
                className={`w-4 h-4 rounded-full transition-all ${
                  idx < brushClicks ? 'bg-[#F5A623] scale-115' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Large 3D Tactile Action Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleAdvanceStep}
          className="btn-tactile btn-tactile--grow w-full min-h-[68px] text-xl font-['Fredoka'] cursor-pointer shadow-xl flex items-center justify-center gap-3"
        >
          <span>{currentStep.actionText}</span>
        </button>
      </div>
    </div>
  );
}
