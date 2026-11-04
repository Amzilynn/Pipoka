import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import { SocialScene } from '../components/CommunicationScenes';

// Consistent characters and settings make each action easy to compare.
const SOCIAL_SCENARIOS = [
  {
    id: 'soc-1',
    situation: 'Tu arrives à l\'école. Tu croises ton maître.',
    question: 'Que fais-tu ?',
    color: '#E84545',
    options: [
      {
        id: 'bonjour',
        label: 'Je dis Bonjour !',
        isCorrect: true,
      },
      {
        id: 'ignorer',
        label: 'Je passe sans rien dire',
        isCorrect: false,
      },
    ],
  },
  {
    id: 'soc-2',
    situation: 'Un copain joue avec un jeu que tu veux.',
    question: 'Que fais-tu ?',
    color: '#E84545',
    options: [
      {
        id: 'demander',
        label: 'Je lui demande poliment',
        isCorrect: true,
      },
      {
        id: 'arracher',
        label: 'Je lui prends sans demander',
        isCorrect: false,
      },
    ],
  },
  {
    id: 'soc-3',
    situation: 'Tu as fini de manger. Tu vas te lever.',
    question: 'Que dis-tu ?',
    color: '#E84545',
    options: [
      {
        id: 'merci',
        label: 'Merci pour le repas !',
        isCorrect: true,
      },
      {
        id: 'partir',
        label: 'Je pars sans rien dire',
        isCorrect: false,
      },
    ],
  },
];

export default function CommunicateSocialActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = SOCIAL_SCENARIOS[currentRound] || SOCIAL_SCENARIOS[0];

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    if (isAudioEnabled && !isFinished) {
      speakText(`${scenario.situation} ${scenario.question}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, scenario]);

  const handleSelectOption = (opt) => {
    if (selectedId !== null) return;
    setSelectedId(opt.id);
    setIsCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      speakText('Bravo ! C\'est la bonne attitude !', isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < SOCIAL_SCENARIOS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText('Essaie encore.', isAudioEnabled);
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 1100);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Situations sociales',
      module: 'communicate',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#E84545]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-rose-50 border-4 border-[#E84545] flex items-center justify-center text-4xl font-black text-[#E84545]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#E84545] mb-1">
            Bravo !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Tu connais les bonnes attitudes !
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-5xl">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>
        <button type="button" onClick={handleFinish} className="btn-tactile btn-tactile--communicate w-full text-xl cursor-pointer">
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
          Situation {currentRound + 1} / {SOCIAL_SCENARIOS.length}
        </span>
        <div className="flex gap-2">
          {SOCIAL_SCENARIOS.map((_, i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < currentRound
                  ? 'bg-[#E84545]'
                  : i === currentRound
                  ? 'bg-[#E84545] ring-4 ring-[#E84545]/20 scale-110'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scenario image + question */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md">
        <div className="h-56 sm:h-72">
          <SocialScene scenario={scenario.id} description={scenario.situation} />
        </div>
        <p className="px-5 pt-4 font-['Fredoka'] text-xl sm:text-2xl font-black leading-snug text-slate-900">
          {scenario.situation}
        </p>

        <div className="p-4 flex items-center justify-between gap-3">
          <p className="font-['Fredoka'] text-xl font-bold text-slate-900">{scenario.question}</p>
          <TTSButton text={`${scenario.situation} ${scenario.question}`} />
        </div>
      </div>

      {/* Answer choices with real photos */}
      <div className="grid grid-cols-2 gap-4">
        {scenario.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrectSelected = isSelected && opt.isCorrect;
          const isWrongSelected = isSelected && !opt.isCorrect;

          return (
            <motion.button
              key={opt.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectOption(opt)}
              disabled={selectedId !== null}
              aria-label={opt.label}
              aria-pressed={isSelected}
              className={`rounded-2xl overflow-hidden border-3 cursor-pointer transition-all shadow-xs ${
                isCorrectSelected
                  ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-md'
                  : isWrongSelected
                  ? 'border-rose-400 ring-4 ring-rose-100 opacity-70'
                  : 'border-slate-200 hover:border-[#E84545]/50 hover:shadow-md'
              }`}
            >
              <div className="h-40 sm:h-48 bg-slate-100">
                <SocialScene scenario={scenario.id} action={opt.id} description={opt.label} />
              </div>
              <div className={`px-3 py-3 text-center ${isCorrectSelected ? 'bg-emerald-50' : isWrongSelected ? 'bg-rose-50' : 'bg-white'}`}>
                <span className="font-['Fredoka'] text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {isCorrectSelected && '✓ '}
                  {opt.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
