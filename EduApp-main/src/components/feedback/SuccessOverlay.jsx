import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button from '../ui/Button';
import { useSpeech } from '../../hooks/useSpeech';

export default function SuccessOverlay({ onNext, isAr, noAudio }) {
  const { speak } = useSpeech();

  useEffect(() => {
    // Trigger confetti
    const end = Date.now() + 2 * 1000;
    const colors = ['#FFD93D', '#6BCB77', '#FF6B6B', '#4D96FF', '#C77DFF'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Play bravo audio - REMOVED as per user request to disable automatic playback
    /*
    if (!noAudio) {
      setTimeout(() => {
        speak(isAr ? 'أحسنت! لقد نجحت!' : 'Bravo ! Tu as tout réussi !');
      }, 500);
    }
    */
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center"
      style={{ background: 'rgba(255,251,240,0.9)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-white rounded-[32px] p-10 shadow-2xl border-[4px] border-[#FFD93D] max-w-md w-full"
      >
        <div className="text-8xl mb-6 float">🏆</div>
        <h2 className="text-4xl font-black text-[#2D2D2D] mb-2">
          {isAr ? 'أحسنت!' : 'Bravo !'}
        </h2>
        <p className="text-xl font-bold text-[#6B6B6B] mb-10">
          {isAr ? 'لقد أكملت النشاط بنجاح' : 'Tu as terminé l\'activité !'}
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-3 mb-4">
             {[1,2,3].map(i => (
               <motion.span 
                 key={i} 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 transition={{ delay: 0.5 + (i*0.2), type: 'spring' }}
                 className="text-5xl"
               >⭐</motion.span>
             ))}
          </div>
          
          <Button size="lg" onClick={onNext} pulse>
            {isAr ? 'التالي ←' : 'Suivant →'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
