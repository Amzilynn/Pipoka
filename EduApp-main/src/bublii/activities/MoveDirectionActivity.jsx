import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import MovementPicture from '../components/MovementPicture';
import SequenceCamera from '../components/SequenceCamera';
import { matchesDirectionPose } from '../utils/directionPose';

const DIRECTIONS = [
  {
    id: 'up',
    label: 'En haut',
    hint: 'Lève les bras vers le haut',
    symbol: '⬆️',
  },
  {
    id: 'left',
    label: 'À gauche',
    hint: 'Montre la gauche',
    symbol: '⬅️',
  },
  {
    id: 'right',
    label: 'À droite',
    hint: 'Montre la droite',
    symbol: '➡️',
  },
  {
    id: 'down',
    label: 'En bas',
    hint: 'Baisse les deux bras vers le bas',
    symbol: '⬇️',
  },
];

const CHOICES = [
  { id: 'up', label: 'En haut', arrow: '▲' },
  { id: 'left', label: 'Gauche', arrow: '◀' },
  { id: 'right', label: 'Droite', arrow: '▶' },
  { id: 'down', label: 'En bas', arrow: '▼' },
];

export default function MoveDirectionActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentRound, setCurrentRound] = useState(0);
  const [isSuccessRound, setIsSuccessRound] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const lockedRef = useRef(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const currentDir = DIRECTIONS[currentRound] || DIRECTIONS[0];

  useEffect(() => {
    lockedRef.current = false;
    setIsSuccessRound(false);
    setSelectedId(null);
    if (isAudioEnabled && !isFinished) {
      speakText(`${currentDir.label}. ${currentDir.hint}`, isAudioEnabled);
    }
    return () => stopSpeech();
  }, [currentRound, isAudioEnabled, isFinished, currentDir]);

  const handleTriggerDirection = (dirId) => {
    if (lockedRef.current || isFinished) return;
    lockedRef.current = true;
    setSelectedId(dirId);
    if (dirId === currentDir.id) {
      setIsSuccessRound(true);
      speakText('Bravo ! Bonne direction !', isAudioEnabled);

      timerRef.current = setTimeout(() => {
        if (currentRound + 1 < DIRECTIONS.length) {
          setCurrentRound((r) => r + 1);
        } else {
          setIsFinished(true);
        }
      }, 1400);
    } else {
      speakText('Essaie encore.', isAudioEnabled);
      timerRef.current = setTimeout(() => { lockedRef.current = false; setSelectedId(null); }, 900);
    }
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Suivre les directions',
      module: 'move',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#22a06b]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 border-4 border-[#22a06b] flex items-center justify-center text-4xl font-black text-[#22a06b]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#22a06b] mb-1">
            Bravo !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Tu connais bien toutes les directions !
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-5xl">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="btn-tactile btn-tactile--move w-full text-xl cursor-pointer"
        >
          Continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Étape {currentRound + 1} / {DIRECTIONS.length}
        </span>
        <div className="flex gap-2">
          {DIRECTIONS.map((_, i) => (
            <span
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < currentRound
                  ? 'bg-[#22a06b]'
                  : i === currentRound
                  ? 'bg-[#22a06b] ring-4 ring-[#22a06b]/20 scale-110'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Visual Demonstration Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-md text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-slate-900">
            {currentDir.label}
          </h2>
          <TTSButton text={`${currentDir.label}. ${currentDir.hint}`} />
        </div>

        <p className="text-sm font-bold text-slate-600">Le personnage est vu de dos : sa gauche est de ton côté gauche.</p>
        <p className="text-sm text-slate-600">Active la cam?ra et reproduis le geste. Garde la bonne position un petit instant pour passer ? la suite.</p>
        <SequenceCamera
          gesture={currentDir.id}
          disabled={selectedId !== null}
          celebrating={isSuccessRound}
          model={<MovementPicture pose={currentDir.id} title={currentDir.hint} />}
          matchPose={matchesDirectionPose}
          onMatch={handleTriggerDirection}
          onInteraction={() => {}}
        />
        <p className="text-xs text-slate-500">La vid?o est trait?e sur cet appareil et n?est pas enregistr?e. Tu peux aussi utiliser les boutons.</p>
      </div>

      {/* Tactile 4-Direction Control Buttons */}
      <div className="grid grid-cols-2 gap-3.5">
        {CHOICES.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isTarget = choice.id === currentDir.id;
          const isSuccessState = isSelected && isTarget;
          const isFailState = isSelected && !isTarget;

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleTriggerDirection(choice.id)}
              disabled={selectedId !== null}
              className={`min-h-[72px] rounded-2xl p-4 font-['Fredoka'] text-xl font-black flex items-center justify-center gap-3 transition-all cursor-pointer border-3 ${
                isSuccessState
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-102 shadow-lg'
                  : isFailState
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-[#22a06b] hover:bg-emerald-50/50 shadow-xs active:scale-98'
              }`}
            >
              <span className="text-2xl text-[#22a06b] font-bold">{choice.arrow}</span>
              <span>{choice.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
