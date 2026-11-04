import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import NeedScene from '../components/NeedScene';

const NEEDS_ITEMS = [
  { id: 'water', label: 'J’ai soif', phrase: 'J’ai soif. Je voudrais un verre d’eau, s’il te plaît.', description: 'Un enfant et un verre d’eau.', color: '#337FA4', background: '#EDF7FC' },
  { id: 'food', label: 'J’ai faim', phrase: 'J’ai faim. Je voudrais manger, s’il te plaît.', description: 'Un enfant pose une main sur son ventre. Un sandwich est dans une assiette.', color: '#A5752C', background: '#FFF5E5' },
  { id: 'rest', label: 'Je suis fatigué', phrase: 'Je suis fatigué. J’ai besoin de me reposer.', description: 'Un enfant bâille, les yeux fermés, assis sur un lit avec un oreiller.', color: '#7C65B0', background: '#F3F0FB' },
  { id: 'help', label: 'J’ai besoin d’aide', phrase: 'J’ai besoin d’aide pour ouvrir cette boîte, s’il te plaît.', description: 'Un enfant tient une boîte fermée. Un adulte l’aide à ouvrir le couvercle.', color: '#477E60', background: '#EDF6EF' },
];

// A communication board: every need is valid, with no required sequence.
export default function CommunicateNeedsActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;
  const reduceMotion = useReducedMotion();
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [explored, setExplored] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isFinished) speakText('De quoi as-tu besoin ? Touche une image pour le dire.', isAudioEnabled);
    return () => stopSpeech();
  }, [isAudioEnabled, isFinished]);

  const handleSelectNeed = (need) => {
    setSelectedNeed(need);
    setExplored(previous => previous.includes(need.id) ? previous : [...previous, need.id]);
    speakText(need.phrase, isAudioEnabled);
  };

  if (isFinished) return (
    <div className="mx-auto max-w-xl space-y-6 rounded-[2.5rem] border-4 border-rose-100 bg-white p-8 text-center shadow-md">
      <div aria-hidden="true" className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-700">✓</div>
      <h2 className="font-['Fredoka'] text-3xl font-black text-slate-800">Bravo, tu as exprimé ton besoin !</h2>
      <p className="text-lg font-semibold text-slate-600">Tu peux demander ce dont tu as besoin.</p>
      <button type="button" onClick={() => setIsFinished(false)} className="min-h-[56px] w-full rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 font-bold text-rose-800">Je veux dire autre chose</button>
      <button type="button" onClick={() => onComplete?.({ score: 3, maxScore: 3, label: 'Exprimer ses besoins', module: 'communicate' })} className="btn-tactile btn-tactile--communicate min-h-[64px] w-full text-xl">Continuer</button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-3xl border-2 border-slate-200 bg-white p-5">
        <div>
          <h2 className="font-['Fredoka'] text-2xl font-black text-slate-800">De quoi as-tu besoin ?</h2>
          <p className="mt-1 font-semibold text-slate-500">Touche une image pour le dire.</p>
        </div>
        <TTSButton text="De quoi as-tu besoin ? Touche une image pour le dire." size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {NEEDS_ITEMS.map(item => {
          const selected = selectedNeed?.id === item.id;
          return <motion.button key={item.id} type="button" onClick={() => handleSelectNeed(item)} aria-label={item.label} aria-pressed={selected}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="relative flex flex-col overflow-hidden rounded-[1.75rem] border-4 bg-white p-2 text-center shadow-sm transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 sm:p-3"
            style={{ borderColor: selected ? item.color : '#E2E8F0', outlineColor: item.color, background: selected ? item.background : 'white' }}>
            <div className="h-36 w-full overflow-hidden rounded-2xl sm:h-44"><NeedScene need={item.id} title={item.description} /></div>
            <span className="flex min-h-[68px] items-center justify-center px-1 py-3 font-['Fredoka'] text-xl font-black leading-tight text-slate-800 sm:text-2xl">{item.label}</span>
            {selected && <span aria-hidden="true" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: item.color }}>✓</span>}
          </motion.button>;
        })}
      </div>

      <div className="min-h-[170px] rounded-3xl border-2 p-5 shadow-sm" style={{ borderColor: selectedNeed?.color || '#E2E8F0', background: selectedNeed?.background || 'white' }}>
        <p className="mb-2 text-sm font-bold text-slate-500">Mon message</p>
        <div role="status" aria-live="polite" aria-atomic="true">
          <p className="font-['Fredoka'] text-xl font-bold leading-relaxed text-slate-800 sm:text-2xl">{selectedNeed ? selectedNeed.phrase : 'Choisis une image. Ton message apparaîtra ici.'}</p>
        </div>
        {selectedNeed && <div className="mt-4"><TTSButton text={selectedNeed.phrase} variant="pill" label="Écouter mon message" /></div>}
      </div>

      {explored.length > 0 && <button type="button" onClick={() => setIsFinished(true)} className="btn-tactile btn-tactile--communicate min-h-[64px] w-full font-['Fredoka'] text-xl">J’ai fini</button>}
    </div>
  );
}
