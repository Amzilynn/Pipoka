import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Each step has a real photo, a short label, and a colour accent
const GESTURE_LIBRARY = {
  arms: {
    id: 'arms',
    label: 'Bras en haut',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
    color: '#22A06B',
  },
  clap: {
    id: 'clap',
    label: 'Applaudir',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
    color: '#F5A623',
  },
  head: {
    id: 'head',
    label: 'Mains sur la tête',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    color: '#2A6FB5',
  },
};

const SEQUENCES = [
  {
    id: 'seq-1',
    title: 'Rythme 1',
    steps: [GESTURE_LIBRARY.arms, GESTURE_LIBRARY.clap],
  },
  {
    id: 'seq-2',
    title: 'Rythme 2',
    steps: [GESTURE_LIBRARY.head, GESTURE_LIBRARY.clap, GESTURE_LIBRARY.arms],
  },
];

export default function MoveSequenceActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentSeqIndex, setCurrentSeqIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [flashId, setFlashId] = useState(null); // success flash
  const [isFinished, setIsFinished] = useState(false);

  const currentSeq = SEQUENCES[currentSeqIndex] || SEQUENCES[0];
  const targetStep = currentSeq.steps[currentStepIndex];

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`${targetStep.label}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentStepIndex, currentSeqIndex, isAudioEnabled, isFinished, targetStep]);

  const handleExecuteStep = (gestureId) => {
    if (gestureId === targetStep.id) {
      setFlashId(gestureId);
      speakText('Bravo !', isAudioEnabled);

      setTimeout(() => {
        setFlashId(null);
        if (currentStepIndex + 1 < currentSeq.steps.length) {
          setCurrentStepIndex((s) => s + 1);
        } else {
          setTimeout(() => {
            if (currentSeqIndex + 1 < SEQUENCES.length) {
              setCurrentSeqIndex((idx) => idx + 1);
              setCurrentStepIndex(0);
            } else {
              setIsFinished(true);
            }
          }, 600);
        }
      }, 900);
    } else {
      speakText('Essaie encore.', isAudioEnabled);
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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 border-4 border-[#22a06b] flex items-center justify-center text-4xl font-black text-[#22a06b]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-1">
            Bravo !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Tu as suivi toute la séquence !
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
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          {currentSeq.title}
        </span>
        <span className="text-xs font-black text-[#22a06b] bg-emerald-50 px-3 py-1 rounded-full border border-[#22a06b]/30">
          Geste {currentStepIndex + 1} / {currentSeq.steps.length}
        </span>
      </div>

      {/* Sequence Timeline — visual memory strip */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400 text-center mb-4">
          Mémorise la séquence
        </p>
        <div className="flex items-center justify-center gap-3">
          {currentSeq.steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <React.Fragment key={idx}>
                <div className={`flex flex-col items-center gap-1.5 transition-all ${isCurrent ? 'scale-110' : isDone ? 'opacity-50' : 'opacity-30'}`}>
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 ${isCurrent ? 'border-[#22a06b] shadow-lg ring-4 ring-[#22a06b]/20' : isDone ? 'border-emerald-400' : 'border-slate-200'}`}>
                    <img src={step.image} alt={step.label} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className={`font-['Fredoka'] text-xs font-bold ${isCurrent ? 'text-[#22a06b]' : 'text-slate-500'}`}>
                    {isDone ? '✓ Fait' : isCurrent ? '👉 À toi' : step.label}
                  </span>
                </div>
                {idx < currentSeq.steps.length - 1 && (
                  <span className="text-xl font-black text-slate-300 mb-4">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current target — big prominent instruction */}
      <div className="bg-white rounded-3xl p-5 border-3 border-[#22a06b]/40 shadow-md text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <h2 className="font-['Fredoka'] text-3xl font-black text-slate-900">
            {targetStep.label}
          </h2>
          <TTSButton text={targetStep.label} />
        </div>
        <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100">
          <img src={targetStep.image} alt={targetStep.label} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* Tactile answer buttons */}
      <div className="grid grid-cols-3 gap-3">
        {Object.values(GESTURE_LIBRARY).map((g) => {
          const isFlashing = flashId === g.id;
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => handleExecuteStep(g.id)}
              whileTap={{ scale: 0.95 }}
              className={`min-h-[88px] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer border-3 transition-all ${
                isFlashing
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                  : 'bg-white border-slate-200 hover:border-[#22a06b] hover:bg-emerald-50/40 shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-200">
                <img src={g.image} alt={g.label} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="font-['Fredoka'] text-xs font-bold text-slate-800 leading-tight text-center">
                {g.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
