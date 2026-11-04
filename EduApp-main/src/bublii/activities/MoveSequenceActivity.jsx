import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const SEQUENCES = [
  {
    id: 'seq-1',
    title: 'Séquence Rythme 1',
    steps: [
      { id: 'arms', label: 'Bras en l’air', emoji: '🙌' },
      { id: 'clap', label: 'Tape dans les mains', emoji: '👏' },
    ],
  },
  {
    id: 'seq-2',
    title: 'Séquence Rythme 2',
    steps: [
      { id: 'head', label: 'Mains sur la tête', emoji: '🙆' },
      { id: 'clap', label: 'Tape dans les mains', emoji: '👏' },
      { id: 'arms', label: 'Bras en l’air', emoji: '🙌' },
    ],
  },
];

export default function MoveSequenceActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentSeqIndex, setCurrentSeqIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentSeq = SEQUENCES[currentSeqIndex] || SEQUENCES[0];
  const targetStep = currentSeq.steps[currentStepIndex];

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`Étape ${currentStepIndex + 1} de la séquence : ${targetStep.label}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentStepIndex, currentSeqIndex, isAudioEnabled, isFinished, targetStep]);

  const handleExecuteStep = (stepId) => {
    if (stepId === targetStep.id) {
      speakText(`Bravo ! ${targetStep.label} fait !`, isAudioEnabled);

      if (currentStepIndex + 1 < currentSeq.steps.length) {
        setCurrentStepIndex((s) => s + 1);
      } else {
        // Sequence completed
        setTimeout(() => {
          if (currentSeqIndex + 1 < SEQUENCES.length) {
            setCurrentSeqIndex((idx) => idx + 1);
            setCurrentStepIndex(0);
          } else {
            setIsFinished(true);
          }
        }, 1200);
      }
    } else {
      speakText(`Regarde bien l'étape demandée : ${targetStep.label}`, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Reproduire une séquence',
      module: 'move',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl">
        <div className="text-7xl mb-4">🎶</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-2">
          Séquence réussie avec brio !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as su mémoriser et enchaîner les gestes avec un super rythme.
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
          Séquence {currentSeqIndex + 1} sur {SEQUENCES.length}
        </span>
        <span className="text-xs font-extrabold text-[#22a06b] bg-[#E6FFFA] px-3 py-1 rounded-full">
          Geste {currentStepIndex + 1} / {currentSeq.steps.length}
        </span>
      </div>

      {/* Sequence Timeline Display */}
      <div className="bg-white rounded-3xl p-8 text-center border-3 border-[#22a06b]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(34, 160, 107, 0.15)' }}>
        <h3 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748] mb-6">
          Enchaîne les gestes dans l'ordre :
        </h3>

        {/* Visual Sequence Strip */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-4">
          {currentSeq.steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <React.Fragment key={idx}>
                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-3xl border-3 transition-all ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-400 opacity-60'
                      : isCurrent
                      ? 'bg-[#E6FFFA] border-[#22a06b] scale-110 shadow-md ring-4 ring-[#22a06b]/20'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl mb-1">{step.emoji}</span>
                  <span className="font-['Fredoka'] text-xs sm:text-sm font-bold text-[#2D3748]">
                    {step.label}
                  </span>
                  {isDone && <span className="text-emerald-600 font-extrabold text-xs mt-1">✓ Fait</span>}
                  {isCurrent && <span className="text-[#22a06b] font-black text-xs mt-1 animate-pulse">À toi !</span>}
                </div>

                {idx < currentSeq.steps.length - 1 && (
                  <span className="text-2xl font-black text-slate-300">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tactile Gestures Action Strip */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm text-center">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#6B7A8C] mb-4">
          Touche le geste que tu viens de faire :
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'arms', label: 'Bras en l’air', emoji: '🙌' },
            { id: 'clap', label: 'Applaudir', emoji: '👏' },
            { id: 'head', label: 'Mains sur la tête', emoji: '🙆' },
          ].map((g) => (
            <motion.button
              key={g.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleExecuteStep(g.id)}
              className="card-choice min-h-[90px] p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="text-4xl">{g.emoji}</span>
              <span className="font-['Fredoka'] text-sm font-bold text-[#2D3748]">{g.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

