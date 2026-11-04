import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Real photos for school bag items
const ITEMS_POOL = [
  {
    id: 'cahier',
    name: 'Cahier',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
    needed: true,
  },
  {
    id: 'trousse',
    name: 'Trousse',
    image: 'https://images.unsplash.com/photo-1612198527896-b4a4bffb6c1f?auto=format&fit=crop&w=400&q=80',
    needed: true,
  },
  {
    id: 'gourde',
    name: 'Gourde',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
    needed: true,
  },
  {
    id: 'gouter',
    name: 'Goûter',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80',
    needed: true,
  },
  {
    id: 'console',
    name: 'Console',
    image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?auto=format&fit=crop&w=400&q=80',
    needed: false,
  },
  {
    id: 'coussin',
    name: 'Coussin',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    needed: false,
  },
];

const neededTotal = ITEMS_POOL.filter((i) => i.needed).length;

export default function GrowSchoolBagActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [bagItems, setBagItems] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null); // { type, text }
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText('Mets dans ton sac les affaires pour l\'école !', isAudioEnabled);
    }
    return () => stopSpeech();
  }, [isAudioEnabled, isFinished]);

  const handleSelectItem = (item) => {
    if (bagItems.some((b) => b.id === item.id)) return;

    if (item.needed) {
      const next = [...bagItems, item];
      setBagItems(next);
      speakText(`${item.name} dans le sac.`, isAudioEnabled);
      setLastFeedback({ type: 'success', text: `✓ ${item.name}` });
    } else {
      speakText(`${item.name} reste à la maison.`, isAudioEnabled);
      setLastFeedback({ type: 'error', text: `${item.name} reste à la maison.` });
    }

    setTimeout(() => setLastFeedback(null), 1500);
  };

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
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#F5A623]/30 shadow-xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-amber-50 border-4 border-[#F5A623] flex items-center justify-center text-4xl font-black text-[#F5A623]">
          ✓
        </div>
        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#F5A623] mb-1">
            Bravo !
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            Ton sac est prêt pour l'école !
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-5xl">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
              ⭐
            </motion.span>
          ))}
        </div>
        <button type="button" onClick={handleFinish} className="btn-tactile btn-tactile--grow w-full text-xl cursor-pointer">
          Continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <TTSButton text="Mets dans ton sac les affaires pour l'école !" />
          <span className="font-['Fredoka'] text-sm font-bold text-slate-700">
            Affaires pour l'école
          </span>
        </div>
        <span className="text-xs font-black text-[#F5A623] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {bagItems.length} / {neededTotal}
        </span>
      </div>

      {/* Backpack visual — packed items as thumbnails */}
      <div className="bg-white rounded-3xl p-5 border-3 border-[#F5A623]/40 shadow-md">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 text-center">
          Mon sac
        </p>
        <div className="min-h-[72px] flex flex-wrap gap-2 items-center justify-center bg-amber-50/60 rounded-2xl p-3 border-2 border-dashed border-amber-200">
          {bagItems.length === 0 ? (
            <span className="text-xs text-slate-400 font-bold">Vide pour l'instant…</span>
          ) : (
            bagItems.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-xs"
              >
                <img src={b.image} alt={b.name} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            ))
          )}
        </div>

        {/* Inline feedback toast */}
        <AnimatePresence>
          {lastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 text-sm font-bold px-4 py-2 rounded-xl text-center ${
                lastFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}
            >
              {lastFeedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Items grid — real photos, choose which go in the bag */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {ITEMS_POOL.map((item) => {
          const isPacked = bagItems.some((b) => b.id === item.id);
          return (
            <motion.button
              key={item.id}
              type="button"
              disabled={isPacked}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectItem(item)}
              className={`rounded-2xl overflow-hidden border-3 cursor-pointer transition-all ${
                isPacked
                  ? 'border-emerald-400 opacity-50 cursor-not-allowed'
                  : 'border-slate-200 hover:border-[#F5A623] hover:shadow-md shadow-xs'
              }`}
            >
              <div className="h-24 sm:h-28 bg-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className={`px-2 py-2 text-center ${isPacked ? 'bg-emerald-50' : 'bg-white'}`}>
                <span className="font-['Fredoka'] text-sm font-bold text-slate-800">
                  {isPacked ? '✓ ' : ''}{item.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Complete button — only appears when bag is ready */}
      <AnimatePresence>
        {isBagReady && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={() => setIsFinished(true)}
            className="btn-tactile btn-tactile--grow w-full min-h-[64px] text-xl cursor-pointer"
          >
            Le sac est prêt ! ✨
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
