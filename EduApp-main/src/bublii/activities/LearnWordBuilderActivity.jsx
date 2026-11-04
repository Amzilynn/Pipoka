import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Word builder with real photography — NO EMOJIS
const WORD_BUILDER_ITEMS = [
  {
    id: 'chat',
    word: 'CHAT',
    letters: ['C', 'H', 'A', 'T'],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    hint: 'La première lettre est C',
  },
  {
    id: 'velo',
    word: 'VELO',
    letters: ['V', 'E', 'L', 'O'],
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    hint: 'La première lettre est V',
  },
  {
    id: 'lune',
    word: 'LUNE',
    letters: ['L', 'U', 'N', 'E'],
    image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80',
    hint: 'La première lettre est L',
  },
];

export default function LearnWordBuilderActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const allowedHints = childSettings?.hints ?? 2;
  const assistanceMode = childSettings?.independence || 'progressive';

  const totalRounds = 3;
  const [currentRound, setCurrentRound] = useState(0);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = WORD_BUILDER_ITEMS[currentRound] || WORD_BUILDER_ITEMS[0];

  // Scramble letters
  const availableTiles = useMemo(() => {
    const list = currentItem.letters.map((char, index) => ({
      id: `${char}-${index}`,
      char,
    }));
    return list.sort(() => 0.5 - Math.random());
  }, [currentItem]);

  const [remainingTiles, setRemainingTiles] = useState(availableTiles);

  useEffect(() => {
    setPlacedLetters([]);
    setRemainingTiles(availableTiles);
    setShowHint(false);
    if (isAudioEnabled && !isFinished) {
      speakText(`Écris le mot : ${currentItem.word}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, availableTiles, isAudioEnabled, isFinished, currentItem]);

  const handleTileClick = (tile) => {
    const expectedIndex = placedLetters.length;
    const expectedLetter = currentItem.letters[expectedIndex];

    if (tile.char === expectedLetter) {
      speakText(tile.char, isAudioEnabled);
      const nextPlaced = [...placedLetters, tile];
      setPlacedLetters(nextPlaced);
      setRemainingTiles((prev) => prev.filter((t) => t.id !== tile.id));

      if (nextPlaced.length === currentItem.letters.length) {
        setIsSuccessRound(true);
        speakText(`Bravo ! Tu as écrit : ${currentItem.word}`, isAudioEnabled);

        setTimeout(() => {
          setIsSuccessRound(false);
          if (currentRound + 1 < totalRounds) {
            setCurrentRound((r) => r + 1);
          } else {
            setIsFinished(true);
          }
        }, 1600);
      }
    } else {
      speakText(`Essaie la lettre ${expectedLetter}`, isAudioEnabled);
    }
  };

  const handleResetLetters = () => {
    setPlacedLetters([]);
    setRemainingTiles(availableTiles);
  };

  const handleUseHint = () => {
    if (hintsUsed >= allowedHints) return;
    setHintsUsed((h) => h + 1);
    setShowHint(true);
    const nextNeeded = currentItem.letters[placedLetters.length];
    if (isAudioEnabled) {
      speakText(`Touche la lettre ${nextNeeded}`, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Construire un mot',
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
          Tu as construit tous les mots avec succès !
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
            Mot {currentRound + 1} sur {totalRounds}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalRounds }).map((_, i) => (
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
          <TTSButton text={`Écris le mot : ${currentItem.word}`} size="sm" />
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

      {/* Target Word Photo Card */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-7 text-center border-4 border-[#2A6FB5]/30 shadow-md">
        <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl overflow-hidden shadow-md border-4 border-white mb-4 bg-slate-100">
          <img
            src={currentItem.image}
            alt={currentItem.word}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Word Slot Boxes (One slot per letter) */}
        <div className="flex justify-center gap-3 my-4">
          {currentItem.letters.map((char, index) => {
            const placed = placedLetters[index];
            const isNextExpected = index === placedLetters.length;

            return (
              <div
                key={index}
                className={`w-16 h-18 sm:w-20 sm:h-22 rounded-2xl border-4 flex items-center justify-center font-['Fredoka'] text-3xl sm:text-4xl font-black transition-all ${
                  placed
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                    : isNextExpected
                    ? 'bg-white border-[#2A6FB5] text-slate-400 shadow-md ring-4 ring-[#2A6FB5]/20 animate-pulse'
                    : 'bg-slate-50 border-dashed border-slate-300 text-transparent'
                }`}
              >
                {placed ? (
                  placed.char
                ) : (assistanceMode === 'assisted' && isNextExpected) || showHint ? (
                  <span className="opacity-40">{char}</span>
                ) : (
                  '•'
                )}
              </div>
            );
          })}
        </div>

        {showHint && (
          <p className="text-sm font-bold text-amber-800 bg-amber-50 py-1.5 px-4 rounded-xl inline-block mt-2">
            💡 {currentItem.hint}
          </p>
        )}
      </div>

      {/* Available Letter Tiles Drawer (Large 72px tactile tiles) */}
      <div className="bg-white rounded-[2.5rem] p-6 text-center border-4 border-slate-200 shadow-sm">
        <span className="text-xs font-black uppercase tracking-wider text-[#64748B] block mb-3">
          Touche la lettre suivante :
        </span>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {remainingTiles.map((tile) => (
            <motion.button
              key={tile.id}
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleTileClick(tile)}
              className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl bg-slate-50 hover:bg-[#EBF4FF] border-3 border-slate-300 hover:border-[#2A6FB5] text-[#1E293B] font-['Fredoka'] text-3xl sm:text-4xl font-black flex items-center justify-center shadow-md cursor-pointer active:translate-y-1 transition-all"
            >
              {tile.char}
            </motion.button>
          ))}
        </div>

        {placedLetters.length > 0 && (
          <button
            type="button"
            onClick={handleResetLetters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-black text-[#64748B] hover:text-[#1E293B] bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            Recommencer le mot ↺
          </button>
        )}
      </div>
    </div>
  );
}
