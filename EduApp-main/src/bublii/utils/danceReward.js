import { useEffect, useRef, useCallback } from 'react';

export function useDanceReward(enabled) {
  const context = useRef(null);
  const voices = useRef([]);
  const stop = useCallback(() => {
    voices.current.forEach(node => { try { node.stop(); } catch {} });
    voices.current = [];
  }, []);
  const unlock = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!context.current && AudioContext) context.current = new AudioContext();
      context.current?.resume().catch(() => {});
    } catch { /* Visual feedback remains available. */ }
  }, []);
  const play = useCallback(() => {
    stop();
    if (!enabled || !context.current || context.current.state !== 'running') return;
    const audio = context.current;
    // A short original, gentle melody; no external audio requests.
    [261.63, 329.63, 392, 329.63, 349.23, 440, 392, 523.25].forEach((frequency, i) => {
      const note = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + 0.9 + i * 0.34;
      note.type = 'sine'; note.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
      note.connect(gain); gain.connect(audio.destination);
      note.onended = () => { note.disconnect(); gain.disconnect(); };
      voices.current.push(note);
      note.start(start); note.stop(start + 0.34);
    });
  }, [enabled, stop]);
  useEffect(() => { if (!enabled) stop(); }, [enabled, stop]);
  useEffect(() => () => { stop(); context.current?.close().catch(() => {}); }, [stop]);
  return { unlock, play, stop };
}