// Bublii — ChildSettingsContext
// Three fictional child profiles with different preferences and support
// needs. The same activity adapts to each child using these real
// settings: number of answer choices, audio assistance, hints, difficulty,
// optional timer, and level of independence.
//
// The profile is injected into the activity through the
// ChildProfileContext (already present in the app). The activity
// components read from it (useChildProfile) and adapt the interaction.

import React, { createContext, useContext, useReducer, useState } from 'react';

const ChildSettingsContext = createContext(null);

const DEFAULT_PROFILE = {
  id: 'lea',
  firstName: 'Léna',
  avatar: {
    skin: '#F1C7A5',
    hair: '#6B4226',
    shirt: '#8B7CF6',
    bg: '#EFECFF',
    style: 'short',
    accessory: 'none',
  },
  level: 4,
  language: 'fr',
  strengths: ['vision', 'imitation'],
  needs: ['attention', 'temps'],
  isMuted: false,
  // Settings that truly change behaviour
  settings: {
    // number of answer choices (LEARN, COMMUNICATE, GROW)
    answerChoices: 4, // 2, 3, 4
    // audio assistance: whether the app reads instructions aloud
    audio: true,
    // hints: whether a hint is available and how many
    hints: 3,
    // difficulty: changes content difficulty (3-5)
    difficulty: 4,
    // optional timer: enabled / disabled
    timer: false,
    // level of independence: how much the child does alone (0 = guided, 1 = independent)
    independence: 1,
    // alternative interaction: whether to use a non-camera/touch interaction
    useAlternatives: false,
  },
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET_SETTINGS': {
      const next = { ...state, settings: { ...state.settings, ...action.payload } };
      return next;
    }
    case 'TOGGLE': {
      const key = action.payload;
      return {
        ...state,
        settings: { ...state.settings, [key]: !state.settings[key] },
      };
    }
    case 'SET_ANSWER_CHOICES': {
      return {
        ...state,
        settings: { ...state.settings, answerChoices: action.payload },
      };
    }
    case 'SET_AUDIO': {
      return { ...state, settings: { ...state.settings, audio: action.payload } };
    }
    case 'SET_HINTS': {
      return { ...state, settings: { ...state.settings, hints: action.payload } };
    }
    case 'SET_DIFFICULTY': {
      return { ...state, settings: { ...state.settings, difficulty: action.payload } };
    }
    case 'SET_TIMER': {
      return { ...state, settings: { ...state.settings, timer: action.payload } };
    }
    case 'SET_INDEPENDENCE': {
      return { ...state, settings: { ...state.settings, independence: action.payload } };
    }
    case 'SET_ALTERNATIVES': {
      return { ...state, settings: { ...state.settings, useAlternatives: action.payload } };
    }
    case 'RESET':
      return { ...DEFAULT_PROFILE, settings: { ...DEFAULT_PROFILE.settings } };
    default:
      return state;
  }
}

export function ChildSettingsProvider({ children }) {
  const [profile, dispatch] = useReducer(settingsReducer, DEFAULT_PROFILE);

  const value = {
    profile,
    dispatch,
    setSettings: (payload) => dispatch({ type: 'SET_SETTINGS', payload }),
    toggle: (key) => dispatch({ type: 'TOGGLE', payload: key }),
    setAnswerChoices: (n) => dispatch({ type: 'SET_ANSWER_CHOICES', payload: n }),
    setAudio: (on) => dispatch({ type: 'SET_AUDIO', payload: on }),
    setHints: (n) => dispatch({ type: 'SET_HINTS', payload: n }),
    setDifficulty: (lvl) => dispatch({ type: 'SET_DIFFICULTY', payload: lvl }),
    setTimer: (on) => dispatch({ type: 'SET_TIMER', payload: on }),
    setIndependence: (ind) => dispatch({ type: 'SET_INDEPENDENCE', payload: ind }),
    setAlternatives: (on) => dispatch({ type: 'SET_ALTERNATIVES', payload: on }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return (
    <ChildSettingsContext.Provider value={value}>
      {children}
    </ChildSettingsContext.Provider>
  );
}

export function useChildSettings() {
  const ctx = useContext(ChildSettingsContext);
  if (!ctx) throw new Error('useChildSettings must be used within ChildSettingsProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Three fictional child profiles with different preferences and support needs
// ---------------------------------------------------------------------------
export const CHILD_PROFILES = [
  {
    id: 'lea',
    firstName: 'Léna',
    avatar: {
      skin: '#F1C7A5',
      hair: '#6B4226',
      shirt: '#8B7CF6',
      bg: '#EFECFF',
      style: 'short',
      accessory: 'none',
    },
    level: 4,
    language: 'fr',
    strengths: ['vision', 'imitation'],
    needs: ['attention', 'temps'],
    isMuted: false,
    settings: {
      answerChoices: 4,
      audio: true,
      hints: 3,
      difficulty: 4,
      timer: false,
      independence: 1,
      useAlternatives: false,
    },
  },
  {
    id: 'noah',
    firstName: 'Noah',
    avatar: {
      skin: '#E8B88C',
      hair: '#3B2A1A',
      shirt: '#2FC48D',
      bg: '#E2F9F0',
      style: 'curly',
      accessory: 'freckles',
    },
    level: 3,
    language: 'fr',
    strengths: ['moteur', 'auditif'],
    needs: ['mobilisation', 'répétition'],
    isMuted: false,
    settings: {
      answerChoices: 3,
      audio: true,
      hints: 2,
      difficulty: 3,
      timer: false,
      independence: 1,
      useAlternatives: false,
    },
  },
  {
    id: 'ines',
    firstName: 'Inès',
    avatar: {
      skin: '#E8B88C',
      hair: '#6B4226',
      shirt: '#FF9F43',
      bg: '#FFF1DE',
      style: 'buns',
      accessory: 'glasses',
    },
    level: 5,
    language: 'fr',
    strengths: ['langage', 'raisonnement'],
    needs: ['plus de défis', 'autonomie'],
    isMuted: false,
    settings: {
      answerChoices: 4,
      audio: false,
      hints: 1,
      difficulty: 5,
      timer: true,
      independence: 0,
      useAlternatives: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers to compute activity adaptation from a profile
// ---------------------------------------------------------------------------
export function adaptContent(content, profile) {
  const { settings } = profile;
  const { answerChoices, difficulty, audio, hints, timer, independence } = settings;

  // Difficulty changes the number of steps/questions up to the content limit
  let steps = content?.steps || content?.items || content?.questions || [];
  if (steps.length > 0 && difficulty) {
    const max = steps.length;
    const min = 2;
    const clamped = Math.min(max, Math.max(min, difficulty));
    if (clamped !== steps.length) {
      steps = steps.slice(0, clamped);
    }
  }

  // answerChoices reduces the number of answer options for LEARN/COMMUNICATE
  if (steps) {
    // only apply to activities that present options
    // (this is a generic hook; the activity components decide what to do)
    if (answerChoices && answerChoices < steps.length) {
      // Keep the first answerChoices items (or the correct one + others)
      steps = steps.slice(0, answerChoices);
    }
  }

  // difficulty also adjusts the challenge level of each step
  return {
    ...content,
    settings: {
      ...content.settings,
      difficulty: Math.min(5, Math.max(3, difficulty || content.settings?.difficulty || 4)),
      steps,
      hintAvailable: hints > 0,
      audio,
      timer,
      independence,
    },
  };
}

export function useAdaptedActivity(content, profile) {
  return adaptContent(content, profile);
}
