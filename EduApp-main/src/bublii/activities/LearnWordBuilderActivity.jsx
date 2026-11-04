import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const WORD_BUILDER_ITEMS = [
  { id: 'chat', word: 'CHAT', letters: ['C', 'H', 'A', 'T'], emoji: '🐱', hint: 'Il miaule : C - H - A - T' },
  { id: 'velo', word: 'VELO', letters: ['V', 'E', 'L', 'O'], emoji: '🚲', hint: 'Deux roues pour rouler : V - E - L - O' },
  { id: 'lune', word: 'LUNE', letters: ['L', 'U', 'N', 'E'], emoji: '🌙', hint: 'Elle brille la nuit : L - U - N - E' },
  { id: 'pain', word: 'PAIN', letters: ['P', 'A', 'I', 'N'], emoji: '🥖', hint: 'Croustillant du boulanger : P - A - I - N' },
];

export default function LearnWordBuilderActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const allowedHints = childSettings?.hints ?? 2;
  const difficulty = childSettings?.difficulty || 4;

  const totalRounds = Math.min(4, Math.max(2, difficulty - 1));

  const [currentRound, setCurrentRound] = useState(0);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = WORD_BUILDER_ITEMS[currentRound] || WORD_BUILDER_ITEMS[0];

  // Scramble letters for the drawer
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
    const expectedLetter = currentItem.letters[placedLetters.length];

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
      speakText(`Essaie la lettre : ${expectedLetter}`, isAudioEnabled);
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
      speakText(`Cherche la lettre ${nextNeeded}`, isAudioEnabled);
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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#2A6FB5]/30 shadow-xl">
        <div className="text-7xl mb-4">🔤</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#2A6FB5] mb-2">
          Génial ! Mots construits !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as su assembler toutes les lettres dans le bon ordre.
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
          className="btn-tactile btn-tactile--learn w-full text-lg cursor-pointer"
        >
          Enregistrer ma victoire et continuer ✨
        </button>
      </div>
    );
  }

  const nextExpectedLetter = currentItem.letters[placedLetters.length];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border-2 border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#6B7A8C]">
            Mot {currentRound + 1} / {totalRounds}
          </span>
          <div className="flex gap-2 ml-2">
            {Array.from({ length: totalRounds }).map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentRound ? 'bg-[#2A6FB5]' : i === currentRound ? 'bg-[#2A6FB5] ring-4 ring-[#2A6FB5]/20 scale-110' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allowedHints > 0 && (
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsUsed >= allowedHints || showHint}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                hintsUsed < allowedHints && !showHint
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>💡 Indice</span>
            </button>
          )}

          {placedLetters.length > 0 && (
            <button
              type="button"
              onClick={handleResetLetters}
              className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold text-[#6B7A8C] bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl p-8 text-center border-3 border-[#2A6FB5]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(42, 111, 177, 0.15)' }}>
        <div className="text-8xl my-3 select-none animate-bounce-short">
          {currentItem.emoji}
        </div>

        <h3 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748] mb-5">
          Assemble les lettres de : {currentItem.word}
        </h3>

        {/* Word Slot Boxes (Tactile Drop Targets) */}
        <div className="flex justify-center gap-3 sm:gap-4 my-4">
          {currentItem.letters.map((char, index) => {
            const placed = placedLetters[index];
            const isNext = index === placedLetters.length;

            return (
              <div
                key={index}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-['Fredoka'] text-3xl font-extrabold border-3 transition-all ${
                  placed
                    ? 'bg-[#EBF4FF] border-[#2A6FB5] text-[#2A6FB5] shadow-sm scale-102'
                    : isNext
                    ? 'bg-slate-50 border-dashed border-[#2A6FB5] animate-pulse text-transparent'
                    : 'bg-slate-100 border-dashed border-slate-300 text-transparent'
                }`}
              >
                {placed ? placed.char : '_'}
              </div>
            );
          })}
        </div>

        {/* Hint banner */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-amber-50 text-amber-900 rounded-2xl text-xs font-bold border-2 border-amber-200"
            >
              💡 {currentItem.hint} (Touche la lettre : {nextExpectedLetter})
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Letter Tiles Drawer (3D tactile tiles) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm text-center">
        <span className="text-xs font-black uppercase tracking-wider text-[#6B7A8C] block mb-4">
          Touche la lettre suivante :
        </span>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {remainingTiles.map((tile) => (
            <motion.button
              key={tile.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTileClick(tile)}
              className="w-16 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-slate-300 text-[#2D3748] font-['Fredoka'] text-3xl font-bold flex items-center justify-center cursor-pointer shadow-md hover:border-[#2A6FB5] hover:text-[#2A6FB5] transition-colors"
              style={{ boxShadow: '0 5px 0 #CBD5E1' }}
            >
              <span>{tile.char}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs font-bold text-[#6B7A8C]">
        Touche les lettres une par une dans le bon ordre.
      </p>
    </div>
  );
}

