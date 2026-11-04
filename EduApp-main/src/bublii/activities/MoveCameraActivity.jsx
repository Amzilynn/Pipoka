import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import { createPoseDetector } from '../utils/mediapipePose';
import { STAR_GOAL, visiblePoint, makeStarTarget, handTouchesStar, bothHandsTouchStar } from '../utils/starCatch';
import TTSButton from '../components/TTSButton';

const SESSION_SECONDS = 60;
const STAR_PAUSE_MS = 2500;
const HOLD_MS = 800;
const MAX_SCORE = Math.ceil(SESSION_SECONDS * 1000 / STAR_PAUSE_MS);

function Star({ className = '' }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true" className={className}><path d="M50 5 L64 33 L95 38 L73 60 L78 92 L50 77 L22 92 L27 60 L5 38 L36 33 Z" fill="#FFD45D" stroke="#FFF8DC" strokeWidth="5" strokeLinejoin="round" /><circle cx="40" cy="49" r="3" fill="#745124" /><circle cx="60" cy="49" r="3" fill="#745124" /><path d="M40 60 Q50 69 60 60" fill="none" stroke="#745124" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export default function MoveCameraActivity({ childSettings, onComplete }) {
  const audioEnabled = childSettings?.audio !== false;
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState('prompt');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const [ready, setReady] = useState(false);
  const remainingRef = useRef(SESSION_SECONDS * 1000);
  const deadlineRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [hands, setHands] = useState([]);
  const [progress, setProgress] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [ratio, setRatio] = useState(4 / 3);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const runRef = useRef(0);
  const scoreRef = useRef(0);
  const targetRef = useRef(null);
  const lockedRef = useRef(false);
  const holdRef = useRef(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);
  const reminderRef = useRef({ text: null, time: -Infinity });

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      runRef.current += 1;
      clearTimeout(timerRef.current);
      stopStream();
      stopSpeech();
    };
  }, [stopStream]);

  useEffect(() => {
    if (!ready || !['camera', 'touch'].includes(mode)) return;
    const deadline = Date.now() + remainingRef.current;
    deadlineRef.current = deadline;
    const tick = () => {
      remainingRef.current = Math.max(0, deadline - Date.now());
      setRemaining(Math.ceil(remainingRef.current / 1000));
      if (remainingRef.current === 0) {
        lockedRef.current = true;
        clearTimeout(timerRef.current);
        setCelebrate(false);
        stopStream();
        setMode('finished');
      }
    };
    tick();
    const interval = setInterval(tick, 100);
    return () => {
      clearInterval(interval);
      remainingRef.current = Math.max(0, deadline - Date.now());
      deadlineRef.current = null;
    };
  }, [mode, ready, stopStream]);

  const catchStar = useCallback(() => {
    if (lockedRef.current || !deadlineRef.current || Date.now() >= deadlineRef.current) return;
    lockedRef.current = true;
    const next = ++scoreRef.current;
    setScore(next);
    setCelebrate(true);
    setProgress(0);
    speakText('Bravo ! Une étoile attrapée avec tes deux mains !', audioEnabled);
    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setCelebrate(false);
      targetRef.current = null;
      holdRef.current = null;
      setTarget(null);
      lockedRef.current = false;
    }, STAR_PAUSE_MS);
  }, [audioEnabled]);

  const switchToTouch = () => {
    runRef.current += 1;
    stopStream();
    holdRef.current = null;
    targetRef.current = null;
    setHands([]);
    setProgress(0);
    setReady(true);
    setMode('touch');
  };

  const startCamera = async () => {
    if (mode === 'starting') return;
    const run = ++runRef.current;
    setError('');
    setReady(false);
    setMode('starting');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('La caméra est indisponible. Tu peux jouer en touchant les étoiles.');
      setMode('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
      if (!mountedRef.current || run !== runRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      setMode('camera');
    } catch (err) {
      if (!mountedRef.current || run !== runRef.current) return;
      setError(err.name === 'NotAllowedError' ? 'Autorise la caméra dans ton navigateur, puis réessaie.' : 'La caméra ne peut pas démarrer. Vérifie qu’elle est disponible.');
      setMode('error');
    }
  };

  useEffect(() => {
    if (mode !== 'camera') return;
    let cancelled = false, detector = null, frame = null, sending = false, errors = 0, lastVideoTime = -1;
    const video = videoRef.current;
    const fail = text => {
      if (cancelled) return;
      stopStream();
      setError(text);
      setMode('error');
    };
    const remind = text => {
      setMessage(text);
      const now = performance.now();
      if (now - reminderRef.current.time >= 8000) {
        reminderRef.current = { text, time: now };
        speakText(text, audioEnabled);
      }
    };
    const onResults = results => {
      if (cancelled || lockedRef.current) return;
      const landmarks = results?.poseLandmarks;
      const wrists = [landmarks?.[15], landmarks?.[16]].filter(visiblePoint);
      setHands(wrists.map(p => ({ x: 1 - p.x, y: p.y })));
      if (wrists.length < 2) {
        holdRef.current = null;
        setProgress(0);
        if (wrists.length === 1) remind('Non, utilise tes deux mains ensemble pour attraper l’étoile !');
        else setMessage('Pour jouer, montre tes deux mains à la caméra.');
        return;
      }
      if (!visiblePoint(landmarks?.[11]) || !visiblePoint(landmarks?.[12])) {
        holdRef.current = null;
        setProgress(0);
        setMessage('Montre tes mains et tes épaules à la caméra.');
        return;
      }
      if (!targetRef.current) {
        targetRef.current = makeStarTarget(landmarks, scoreRef.current);
        setTarget(targetRef.current);
      }
      const touching = bothHandsTouchStar(landmarks, targetRef.current, video.videoWidth, video.videoHeight);
      const now = performance.now();
      if (touching) {
        if (!holdRef.current || now - holdRef.current.last > 300) holdRef.current = { start: now, last: now };
        holdRef.current.last = now;
        const held = Math.min(1, (now - holdRef.current.start) / HOLD_MS);
        setProgress(held);
        setMessage('Super, garde tes deux mains sur l’étoile un petit instant !');
        if (held >= 1) catchStar();
      } else {
        holdRef.current = null;
        setProgress(0);
        if (wrists.some(wrist => handTouchesStar(wrist, targetRef.current, video.videoWidth, video.videoHeight))) {
          remind('Non, utilise tes deux mains ensemble pour attraper l’étoile !');
        } else {
          setMessage('Approche tes deux mains ensemble de l’étoile.');
        }
      }
    };
    const loop = async () => {
      if (cancelled) return;
      if (video.readyState >= 2 && video.currentTime !== lastVideoTime && !lockedRef.current) {
        lastVideoTime = video.currentTime;
        sending = true;
        try { await detector.send({ image: video }); errors = 0; }
        catch { errors += 1; if (errors >= 3) fail('Le suivi des mains s’est arrêté. Réessaie ou choisis le jeu tactile.'); }
        finally { sending = false; if (cancelled) { await detector.close(); return; } }
      }
      if (!cancelled) frame = requestAnimationFrame(loop);
    };
    const timeout = setTimeout(() => fail('Le suivi met trop de temps à démarrer. Réessaie ou joue sans caméra.'), 45000);
    (async () => {
      try {
        setMessage('Préparation du jeu…');
        video.srcObject = streamRef.current;
        await video.play();
        if (cancelled) return;
        setRatio(video.videoWidth / video.videoHeight || 4 / 3);
        detector = await createPoseDetector(onResults);
        if (!detector) throw new Error('Detector unavailable');
        if (cancelled) { await detector.close(); return; }
        sending = true;
        try { await detector.initialize(); } finally { sending = false; }
        if (cancelled) { await detector.close(); return; }
        clearTimeout(timeout);
        setReady(true);
        setMessage('Montre tes mains et tes épaules.');
        speakText('Attrape chaque étoile avec tes deux mains ensemble. Garde-les sur l’étoile un petit instant.', audioEnabled);
        frame = requestAnimationFrame(loop);
      } catch {
        fail('Le suivi ne peut pas démarrer. Réessaie ou joue en touchant les étoiles.');
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      if (detector && !sending) Promise.resolve(detector.close()).catch(() => {});
      video.pause();
      video.srcObject = null;
      stopSpeech();
    };
  }, [mode, audioEnabled, catchStar, stopStream]);

  const button = 'min-h-[56px] rounded-2xl border-2 px-5 py-3 font-bold focus-visible:outline-4 focus-visible:outline-offset-2';
  if (mode === 'finished') return <div className="mx-auto max-w-xl space-y-5 rounded-3xl border-4 border-emerald-100 bg-white p-8 text-center">
    <Star className="mx-auto h-24 w-24" /><h2 className="font-['Fredoka'] text-3xl font-black text-emerald-800">Bravo ! La minute est terminée !</h2>
    <p className="text-2xl font-black text-amber-800">Score : {score} {score === 1 ? 'étoile attrapée' : 'étoiles attrapées'}</p>
    <button type="button" className="btn-tactile btn-tactile--move min-h-[64px] w-full text-xl" onClick={() => onComplete?.({ score, maxScore: MAX_SCORE, label: 'Attraper les étoiles', module: 'move' })}>Continuer</button>
  </div>;

  if (['prompt', 'starting', 'error'].includes(mode)) return <div className="mx-auto max-w-xl space-y-5 rounded-3xl border-4 border-emerald-100 bg-white p-6 text-center sm:p-8">
    <Star className="mx-auto h-24 w-24" /><h2 className="font-['Fredoka'] text-3xl font-black text-emerald-800">Attrape les étoiles !</h2>
    <p className="text-lg font-bold text-slate-600">Ce jeu se joue avec les deux mains ensemble ! Approche tes deux mains de la même étoile et garde-les dessus un petit instant pour marquer. Tu as 1 minute, assis ou debout, à ton rythme.</p>
    <p className="text-sm text-slate-500">La vidéo est traitée sur cet appareil. Elle n’est pas enregistrée.</p>
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4 font-bold text-amber-900">{error}</p>}
    <button type="button" disabled={mode === 'starting'} onClick={startCamera} className={`${button} w-full border-emerald-700 bg-emerald-700 text-white disabled:opacity-50`}>{mode === 'starting' ? 'Ouverture de la caméra…' : error ? 'Réessayer la caméra' : 'Jouer avec la caméra'}</button>
    <button type="button" onClick={switchToTouch} className={`${button} w-full border-slate-200 bg-slate-50 text-slate-700`}>Jouer en touchant les étoiles</button>
  </div>;

  const touchTarget = [{ x: .5, y: .35 }, { x: .28, y: .5 }, { x: .72, y: .5 }, { x: .35, y: .3 }, { x: .65, y: .3 }][score % STAR_GOAL];
  const star = mode === 'touch' ? touchTarget : target;
  return <div className="mx-auto w-full max-w-3xl space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4">
      <h2 className="font-['Fredoka'] text-2xl font-bold text-slate-800">Attrape l’étoile</h2>
      <span className="rounded-xl bg-amber-50 px-4 py-2 text-xl font-black text-amber-800" aria-label={`Score : ${score} étoiles`}>Score : {score} ⭐</span>
      <span role="timer" aria-label={`Temps restant : ${remaining} secondes`} className="rounded-xl bg-emerald-50 px-4 py-2 text-xl font-black tabular-nums text-emerald-800">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>
      <TTSButton text={"Attrape l’étoile avec tes deux mains ensemble."} />
    </div>
    <p className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3 text-center text-xl font-black text-emerald-800" aria-live="polite">{celebrate ? 'Bravo !' : 'Utilise tes deux mains ensemble !'}</p>
    <div className="relative overflow-hidden rounded-3xl border-4 border-emerald-300 bg-[#E8F3F0]" style={{ aspectRatio: ratio }}>
      {mode === 'camera' && <video ref={videoRef} muted playsInline autoPlay className="h-full w-full -scale-x-100" />}
      {hands.map((p, i) => <span key={i} aria-hidden="true" className="pointer-events-none absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-emerald-400/60" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }} />)}
      {star && !celebrate && <motion.div key={score} initial={reduceMotion ? false : { scale: .8 }} animate={{ scale: 1 }} className="absolute h-[23%] aspect-square" style={{ x: '-50%', y: '-50%', left: `${star.x * 100}%`, top: `${star.y * 100}%` }}>
        {mode === 'touch' ? <button type="button" onClick={catchStar} aria-label="Attraper l’étoile" className="h-full min-h-[64px] w-full min-w-[64px] rounded-full focus-visible:outline-4 focus-visible:outline-emerald-700"><Star className="h-full w-full" /></button> : <Star className="pointer-events-none h-full w-full" />}
      </motion.div>}
      {celebrate && <div role="status" className="absolute inset-0 flex flex-col items-center justify-center bg-white/80"><Star className="h-24 w-24" /><p className="font-['Fredoka'] text-3xl font-black text-emerald-800">Bravo !</p></div>}
    </div>
    <p role="status" className="min-h-[48px] text-center text-lg font-bold text-slate-700">{mode === 'camera' ? message : 'Touche l’étoile avec tes deux mains ensemble.'}</p>
    {mode === 'camera' && <>
      <div role="progressbar" aria-label="Étoile presque attrapée" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="h-3 overflow-hidden rounded-full bg-emerald-100"><div className="h-full bg-emerald-600" style={{ width: `${progress * 100}%` }} /></div>
      <button type="button" onClick={switchToTouch} className={`${button} w-full border-slate-200 bg-white text-slate-700`}>Jouer sans caméra</button>
    </>}
  </div>;
}
