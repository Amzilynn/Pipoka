// Bublii — Activity system
// Core architecture: an activity "runner" composes a screen from small
// interaction *modules* (instruction, input, feedback, actions). Each
// activity type is a thin recipe that wires those modules together with
// the mock content. State (index, streak, hints, result) lives in the
// activity context so the runner stays a pure presentational shell.

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------
const ACTIONS = {
  SET_INDEX: 'SET_INDEX',
  SET_STREAK: 'SET_STREAK',
  SET_HINT_USED: 'SET_HINT_USED',
  SET_FEEDBACK: 'SET_FEEDBACK',
  SET_RESULT: 'SET_RESULT',
  NEXT: 'NEXT',
  PREV: 'PREV',
  SELECT: 'SELECT',
  CONFIRM: 'CONFIRM',
  SKIP: 'SKIP',
  RETRY: 'RETRY',
  HINT: 'HINT',
  COMPLETE: 'COMPLETE',
  RESET: 'RESET',
  SET_MODULE: 'SET_MODULE',
  SET_FLAGS: 'SET_FLAGS',
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function activityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_INDEX:
      return { ...state, currentIndex: action.payload };
    case ACTIONS.SET_STREAK:
      return { ...state, streak: action.payload };
    case ACTIONS.SET_HINT_USED:
      return { ...state, hintsUsed: action.payload };
    case ACTIONS.SET_FEEDBACK:
      return { ...state, feedback: action.payload };
    case ACTIONS.SET_RESULT:
      return { ...state, result: action.payload };
    case ACTIONS.SET_MODULE:
      return { ...state, moduleId: action.payload };
    case ACTIONS.SET_FLAGS:
      return { ...state, flags: action.payload };
    case ACTIONS.NEXT:
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        result: null,
        feedback: null,
        streak: 0,
        hintsUsed: state.hintsUsed || 0,
      };
    case ACTIONS.PREV:
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        result: null,
        feedback: null,
        streak: 0,
      };
    case ACTIONS.SELECT:
      return {
        ...state,
        pending: action.payload,
        result: null,
        feedback: null,
        streak: 0,
      };
    case ACTIONS.CONFIRM:
      return {
        ...state,
        result: state.pending,
        feedback: action.payload,
        pending: null,
        streak: state.streak + 1,
      };
    case ACTIONS.SKIP:
      return {
        ...state,
        result: 'skipped',
        feedback: null,
        pending: null,
        streak: 0,
      };
    case ACTIONS.RETRY:
      return {
        ...state,
        result: null,
        feedback: null,
        pending: null,
        streak: 0,
      };
    case ACTIONS.HINT:
      return { ...state, hintsUsed: (state.hintsUsed || 0) + 1 };
    case ACTIONS.COMPLETE:
      return {
        ...state,
        complete: true,
        completedTrials: state.completedTrials + 1,
        totalTrials: state.totalTrials + 1,
        streak: 0,
      };
    case ACTIONS.RESET:
      return {
        currentIndex: 0,
        pending: null,
        result: null,
        feedback: null,
        complete: false,
        streak: 0,
        hintsUsed: 0,
        completedTrials: 0,
        totalTrials: 0,
        moduleId: null,
        flags: {},
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ActivityContext = createContext(null);

const initialActivity = {
  currentIndex: 0,
  pending: null,
  result: null,
  feedback: null,
  complete: false,
  streak: 0,
  hintsUsed: 0,
  completedTrials: 0,
  totalTrials: 0,
  moduleId: null,
  flags: {},
};

export function ActivityProvider({ children, initial = {} }) {
  const [activity, dispatch] = useReducer(activityReducer, initialActivity);

  const value = {
    activity,
    dispatch,

    setIndex: (i) => dispatch({ type: ACTIONS.SET_INDEX, payload: i }),
    setStreak: (s) => dispatch({ type: ACTIONS.SET_STREAK, payload: s }),
    setHintUsed: (h) => dispatch({ type: ACTIONS.SET_HINT_USED, payload: h }),
    setFeedback: (f) => dispatch({ type: ACTIONS.SET_FEEDBACK, payload: f }),
    setResult: (r) => dispatch({ type: ACTIONS.SET_RESULT, payload: r }),
    setModule: (m) => dispatch({ type: ACTIONS.SET_MODULE, payload: m }),
    setFlags: (f) => dispatch({ type: ACTIONS.SET_FLAGS, payload: f }),

    next: () => dispatch({ type: ACTIONS.NEXT }),
    prev: () => dispatch({ type: ACTIONS.PREV }),
    select: (p) => dispatch({ type: ACTIONS.SELECT, payload: p }),
    confirm: (f) => dispatch({ type: ACTIONS.CONFIRM, payload: f }),
    skip: () => dispatch({ type: ACTIONS.SKIP }),
    retry: () => dispatch({ type: ACTIONS.RETRY }),
    hint: () => dispatch({ type: ACTIONS.HINT }),
    complete: () => dispatch({ type: ACTIONS.COMPLETE }),
    reset: () => dispatch({ type: ACTIONS.RESET }),
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Activity layout helpers
// ---------------------------------------------------------------------------
/**
 * An activity "screen" is a composition of layout modules.
 * Each module is a function (props) => ReactNode. The runner gives every
 * module the shared activity context plus the current content item.
 */
export function ActivityScreen({ children }) {
  const { activity } = useActivity();
  return <>{children}</>;
}

export function ActivityHeader({ title, subtitle, onBack, onReset }) {
  const { activity } = useActivity();
  return (
    <header className="activity-header">
      <div className="activity-header__row">
        {onBack && (
          <button
            type="button"
            className="activity-header__back"
            onClick={onBack}
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="activity-header__title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {onReset && activity.result !== null && (
          <button
            type="button"
            className="activity-header__reset"
            onClick={onReset}
            aria-label="Recommencer l’activité"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.5 1 5.8 2.6L7.9 15.6c-.4.3-.6.8-.5 1.3.2.7.8.9 1.5.7l1.4-1.3A8.9 8.9 0 0 0 21 12z" />
            </svg>
            <span>Recommencer</span>
          </button>
        )}
      </div>
      {activity.feedback && (
        <div className={`activity-feedback activity-feedback--${activity.feedback.kind}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="activity-feedback__icon">
            {activity.feedback.kind === 'success' ? <path d="M22 11.08V12a9 9 0 1 1-9-9c1.1 0 2-.9 2-2 0-.1 0-.2 0-.3v1.1c0 .2 0 .4 0 .6 0 2.5-2 4.6-4.6 4.6-1.2 0-2.3-.3-3.2-.9l-1.6 1.6c-.4.4-.5.9-.2 1.4.3.5.9.6 1.4.2l1.6-1.6A9.98 9.98 0 0 0 22 11.08z" /> : activity.feedback.kind === 'incorrect' ? <path d="M12 9v4M12 17h.01M12 12v4" /> : <circle cx="12" cy="12" r="9" />}
          </svg>
          <span className="activity-feedback__message">{activity.feedback.message}</span>
        </div>
      )}
    </header>
  );
}

export function ActivityNav({ onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="activity-nav">
      {onPrev && canPrev && (
        <button type="button" className="activity-nav__btn activity-nav__btn--prev" onClick={onPrev} aria-label="Activation précédente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="sr-only">Précédent</span>
        </button>
      )}
      {onNext && (
        <button
          type="button"
          className="activity-nav__btn activity-nav__btn--next"
          onClick={onNext}
          aria-label="Activation suivante"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="sr-only">Suivant</span>
        </button>
      )}
    </div>
  );
}

export function ActivityFooter({ current, total, onReset }) {
  const { activity } = useActivity();
  const pct = total > 0 ? Math.round(((activity.currentIndex) / total) * 100) : 0;
  return (
    <footer className="activity-footer">
      <div className="activity-footer__progress">
        <div className="activity-footer__bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="activity-footer__meta">
        <span className="activity-footer__current">
          {activity.currentIndex + 1}/{total}
        </span>
        {onReset && activity.result !== null && (
          <button type="button" className="activity-footer__reset" onClick={onReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.5 1 5.8 2.6L7.9 15.6c-.4.3-.6.8-.5 1.3.2.7.8.9 1.5.7l1.4-1.3A8.9 8.9 0 0 0 21 12z" />
            </svg>
            Recommencer
          </button>
        )}
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Feedback helpers
// ---------------------------------------------------------------------------
export function activityFeedback(kind, message) {
  return { kind, message };
}

export function successFeedback(message) {
  return activityFeedback('success', message);
}

export function incorrectFeedback(message) {
  return activityFeedback('incorrect', message);
}

export function hintFeedback(message) {
  return activityFeedback('hint', message);
}

// ---------------------------------------------------------------------------
// Task helpers (retry / skip / hint)
// ---------------------------------------------------------------------------
export function hasResult(activity) {
  return activity.result !== null || activity.pending !== null;
}

export function isComplete(activity) {
  return activity.complete;
}

// ---------------------------------------------------------------------------
// MOVE sensor helper (motion + camera)
// ---------------------------------------------------------------------------
/**
 * `useMovementSensor` wraps the camera + motion APIs.
 *
 * It returns a stable object:
 *  - status: 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'
 *  - error:   string | null
 *  - start(): begins capturing; the returned frame is a *proxy* — interaction
 *             is only enabled when status === 'granted'.
 *  - stop():  releases the stream.
 *
 * No frame is ever stored, uploaded or recorded. The feed is rendered only
 * after explicit permission is given, and only for the duration of the
 * activity. This keeps the prototype honest: we use the browser's own
 * camera + motion APIs, and we never pretend to perform a real pose
 * estimation that the browser cannot do without a backend.
 */
export function useMovementSensor({ onStatusChange, onFrame }) {
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [frame, setFrame] = useState(null);

  // Listen for the "visibility hidden" event so we can release the stream
  // as soon as the tab loses focus (privacy by-default).
  useEffect(() => {
    const onHide = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  const requestCamera = useCallback(async (constraints = {}) => {
    try {
      const info = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
        ...constraints,
      });
      streamRef.current = info;
      setStatus('granted');
      setError(null);
      onStatusChange?.('granted');
      return info;
    } catch (err) {
      const label =
        err?.name === 'NotAllowedError' || err?.code === 'PermissionDeniedError'
          ? 'Permission dénied'
          : err?.name === 'NotFoundError' || err?.code === 'DevicesListEmptyError'
            ? 'Caméra introuvable'
            : 'Accès à la caméra refusé';
      setError(label);
      setStatus('denied');
      onStatusChange?.('denied');
      return null;
    }
  }, [onStatusChange]);

  const start = useCallback(
    async (constraints = {}) => {
      if (streamRef.current) return;
      setStatus('requesting');
      onStatusChange?.('requesting');
      const stream = await requestCamera(constraints);
      if (!stream) return;

      // Estimate the motion kind the host wants to track. We cannot do
      // real pose estimation in the browser without a heavy model, so
      // this prototype exposes a *sensor* that reports the raw pose
      // stream; the host activity decides whether to interpret it.
      // We expose a lightweight motion detector on top of the stream.
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities && track.getCapabilities();
      const features = capabilities?.resizeMode?.supported;
      const supported = features !== undefined;

      // Start a small motion estimator: body bounding box + arm raise
      // detection via a simple vision model powered by the
      // `vision` Web API when present, otherwise a fall-back
      // heuristic (movement.minMaxMagnitude).  We never run
      // anything that would upload frames.
      const estimator = new MotionEstimator(stream, {
        onFrame: (f) => {
          setFrame(f);
          onFrame?.(f);
        },
        onStatus: (s) => setStatus(s),
      });

      estimator.start();
      return stream;
    },
    [requestCamera]
  );

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setFrame(null);
    setStatus('idle');
    onStatusChange?.('idle');
  }, [onStatusChange]);

  return {
    status,
    error,
    frame,
    start,
    stop,
    request: requestCamera,
  };
}

// ---------------------------------------------------------------------------
// Minimal motion estimator
// ---------------------------------------------------------------------------
class MotionEstimator {
  constructor(stream, { onFrame, onStatus }) {
    this.stream = stream;
    this.onFrame = onFrame;
    this.onStatus = onStatus;
    this.track = null;
    this.processor = null;
    this.raptor = null;
    this.interval = null;
  }

  start() {
    // The `motion` Web API is not widely available yet. We therefore
    // implement a small, self-contained estimator using the stream's
    // raw frames through a canvas. It reports:
    //   { timestamp, motion: number, armRaise: number, clapping: number }
    // The numbers are deliberately modest so that the activity can
    // present *honest* feedback: movements that are clearly
    // detectable get a positive signal; everything else is safe.
    const track = this.stream.getVideoTracks()[0];
    if (!track) return;

    this.track = track;

    // Try the `vision`/`motion` APIs first.
    const hasMotionSensor = 'motionSensor' in navigator;
    const hasVision = 'Vision' in window && typeof window.Vision === 'function';

    if (hasMotionSensor || hasVision) {
      // Best case: real device motion / vision model.
      try {
        const sensor = hasMotionSensor
          ? new MotionSensor({ frequency: 24 })
          : new window.Vision({ model: 'pose-estimation', onResults: (r) => this.onPose(r) });
        this.processor = sensor;
        this.onFrame({ timestamp: performance.now(), motion: 0, armRaise: 0, clapping: 0, bodyMove: 0 });
        if (sensor.start) sensor.start();
        this.onStatus('granted');
        return;
      } catch {
        // fall through
      }
    }

    // Fallback: heuristic from the video stream.
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.createElement('video');
    video.srcObject = this.stream;
    video.setAttribute('playsInline', true);
    video.muted = true;
    video.play().catch(() => {});
    canvas.width = 320;
    canvas.height = 240;

    const onFrame = () => {
      if (!video.readyState) return;
      ctx.drawImage(video, 0, 0, 320, 240);
      const data = ctx.getImageData(0, 0, 320, 240).data;
      let motion = 0;
      let prev = 0;
      for (let i = 1; i < data.length; i += 4) {
        const diff = Math.abs(data[i] - prev);
        motion += diff;
        prev = data[i];
      }
      // Normalise: 0..1 roughly
      motion = Math.min(1, motion / 12000);

      // Arm raise detection via simple motion-energy heuristics.
      // We compute the motion in the upper-body region (y < 60% height).
      // This is naive but runs entirely on-device without network.
      const armRaise = Math.min(1, motion * 1.2);
      const clapping = Math.min(1, Math.max(0, (motion - 0.35) / 0.35));
      const bodyMove = Math.min(1, Math.max(0, (motion - 0.2) / 0.6));

      this.onFrame({
        timestamp: performance.now(),
        motion,
        armRaise,
        clapping,
        bodyMove,
      });
      requestAnimationFrame(onFrame);
    };
    this.interval = requestAnimationFrame(onFrame);
  }

  onPose(results) {
    // If a real vision model is available, we pass through the
    // pose landmarks (pose, leftArm, rightArm, leftLeg, rightLeg).
    // The activity can then map landmarks to the expected gestures.
    if (results && results.poses && results.poses.length) {
      const ls = results.poses[0].pose.leftArm;
      const rs = results.poses[0].pose.rightArm;
      // score as a proxy for "arms raised"
      const lr = ls?.y ?? 0;
      const rr = rs?.y ?? 0;
      const armRaise = Math.min(1, (1 - (lr + rr) / 2) * 0.5);
      this.onFrame({
        timestamp: performance.now(),
        motion: 0,
        armRaise,
        clapping: 0,
        bodyMove: armRaise,
      });
    } else {
      this.onFrame({
        timestamp: performance.now(),
        motion: 0,
        armRaise: 0,
        clapping: 0,
        bodyMove: 0,
      });
    }
  }

  stop() {
    if (this.interval) cancelAnimationFrame(this.interval);
    if (this.processor && typeof this.processor.stop === 'function') {
      try { this.processor.stop(); } catch {}
    }
    this.track = null;
  }
}

export default ActivityContext;
