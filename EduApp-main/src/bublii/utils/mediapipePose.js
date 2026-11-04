// MediaPipe Pose Landmarker Integration for Bublii
// Provides real-time 33-point skeletal landmark detection running locally in WebAssembly

let mediaPipeReadyPromise = null;

export function waitForMediaPipePose() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser required'));
  if (window.Pose) return Promise.resolve(window.Pose);
  if (mediaPipeReadyPromise) return mediaPipeReadyPromise;
  mediaPipeReadyPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/assets/mediapipe/pose/pose.js';
    script.async = true;
    const timer = setTimeout(() => fail(), 20000);
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      mediaPipeReadyPromise = null;
      reject(new Error('Pose runtime unavailable'));
    };
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timer);
      if (window.Pose) resolve(window.Pose);
      else fail();
    };
    document.head.appendChild(script);
  });
  return mediaPipeReadyPromise;
}

export function isMediaPipeAvailable() {
  return typeof window !== 'undefined' && typeof window.Pose !== 'undefined';
}

/**
 * Creates and initializes a configured MediaPipe Pose instance.
 */
export async function createPoseDetector(onResultsCallback) {
  const PoseClass = await waitForMediaPipePose();
  if (!PoseClass) return null;

  try {
    const pose = new PoseClass({
      locateFile: (file) => `/assets/mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 0, // Balanced speed and accuracy
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55,
    });

    pose.onResults(onResultsCallback);
    return pose;
  } catch (err) {
    console.warn('Failed to initialize MediaPipe Pose:', err);
    return null;
  }
}

/**
 * Analyze skeletal landmarks for target gestures.
 * Landmark Indices:
 * 0: Nose, 7: Left Ear, 8: Right Ear
 * 11: Left Shoulder, 12: Right Shoulder
 * 13: Left Elbow, 14: Right Elbow
 * 15: Left Wrist, 16: Right Wrist
 * 23: Left Hip, 24: Right Hip
 */
export function evaluatePoseMovement(landmarks, targetGesture) {
  if (!landmarks || landmarks.length < 25) {
    return {
      isInFrame: false,
      isGestureValid: false,
      message: "Recule-toi pour qu'on voie ton corps 🧍",
      confidence: 0,
    };
  }

  const nose = landmarks[0];
  const leftEar = landmarks[7];
  const rightEar = landmarks[8];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  // 1. Framing check: shoulders must be clearly visible
  const leftShoulderVisible = (leftShoulder?.visibility ?? 0) > 0.55;
  const rightShoulderVisible = (rightShoulder?.visibility ?? 0) > 0.55;

  if (!leftShoulderVisible || !rightShoulderVisible) {
    return {
      isInFrame: false,
      isGestureValid: false,
      message: "Recule-toi un peu pour être bien dans le cadre 🧍",
      confidence: 0,
    };
  }

  // 2. Gesture Evaluation
  if (targetGesture === 'arms-up') {
    // Both wrists must be visible and clearly ABOVE shoulders
    // Note: y=0 is top, y=1 is bottom, so wrist.y < shoulder.y means hands are raised!
    const leftWristVisible = (leftWrist?.visibility ?? 0) > 0.5;
    const rightWristVisible = (rightWrist?.visibility ?? 0) > 0.5;

    const leftArmUp = leftWristVisible && leftWrist.y < leftShoulder.y - 0.08;
    const rightArmUp = rightWristVisible && rightWrist.y < rightShoulder.y - 0.08;

    const isValid = leftArmUp && rightArmUp;

    return {
      isInFrame: true,
      isGestureValid: isValid,
      message: isValid ? "Super ! Les deux bras sont levés ! ⭐" : "Lève tes deux bras bien haut ! 🙌",
      confidence: (leftArmUp ? 0.5 : 0) + (rightArmUp ? 0.5 : 0),
    };
  }

  if (targetGesture === 'touch-head') {
    // At least one wrist or both wrists touching near the head (nose / ears)
    const leftWristVisible = (leftWrist?.visibility ?? 0) > 0.5;
    const rightWristVisible = (rightWrist?.visibility ?? 0) > 0.5;

    // Euclidean distance in normalized coords
    const distToHead = (wrist) => {
      if (!wrist) return 999;
      const headX = (leftEar?.x + rightEar?.x) / 2 || nose.x;
      const headY = (leftEar?.y + rightEar?.y) / 2 || nose.y;
      const dx = wrist.x - headX;
      const dy = wrist.y - headY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const leftTouch = leftWristVisible && distToHead(leftWrist) < 0.18;
    const rightTouch = rightWristVisible && distToHead(rightWrist) < 0.18;

    const isValid = leftTouch || rightTouch;

    return {
      isInFrame: true,
      isGestureValid: isValid,
      message: isValid ? "Bravo ! Mains sur la tête ! ⭐" : "Pose tes mains sur le haut de ta tête 🙆",
      confidence: isValid ? 1 : 0,
    };
  }

  return {
    isInFrame: true,
    isGestureValid: false,
    message: "Fais le mouvement demandé",
    confidence: 0,
  };
}

/**
 * Draw interactive visual skeleton on top of the live video canvas.
 */
export function drawSkeletalLandmarks(ctx, landmarks, width, height, isSuccess) {
  if (!ctx || !landmarks || landmarks.length < 25) return;

  const toPx = (point) => ({
    x: point.x * width,
    y: point.y * height,
  });

  // Skeletal connections
  const connections = [
    [11, 12], // Shoulders
    [11, 13], [13, 15], // Left arm
    [12, 14], [14, 16], // Right arm
    [11, 23], [12, 24], // Torso
    [23, 24], // Hips
  ];

  ctx.save();
  ctx.lineWidth = isSuccess ? 5 : 3;
  ctx.strokeStyle = isSuccess ? '#22C55E' : '#6DD58F';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw bones
  connections.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    if (p1 && p2 && (p1.visibility ?? 1) > 0.5 && (p2.visibility ?? 1) > 0.5) {
      const pt1 = toPx(p1);
      const pt2 = toPx(p2);
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      ctx.lineTo(pt2.x, pt2.y);
      ctx.stroke();
    }
  });

  // Draw joint nodes
  const importantNodes = [11, 12, 13, 14, 15, 16, 0];
  importantNodes.forEach((idx) => {
    const p = landmarks[idx];
    if (p && (p.visibility ?? 1) > 0.5) {
      const pt = toPx(p);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, idx === 15 || idx === 16 ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isSuccess ? '#22C55E' : '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isSuccess ? '#146844' : '#22A06B';
      ctx.stroke();
    }
  });

  ctx.restore();
}

