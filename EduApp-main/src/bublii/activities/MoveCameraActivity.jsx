import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import {
  createPoseDetector,
  evaluatePoseMovement,
  drawSkeletalLandmarks,
} from '../utils/mediapipePose';

// Supported movements
const POSE_MOVEMENTS = [
  {
    id: 'arms-up',
    title: 'Lève les bras',
    instruction: 'Lève tes deux bras bien haut au-dessus de la tête !',
    demoImage: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80',
    color: '#22A06B',
  },
  {
    id: 'touch-head',
    title: 'Touche ta tête',
    instruction: 'Pose doucement tes mains sur le haut de ta tête !',
    demoImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    color: '#2A6FB5',
  },
];

export default function MoveCameraActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [mode, setMode] = useState('prompt'); // 'prompt' | 'camera' | 'alternative' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [framingMessage, setFramingMessage] = useState('Positionne-toi debout face à l’écran');
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Alternative tactile mode state
  const [alternativeProgress, setAlternativeProgress] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseDetectorRef = useRef(null);
  const animFrameRef = useRef(null);
  const holdCounterRef = useRef(0);
  const isAdvancingRef = useRef(false);

  const activeMove = POSE_MOVEMENTS[currentStep] || POSE_MOVEMENTS[0];

  // Stop all camera tracks and clean up
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (poseDetectorRef.current && typeof poseDetectorRef.current.close === 'function') {
      try {
        poseDetectorRef.current.close();
      } catch {
        // ignore
      }
      poseDetectorRef.current = null;
    }
  }, []);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeech();
    };
  }, [stopCamera]);

  // Audio instruction on step change
  useEffect(() => {
    if (isAudioEnabled && !isFinished && mode !== 'prompt') {
      speakText(`${activeMove.title}. ${activeMove.instruction}`, isAudioEnabled);
    }
    holdCounterRef.current = 0;
  }, [currentStep, isAudioEnabled, isFinished, mode, activeMove]);

  // Advance to next movement with celebration
  const handleSuccess = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setIsSuccessFeedback(true);
    setScore((s) => s + 1);
    speakText('Bravo ! Mouvement réussi !', isAudioEnabled);

    setTimeout(() => {
      setIsSuccessFeedback(false);

      if (currentStep + 1 < POSE_MOVEMENTS.length) {
        setCurrentStep((s) => s + 1);
        holdCounterRef.current = 0;
        isAdvancingRef.current = false;
      } else {
        stopCamera();
        setIsFinished(true);
      }
    }, 1600);
  }, [currentStep, isAudioEnabled, stopCamera]);

  // MediaPipe Pose results callback
  const handlePoseResults = useCallback(
    (results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const landmarks = results?.poseLandmarks;
      if (!landmarks) {
        setFramingMessage('Recule-toi pour qu’on voie tout ton corps 🧍');
        return;
      }

      // Biomechanical evaluation of posture & movement
      const evaluation = evaluatePoseMovement(landmarks, activeMove.id);
      setFramingMessage(evaluation.message);

      // Draw skeleton on canvas in mirror mode
      drawSkeletalLandmarks(ctx, landmarks, W, H, evaluation.isGestureValid);

      // Require temporal stability (hold gesture for ~800ms)
      if (evaluation.isGestureValid) {
        holdCounterRef.current += 1;
        if (holdCounterRef.current >= 6) {
          handleSuccess();
        }
      } else {
        holdCounterRef.current = Math.max(0, holdCounterRef.current - 1);
      }
    },
    [activeMove.id, handleSuccess]
  );

  // Video frame inference loop
  const startInferenceLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const loop = async () => {
      if (!streamRef.current || !videoRef.current) return;

      if (video.readyState >= 2 && poseDetectorRef.current && !isAdvancingRef.current) {
        try {
          await poseDetectorRef.current.send({ image: video });
        } catch {
          // ignore frame errors
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  // Initialize camera and MediaPipe Pose
  const handleStartCamera = async () => {
    setErrorMessage('');
    setFramingMessage('Connexion à la caméra…');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("La caméra n'est pas disponible sur ce navigateur.");
      setMode('error');
      return;
    }

    try {
      // 1. Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setMode('camera');

      // 2. Attach video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // 3. Initialize MediaPipe Pose model
      setFramingMessage('Chargement du modèle de pose…');
      const detector = await createPoseDetector(handlePoseResults);

      if (detector) {
        poseDetectorRef.current = detector;
        setFramingMessage('Mets-toi debout face à l’écran 🧍');
        startInferenceLoop();
      } else {
        setFramingMessage('Caméra active • Mode visuel prêt');
      }
    } catch (err) {
      console.warn('Camera error:', err);
      let msg = "Accès à la caméra refusé ou indisponible.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Clique sur 'Autoriser' dans ton navigateur pour utiliser la caméra.";
      }
      setErrorMessage(msg);
      setMode('error');
    }
  };

  // Video Ref Callback guarantees stream binding
  const setVideoCallback = useCallback((el) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  // Canvas Ref Callback
  const setCanvasCallback = useCallback((el) => {
    canvasRef.current = el;
    if (el) {
      el.width = el.parentElement?.clientWidth || 640;
      el.height = el.parentElement?.clientHeight || 480;
    }
  }, []);

  // Alternative mode interaction
  const handleAlternativeTap = () => {
    const next = alternativeProgress + 1;
    setAlternativeProgress(next);
    if (next >= 2) {
      handleSuccess();
      setAlternativeProgress(0);
    } else {
      speakText('Encore une fois pour valider !', isAudioEnabled);
    }
  };

  const handleFinish = () => {
    stopCamera();
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Imiter le mouvement',
      module: 'move',
    });
  };

  // 1. VICTORY SCREEN
  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#22A06B]/30 shadow-2xl space-y-6">
        <div className="text-8xl animate-bounce">🏆</div>
        <h2 className="font-['Fredoka'] text-4xl sm:text-5xl font-black text-[#22A06B]">
          Bravo champion !
        </h2>
        <p className="text-xl text-[#64748B] font-bold">
          Tu as réussi les mouvements avec ton corps !
        </p>

        <div className="flex items-center justify-center gap-4 text-6xl py-3">
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
          className="btn-tactile btn-tactile--move w-full min-h-[68px] text-2xl font-['Fredoka'] cursor-pointer shadow-xl"
        >
          Continuer ✨
        </button>
      </div>
    );
  }

  // 2. WELCOME / PROMPT SCREEN
  if (mode === 'prompt') {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 text-center max-w-xl mx-auto border-4 border-[#22A06B]/30 shadow-2xl space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-[#E6FFFA] flex items-center justify-center text-6xl shadow-sm">
          🧍
        </div>

        <div>
          <h2 className="font-['Fredoka'] text-3xl sm:text-4xl font-black text-[#22A06B] mb-2">
            Imiter le mouvement
          </h2>
          <p className="text-base text-[#64748B] font-bold leading-relaxed max-w-md mx-auto">
            Mets-toi debout pour bouger ton corps devant l’écran !
          </p>
        </div>

        {/* Privacy note */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-left flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <p className="text-xs text-emerald-950 font-bold leading-relaxed">
            <span className="block font-black text-emerald-900 mb-0.5">100% sécurisé et local :</span>
            Aucune image n'est enregistrée ni transmise. Tout reste sur ton appareil.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleStartCamera}
            className="btn-tactile btn-tactile--move w-full min-h-[68px] text-2xl font-['Fredoka'] cursor-pointer flex items-center justify-center gap-3 shadow-xl"
          >
            <span>Allumer la caméra</span>
            <span className="text-3xl">📷</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('alternative')}
            className="w-full min-h-[56px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 font-['Fredoka'] text-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Jouer sans caméra (Mode tactile) ✋</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. ERROR SCREEN
  if (mode === 'error') {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 text-center max-w-xl mx-auto border-4 border-amber-300 shadow-xl space-y-6">
        <div className="text-6xl">⚠️</div>
        <h3 className="font-['Fredoka'] text-3xl font-black text-[#1E293B]">
          Caméra non accessible
        </h3>
        <p className="text-base text-[#64748B] font-bold">
          {errorMessage || "Impossible d'accéder à la caméra."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={handleStartCamera}
            className="btn-tactile btn-tactile--move px-6 min-h-[56px] text-lg font-['Fredoka'] cursor-pointer"
          >
            Réessayer 🔄
          </button>
          <button
            type="button"
            onClick={() => setMode('alternative')}
            className="px-6 min-h-[56px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 font-['Fredoka'] text-base font-bold cursor-pointer"
          >
            Jouer sans caméra ✋
          </button>
        </div>
      </div>
    );
  }

  // 4. ALTERNATIVE TACTILE MODE (No penalty)
  if (mode === 'alternative') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-[2rem] px-6 py-4 border-3 border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl select-none">✋</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#22A06B] block">
                Mode sans caméra • Geste {currentStep + 1} / {POSE_MOVEMENTS.length}
              </span>
              <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B]">
                {activeMove.title}
              </h2>
            </div>
            <TTSButton text={activeMove.instruction} size="sm" />
          </div>

          <button
            type="button"
            onClick={handleStartCamera}
            className="min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 transition-all cursor-pointer"
          >
            Activer caméra 📷
          </button>
        </div>

        {/* Guided Demonstration Card */}
        <div className="bg-white rounded-[2.5rem] p-7 text-center border-4 border-[#22A06B]/30 shadow-md space-y-5">
          <div className="w-52 h-52 mx-auto rounded-3xl overflow-hidden shadow-md border-4 border-white bg-slate-100">
            <img
              src={activeMove.demoImage}
              alt={activeMove.title}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-['Fredoka'] text-3xl font-black text-[#1E293B]">
            {activeMove.instruction}
          </h3>

          <button
            type="button"
            onClick={handleAlternativeTap}
            className="btn-tactile btn-tactile--move w-full max-w-md mx-auto min-h-[72px] text-2xl font-['Fredoka'] cursor-pointer shadow-xl flex items-center justify-center gap-3"
          >
            <span>J'ai fait le mouvement !</span>
            <span className="bg-white/30 px-3 py-1 rounded-full text-base font-black">
              {alternativeProgress} / 2
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 5. ACTIVE CAMERA MODE (Real-time MediaPipe Pose Landmarks)
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Banner: Step & Audio */}
      <div className="bg-white rounded-[2rem] px-6 py-4 border-3 border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#22A06B] block">
              Geste {currentStep + 1} / {POSE_MOVEMENTS.length}
            </span>
            <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B]">
              {activeMove.title}
            </h2>
          </div>
          <TTSButton text={activeMove.instruction} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          {/* Score Counter */}
          <div className="flex items-center gap-2 bg-[#FFFDF0] border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-xs">
            <span className="text-2xl">⭐</span>
            <span className="font-['Fredoka'] text-2xl font-black text-[#1E293B]">{score}</span>
          </div>

          {/* Switch to alternative */}
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setMode('alternative');
            }}
            className="min-h-[48px] px-3.5 py-1.5 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 transition-all cursor-pointer"
          >
            Sans caméra ✋
          </button>
        </div>
      </div>

      {/* Main Camera Stage with Live Skeleton Overlay */}
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#22A06B] relative aspect-[4/3] sm:aspect-video flex items-center justify-center">
          {/* Mirrored Video Feed */}
          <video
            ref={setVideoCallback}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover transform -scale-x-100"
          />

          {/* Real-time Skeleton Overlay */}
          <canvas
            ref={setCanvasCallback}
            className="absolute inset-0 pointer-events-none w-full h-full transform -scale-x-100"
          />

          {/* Dynamic Framing & Pose Guidance Pill */}
          <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none px-4">
            <div className="bg-black/80 backdrop-blur-md text-white font-['Fredoka'] text-sm sm:text-base font-bold px-5 py-2 rounded-full border border-white/25 flex items-center gap-2 shadow-lg">
              <span>{framingMessage}</span>
            </div>
          </div>

          {/* Live Landmark Tracker Badge */}
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pose Tracker actif</span>
          </div>

          {/* Success Overlay when detected */}
          <AnimatePresence>
            {isSuccessFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white z-30 space-y-2"
              >
                <span className="text-8xl animate-bounce">⭐</span>
                <h3 className="font-['Fredoka'] text-5xl font-black">Bravo !</h3>
                <p className="text-2xl font-bold">+1 Étoile ⭐</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Safety tactile button (child is never blocked) */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleSuccess}
            className="btn-tactile btn-tactile--move w-full min-h-[64px] text-2xl font-['Fredoka'] cursor-pointer shadow-lg flex items-center justify-center gap-3"
          >
            <span>J'ai fait le geste !</span>
            <span className="text-3xl">⭐</span>
          </button>
        </div>
      </div>
    </div>
  );
}
