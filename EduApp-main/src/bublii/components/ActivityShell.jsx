// Bublii — ActivityShell: a presentational scaffold for a single activity
// trial. It is reused by every activity type so that the child always sees
// the same chrome: a clear instruction, a large interactable area, immediate
// feedback, and a retry / hint affordance.

import React from 'react';
import { useActivity } from '../lib/ActivitySystem';
import { useChildProfile } from '../context/ChildProfileContext';
import {
  success,
  incorrect,
  hint as buildHint,
  info,
} from '../lib/ActivityFeedback';

/**
 * ActivityShell renders one trial of an activity.
 *
 * Props:
 *  - instruction: React node (the trial instruction, e.g. "Glisse le mot vers la bonne forme")
 *  - input:       React node (the interactable area, e.g. a set of draggable cards)
 *  - feedback:    feedback object (null when the trial is not yet resolved)
 *  - onComplete:  called when the trial is answered correctly
 *  - onWrong:     called when the child chooses incorrectly (sends feedback)
 *  - onHint:      called when the child requests a hint
 *  - hintLabel:   label for the hint action (default "Indice")
 *  - variant:     optional variant class for the shell
 *
 * The shell handles:
 *  - showing immediate, encouraging feedback
 *  - retry (recommencer) and hint
 *  - a subtle progress ring and the child's name from the profile
 *  - optional timer and optional audio (flag-driven)
 */
export default function ActivityShell({
  instruction,
  input,
  feedback,
  onComplete,
  onWrong,
  onHint,
  hintLabel = 'Indice',
  variant,
  showName = true,
  showStreak = true,
}) {
  const { activity, dispatch } = useActivity();
  const { profile } = useChildProfile();

  const handleRetry = () => {
    onWrong?.();
    dispatch({ type: 'RETRY' });
  };

  const handleHint = () => {
    onHint?.();
    dispatch({ type: 'HINT' });
  };

  const hasFeedback = feedback !== null;

  return (
    <section
      className={`activity-shell${variant ? ` activity-shell--${variant}` : ''}`}
      role="region"
      aria-label="Activité"
    >
      {/* Instruction */}
      {instruction && (
        <div className="activity-shell__instruction">
          <p className="activity-shell__instruction__label">Indication</p>
          <p className="activity-shell__instruction__text">{instruction}</p>
        </div>
      )}

      {/* Interactive content */}
      <div className="activity-shell__input">{input}</div>

      {/* Feedback */}
      {hasFeedback && (
        <div className="activity-shell__feedback">
          {feedback.type === 'success' ? (
            <div className="feedback-shell__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a9 9 0 1 1-9-9c1.1 0 2-.9 2-2 0-.1 0-.2 0-.3v1.1c0 .2 0 .4 0 .6 0 2.5-2 4.6-4.6 4.6-1.2 0-2.3-.3-3.2-.9l-1.6 1.6c-.4.4-.5.9-.2 1.4.3.5.9.6 1.4.2l1.6-1.6A9.98 9.98 0 0 0 22 11.08z" />
              </svg>
            </div>
          ) : feedback.type === 'incorrect' ? (
            <div className="feedback-shell__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
          ) : feedback.type === 'hint' ? (
            <div className="feedback-shell__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4.4 12.4c.7.6 1.2 1.5 1.2 2.4V18h6.4v-1.2c0-.9.5-1.8 1.2-2.4A7 7 0 0 0 12 2Z" />
              </svg>
            </div>
          ) : (
            <div className="feedback-shell__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1.1 6.1-5.5-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9Z" />
              </svg>
            </div>
          )}

          <div className="feedback-shell__body">
            <p className="feedback-shell__message">{feedback.message}</p>
            {feedback.actionLabel && feedback.actionOnClick ? (
              <button
                type="button"
                className="feedback-shell__action"
                onClick={() => onHint?.()}
              >
                {feedback.actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Retry / hint controls */}
      {hasFeedback && (
        <div className="activity-shell__actions">
          {onWrong && (
            <button type="button" className="activity-shell__action-btn" onClick={handleRetry}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.5 1 5.8 2.6L7.9 15.6c-.4.3-.6.8-.5 1.3.2.7.8.9 1.5.7l1.4-1.3A8.9 8.9 0 0 0 21 12z" />
              </svg>
              Recommencer
            </button>
          )}
          {onHint && (
            <button type="button" className="activity-shell__action-btn" onClick={handleHint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4.4 12.4c.7.6 1.2 1.5 1.2 2.4V18h6.4v-1.2c0-.9.5-1.8 1.2-2.4A7 7 0 0 0 12 2Z" />
              </svg>
              Indice
            </button>
          )}
        </div>
      )}

      {/* Name + streak (when profile is available) */}
      {showName && profile?.firstName && !showStreak ? (
        <div className="activity-shell__name">
          <span className="activity-shell__name__label">Bonjour, {profile.firstName} !</span>
        </div>
      ) : null}

      {showStreak && profile?.firstName && activity.streak > 0 && (
        <div className="activity-shell__streak" role="status">
          <span className="activity-shell__streak__icon">🔥</span>
          <span className="activity-shell__streak__text">{activity.streak} bonne{s} en séquence</span>
        </div>
      )}
    </section>
  );
}
