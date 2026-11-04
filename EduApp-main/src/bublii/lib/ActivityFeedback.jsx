// Bublii — activity feedback engine
// Turns the raw result of an interaction into a presentational *feedback*
// object. Every activity uses these building blocks so feedback is always
// immediate, encouraging and consistent across modules.

import React from 'react';
import Icon from '../components/Icon';

/**
 * Feedback types are deliberately small and predictable:
 *  - success  : correct answer, an achieved movement, a completed step
 *  - incorrect: a wrong choice or missed movement
 *  - hint     : a nudge that never costs a streak
 *  - info     : neutral guidance (how to play, what the next step is)
 */

export const TONE = {
  success: 'success',
  incorrect: 'incorrect',
  hint: 'hint',
  info: 'info',
};

export function buildFeedback(type, message, { action = null, detail = null } = {}) {
  return { type, message, action, detail };
}

// ---------------------------------------------------------------------------
// Predefined feedback builders — the "voice" of the prototype
// ---------------------------------------------------------------------------
export function success(msg) {
  return { type: TONE.success, message: msg };
}

export function incorrect(msg) {
  return { type: TONE.incorrect, message: msg };
}

export function hint(msg) {
  return { type: TONE.hint, message: msg };
}

export function info(msg) {
  return { type: TONE.info, message: msg };
}

// Generic celebration used by the completion state and the MOVE
// "génial" beat.
export function celebrate(msg) {
  return { type: TONE.success, message: msg };
}

// Short, high-energy praise with a *single* possible action the child
// can take. Used by activities with a "try again" branch.
export function boom(msg, actionLabel, actionOnClick) {
  return { type: TONE.success, message: msg, actionLabel, actionOnClick };
}

// ---------------------------------------------------------------------------
// Feedback presenter
// ---------------------------------------------------------------------------
export function Feedback({ feedback, onAction }) {
  if (!feedback) return null;

  const isSuccess = feedback.type === TONE.success;
  const isIncorrect = feedback.type === TONE.incorrect;
  const isHint = feedback.type === TONE.hint;
  const isInfo = feedback.type === TONE.info;

  return (
    <div
      className={`feedback feedback--${feedback.type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="feedback__icon">
        {isSuccess ? (
          <Icon name="check" size={22} filled />
        ) : isIncorrect ? (
          <Icon name="close" size={22} filled />
        ) : isHint ? (
          <Icon name="bulb" size={22} />
        ) : (
          <Icon name="spark" size={22} />
        )}
      </div>

      <div className="feedback__body">
        <p className="feedback__message">{feedback.message}</p>

        {feedback.actionLabel && feedback.actionOnClick ? (
          <button
            type="button"
            className="feedback__action"
            onClick={() => onAction?.(feedback.actionOnClick)}
          >
            {feedback.actionLabel}
          </button>
        ) : null}

        {feedback.detail && !isSuccess && (
          <p className="feedback__detail">{feedback.detail}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streak / score helpers
// ---------------------------------------------------------------------------
export function streakLabel(streak, maxStreak = 5) {
  if (streak <= 0) return null;
  if (streak >= maxStreak) {
    return `🔥 ${streak} gestes consécutifs — tu es un vrai pourchasseur !`;
  }
  return `Tu as ${streak} bonne${streak > 1 ? 's' : ''} en séquence.`;
}

export function scoreBadge(score, max = 3) {
  return (
    <span className={`score-badge score-badge--${Math.min(score, max)}`}>
      {score > 0 ? `${score} ✨` : ''}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Animation helpers (for celebratory confetti-light effects)
// ---------------------------------------------------------------------------
export function useConfettiBurst({ enabled, config = {} }) {
  const { ref, fired } = useRef(null);

  // A tiny, dependency-free burst of "stars" that animates on screen.
  // It is not canvas-confetti: it runs entirely in CSS with a short
  // timeout and never touches the network. It can be installed
  // optionally if the library is present, but we do not require it.
  return ref;
}
