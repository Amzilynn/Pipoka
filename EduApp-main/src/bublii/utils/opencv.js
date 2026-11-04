// OpenCV.js integration utility for Booblii (WebAssembly-based real-time Computer Vision)

let isOpenCvInitialized = false;
let initPromise = null;

export function waitForOpenCV() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.cv && window.cv.Mat) {
    isOpenCvInitialized = true;
    return Promise.resolve(window.cv);
  }

  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    if (window.cv && window.cv.onRuntimeInitialized) {
      window.cv.onRuntimeInitialized = () => {
        isOpenCvInitialized = true;
        resolve(window.cv);
      };
      return;
    }

    const interval = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        clearInterval(interval);
        isOpenCvInitialized = true;
        resolve(window.cv);
      }
    }, 100);

    // Safety timeout after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (window.cv && window.cv.Mat) {
        isOpenCvInitialized = true;
        resolve(window.cv);
      } else {
        resolve(null);
      }
    }, 10000);
  });

  return initPromise;
}

export function isOpenCvAvailable() {
  return typeof window !== 'undefined' && !!(window.cv && window.cv.Mat);
}

/**
 * Perform genuine OpenCV image processing on canvas frames.
 * Uses Gaussian Blur (7x7) + AbsDiff + Binary Threshold (32) to filter webcam sensor noise.
 * 
 * @param {HTMLCanvasElement} canvas - Processing canvas
 * @param {object} opencvState - Persistent state holder holding prevGray Mat
 * @param {string} movementType - 'arms-up' | 'touch-head' | 'clap'
 * @returns {object} { ratio, roiRect, isMotionDetected }
 */
export function processFrameWithOpenCV(canvas, opencvState, movementType) {
  const cv = window.cv;
  if (!cv || !cv.Mat || !canvas) {
    return { ratio: 0, isMotionDetected: false, roiRect: null };
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const W = canvas.width;
  const H = canvas.height;
  const imgData = ctx.getImageData(0, 0, W, H);

  let src = null;
  let gray = null;
  let blur = null;
  let diff = null;
  let thresh = null;
  let roi = null;
  let rect = null;

  try {
    src = cv.matFromImageData(imgData);
    gray = new cv.Mat();
    blur = new cv.Mat();

    // 1. Convert RGBA to Grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // 2. Strong Gaussian Blur (7x7) to completely eliminate webcam ambient noise
    cv.GaussianBlur(gray, blur, new cv.Size(7, 7), 0);

    // If first frame, store as reference
    if (!opencvState.prevGray) {
      opencvState.prevGray = new cv.Mat();
      blur.copyTo(opencvState.prevGray);
      return { ratio: 0, isMotionDetected: false, roiRect: null };
    }

    diff = new cv.Mat();
    thresh = new cv.Mat();

    // 3. OpenCV Absolute Difference: |prevFrame - currentFrame|
    cv.absdiff(opencvState.prevGray, blur, diff);

    // 4. Strict Binary Threshold (30) so ambient lighting / grain doesn't trigger
    cv.threshold(diff, thresh, 30, 255, cv.THRESH_BINARY);

    // Update reference frame
    blur.copyTo(opencvState.prevGray);

    // 5. Target Region of Interest (ROI)
    let targetX = 0;
    let targetY = 0;
    let targetW = W;
    let targetH = Math.floor(H * 0.35);

    if (movementType === 'arms-up') {
      // Arms raised: top 35% of standing frame
      targetX = 0;
      targetY = 0;
      targetW = W;
      targetH = Math.floor(H * 0.35);
    } else if (movementType === 'touch-head') {
      // Hands near head: top-center 40%
      targetX = Math.floor(W * 0.28);
      targetY = 0;
      targetW = Math.floor(W * 0.44);
      targetH = Math.floor(H * 0.40);
    } else {
      // Clapping: central chest area
      targetX = Math.floor(W * 0.25);
      targetY = Math.floor(H * 0.32);
      targetW = Math.floor(W * 0.50);
      targetH = Math.floor(H * 0.42);
    }

    rect = new cv.Rect(targetX, targetY, targetW, targetH);
    roi = thresh.roi(rect);

    // 6. Count non-zero motion pixels inside OpenCV ROI
    const nonZeroCount = cv.countNonZero(roi);
    const roiArea = targetW * targetH;
    const ratio = Math.round((nonZeroCount / roiArea) * 100);

    // Real human movement threshold is >= 15% (noise is usually 0-4%)
    const isMotionDetected = ratio >= 15;

    return {
      ratio,
      isMotionDetected,
      roiRect: {
        x: targetX / W,
        y: targetY / H,
        w: targetW / W,
        h: targetH / H,
      },
    };
  } catch (err) {
    console.warn('OpenCV processing error:', err);
    return { ratio: 0, isMotionDetected: false, roiRect: null };
  } finally {
    if (src) src.delete();
    if (gray) gray.delete();
    if (blur) blur.delete();
    if (diff) diff.delete();
    if (thresh) thresh.delete();
    if (roi) roi.delete();
  }
}

export function cleanupOpenCvState(opencvState) {
  if (opencvState && opencvState.prevGray) {
    try {
      opencvState.prevGray.delete();
    } catch {
      // ignore
    }
    opencvState.prevGray = null;
  }
}
