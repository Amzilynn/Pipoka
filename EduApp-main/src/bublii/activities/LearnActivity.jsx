import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// High-definition real photography of everyday objects — NO EMOJIS
const VOCABULARY_ITEMS = [
  {
    id: 'chat',
    word: 'Le chat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    category: 'Animaux',
    hint: 'Il fait "Miaou" !',
  },
  {
    id: 'pomme',
    word: 'La pomme',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    category: 'Fruits',
    hint: 'Un fruit rouge et croquant !',
  },
  {
    id: 'voiture',
    word: 'La voiture',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    category: 'Véhicules',
    hint: 'Elle roule avec 4 roues !',
  },
  {
    id: 'ballon',
    word: 'Le ballon',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=600&q=80',
    category: 'Jeux',
    hint: 'Tout rond pour jouer dehors !',
  },
  {
    id: 'fleur',
    word: 'La fleur',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    category: 'Nature',
    hint: 'Elle sent très bon !',
  },
  {
    id: 'arbre',
    word: 'L’arbre',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    category: 'Nature',
    hint: 'Il a des feuilles vertes et un grand tronc !',
  },
];

export default function LearnActivity({ childSettings, onComplete }) {
  const answerChoicesCount = childSettings?.answerChoices || 3;
  const isAudioEnabled = childSettings?.audio !== false;
  const allowedHints = childSettings?.hints ?? 2;
  const difficultyLevel = childSettings?.difficulty || 4;

  const totalRounds = Math.min(4, Math.max(2, difficultyLevel - 1));

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintText, setShowHintText] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const rounds = useMemo(() => {
    return VOCABULARY_ITEMS.slice(0, totalRounds);
  }, [totalRounds]);

  const targetItem = rounds[currentRound] || rounds[0];

  const currentOptions = useMemo(() => {
    const distractors = VOCABULARY_ITEMS.filter((item) => item.id !== targetItem.id);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, answerChoicesCount - 1);
    return [targetItem, ...selectedDistractors].sort(() => 0.5 - Math.random());
  }, [targetItem, answerChoicesCount]);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`Trouve la photo : ${targetItem.word}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, targetItem]);

  const handleSelectOption = (option) => {
    if (selectedWord !== null) return;

    setSelectedWord(option.id);
    const correct = option.id === targetItem.id;
    setIsCorrect(correct);

    if (correct) {
      speakText(`Bravo ! C'est bien : ${targetItem.word}`, isAudioEnabled);
      setScore((s) => s + 1);

      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound((r) => r + 1);
          setSelectedWord(null);
          setIsCorrect(null);
          setShowHintText(false);
          setEliminatedOptions([]);
        } else {
          setIsFinished(true);
        }
      }, 1400);
    } else {
      speakText(`Essaie encore !`, isAudioEnabled);
      setTimeout(() => {
        setSelectedWord(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleUseHint = () => {
    if (hintsUsed >= allowedHints) return;
    setHintsUsed((h) => h + 1);
    setShowHintText(true);

    const wrongOption = currentOptions.find(
      (opt) => opt.id !== targetItem.id && !eliminatedOptions.includes(opt.id)
    );
    if (wrongOption && currentOptions.length - eliminatedOptions.length > 2) {
      setEliminatedOptions((prev) => [...prev, wrongOption.id]);
    }

    if (isAudioEnabled) {
      speakText(targetItem.hint, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score,
      maxScore: totalRounds,
      label: 'Associer mots et images',
      module: 'learn',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#2A6FB5]/30 shadow-2xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-5xl">
          ⭐
        </div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#2A6FB5]">
          Super réussite !
        </h2>
        <p className="text-base text-[#64748B] font-bold">
          Tu as bien reconnu toutes les photos !
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
            Étape {currentRound + 1} sur {totalRounds}
          </span>
          <div className="flex gap-2">
            {rounds.map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i < currentRound
                    ? 'bg-[#2A6FB5]'
                    : i === currentRound
                    ? 'bg-[#2A6FB5] ring-4 ring-[#2A6FB5]/25 scale-110'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TTSButton text={targetItem.word} size="sm" />

          {allowedHints > 0 && (
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsUsed >= allowedHints || showHintText}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                hintsUsed < allowedHints && !showHintText
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>💡 Indice</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Real Photo Card (No Emojis, High Aesthetics) */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 text-center border-4 border-[#2A6FB5]/30 shadow-md">
        <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white mb-4 bg-slate-100">
          <img
            src={targetItem.image}
            alt={targetItem.word}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <h3 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#1E293B]">
            Quel est ce mot ?
          </h3>
          <TTSButton text={`Quel est ce mot ? C'est ${targetItem.word}`} size="sm" />
        </div>

        {/* Hint text if active */}
        <AnimatePresence>
          {showHintText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-amber-50 text-amber-900 rounded-2xl text-sm font-bold border-2 border-amber-200"
            >
              💡 {targetItem.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Tactile Word Cards (2, 3 or 4 choices) */}
      <div
        className={`grid gap-4 ${
          answerChoicesCount === 2
            ? 'grid-cols-2'
            : answerChoicesCount === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {currentOptions.map((option) => {
          const isSelected = selectedWord === option.id;
          const isEliminated = eliminatedOptions.includes(option.id);

          let stateClass = 'card-choice';
          if (isSelected) {
            stateClass = isCorrect ? 'card-choice card-choice--correct' : 'card-choice card-choice--error';
          } else if (isEliminated) {
            stateClass = 'bg-slate-100 border-2 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed rounded-3xl min-h-[84px] flex items-center justify-center';
          }

          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={selectedWord !== null || isEliminated}
              onClick={() => handleSelectOption(option)}
              whileHover={!isEliminated && selectedWord === null ? { scale: 1.02 } : {}}
              whileTap={!isEliminated && selectedWord === null ? { scale: 0.98 } : {}}
              className={`min-h-[84px] p-4 rounded-3xl font-['Fredoka'] text-2xl font-bold flex items-center justify-center ${stateClass}`}
            >
              <span>{option.word}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
