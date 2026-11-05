import React, { useEffect, useRef, useState } from 'react';
import { createPoseDetector } from '../utils/mediapipePose';
import { matchesSequencePose } from '../utils/sequencePose';

export default function SequenceCamera({ gesture, disabled, paused, demonstrating = false, celebrating, model, onMatch, onInteraction, matchPose = matchesSequencePose }) {
  const [mode, setMode] = useState('off');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const generation = useRef(0);
  const latest = useRef({ gesture, disabled, onMatch, matchPose });
  latest.current = { gesture, disabled, onMatch, matchPose };
  const stop = () => {
    generation.current += 1;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };
  useEffect(() => () => stop(), []);
  const start = async () => {
    onInteraction();
    stop();
    const run = generation.current;
    setMode('starting');
    setMessage('Autorise la caméra pour commencer.');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unavailable');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      if (run !== generation.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      setMode('camera');
    } catch (error) {
      if (run !== generation.current) return;
      setMode('error');
      setMessage(error.name === 'NotAllowedError' ? 'Autorise la caméra dans le navigateur, puis réessaie. Tu peux aussi jouer sans caméra.' : 'Caméra indisponible. Vérifie son branchement ou joue sans caméra.');
    }
  };
  useEffect(() => {
    if (mode !== 'camera') return;
    let cancelled = false, detector, frame, sending = false, held = null, previousGesture, lastTime = -1, errors = 0;
    const video = videoRef.current;
    const close = () => { if (detector) Promise.resolve(detector.close()).catch(() => {}); };
    const fail = () => {
      if (cancelled) return;
      stop(); setMode('error'); setProgress(0);
      setMessage('Le suivi ne peut pas démarrer. Réessaie ou joue sans caméra.');
    };
    const timeout = setTimeout(fail, 45000);
    const results = result => {
      if (cancelled) return;
      const current = latest.current;
      if (current.disabled || document.hidden || previousGesture !== current.gesture) { held = null; setProgress(0); }
      previousGesture = current.gesture;
      if (current.disabled || document.hidden) return;
      const match = current.matchPose(result.poseLandmarks, current.gesture, video.videoWidth / video.videoHeight);
      const now = performance.now();
      if (!match.visible) {
        held = null; setProgress(0); setMessage('Montre tes mains, ta tête et tes épaules. Tu peux rester assis.'); return;
      }
      if (!match.matches) {
        held = null; setProgress(0); setMessage('À toi ! Prends tout ton temps.'); return;
      }
      if (!held || now - held.last > 350) held = { start: now, last: now };
      held.last = now;
      const amount = Math.min(1, (now - held.start) / (current.gesture === 'clap' ? 300 : 650));
      setProgress(amount);
      setMessage('Oui, garde le geste un petit instant !');
      if (amount === 1) { held = null; current.onMatch(current.gesture); }
    };
    const loop = async () => {
      if (cancelled) return;
      if (latest.current.disabled) { held = null; }
      if (video.readyState >= 2 && video.currentTime !== lastTime && !document.hidden && !latest.current.disabled) {
        lastTime = video.currentTime; sending = true;
        try { await detector.send({ image: video }); errors = 0; }
        catch { if (++errors >= 3) { fail(); return; } }
        finally { sending = false; if (cancelled) close(); }
      }
      if (!cancelled) frame = requestAnimationFrame(loop);
    };
    (async () => {
      try {
        setMessage('Préparation du suivi des mouvements…');
        video.srcObject = streamRef.current;
        await video.play();
        if (cancelled) return;
        detector = await createPoseDetector(results);
        if (!detector) throw new Error('detector');
        if (cancelled) { close(); return; }
        sending = true;
        try { await detector.initialize(); } finally { sending = false; }
        if (cancelled) { close(); return; }
        clearTimeout(timeout);
        setMessage('À toi ! Prends tout ton temps.');
        frame = requestAnimationFrame(loop);
      } catch { fail(); }
    })();
    return () => {
      cancelled = true; clearTimeout(timeout); cancelAnimationFrame(frame);
      video.pause(); video.srcObject = null;
      if (!sending) close();
    };
  }, [mode]);
  return <div className="p-3 sm:p-5">
    <div className="grid grid-cols-2 gap-2 sm:gap-5">
      <div className="min-w-0 rounded-2xl border-2 border-[#D3E4DA] bg-[#F5F9F6] overflow-hidden">
        <p className="py-2 text-center text-sm sm:text-lg font-bold text-[#245C46]">Regarde le modèle</p>
        <div className="w-full" style={{ aspectRatio: '1 / 1' }}>{model}</div>
      </div>
      <div className="min-w-0 rounded-2xl border-2 border-[#D3E4DA] bg-[#F3F5F8] overflow-hidden">
        <p className="py-2 text-center text-sm sm:text-lg font-bold text-slate-700">{demonstrating ? 'Observe le modèle' : 'À toi !'}</p>
        <div className="relative flex items-center justify-center w-full bg-slate-100" style={{ aspectRatio: '1 / 1' }}>
          {mode === 'camera' ? <>
            <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full -scale-x-100 object-contain" />
            {paused && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-white text-xl font-bold">Pause</div>}
            {celebrating && <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/95 py-2 text-center text-lg font-bold text-emerald-800">✓ Bravo !</div>}
          </> : <div className="px-2 sm:px-5 text-center text-slate-600">
            <svg viewBox="0 0 80 64" aria-hidden="true" className="mx-auto mb-2 h-10 sm:h-16 w-16 sm:w-20" fill="none" stroke="currentColor" strokeWidth="3"><rect x="6" y="16" width="48" height="36" rx="9" /><path d="M54 28 L73 19 V49 L54 40" /><circle cx="29" cy="34" r="9" /></svg>
            <p className="text-sm sm:text-lg">{demonstrating ? 'Regarde d’abord le mouvement du modèle.' : 'Fais le geste comme le modèle.'}</p>
          </div>}
        </div>
      </div>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
      {mode !== 'camera' && <button type="button" onClick={start} disabled={mode === 'starting'} className="min-h-[52px] rounded-2xl bg-[#28684F] px-5 py-3 font-bold text-white disabled:opacity-50">{mode === 'starting' ? 'Ouverture…' : mode === 'error' ? 'Réessayer la caméra' : 'Activer ma caméra'}</button>}
      {(mode === 'camera' || mode === 'starting') && <button type="button" onClick={() => { stop(); setMode('off'); setProgress(0); setMessage('Caméra arrêtée. Tu peux continuer avec un adulte.'); }} className="min-h-[48px] rounded-xl border-2 border-slate-300 px-4 font-bold text-slate-700">Arrêter la caméra</button>}
    </div>
    {mode === 'camera' && <progress aria-label="Geste reconnu" value={disabled ? 0 : progress} max="1" className="mt-3 w-full h-3 accent-emerald-700" />}
    <p role="status" aria-live="polite" className="mt-2 min-h-[24px] text-center text-sm sm:text-base text-slate-600">{paused ? 'Reprends quand tu veux.' : celebrating ? 'Super, on continue doucement.' : demonstrating ? 'Regarde le modèle. Ce sera ensuite à toi !' : message || 'Tu peux aussi jouer sans caméra avec un adulte.'}</p>
  </div>;
}