import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import { useBublii } from '../context/BubliiContext';
import { createCountingRound, readCountingProgress, freshCountingProgress, saveCountingProgress, recordCountingAttempt } from '../utils/countingProgress';

// Real photographic counting objects — NO EMOJIS
const COUNTING_ROUNDS = [
  {
    id: 'apples',
    item: 'pommes',
    singular: 'Une pomme',
    image: '/assets/images/counting/single-apple.jpg',
  },
  {
    id: 'balls',
    item: 'ballons',
    singular: 'Un ballon',
    image: '/assets/images/counting/single-ball.jpg',
  },
  {
    id: 'cats',
    item: 'chats',
    singular: 'Un chat',
    image: '/assets/images/counting/single-cat.jpg',
  },
];

export default function LearnCountingActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const { activeChild } = useBublii();
  const childId = activeChild.id;
  const [progress] = useState(() => {
    try { return readCountingProgress(window.localStorage, childId); }
    catch { return freshCountingProgress(); }
  });
  const progressRef = useRef(progress);
  const sessionId = useRef(null);
  if (!sessionId.current) sessionId.current = globalThis.crypto?.randomUUID?.() || String(Date.now()) + '-' + Math.random();
  const pendingTimer = useRef(null);
  const answerLocked = useRef(false);
  const [round, setRound] = useState(() => createCountingRound(progress.level));
  const [roundErrors, setRoundErrors] = useState(0);
  const [helpUsed, setHelpUsed] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => () => clearTimeout(pendingTimer.current), []);

  const [currentRound, setCurrentRound] = useState(0);
  const [countedIndices, setCountedIndices] = useState(new Set());
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = useMemo(() => ({ ...(COUNTING_ROUNDS[currentRound] || COUNTING_ROUNDS[0]), count: round.count }), [currentRound, round.count]);
  const options = round.options;

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`Combien y a-t-il de ${currentItem.item} ? Touche chaque objet pour compter.`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentItem, isAudioEnabled, isFinished]);

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

  const handleShowExample = () => {
    setHelpUsed(true);
    setShowExample(true);
    speakText(Array.from({ length: currentItem.count }, (_, i) => i + 1).join(', ') + '. Il y en a ' + currentItem.count + '.', isAudioEnabled);
  };

  const handleSelectNumber = (num) => {
    if (answerLocked.current) return;
    answerLocked.current = true;
    setSelectedNumber(num);
    const correct = num === currentItem.count;
    setIsCorrect(correct);
    const next = recordCountingAttempt(progressRef.current, {
      sessionId: sessionId.current,
      round: currentRound + 1,
      level: round.level,
      target: currentItem.count,
      answer: num,
      correct,
      helpUsed,
      hadError: roundErrors > 0,
      objectsTapped: countedIndices.size,
      recordedAt: new Date().toISOString(),
    });
    progressRef.current = next;
    try { setStorageAvailable(saveCountingProgress(window.localStorage, childId, next)); }
    catch { setStorageAvailable(false); }

    if (correct) {
      speakText('Bravo ! Il y en a bien ' + currentItem.count + ' !', isAudioEnabled);
      pendingTimer.current = setTimeout(() => {
        if (currentRound + 1 < COUNTING_ROUNDS.length) {
          setRound(createCountingRound(next.level));
          setRoundErrors(0);
          setHelpUsed(false);
          setShowExample(false);
          setCountedIndices(new Set());
          setSelectedNumber(null);
          setIsCorrect(null);
          answerLocked.current = false;
          setCurrentRound(r => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      setRoundErrors(errors => errors + 1);
      if (roundErrors + 1 >= 2) {
        handleShowExample();
      } else {
        speakText('Essaie encore, recompte doucement !', isAudioEnabled);
      }
      pendingTimer.current = setTimeout(() => {
        setSelectedNumber(null);
        setIsCorrect(null);
        answerLocked.current = false;
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
      {!storageAvailable && <p role="status" className="rounded-2xl bg-white p-4 text-slate-700">Tu peux continuer à jouer. La sauvegarde est indisponible sur cet appareil.</p>}
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border-3 border-slate-200 shadow-sm">
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
          {isAudioEnabled && <TTSButton text={`Combien y a-t-il de ${currentItem.item} ?`} size="sm" />}
          <span className="text-xs font-black text-[#2A6FB5] bg-[#EBF4FF] px-3.5 py-1.5 rounded-full border border-[#2A6FB5]/30">
            {showExample ? 'Un exemple pour compter' : countedIndices.size + ' objets comptés'}
          </span>
        </div>
      </div>

      {/* Counting Field (Real images, tactile tap to count) */}
      <div className="bg-white rounded-[2.5rem] p-7 text-center border-4 border-[#2A6FB5]/30 shadow-md">
        <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B] mb-2">
          Touche chaque objet pour compter :
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-5 my-6 min-h-[140px]">
          {Array.from({ length: currentItem.count }).map((_, idx) => {
            const isCounted = countedIndices.has(idx) || showExample;

            return (
              <motion.button
                key={`${currentItem.id}-${idx}`}
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleTapObject(idx)}
                aria-label={`${currentItem.singular}${isCounted ? ', compté' : ''}`}
                aria-pressed={isCounted}
                disabled={selectedNumber !== null}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white cursor-pointer border-4 transition-all focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2A6FB5] ${
                  isCounted
                    ? 'border-emerald-500 shadow-md ring-4 ring-emerald-400/30 scale-105'
                    : 'border-slate-300 hover:border-[#2A6FB5]'
                }`}
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.singular}
                  className="w-full h-full object-contain p-1"
                  draggable={false}
                />
                {isCounted && (
                  <span className="absolute right-1 top-1 h-7 w-7 rounded-full bg-emerald-700 flex items-center justify-center text-white font-['Fredoka'] text-base font-black">
                    {showExample ? idx + 1 : Array.from(countedIndices).indexOf(idx) + 1}
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

      <div className="text-center space-y-3">
        <button type="button" onClick={handleShowExample} disabled={selectedNumber !== null}
          className="min-h-[52px] rounded-2xl border-2 border-[#2A6FB5] bg-white px-6 py-3 font-bold text-[#2A6FB5] disabled:opacity-50">
          Montre-moi comment compter
        </button>
        <p role="status" aria-live="polite" className="font-bold text-[#1E293B]">
          {showExample ? `Compte les objets : ${Array.from({ length: currentItem.count }, (_, i) => i + 1).join(', ')}. Il y en a ${currentItem.count}.` : isCorrect === true ? 'Bravo !' : isCorrect === false ? 'Tu peux recompter ou demander un exemple.' : ''}
        </p>
      </div>
      {/* Number choices follow this activity's saved learning level. */}
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
