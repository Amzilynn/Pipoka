import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// AAC / CAA Communication Board with real photography — NO EMOJIS
const NEEDS_ITEMS = [
  {
    id: 'water',
    label: 'J’ai soif',
    phrase: 'J’ai soif, je voudrais un verre d’eau.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food',
    label: 'J’ai faim',
    phrase: 'J’ai faim, je voudrais manger.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rest',
    label: 'Je suis fatigué',
    phrase: 'Je suis fatigué, j’ai besoin de me reposer.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'help',
    label: 'Besoin d’aide',
    phrase: 'J’ai besoin d’aide s’il vous plaît.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CommunicateNeedsActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText('Touche une photo pour exprimer ton besoin.', isAudioEnabled);
    }
    return () => stopSpeech();
  }, [isAudioEnabled, isFinished]);

  const handleSelectNeed = (need) => {
    setSelectedNeed(need);
    speakText(need.phrase, isAudioEnabled);
    setMessagesCount((m) => m + 1);
  };

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Exprimer ses besoins',
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
          Tu as su exprimer ce dont tu as besoin !
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
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-6 py-4 rounded-3xl border-3 border-slate-200 shadow-sm">
        <span className="text-sm font-black text-[#1E293B]">
          Touche une photo pour parler
        </span>
        <TTSButton text="Touche une photo pour exprimer ton besoin." size="sm" />
      </div>

      {/* Spoken Message Bubble when active */}
      <AnimatePresence>
        {selectedNeed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFF5F5] border-3 border-[#E84545] rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🗣️</span>
              <p className="font-['Fredoka'] text-2xl font-black text-[#E84545]">
                « {selectedNeed.phrase} »
              </p>
            </div>
            <TTSButton text={selectedNeed.phrase} size="sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Photo AAC Grid */}
      <div className="grid grid-cols-2 gap-5">
        {NEEDS_ITEMS.map((item) => {
          const isSelected = selectedNeed?.id === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleSelectNeed(item)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-[2rem] border-4 text-center transition-all cursor-pointer shadow-md flex flex-col items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-rose-50 border-[#E84545] shadow-lg ring-4 ring-[#E84545]/20 scale-102'
                  : 'bg-white border-slate-200 hover:border-[#E84545]/60'
              }`}
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B]">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Done Button if at least 1 message expressed */}
      {messagesCount > 0 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsFinished(true)}
            className="btn-tactile btn-tactile--communicate w-full min-h-[64px] text-xl font-['Fredoka'] cursor-pointer shadow-lg"
          >
            J'ai fini d'exprimer mes besoins ✨
          </button>
        </div>
      )}
    </div>
  );
}
