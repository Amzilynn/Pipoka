import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';

// Real photographic AAC building cards — NO EMOJIS
const SUBJECTS = [
  { id: 'garcon', label: 'Le garçon', image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80' },
  { id: 'fille', label: 'La fille', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80' },
  { id: 'chat', label: 'Le chat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80' },
];

const VERBS = [
  { id: 'mange', label: 'mange', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&q=80' },
  { id: 'boit', label: 'boit', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80' },
];

const OBJECTS = [
  { id: 'pomme', label: 'une pomme', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80' },
  { id: 'eau', label: 'de l’eau', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80' },
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
      speakText('Choisis qui fait l’action pour commencer la phrase.', isAudioEnabled);
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

    if (selectedSubject && selectedVerb) {
      setTimeout(() => {
        const full = `${selectedSubject.label} ${selectedVerb.label} ${o.label}.`;
        speakText(`Bravo ! ${full}`, isAudioEnabled);
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
  const sentenceText = isSentenceComplete
    ? `${selectedSubject.label} ${selectedVerb.label} ${selectedObject.label}.`
    : '';

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
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#E84545]/30 shadow-2xl space-y-6">
        <div className="text-8xl animate-bounce">⭐</div>
        <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#E84545]">
          Bravo champion !
        </h2>
        <p className="text-lg text-[#64748B] font-bold">
          Tu as construit une belle phrase complète !
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
          Construire une phrase
        </span>
        {isSentenceComplete ? (
          <TTSButton text={sentenceText} size="sm" />
        ) : (
          <TTSButton text="Touche une photo pour faire la phrase." size="sm" />
        )}
      </div>

      {/* Sentence Builder Visual Slots */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-7 border-4 border-[#E84545]/30 shadow-md">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Slot 1: Subject */}
          <div
            className={`p-3 rounded-2xl border-3 text-center min-h-[110px] flex flex-col items-center justify-center transition-all ${
              selectedSubject
                ? 'bg-rose-50 border-[#E84545]'
                : currentSlot === 'subject'
                ? 'bg-white border-[#E84545] border-dashed ring-4 ring-[#E84545]/20 animate-pulse'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {selectedSubject ? (
              <>
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs mb-1">
                  <img src={selectedSubject.image} alt={selectedSubject.label} className="w-full h-full object-cover" />
                </div>
                <span className="font-['Fredoka'] text-sm font-black text-[#1E293B]">{selectedSubject.label}</span>
              </>
            ) : (
              <span className="text-xs font-black text-[#64748B]">1. Qui ?</span>
            )}
          </div>

          {/* Slot 2: Verb */}
          <div
            className={`p-3 rounded-2xl border-3 text-center min-h-[110px] flex flex-col items-center justify-center transition-all ${
              selectedVerb
                ? 'bg-rose-50 border-[#E84545]'
                : currentSlot === 'verb'
                ? 'bg-white border-[#E84545] border-dashed ring-4 ring-[#E84545]/20 animate-pulse'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {selectedVerb ? (
              <>
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs mb-1">
                  <img src={selectedVerb.image} alt={selectedVerb.label} className="w-full h-full object-cover" />
                </div>
                <span className="font-['Fredoka'] text-sm font-black text-[#1E293B]">{selectedVerb.label}</span>
              </>
            ) : (
              <span className="text-xs font-black text-[#64748B]">2. Fait quoi ?</span>
            )}
          </div>

          {/* Slot 3: Object */}
          <div
            className={`p-3 rounded-2xl border-3 text-center min-h-[110px] flex flex-col items-center justify-center transition-all ${
              selectedObject
                ? 'bg-rose-50 border-[#E84545]'
                : currentSlot === 'object'
                ? 'bg-white border-[#E84545] border-dashed ring-4 ring-[#E84545]/20 animate-pulse'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {selectedObject ? (
              <>
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs mb-1">
                  <img src={selectedObject.image} alt={selectedObject.label} className="w-full h-full object-cover" />
                </div>
                <span className="font-['Fredoka'] text-sm font-black text-[#1E293B]">{selectedObject.label}</span>
              </>
            ) : (
              <span className="text-xs font-black text-[#64748B]">3. Quoi ?</span>
            )}
          </div>
        </div>

        {/* Full Sentence Spoken Display */}
        {isSentenceComplete ? (
          <div className="bg-[#FFF5F5] border-2 border-[#E84545] rounded-2xl p-4 text-center">
            <p className="font-['Fredoka'] text-2xl font-black text-[#E84545]">
              « {sentenceText} »
            </p>
          </div>
        ) : (
          <p className="text-center text-xs font-bold text-[#64748B]">
            Touche une photo ci-dessous pour compléter la phrase :
          </p>
        )}
      </div>

      {/* Choice Drawer based on current slot */}
      <div className="bg-white rounded-[2.5rem] p-6 text-center border-4 border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(currentSlot === 'subject'
            ? SUBJECTS
            : currentSlot === 'verb'
            ? VERBS
            : OBJECTS
          ).map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (currentSlot === 'subject') handleSelectSubject(item);
                else if (currentSlot === 'verb') handleSelectVerb(item);
                else handleSelectObject(item);
              }}
              className="p-3.5 rounded-2xl border-3 border-slate-200 hover:border-[#E84545] bg-white flex flex-col items-center gap-2 cursor-pointer shadow-sm"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
              </div>
              <span className="font-['Fredoka'] text-lg font-black text-[#1E293B]">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>

        {selectedSubject && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-black text-[#64748B] hover:text-[#1E293B] bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            Recommencer la phrase ↺
          </button>
        )}
      </div>

      {/* Success Done Button */}
      {isSentenceComplete && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsFinished(true)}
            className="btn-tactile btn-tactile--communicate w-full min-h-[64px] text-xl font-['Fredoka'] cursor-pointer shadow-lg"
          >
            Valider ma phrase ✨
          </button>
        </div>
      )}
    </div>
  );
}
