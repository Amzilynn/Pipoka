import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText, stopSpeech } from '../utils/speech';
import TTSButton from '../components/TTSButton';
import {
  waitForOpenCV,
  isOpenCvAvailable,
  cleanupOpenCvState,
} from '../utils/opencv';

// 3 clear, intuitive standing movements with spatial target bubbles
const STANDING_MOVEMENTS = [
  {
    id: 'arms-up',
    title: 'Lève les bras !',
    voicePrompt: 'Lève tes deux bras bien haut pour toucher les étoiles !',
    icon: '🙌',
    color: '#22A06B',
    instruction: 'Touche les 2 étoiles en haut avec tes mains',
    targetType: 'dual-top', // Left + Right top targets
  },
  {
    id: 'touch-head',
    title: 'Touche ta tête !',
    voicePrompt: 'Pose tes deux mains sur ta tête !',
    icon: '🙆',
    color: '#2A6FB5',
    instruction: 'Pose tes mains sur la couronne au-dessus de ta tête',
    targetType: 'head-crown', // Top center target
  },
  {
    id: 'clap',
    title: 'Applaudis !',
    voicePrompt: 'Applaudis fort avec tes deux mains !',
    icon: '👏',
    color: '#F5A623',
    instruction: 'Tape dans tes mains au centre de la cible',
    targetType: 'center-clap', // Mid-chest center target
  },
];

