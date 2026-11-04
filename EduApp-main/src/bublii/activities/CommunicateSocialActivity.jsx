import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const SOCIAL_SCENARIOS = [
  {
    id: 'soc-1',
    situation: 'Tu arrives à l’école et tu croises ton maître ou ta maîtresse. Que fais-tu ?',
    emoji: '🏫',
    correctId: 'bonjour',
    options: [
      { id: 'bonjour', label: 'Je dis « Bonjour ! » en souriant', emoji: '👋', isCorrect: true },
      { id: 'ignorer', label: 'Je passe sans rien dire', emoji: '🚶', isCorrect: false },
      { id: 'crier', label: 'Je crie très fort', emoji: '📢', isCorrect: false },
    ],
  },
  {
    id: 'soc-2',
    situation: 'Un copain joue avec le jeu de construction que tu aimerais essayer. Que fais-tu ?',
    emoji: '🧱',
    correctId: 'demander',
    options: [
      { id: 'demander', label: 'Je demande : « Est-ce qu’on peut jouer ensemble ? »', emoji: '🤝', isCorrect: true },
      { id: 'arracher', label: 'J’arrache les pièces de ses mains', emoji: '😠', isCorrect: false },
      { id: 'pleurer', label: 'Je me fâche tout seul dans mon coin', emoji: '😢', isCorrect: false },
    ],
  },
  {
    id: 'soc-3',
    situation: 'Tu as terminé de déjeuner à table. Que dis-tu avant de te lever ?',
    emoji: '🍽️',
    correctId: 'merci',
    options: [
      { id: 'merci', label: '« Merci pour le repas ! »', emoji: '🙏', isCorrect: true },
      { id: 'partir', label: 'Je pars en courant sans prévenir', emoji: '🏃', isCorrect: false },
      { id: 'jeter', label: 'Je pousse mon assiette par terre', emoji: '💥', isCorrect: false },
    ],
  },
];

export default function CommunicateSocialActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentScenario = SOCIAL_SCENARIOS[currentRound] || SOCIAL_SCENARIOS[0];

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    if (isAudioEnabled && !isFinished) {
      speakText(currentScenario.situation, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentScenario]);

  const handleSelectOption = (opt) => {
    if (selectedId !== null) return;
    setSelectedId(opt.id);
    setIsCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      speakText(`Exactement ! C'est la bonne attitude sociale !`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < SOCIAL_SCENARIOS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1600);
    } else {
      speakText(`Réfléchis à ce qui est le plus gentil et respectueux.`, isAudioEnabled);
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 1200);
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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#E84545]/30 shadow-xl">
        <div className="text-7xl mb-4">🤝</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#E84545] mb-2">
          Champion de la politesse !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu connais très bien les bonnes attitudes avec tes camarades.
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
          className="btn-tactile btn-tactile--communicate w-full text-lg cursor-pointer"
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
          Situation {currentRound + 1} / {SOCIAL_SCENARIOS.length}
        </span>
        <div className="flex gap-2">
          {SOCIAL_SCENARIOS.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentRound ? 'bg-[#E84545]' : i === currentRound ? 'bg-[#E84545] ring-4 ring-[#E84545]/20 scale-110' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Social Scenario Card */}
      <div className="bg-white rounded-3xl p-8 text-center border-3 border-[#E84545]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(232, 69, 69, 0.15)' }}>
        <div className="text-8xl my-3 select-none animate-bounce-short">
          {currentScenario.emoji}
        </div>
        <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-[#2D3748] max-w-lg mx-auto leading-snug">
          {currentScenario.situation}
        </h3>
      </div>

      {/* Choice Options */}
      <div className="space-y-3">
        {currentScenario.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let stateClass = 'card-choice';
          if (isSelected) {
            stateClass = isCorrect ? 'card-choice card-choice--correct' : 'card-choice card-choice--error';
          }

          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={selectedId !== null}
              onClick={() => handleSelectOption(opt)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full min-h-[72px] p-4 rounded-3xl flex items-center gap-4 text-left cursor-pointer ${stateClass}`}
            >
              <span className="text-4xl flex-shrink-0">{opt.emoji}</span>
              <span className="font-['Fredoka'] text-base sm:text-lg font-bold text-[#2D3748]">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

