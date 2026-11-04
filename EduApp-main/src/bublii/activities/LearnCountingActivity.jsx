import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

const COUNTING_ROUNDS = [
  { id: 'apples', item: 'Pommes', emoji: '🍎', count: 3, choices: [2, 3, 4] },
  { id: 'stars', item: 'Étoiles', emoji: '⭐', count: 4, choices: [3, 4, 5] },
  { id: 'cats', item: 'Chats', emoji: '🐱', count: 2, choices: [1, 2, 3] },
  { id: 'balloons', item: 'Ballons', emoji: '🎈', count: 5, choices: [3, 4, 5] },
];

export default function LearnCountingActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const answerChoicesCount = childSettings?.answerChoices || 3;

  const [currentRound, setCurrentRound] = useState(0);
  const [countedIndices, setCountedIndices] = useState(new Set());
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = COUNTING_ROUNDS[currentRound] || COUNTING_ROUNDS[0];

  // Options dynamically adapted to childSettings.answerChoices
  const options = useMemo(() => {
    const correct = currentItem.count;
    const candidates = [1, 2, 3, 4, 5].filter((n) => n !== correct);
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, answerChoicesCount - 1);
    return [correct, ...distractors].sort((a, b) => a - b);
  }, [currentItem, answerChoicesCount]);

  useEffect(() => {
    setCountedIndices(new Set());
    setSelectedNumber(null);
    setIsCorrect(null);
    if (isAudioEnabled && !isFinished) {
      speakText(`Combien y a-t-il de ${currentItem.item} ? Touche chaque élément avec ton doigt pour compter.`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentItem]);

  const handleTapObject = (index) => {
    const nextSet = new Set(countedIndices);
    if (!nextSet.has(index)) {
      nextSet.add(index);
      setCountedIndices(nextSet);
      if (isAudioEnabled) {
        speakText(`${nextSet.size}`, isAudioEnabled);
      }
    }
  };

  const handleSelectNumber = (num) => {
    if (selectedNumber !== null) return;
    setSelectedNumber(num);
    const correct = num === currentItem.count;
    setIsCorrect(correct);

    if (correct) {
      speakText(`Bravo ! Il y a exactement ${currentItem.count} ${currentItem.item} !`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < COUNTING_ROUNDS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Ce n'est pas tout à fait ça. Recompte doucement !`, isAudioEnabled);
      setTimeout(() => {
        setSelectedNumber(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Compter des objets',
      module: 'learn',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-4 border-[#2A6FB5]/30 shadow-xl">
        <div className="text-8xl mb-4">🔢</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#2A6FB5] mb-2">
          Expert du calcul !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as compté tous les objets avec précision et patience.
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
            Défi {currentRound + 1} / {COUNTING_ROUNDS.length}
          </span>
          <div className="flex gap-2 ml-2">
            {COUNTING_ROUNDS.map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full ${
                  i < currentRound ? 'bg-[#2A6FB5]' : i === currentRound ? 'bg-[#2A6FB5] ring-4 ring-[#2A6FB5]/20 scale-110' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TTSButton
            text={`Combien y a-t-il de ${currentItem.item} ? Touche chaque image pour compter.`}
            size="sm"
          />
          <span className="text-xs font-black text-[#2A6FB5] bg-[#EBF4FF] px-3.5 py-1.5 rounded-full border border-[#2A6FB5]/30">
            {countedIndices.size} / {currentItem.count} touchés
          </span>
        </div>
      </div>

      {/* Counting Playground Card */}
      <div
        className="bg-white rounded-3xl p-8 text-center border-4 border-[#2A6FB5]/30 shadow-md relative"
        style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(42, 111, 177, 0.15)' }}
      >
        <h3 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748] mb-2">
          Touche chaque {currentItem.item.slice(0, -1)} pour compter :
        </h3>

        {/* Objects Area */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 my-6 min-h-[140px]">
          {Array.from({ length: currentItem.count }).map((_, idx) => {
            const isCounted = countedIndices.has(idx);

            return (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTapObject(idx)}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-6xl select-none transition-all cursor-pointer border-4 ${
                  isCounted
                    ? 'bg-[#EBF4FF] border-[#2A6FB5] shadow-md scale-105 ring-4 ring-[#2A6FB5]/20'
                    : 'bg-slate-50 border-slate-300 hover:border-[#2A6FB5]/60'
                }`}
              >
                <span>{currentItem.emoji}</span>
                {isCounted && (
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2A6FB5] text-white font-['Fredoka'] font-extrabold text-sm flex items-center justify-center shadow-sm">
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="text-sm font-bold text-[#6B7A8C]">
          Combien y en a-t-il au total ?
        </p>
      </div>

      {/* Number Choice Cards (Dictated by answerChoices) */}
      <div
        className={`grid gap-4 ${
          options.length === 2
            ? 'grid-cols-2'
            : options.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {options.map((num) => {
          const isSelected = selectedNumber === num;
          let stateClass = 'card-choice';
          if (isSelected) {
            stateClass = isCorrect ? 'card-choice card-choice--correct' : 'card-choice card-choice--error';
          }

          return (
            <motion.button
              key={num}
              type="button"
              disabled={selectedNumber !== null}
              onClick={() => handleSelectNumber(num)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`min-h-[80px] rounded-3xl font-['Fredoka'] text-3xl font-black flex items-center justify-center cursor-pointer ${stateClass}`}
            >
              <span>{num}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
