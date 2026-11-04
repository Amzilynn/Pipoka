import { useCallback, useEffect, useRef, useState } from 'react';
import { speakText } from './speech';

export function useMovementSound(audioEnabled) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const activeAudio = useRef(null);
  const stopCue = useCallback(() => {
    if (activeAudio.current) {
      activeAudio.current.onended = null;
      activeAudio.current.pause();
      activeAudio.current = null;
    }
  }, []);
  useEffect(() => stopCue, [stopCue]);
  useEffect(() => { if (!audioEnabled || !soundEnabled) stopCue(); }, [audioEnabled, soundEnabled, stopCue]);
  const playCue = useCallback((id, words) => {
    stopCue();
    if (!audioEnabled) return;
    if (!soundEnabled) { speakText(words, true); return; }
    const clip = new Audio(`/assets/audio/movement/${id}.wav`);
    activeAudio.current = clip;
    clip.volume = 0.55;
    const finish = () => {
      if (activeAudio.current !== clip) return;
      activeAudio.current = null;
      speakText(words, true);
    };
    clip.onended = finish;
    clip.onerror = finish;
    clip.play().catch(finish);
  }, [audioEnabled, soundEnabled, stopCue]);
  return { playCue, stopCue, soundEnabled, setSoundEnabled };
}