export default function MoveCameraActivity({ childSettings, onComplete }) {
  const isAudioEnabled = childSettings?.audio !== false;

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isOpenCvReady, setIsOpenCvReady] = useState(isOpenCvAvailable());
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 100% hold progress
  const [isSuccessOverlay, setIsSuccessOverlay] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isTactileMode, setIsTactileMode] = useState(false);

  const videoRef = useRef(null);
  const procCanvasRef = useRef(null);
  const visualOverlayRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const prevFrameRef = useRef(null);
  const dwellCounterRef = useRef(0);
  const openCvStateRef = useRef({ prevGray: null });

  const activeMove = STANDING_MOVEMENTS[currentStep] || STANDING_MOVEMENTS[0];

  // Initialize OpenCV WebAssembly runtime
  useEffect(() => {
    waitForOpenCV().then((cv) => {
      if (cv) setIsOpenCvReady(true);
    });
  }, []);

  // Stop camera tracks cleanly
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
    cleanupOpenCvState(openCvStateRef.current);
    setCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeech();
    };
  }, [stopCamera]);

  // Audio instruction on movement change
  useEffect(() => {
    if (isAudioEnabled && !isFinished) {
      speakText(activeMove.voicePrompt, isAudioEnabled);
    }
    dwellCounterRef.current = 0;
    setDwellProgress(0);
  }, [currentStep, isAudioEnabled, isFinished, activeMove]);

  // Success handler with smooth transition
  const handleSuccessDetection = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setIsSuccessOverlay(true);
    setScore((s) => s + 1);
    speakText('Bravo ! Super mouvement !', isAudioEnabled);

    setTimeout(() => {
      setIsSuccessOverlay(false);

      if (currentStep + 1 < STANDING_MOVEMENTS.length) {
        setCurrentStep((s) => s + 1);
        dwellCounterRef.current = 0;
        setDwellProgress(0);
        prevFrameRef.current = null;
        cleanupOpenCvState(openCvStateRef.current);
        isTransitioningRef.current = false;
      } else {
        stopCamera();
        setIsFinished(true);
      }
    }, 1600);
  }, [currentStep, isAudioEnabled, stopCamera]);

  // Render high-clarity target bubbles on top of the live video
  const renderVisualTargetBubbles = (leftActive, rightActive, singleActive) => {
    const canvas = visualOverlayRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const time = Date.now() / 250;
    const pulse = Math.sin(time) * 3;

    if (activeMove.targetType === 'dual-top') {
      // 1. Left Target Star
      const lx = W * 0.20;
      const ly = H * 0.22;
      const lr = 46 + pulse;

      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fillStyle = leftActive ? 'rgba(34, 197, 94, 0.45)' : 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.lineWidth = leftActive ? 5 : 3;
      ctx.strokeStyle = leftActive ? '#22C55E' : '#38BDF8';
      ctx.stroke();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(leftActive ? '⭐' : '✋', lx, ly);
      ctx.restore();

      // 2. Right Target Star
      const rx = W * 0.80;
      const ry = H * 0.22;
      const rr = 46 + pulse;

      ctx.save();
      ctx.beginPath();
      ctx.arc(rx, ry, rr, 0, Math.PI * 2);
      ctx.fillStyle = rightActive ? 'rgba(34, 197, 94, 0.45)' : 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      ctx.lineWidth = rightActive ? 5 : 3;
      ctx.strokeStyle = rightActive ? '#22C55E' : '#38BDF8';
      ctx.stroke();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rightActive ? '⭐' : '✋', rx, ry);
      ctx.restore();
    } else if (activeMove.targetType === 'head-crown') {
      // Head Crown Target
      const hx = W * 0.50;
      const hy = H * 0.20;
      const hr = 52 + pulse;

      ctx.save();
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fillStyle = singleActive ? 'rgba(34, 197, 94, 0.45)' : 'rgba(59, 130, 246, 0.25)';
      ctx.fill();
      ctx.lineWidth = singleActive ? 5 : 3;
      ctx.strokeStyle = singleActive ? '#22C55E' : '#3B82F6';
      ctx.stroke();

      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(singleActive ? '⭐' : '👑', hx, hy);
      ctx.restore();
    } else {
      // Clapping Central Bell
      const cx = W * 0.50;
      const cy = H * 0.50;
      const cr = 54 + pulse;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = singleActive ? 'rgba(34, 197, 94, 0.45)' : 'rgba(245, 158, 11, 0.25)';
      ctx.fill();
      ctx.lineWidth = singleActive ? 5 : 3;
      ctx.strokeStyle = singleActive ? '#22C55E' : '#F59E0B';
      ctx.stroke();

      ctx.font = '34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(singleActive ? '⭐' : '👏', cx, cy);
      ctx.restore();
    }
  };

  // Robust, Anti-Tripping Computer Vision Loop
  const startDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const procCanvas = procCanvasRef.current;
    if (!video || !procCanvas) return;

    const ctx = procCanvas.getContext('2d', { willReadFrequently: true });
    const W = 160;
    const H = 120;
    procCanvas.width = W;
    procCanvas.height = H;

    const loop = () => {
      if (!streamRef.current) return;

      if (!video || video.paused || video.ended || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      if (isTransitioningRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      // Draw mirrored video into processing canvas
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -W, 0, W, H);
      ctx.restore();

      const imgData = ctx.getImageData(0, 0, W, H);
      const data = imgData.data;

      if (!prevFrameRef.current) {
        prevFrameRef.current = new Uint8ClampedArray(data);
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const prev = prevFrameRef.current;

      // Anti-camera flicker filter: Check total screen change
      // If whole room shifts brightness (camera auto-exposure), ignore frame to prevent tripping!
      let totalChangedPixels = 0;
      let leftZoneHits = 0;
      let rightZoneHits = 0;
      let headZoneHits = 0;
      let centerZoneHits = 0;

      for (let i = 0; i < data.length; i += 16) {
        const diffR = Math.abs(data[i] - prev[i]);
        const diffG = Math.abs(data[i + 1] - prev[i + 1]);
        const diffB = Math.abs(data[i + 2] - prev[i + 2]);
        const avgDiff = (diffR + diffG + diffB) / 3;

        // Strict threshold (28) ignores normal sensor noise
        if (avgDiff > 28) {
          totalChangedPixels++;
          const pIndex = i / 4;
          const x = pIndex % W;
          const y = Math.floor(pIndex / W);

          // 1. Dual top targets for "Lève les bras"
          if (y < H * 0.35 && x < W * 0.35) {
            leftZoneHits++;
          }
          if (y < H * 0.35 && x > W * 0.65) {
            rightZoneHits++;
          }

          // 2. Head zone for "Touche ta tête"
          if (y < H * 0.38 && x >= W * 0.32 && x <= W * 0.68) {
            headZoneHits++;
          }

          // 3. Center zone for "Applaudis"
          if (y >= H * 0.32 && y <= H * 0.68 && x >= W * 0.28 && x <= W * 0.72) {
            centerZoneHits++;
          }
        }
      }

      prevFrameRef.current.set(data);

      const totalSampled = data.length / 16;
      const globalChangeRatio = totalChangedPixels / totalSampled;

      // If global auto-exposure flickered (> 60% of frame changed at once), ignore frame
      if (globalChangeRatio > 0.60) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      let isCurrentPoseActive = false;
      let leftActive = false;
      let rightActive = false;
      let singleActive = false;

      if (activeMove.id === 'arms-up') {
        leftActive = leftZoneHits >= 3;
        rightActive = rightZoneHits >= 3;
        // Both hands must be raised to trigger
        isCurrentPoseActive = leftActive && rightActive;
      } else if (activeMove.id === 'touch-head') {
        singleActive = headZoneHits >= 5;
        isCurrentPoseActive = singleActive;
      } else {
        singleActive = centerZoneHits >= 6;
        isCurrentPoseActive = singleActive;
      }

      // Draw real-time visual target bubbles
      renderVisualTargetBubbles(leftActive, rightActive, singleActive);

      // Temporal stability: Must sustain the pose for 700ms (prevents random tripping!)
      if (isCurrentPoseActive) {
        dwellCounterRef.current += 1;
        const prog = Math.min(100, Math.round((dwellCounterRef.current / 12) * 100));
        setDwellProgress(prog);

        if (prog >= 100) {
          handleSuccessDetection();
        }
      } else {
        // Smooth decay if child drops arms
        dwellCounterRef.current = Math.max(0, dwellCounterRef.current - 1);
        setDwellProgress((p) => Math.max(0, p - 8));
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [activeMove.id, handleSuccessDetection]);

  // Launch camera
  const handleStartCamera = async () => {
    setCameraError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Caméra non supportée sur cet appareil.");
      setIsTactileMode(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
      setIsTactileMode(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setTimeout(() => {
        startDetectionLoop();
      }, 300);
    } catch {
      setCameraError("Pour voir ta caméra, clique sur 'Autoriser' dans ton navigateur.");
    }
  };

  // Immediate video element binding
  const setVideoCallback = useCallback((el) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  const handleOverlayRef = useCallback((el) => {
    visualOverlayRef.current = el;
    if (el) {
      el.width = el.parentElement?.clientWidth || 640;
      el.height = el.parentElement?.clientHeight || 480;
    }
  }, []);

  const handleFinish = () => {
    stopCamera();
    onComplete?.({
      score: 3,
      maxScore: 3,
      label: 'Bouger debout',
      module: 'move',
    });
  };

  // VICTORY SCREEN
  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center max-w-xl mx-auto border-4 border-[#22A06B]/30 shadow-2xl space-y-6">
        <div className="text-8xl animate-bounce">🏆</div>
        <h2 className="font-['Fredoka'] text-4xl sm:text-5xl font-black text-[#22A06B]">
          Bravo champion !
        </h2>
        <p className="text-xl text-[#64748B] font-bold">
          Tu as réussi les 3 mouvements debout !
        </p>

        {/* 3 Golden Stars */}
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

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <canvas ref={procCanvasRef} className="hidden" />

      {/* Top Banner: Score, Movement Prompt & Audio */}
      <div className="bg-white rounded-[2rem] px-6 py-4 border-3 border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl select-none">{activeMove.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#22A06B] block">
                Mouvement {currentStep + 1} / 3
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {isOpenCvReady ? 'OpenCV 🟢' : 'Vision 👁️'}
              </span>
            </div>
            <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#1E293B]">
              {activeMove.title}
            </h2>
          </div>
          <TTSButton text={activeMove.voicePrompt} size="sm" />
        </div>

        {/* Score Stars */}
        <div className="flex items-center gap-2 bg-[#FFFDF0] border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-xs">
          <span className="text-2xl">⭐</span>
          <span className="font-['Fredoka'] text-2xl font-black text-[#1E293B]">{score}</span>
        </div>
      </div>

      {/* Large Full-Body Camera Stage with Non-Tripping Target Bubbles */}
      {cameraActive && !isTactileMode ? (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#22A06B] relative aspect-[4/3] sm:aspect-video flex items-center justify-center">
            {/* Live Camera Feed */}
            <video
              ref={setVideoCallback}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Visual Target Bubbles Overlay */}
            <canvas
              ref={handleOverlayRef}
              className="absolute inset-0 pointer-events-none w-full h-full"
            />

            {/* Clear Goal Banner */}
            <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md text-white font-['Fredoka'] text-sm sm:text-base font-bold px-5 py-2 rounded-full border border-white/25 flex items-center gap-2 shadow-lg">
                <span>{activeMove.instruction}</span>
              </div>
            </div>

            {/* Steady Hold Progress Bar */}
            {dwellProgress > 0 && (
              <div className="absolute bottom-5 inset-x-10 flex flex-col items-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md text-emerald-400 font-['Fredoka'] text-sm font-black px-4 py-1 rounded-full mb-1 border border-white/20">
                  Maintiens la position !
                </div>
                <div className="w-full max-w-xs bg-white/25 rounded-full h-3.5 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                    style={{ width: `${dwellProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success Overlay when detected */}
            <AnimatePresence>
              {isSuccessOverlay && (
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

          {/* Large Friendly Validation Button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSuccessDetection}
              className="btn-tactile btn-tactile--move w-full min-h-[64px] text-2xl font-['Fredoka'] cursor-pointer shadow-lg flex items-center justify-center gap-3"
            >
              <span>J'ai fait le geste !</span>
              <span className="text-3xl">⭐</span>
            </button>
          </div>
        </div>
      ) : isTactileMode ? (
        /* Tactile Fallback */
        <div className="bg-white rounded-[2.5rem] p-10 text-center border-4 border-[#22A06B]/30 shadow-xl space-y-6">
          <div className="text-8xl select-none animate-bounce-short">{activeMove.icon}</div>
          <h3 className="font-['Fredoka'] text-3xl font-black text-[#1E293B]">
            Fais le geste debout : {activeMove.title}
          </h3>

          <button
            type="button"
            onClick={handleSuccessDetection}
            className="btn-tactile btn-tactile--move w-full max-w-md mx-auto min-h-[72px] text-2xl font-['Fredoka'] cursor-pointer shadow-xl flex items-center justify-center gap-3"
          >
            <span>J'ai fait le geste !</span>
            <span className="text-3xl">⭐</span>
          </button>
        </div>
      ) : (
        /* Camera Activation Welcome */
        <div className="bg-white rounded-[2.5rem] p-10 text-center border-4 border-[#22A06B]/30 shadow-xl space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#E6FFFA] flex items-center justify-center text-6xl shadow-sm">
            🧍
          </div>

          <h3 className="font-['Fredoka'] text-3xl font-black text-[#1E293B]">
            Mets-toi debout pour jouer !
          </h3>
          <p className="text-base text-[#64748B] font-bold">
            Allume ta caméra et recule un peu pour qu'on voie tout ton corps.
          </p>

          {cameraError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 font-bold">
              {cameraError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleStartCamera}
              className="btn-tactile btn-tactile--move w-full min-h-[72px] text-2xl font-['Fredoka'] cursor-pointer flex items-center justify-center gap-3 shadow-xl"
            >
              <span>Allumer la caméra</span>
              <span className="text-3xl">📷</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTactileMode(true)}
              className="w-full min-h-[52px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] border-2 border-slate-300 font-['Fredoka'] text-base font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Jouer sans caméra ✋</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
