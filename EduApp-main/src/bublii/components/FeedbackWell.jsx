// Bublii — Feedbackwell: the *place* where feedback appears.
// It is a presentational shell around the_feedback* helpers so that
// activities always show the same well-shaped message bubble, with
// the right icon, colour and animation.

import React from 'react';
import Bubli from '../components/Bubli';

/** Props: { feedback, onAction } where feedback is the output of
 *  `buildFeedback` / `success` / `incorrect` / `hint` / `info`. */
export default function FeedbackWell({ feedback, onAction, hideIcon = false }) {
  const isSuccess = feedback?.type === 'success';
  const isIncorrect = feedback?.type === 'incorrect';
  const isHint = feedback?.type === 'hint';
  const isInfo = feedback?.type === 'info';

  if (!feedback) return null;

  return (
    <div className="feedback-well" role="status" aria-live="polite">
      {/* Decorative bubble */}
      <div className={`feedback-well__bubble feedback-well__bubble--${feedback.type}`}>
        {!hideIcon && (
          <div className="feedback-well__icon">
            {isSuccess ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a9 9 0 1 1-9-9c1.1 0 2-.9 2-2 0-.1 0-.2 0-.3v1.1c0 .2 0 .4 0 .6 0 2.5-2 4.6-4.6 4.6-1.2 0-2.3-.3-3.2-.9l-1.6 1.6c-.4.4-.5.9-.2 1.4.3.5.9.6 1.4.2l1.6-1.6A9.98 9.98 0 0 0 22 11.08z" />
              </svg>
            ) : isIncorrect ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            ) : isHint ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4.4 12.4c.7.6 1.2 1.5 1.2 2.4V18h6.4v-1.2c0-.9.5-1.8 1.2-2.4A7 7 0 0 0 12 2Z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1.1 6.1-5.5-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9Z" />
              </svg>
            )}
          </div>
        )}

        <div className="feedback-well__text">
          <p className="feedback-well__message">{feedback.message}</p>
          {feedback.actionLabel && feedback.actionOnClick ? (
            <button
              type="button"
              className="feedback-well__action"
              onClick={() => onAction?.(feedback.actionOnClick)}
            >
              {feedback.actionLabel}
            </button>
          ) : null}
        </div>
      </div>

      {/* Bubli the little companion reacts to the last feedback. */}
      {!hideIcon && (
        <Bubli size={44} mood={isSuccess ? 'celebrate' : isIncorrect ? 'think' : 'happy'} className="feedback-well__bubli" aria-hidden="true" />
      )}
    </div>
  );
}

export function FeedbackWellController({ feedback, onAction, onHint, hintAvailable, maxStreak }) {
  // A controller that also shows a hint button when the child has more
  // hints available. This is the "retry / hint" affordance.
  return (
    <div className="feedback-well-controller">
      {hintAvailable && onHint && hintAvailable > 0 ? (
        <button type="button" className="feedback-well-controller__hint" onClick={onHint}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18h6M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4.4 12.4c.7.6 1.2 1.5 1.2 2.4V18h6.4v-1.2c0-.9.5-1.8 1.2-2.4A7 7 0 0 0 12 2Z" />
          </svg>
          Indice {hintAvailable}
        </button>
      ) : null}

      {maxStreak > 0 && maxStreak >= 3 ? (
        <span className="feedback-well-controller__streak">🔥 {maxStreak} en cours</span>
      ) : null}
    </div>
  );
}
