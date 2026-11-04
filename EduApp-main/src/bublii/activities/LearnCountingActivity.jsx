import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Real photographic counting objects — NO EMOJIS
const COUNTING_ROUNDS = [
  {
    id: 'apples',
    item: 'Pommes rouges',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    count: 3,
  },
  {
    id: 'oranges',
    item: 'Balles',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=300&q=80',
    count: 4,
  },
  {
    id: 'stars',
    item: 'Petits chats',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
    count: 2,
  },
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
      speakText(`Combien y a-t-il de ${currentItem.item} ? Touche chaque photo pour compter.`, isAudioEnabled);
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
      speakText(`Bravo ! Il y en a bien ${currentItem.count} !`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < COUNTING_ROUNDS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Essaie encore, recompte doucement !`, isAudioEnabled);
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
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#2A6FB5]/30 shadow-2xl space-y-6">
        <div className="text-8xl animate-bounce">⭐</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#2A6FB5]">
          Bravo champion !
        </h2>
        <p className="text-lg text-[#64748B] font-bold">
          Tu as compté tous les objets avec succès !
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
            Étape {currentRound + 1} sur {COUNTING_ROUNDS.length}
          </span>
          <div className="flex gap-2">
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
          <TTSButton text={`Combien y a-t-il de ${currentItem.item} ?`} size="sm" />
          <span className="text-xs font-black text-[#2A6FB5] bg-[#EBF4FF] px-3.5 py-1.5 rounded-full border border-[#2A6FB5]/30">
            {countedIndices.size} / {currentItem.count} comptés
          </span>
        </div>
      </div>

      {/* Counting Field (Real images, tactile tap to count) */}
      <div className="bg-white rounded-[2.5rem] p-7 text-center border-4 border-[#2A6FB5]/30 shadow-md">
        <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B] mb-2">
          Touche chaque photo pour compter :
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-5 my-6 min-h-[140px]">
          {Array.from({ length: currentItem.count }).map((_, idx) => {
            const isCounted = countedIndices.has(idx);

            return (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleTapObject(idx)}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden cursor-pointer border-4 transition-all ${
                  isCounted
                    ? 'border-emerald-500 shadow-md ring-4 ring-emerald-400/30 scale-105'
                    : 'border-slate-300 hover:border-[#2A6FB5]'
                }`}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.item}
                  className="w-full h-full object-cover"
                />
                {isCounted && (
                  <span className="absolute inset-0 bg-emerald-600/40 backdrop-blur-xs flex items-center justify-center text-white font-['Fredoka'] text-3xl font-black">
                    ✓
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="text-base font-bold text-[#64748B]">
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
              className={`min-h-[84px] rounded-3xl font-['Fredoka'] text-4xl font-black flex items-center justify-center cursor-pointer ${stateClass}`}
            >
              <span>{num}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
