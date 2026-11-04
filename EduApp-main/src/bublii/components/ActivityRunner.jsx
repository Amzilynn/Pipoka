// Bublii — ActivityRunner: the generic engine that composes every activity
// from small, reusable layout *modules*.
//
// An activity is a *recipe*:
//   - instruction content (text + optional icon + optional audio)
//   - a list of trials
//   - an interaction *pattern* (drag, match, sequencer, gesture, camera, etc.)
//   - feedback / completion / retry / hint wiring
//
// The runner never knows about the *domain* of the activity. It only knows
// how to lay out: header, instruction, input area, feedback, progress,
// navigation and completion state. Every module is a presentational
// function passed in by the activity recipe.

import React from 'react';
import { useActivity } from '../lib/ActivitySystem';
import { useChildProfile } from '../context/ChildProfileContext';
import FeedbackWell from '../components/FeedbackWell';
import { ProgressBar, StarRating } from '../components/Progress';

/**
 * ActivityRunner renders the common chrome and delegates the actual
 * interaction to children. It is the only component that needs to know
 * about the activity state machine.
 */
export default function ActivityRunner({
  // Callbacks to drive the activity (all optional; the recipe wires them)
  onStart,
  onBack,
  onNext,
  onRetry,
  onHint,
  onSkip,
  onComplete,
  onTaskDone,

  // The activity "shell" supplies the child-facing chrome
  title,
  subtitle,
  instruction,
  instructionIcon,

  // Progress config
  totalTrials,
  currentTrial,

  // Feedback from the recipe (set by the interaction module)
  feedback,

  // Completion state
  complete,
  score,

  // Extra chrome
  headerRight,
  footerRight,
}) {
  const { activity, dispatch } = useActivity();
  const { profile } = useChildProfile();

  const canPrev = activity.currentIndex > 0;
  const canNext = activity.currentIndex < (totalTrials || 1) - 1;
  const isCompleted = activity.complete || complete;

  const handleNext = () => {
    onNext?.();
    dispatch({ type: 'NEXT' });
  };

  const handleRetry = () => {
    onRetry?.();
    dispatch({ type: 'RETRY' });
  };

  const handleHint = () => {
    onHint?.();
    dispatch({ type: 'HINT' });
  };

  const handleSkip = () => {
    onSkip?.();
    dispatch({ type: 'SKIP' });
  };

  const handleComplete = () => {
    onComplete?.();
    dispatch({ type: 'COMPLETE' });
  };

  return (
    <div className="activity-runner">
      {/* Header */}
      <header className="activity-runner__header">
        <div className="activity-runner__header__inner">
          {onBack && (
            <button type="button" className="activity-runner__header__back" onClick={onBack} aria-label="Retour">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="activity-runner__header__title">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>

          {headerRight}
        </div>
      </header>

      {/* Instruction */}
      {instruction && (
        <section className="activity-runner__instruction">
          {instructionIcon && (
            <div className="activity-runner__instruction__icon">{instructionIcon}</div>
          )}
          <p className="activity-runner__instruction__text">{instruction}</p>
        </section>
      )}

      {/* Main content (supplied by the recipe) */}
      <main className="activity-runner__main">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { activity, dispatch }) : child
        )}
      </main>

      {/* Feedback */}
      {feedback && !isCompleted && <FeedbackWell feedback={feedback} onAction={onNext} />}

      {/* Completion state */}
      {isCompleted && (
        <div className="activity-runner__completion">
          <div className="activity-runner__completion__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a9 9 0 1 1-9-9c1.1 0 2-.9 2-2 0-.1 0-.2 0-.3v1.1c0 .2 0 .4 0 .6 0 2.5-2 4.6-4.6 4.6-1.2 0-2.3-.3-3.2-.9l-1.6 1.6c-.4.4-.5.9-.2 1.4.3.5.9.6 1.4.2l1.6-1.6A9.98 9.98 0 0 0 22 11.08z" />
            </svg>
          </div>
          <div className="activity-runner__completion__body">
            <h2>Activité terminée !</h2>
            {score !== null && (
              <p className="activity-runner__completion__score">
                {score >= 3 ? 'Parfait, question !' : score >= 2 ? 'Très bien, presque tout !' : 'Bien essayé, continue !'}
              </p>
            )}
            {profile?.firstName && <p className="activity-runner__completion__name">La voici, {profile.firstName} !</p>}
          </div>
          <button type="button" className="activity-runner__completion__btn" onClick={handleComplete}>
            Continuer
          </button>
        </div>
      )}

      {/* Progress */}
      {totalTrials > 0 && (
        <div className="activity-runner__progress">
          <div className="activity-runner__progress__track">
            <div className="activity-runner__progress__fill" style={{ width: `${totalTrials ? (activity.currentIndex / totalTrials) * 100 : 0}%` }} />
          </div>
          <p className="activity-runner__progress__label">{activity.currentIndex + 1}/{totalTrials}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="activity-runner__foot">
        {onRetry && activity.result !== null && (
          <button type="button" className="activity-runner__foot__retry" onClick={handleRetry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.5 1 5.8 2.6L7.9 15.6c-.4.3-.6.8-.5 1.3.2.7.8.9 1.5.7l1.4-1.3A8.9 8.9 0 0 0 21 12z" />
            </svg>
            Recommencer
          </button>
        )}
        {onSkip && !isCompleted && (
          <button type="button" className="activity-runner__foot__skip" onClick={handleSkip}>
            Ignorer
          </button>
        )}
        {onNext && (
          <button type="button" className="activity-runner__foot__next" onClick={handleNext}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Suivant
            {activity.currentIndex >= (totalTrials || 1) - 1 && (
              <span className="sr-only">(activité terminée)</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
