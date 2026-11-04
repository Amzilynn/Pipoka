import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Problem solving with real photography & clean visual logic — NO EMOJIS
const PROBLEM_ROUNDS = [
  {
    id: 'p-1',
    type: 'odd-one-out',
    question: 'Trouve l’intrus qui roule sur la route !',
    instruction: 'Trois sont des fruits à manger, mais un seul est un véhicule.',
    hint: 'Regarde les roues de la voiture !',
    options: [
      { id: 'apple', label: 'Pomme', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80', isOdd: false },
      { id: 'banana', label: 'Banane', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80', isOdd: false },
      { id: 'car', label: 'Voiture', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80', isOdd: true },
    ],
  },
  {
    id: 'p-2',
    type: 'odd-one-out',
    question: 'Quel animal nage dans l’eau ?',
    instruction: 'Deux animaux marchent sur terre, mais un seul nage dans l’océan.',
    hint: 'Le poisson a des nageoires pour nager !',
    options: [
      { id: 'cat', label: 'Chat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80', isOdd: false },
      { id: 'fish', label: 'Poisson', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=300&q=80', isOdd: true },
      { id: 'dog', label: 'Chien', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80', isOdd: false },
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
      speakText(`${currentProblem.question}. ${currentProblem.instruction}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentProblem]);

  const handleSelectOption = (opt) => {
    if (selectedId !== null) return;
    setSelectedId(opt.id);

    const correct = opt.isOdd;
    setIsCorrect(correct);

    if (correct) {
      speakText(`Bravo ! Tu as trouvé la bonne réponse !`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < PROBLEM_ROUNDS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Essaie encore, réfléchis bien !`, isAudioEnabled);
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
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#2A6FB5]/30 shadow-2xl space-y-6">
        <div className="text-8xl animate-bounce">⭐</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#2A6FB5]">
          Bravo champion !
        </h2>
        <p className="text-lg text-[#64748B] font-bold">
          Tu as résolu les énigmes avec succès !
        </p>

        <div className="flex items-center justify-center gap-4 text-6xl py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.2 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-tactile btn-tactile--learn w-full min-h-[64px] text-xl font-['Fredoka'] cursor-pointer shadow-lg"
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
            Énigme {currentRound + 1} sur {PROBLEM_ROUNDS.length}
          </span>
          <div className="flex gap-2">
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
              className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
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

      {/* Challenge Title */}
      <div className="bg-white rounded-[2.5rem] p-7 text-center border-4 border-[#2A6FB5]/30 shadow-md">
        <h3 className="font-['Fredoka'] text-3xl font-black text-[#1E293B] mb-2 leading-snug">
          {currentProblem.question}
        </h3>
        <p className="text-base font-bold text-[#64748B]">
          {currentProblem.instruction}
        </p>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-amber-50 text-amber-900 rounded-2xl text-sm font-bold border-2 border-amber-200"
            >
              💡 {currentProblem.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real Photographic Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {currentProblem.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let borderClass = 'border-slate-300 hover:border-[#2A6FB5]';
          if (isSelected) {
            borderClass = isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50';
          }

          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={selectedId !== null}
              onClick={() => handleSelectOption(opt)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-[2rem] border-4 text-center transition-all cursor-pointer shadow-md bg-white flex flex-col items-center justify-between gap-3 ${borderClass}`}
            >
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="font-['Fredoka'] text-2xl font-black text-[#1E293B]">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
