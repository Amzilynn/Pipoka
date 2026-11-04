import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const ITEMS_POOL = [
  { id: 'cahier', name: 'Cahier d’école', emoji: '📓', needed: true },
  { id: 'trousse', name: 'Trousse & stylos', emoji: '✏️', needed: true },
  { id: 'gourde', name: 'Gourde d’eau', emoji: '💧', needed: true },
  { id: 'gouter', name: 'Goûter', emoji: '🍎', needed: true },
  { id: 'console', name: 'Console de jeu', emoji: '🎮', needed: false },
  { id: 'coussin', name: 'Gros coussin', emoji: '🛏️', needed: false },
];

export default function GrowSchoolBagActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [bagItems, setBagItems] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText('Mets dans ton sac uniquement les affaires utiles pour l’école !', isAudioEnabled);
    }
    return () => stopSpeech();
  }, [isAudioEnabled, isFinished]);

  const handleSelectItem = (item) => {
    if (item.needed) {
      if (!bagItems.some((b) => b.id === item.id)) {
        const next = [...bagItems, item];
        setBagItems(next);
        speakText(`Super ! On met ${item.name} dans le sac.`, isAudioEnabled);
        setFeedback({ type: 'success', text: `Bien joué ! ${item.name} est dans le cartable.` });
      }
    } else {
      speakText(`Non, ${item.name} reste à la maison pour l'école !`, isAudioEnabled);
      setFeedback({ type: 'error', text: `${item.name} doit rester à la maison.` });
    }
  };

  const neededTotal = ITEMS_POOL.filter((i) => i.needed).length;
  const isBagReady = bagItems.length === neededTotal;

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Je prépare mon sac',
      module: 'grow',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#F5A623]/30 shadow-xl">
        <div className="text-7xl mb-4">🎒</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#F5A623] mb-2">
          Cartable prêt pour l'école !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as su emporter exactement ce dont tu as besoin pour ta journée de classe.
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
          className="btn-tactile btn-tactile--grow w-full text-lg cursor-pointer"
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
        <span className="text-xs font-black uppercase tracking-wider text-[#6B7A8C]">
          Préparation du sac d'école
        </span>
        <span className="text-xs font-extrabold text-[#F5A623] bg-[#FFFDF0] px-3 py-1 rounded-full border border-amber-200">
          {bagItems.length} / {neededTotal} affaires rangées
        </span>
      </div>

      {/* Backpack Display Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-3 border-[#F5A623]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(245, 166, 35, 0.15)' }}>
        <div className="w-24 h-24 mx-auto rounded-3xl bg-[#FFFDF0] border-2 border-amber-200 flex items-center justify-center text-6xl shadow-xs animate-bounce-short">
          🎒
        </div>

        <h3 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748] mt-3">
          Mon cartable d’école
        </h3>

        {/* Packed Items Strip inside backpack */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-4 min-h-[60px] bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-200">
          {bagItems.length > 0 ? (
            bagItems.map((b) => (
              <span key={b.id} className="text-3xl bg-white p-2 rounded-xl border border-slate-200 shadow-xs animate-bounce-short">
                {b.emoji}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#6B7A8C] font-semibold">
              Le sac est vide pour l'instant. Touche les affaires utiles ci-dessous !
            </span>
          )}
        </div>

        {/* Feedback banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs font-bold p-2.5 rounded-xl border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Available Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ITEMS_POOL.map((item) => {
          const isPacked = bagItems.some((b) => b.id === item.id);

          return (
            <motion.button
              key={item.id}
              type="button"
              disabled={isPacked}
              whileHover={!isPacked ? { scale: 1.02 } : {}}
              whileTap={!isPacked ? { scale: 0.98 } : {}}
              onClick={() => handleSelectItem(item)}
              className={`min-h-[80px] p-3 rounded-3xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isPacked
                  ? 'bg-slate-100 border-2 border-slate-200 opacity-40 cursor-not-allowed'
                  : 'card-choice'
              }`}
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="font-['Fredoka'] text-sm font-bold text-[#2D3748]">
                {item.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Finish button when bag complete */}
      {isBagReady && (
        <button
          type="button"
          onClick={() => setIsFinished(true)}
          className="btn-tactile btn-tactile--grow w-full text-base cursor-pointer"
        >
          Le sac est prêt pour l'école ! ✨
        </button>
      )}
    </div>
  );
}

