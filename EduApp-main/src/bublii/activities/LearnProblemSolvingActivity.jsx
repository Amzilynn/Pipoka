import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

const PROBLEM_ROUNDS = [
  {
    id: 'p-1',
    type: 'odd-one-out',
    question: 'Trouve l’intrus qui ne se mange pas !',
    instruction: 'Trois sont des fruits délicieux, mais un seul est un véhicule qui roule sur la route.',
    hint: 'Regarde bien les roues de la voiture !',
    options: [
      { id: 'apple', label: 'Pomme', emoji: '🍎', isOdd: false },
      { id: 'banana', label: 'Banane', emoji: '🍌', isOdd: false },
      { id: 'car', label: 'Voiture', emoji: '🚗', isOdd: true },
      { id: 'strawberry', label: 'Fraise', emoji: '🍓', isOdd: false },
    ],
  },
  {
    id: 'p-2',
    type: 'pattern',
    question: 'Quelle forme vient ensuite dans la suite ?',
    patternDisplay: ['⭐', '🔵', '⭐', '🔵', '❓'],
    instruction: 'Étoile, Rond, Étoile, Rond... que met-on après ?',
    hint: 'Après le rond bleu, c’est au tour de l’étoile dorée !',
    correctId: 'star',
    options: [
      { id: 'star', label: 'Étoile', emoji: '⭐', isCorrect: true },
      { id: 'circle', label: 'Rond', emoji: '🔵', isCorrect: false },
      { id: 'square', label: 'Carré', emoji: '🟩', isCorrect: false },
    ],
  },
  {
    id: 'p-3',
    type: 'odd-one-out',
    question: 'Quel animal ne nage pas dans l’eau ?',
    instruction: 'Trois animaux adorent nager dans l’océan, mais un seul vole dans le ciel.',
    hint: 'Le petit oiseau a des ailes pour voler dans les airs !',
    options: [
      { id: 'fish', label: 'Poisson', emoji: '🐟', isOdd: false },
      { id: 'whale', label: 'Baleine', emoji: '🐋', isOdd: false },
      { id: 'bird', label: 'Oiseau', emoji: '🐦', isOdd: true },
      { id: 'dolphin', label: 'Dauphin', emoji: '🐬', isOdd: false },
    ],
  },
];

export default function LearnProblemSolvingActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const allowedHints = childSettings?.hints ?? 2;

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentProblem = PROBLEM_ROUNDS[currentRound] || PROBLEM_ROUNDS[0];

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    setShowHint(false);
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentProblem.question} ${currentProblem.instruction}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentProblem]);

  const handleSelectOption = (opt) => {
    if (selectedId !== null) return;
    setSelectedId(opt.id);

    const correct = currentProblem.type === 'odd-one-out' ? opt.isOdd : opt.isCorrect;
    setIsCorrect(correct);

    if (correct) {
      speakText(`Bravo ! C'est la bonne réponse !`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < PROBLEM_ROUNDS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Essaie encore, tu peux trouver la solution !`, isAudioEnabled);
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleUseHint = () => {
    if (hintsUsed >= allowedHints) return;
    setHintsUsed((h) => h + 1);
    setShowHint(true);
    if (isAudioEnabled) {
      speakText(currentProblem.hint, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Résoudre un problème',
      module: 'learn',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-4 border-[#2A6FB5]/30 shadow-xl">
        <div className="text-8xl mb-4">🧩</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#2A6FB5] mb-2">
          As de la logique !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as résolu toutes les énigmes avec succès.
        </p>

        <div className="flex items-center justify-center gap-4 text-5xl mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-tactile btn-tactile--learn w-full text-xl cursor-pointer py-4"
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#6B7A8C]">
            Énigme {currentRound + 1} / {PROBLEM_ROUNDS.length}
          </span>
          <div className="flex gap-2 ml-2">
            {PROBLEM_ROUNDS.map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full ${
                  i < currentRound ? 'bg-[#2A6FB5]' : i === currentRound ? 'bg-[#2A6FB5] ring-4 ring-[#2A6FB5]/20 scale-110' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TTSButton text={`${currentProblem.question}. ${currentProblem.instruction}`} size="sm" />

          {allowedHints > 0 && (
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsUsed >= allowedHints || showHint}
              className={`min-h-[48px] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                hintsUsed < allowedHints && !showHint
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>💡 Indice</span>
            </button>
          )}
        </div>
      </div>

      {/* Problem Challenge Card */}
      <div
        className="bg-white rounded-3xl p-8 text-center border-4 border-[#2A6FB5]/30 shadow-md relative"
        style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(42, 111, 177, 0.15)' }}
      >
        <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-[#2D3748] mb-2 leading-snug">
          {currentProblem.question}
        </h3>
        <p className="text-sm font-bold text-[#6B7A8C] mb-4">
          {currentProblem.instruction}
        </p>

        {/* Pattern view if pattern type */}
        {currentProblem.type === 'pattern' && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-6 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
            {currentProblem.patternDisplay.map((sym, i) => (
              <span
                key={i}
                className={`text-4xl sm:text-5xl select-none ${
                  sym === '❓' ? 'w-14 h-14 rounded-2xl bg-[#EBF4FF] border-2 border-dashed border-[#2A6FB5] text-[#2A6FB5] flex items-center justify-center font-bold animate-pulse text-2xl' : ''
                }`}
              >
                {sym}
              </span>
            ))}
          </div>
        )}

        {/* Hint banner */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3.5 bg-amber-50 text-amber-900 rounded-2xl text-xs font-bold border-2 border-amber-200"
            >
              💡 {currentProblem.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {currentProblem.options.map((opt) => {
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`min-h-[96px] rounded-3xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer ${stateClass}`}
            >
              <span className="text-5xl select-none">{opt.emoji}</span>
              <span className="font-['Fredoka'] text-base font-bold text-[#2D3748]">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
