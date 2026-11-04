import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import { EmotionPortrait } from '../components/CommunicationScenes';

// Each portrait shows the facial features described in the prompt.
const EMOTION_SCENARIOS = [
  {
    id: 'sc-joie',
    emotion: 'La Joie',
    audioText: 'L’enfant sourit et rit aux éclats !',
    hint: 'Regarde son beau sourire éclatant !',
  },
  {
    id: 'sc-tristesse',
    emotion: 'La Tristesse',
    audioText: 'L’enfant a du chagrin et se sent triste.',
    hint: 'Sa bouche est tournée vers le bas. Une larme coule sur sa joue.',
  },
  {
    id: 'sc-surprise',
    emotion: 'La Surprise',
    audioText: 'L’enfant ouvre de grands yeux étonnés !',
    hint: 'Ses yeux sont tout ronds !',
  },
  {
    id: 'sc-calme',
    emotion: 'Le Calme',
    audioText: 'L’enfant est détendu et serein.',
    hint: 'Son visage est reposé et tranquille.',
  },
];

const ALL_EMOTIONS = [
  { id: 'sc-joie', label: 'La Joie' },
  { id: 'sc-tristesse', label: 'La Tristesse' },
  { id: 'sc-surprise', label: 'La Surprise' },
  { id: 'sc-calme', label: 'Le Calme' },
];

export default function CommunicateActivity({ childSettings, onComplete }) {
  const answerChoicesCount = childSettings?.answerChoices || 3;
  const isAudioEnabled = childSettings?.audio !== false;
  const allowedHints = childSettings?.hints ?? 2;

  const totalRounds = 3;
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintText, setShowHintText] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentScenario = EMOTION_SCENARIOS[currentRound] || EMOTION_SCENARIOS[0];

  const currentOptions = useMemo(() => {
    const correctOpt = ALL_EMOTIONS.find((e) => e.id === currentScenario.id);
    const others = ALL_EMOTIONS.filter((e) => e.id !== currentScenario.id);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, answerChoicesCount - 1);
    return [correctOpt, ...distractors].sort(() => 0.5 - Math.random());
  }, [currentScenario, answerChoicesCount]);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(`Comment se sent l'enfant ? ${currentScenario.audioText}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentScenario]);

  const handleSelectEmotion = (option) => {
    if (selectedId !== null) return;
    setSelectedId(option.id);

    const correct = option.id === currentScenario.id;
    setIsCorrect(correct);

    if (correct) {
      speakText(`Bravo ! C'est bien : ${currentScenario.emotion}`, isAudioEnabled);
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound((r) => r + 1);
          setSelectedId(null);
          setIsCorrect(null);
          setShowHintText(false);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    } else {
      speakText(`Regarde bien son visage et essaie encore !`, isAudioEnabled);
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleUseHint = () => {
    if (hintsUsed >= allowedHints) return;
    setHintsUsed((h) => h + 1);
    setShowHintText(true);
    if (isAudioEnabled) {
      speakText(currentScenario.hint, isAudioEnabled);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Reconnaître les émotions',
      module: 'communicate',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#E84545]/30 shadow-2xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-5xl">
          ❤️
        </div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#E84545]">
          Bravo champion !
        </h2>
        <p className="text-base text-[#64748B] font-bold">
          Tu as reconnu les émotions des enfants avec succès !
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
          className="btn-tactile btn-tactile--communicate w-full min-h-[64px] text-xl font-['Fredoka'] cursor-pointer shadow-lg"
        >
          Continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border-3 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-[#1E293B]">
            Étape {currentRound + 1} sur {totalRounds}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalRounds }).map((_, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i < currentRound
                    ? 'bg-[#E84545]'
                    : i === currentRound
                    ? 'bg-[#E84545] ring-4 ring-[#E84545]/25 scale-110'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TTSButton text={currentScenario.audioText} size="sm" />

          {allowedHints > 0 && (
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsUsed >= allowedHints || showHintText}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
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

      {/* Real Child Portrait (No Emojis) */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 text-center border-4 border-[#E84545]/30 shadow-md">
        <div className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white mb-4 bg-slate-100">
          <EmotionPortrait emotion={currentScenario.id} description={currentScenario.audioText} />
        </div>

        <div className="flex items-center justify-center gap-3">
          <h3 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#1E293B]">
            Comment se sent l'enfant ?
          </h3>
          <TTSButton text={`Comment se sent l'enfant ? ${currentScenario.audioText}`} size="sm" />
        </div>

        <AnimatePresence>
          {showHintText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-amber-50 text-amber-900 rounded-2xl text-sm font-bold border-2 border-amber-200"
            >
              💡 {currentScenario.hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tactile 3D Choice Cards */}
      <div
        className={`grid gap-4 ${
          answerChoicesCount === 2
            ? 'grid-cols-2'
            : answerChoicesCount === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {currentOptions.map((opt) => {
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
              onClick={() => handleSelectEmotion(opt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`min-h-[84px] p-4 rounded-3xl font-['Fredoka'] text-2xl font-bold flex items-center justify-center cursor-pointer ${stateClass}`}
            >
              <span>{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
