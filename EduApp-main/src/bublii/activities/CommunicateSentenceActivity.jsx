import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';

const SUBJECTS = [
  { id: 'garcon', label: 'Le garçon', emoji: '👦' },
  { id: 'fille', label: 'La fille', emoji: '👧' },
  { id: 'chat', label: 'Le chat', emoji: '🐱' },
];

const VERBS = [
  { id: 'mange', label: 'mange', emoji: '🍽️' },
  { id: 'boit', label: 'boit', emoji: '🥤' },
  { id: 'regarde', label: 'regarde', emoji: '👀' },
];

const OBJECTS = [
  { id: 'pomme', label: 'une pomme', emoji: '🍎' },
  { id: 'eau', label: 'de l’eau', emoji: '💧' },
  { id: 'etoile', label: 'une étoile', emoji: '⭐' },
];

export default function CommunicateSentenceActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [currentSlot, setCurrentSlot] = useState('subject'); // 'subject' | 'verb' | 'object'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText('Construis une phrase en choisissant qui fait l’action.', isAudioEnabled);
    }
    return () => stopSpeech();
  }, [isAudioEnabled, isFinished]);

  const handleSelectSubject = (s) => {
    setSelectedSubject(s);
    speakText(s.label, isAudioEnabled);
    setCurrentSlot('verb');
  };

  const handleSelectVerb = (v) => {
    setSelectedVerb(v);
    speakText(v.label, isAudioEnabled);
    setCurrentSlot('object');
  };

  const handleSelectObject = (o) => {
    setSelectedObject(o);
    speakText(o.label, isAudioEnabled);

    // Read full sentence after complete selection
    if (selectedSubject && selectedVerb) {
      setTimeout(() => {
        const fullSentence = `${selectedSubject.label} ${selectedVerb.label} ${o.label}.`;
        speakText(`Bravo ! Ta phrase est : ${fullSentence}`, isAudioEnabled);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setSelectedVerb(null);
    setSelectedObject(null);
    setCurrentSlot('subject');
  };

  const isSentenceComplete = selectedSubject && selectedVerb && selectedObject;

  const handleFinish = () => {
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Construire une phrase',
      module: 'communicate',
    });
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto border-3 border-[#E84545]/30 shadow-xl">
        <div className="text-7xl mb-4">🗣️</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-bold text-[#E84545] mb-2">
          Phrase réussie !
        </h2>
        <p className="text-base text-[#6B7A8C] mb-6 font-semibold">
          Tu as su assembler les bons mots pour construire une phrase complète.
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
          className="btn-tactile btn-tactile--communicate w-full text-lg cursor-pointer"
        >
          Enregistrer ma victoire et continuer ✨
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Sentence Strip Card (Visual slots) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-3 border-[#E84545]/30 shadow-md relative"
           style={{ boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(232, 69, 69, 0.15)' }}>
        <span className="text-xs font-black uppercase tracking-wider text-[#E84545] bg-[#FFF5F5] px-3.5 py-1 rounded-full inline-block mb-4">
          La fabrique de phrases
        </span>

        {/* 3 Sentence Slots (Subject - Verb - Object) */}
        <div className="grid grid-cols-3 gap-3 my-2">
          {/* Slot 1: Qui ? */}
          <button
            type="button"
            onClick={() => setCurrentSlot('subject')}
            className={`min-h-[100px] rounded-2xl p-3 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
              currentSlot === 'subject'
                ? 'border-[#E84545] bg-rose-50/70 shadow-xs'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-[#6B7A8C] mb-1">Qui ?</span>
            {selectedSubject ? (
              <>
                <span className="text-3xl">{selectedSubject.emoji}</span>
                <span className="font-['Fredoka'] text-sm font-bold text-[#2D3748] mt-1">
                  {selectedSubject.label}
                </span>
              </>
            ) : (
              <span className="text-2xl text-slate-300 font-bold">?</span>
            )}
          </button>

          {/* Slot 2: Fait quoi ? */}
          <button
            type="button"
            onClick={() => setCurrentSlot('verb')}
            className={`min-h-[100px] rounded-2xl p-3 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
              currentSlot === 'verb'
                ? 'border-[#E84545] bg-rose-50/70 shadow-xs'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-[#6B7A8C] mb-1">Fait quoi ?</span>
            {selectedVerb ? (
              <>
                <span className="text-3xl">{selectedVerb.emoji}</span>
                <span className="font-['Fredoka'] text-sm font-bold text-[#2D3748] mt-1">
                  {selectedVerb.label}
                </span>
              </>
            ) : (
              <span className="text-2xl text-slate-300 font-bold">?</span>
            )}
          </button>

          {/* Slot 3: Quoi ? */}
          <button
            type="button"
            onClick={() => setCurrentSlot('object')}
            className={`min-h-[100px] rounded-2xl p-3 flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
              currentSlot === 'object'
                ? 'border-[#E84545] bg-rose-50/70 shadow-xs'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-[#6B7A8C] mb-1">Quoi ?</span>
            {selectedObject ? (
              <>
                <span className="text-3xl">{selectedObject.emoji}</span>
                <span className="font-['Fredoka'] text-sm font-bold text-[#2D3748] mt-1">
                  {selectedObject.label}
                </span>
              </>
            ) : (
              <span className="text-2xl text-slate-300 font-bold">?</span>
            )}
          </button>
        </div>

        {/* Read-out Full Sentence if complete */}
        {isSentenceComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between gap-4"
          >
            <span className="font-['Fredoka'] text-lg font-bold text-emerald-900 text-left">
              « {selectedSubject.label} {selectedVerb.label} {selectedObject.label}. »
            </span>
            <button
              type="button"
              onClick={() => speakText(`${selectedSubject.label} ${selectedVerb.label} ${selectedObject.label}.`, isAudioEnabled)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              🔊 Écouter
            </button>
          </motion.div>
        )}
      </div>

      {/* Choice Options for Current Slot */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#6B7A8C] mb-4 text-center">
          {currentSlot === 'subject' && '1. Choisis le personnage :'}
          {currentSlot === 'verb' && '2. Choisis l’action :'}
          {currentSlot === 'object' && '3. Choisis l’objet :'}
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {(currentSlot === 'subject' ? SUBJECTS : currentSlot === 'verb' ? VERBS : OBJECTS).map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (currentSlot === 'subject') handleSelectSubject(item);
                else if (currentSlot === 'verb') handleSelectVerb(item);
                else handleSelectObject(item);
              }}
              className="card-choice min-h-[80px] p-3 flex flex-col items-center justify-center gap-1.5"
            >
              <span className="text-3xl sm:text-4xl">{item.emoji}</span>
              <span className="font-['Fredoka'] text-sm sm:text-base font-bold text-[#2D3748]">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex gap-3">
        {isSentenceComplete ? (
          <button
            type="button"
            onClick={() => setIsFinished(true)}
            className="btn-tactile btn-tactile--communicate flex-1 text-base cursor-pointer"
          >
            Valider ma phrase ✨
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="btn-tactile btn-tactile--white flex-1 text-sm cursor-pointer"
          >
            Recommencer la phrase
          </button>
        )}
      </div>
    </div>
  );
}

