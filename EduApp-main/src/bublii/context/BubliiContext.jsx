import React, { createContext, useContext, useState, useEffect } from 'react';
import { appendCompletion, migrateProfiles, readSavedProfiles, PROFILES_STORAGE_KEY } from '../data/progress';

// ============================================================================
// BUBLII UNIFIED CONTEXT
// Single source of truth for child profiles, active settings, session progress,
// and current user role. Profiles persist locally; role remains per tab.
// ============================================================================

export const INITIAL_CHILD_PROFILES = [{
  id: 'local-child', firstName: 'Mon espace', age: null, tagline: 'Mon espace personnel',
  avatar: { initial: '☺', bg: '#EBF4FF', color: '#2A6FB5', borderColor: '#2A6FB5' },
  strengths: [], supportNeeds: [], objectives: [], history: [],
  settings: { answerChoices: 4, audio: true, hints: 3, difficulty: 3, timer: false, independence: 'Progressif', useAlternatives: false },
  moduleProgress: Object.fromEntries(['learn', 'communicate', 'move', 'grow'].map(id => [id, { completedCount: 0, totalActivities: 4, stars: 0, lastActivity: 'Aucune activité pour le moment' }])),
}];
const BubliiContext = createContext(null);

export function BubliiProvider({ children }) {
  // 1. Current active role (enfant | parent | specialiste)
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return sessionStorage.getItem('bubliiRole') || null;
    } catch {
      return null;
    }
  });

  // 2. Selected child ID
  const [selectedChildId, setSelectedChildId] = useState(() => {
    try {
      return localStorage.getItem('bubliiChildId') || sessionStorage.getItem('bubliiChildId') || 'local-child';
    } catch {
      return 'local-child';
    }
  });

  // 3. Child profiles with settings and progress
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = readSavedProfiles(localStorage) || readSavedProfiles(sessionStorage);
      const local = saved?.filter((profile) => profile.id === 'local-child');
      if (local?.length) return local;
      const legacy = sessionStorage.getItem('bubliiProfiles');
      return migrateProfiles(INITIAL_CHILD_PROFILES, legacy ? JSON.parse(legacy) : null);
    } catch {
      return migrateProfiles(INITIAL_CHILD_PROFILES, null);
    }
  });

  // Keep sessionStorage in sync
  useEffect(() => {
    try {
      if (currentRole) {
        sessionStorage.setItem('bubliiRole', currentRole);
      } else {
        sessionStorage.removeItem('bubliiRole');
      }
    } catch {
      // ignore in constrained storage
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      sessionStorage.setItem('bubliiChildId', selectedChildId);
      localStorage.setItem('bubliiChildId', selectedChildId);
    } catch {
      // ignore
    }
  }, [selectedChildId]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch {
      try { sessionStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles)); } catch { /* In-memory fallback. */ }
    }
  }, [profiles]);

  // The active child object
  const activeChild = profiles.find((p) => p.id === selectedChildId) || profiles[0];

  // Action: Switch active child
  const switchChild = (childId) => {
    if (profiles.some((p) => p.id === childId)) {
      setSelectedChildId(childId);
    }
  };

  // Action: Update settings for a specific child (or active child)
  const updateSettings = (childId, newSettings) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === childId) {
          return {
            ...p,
            settings: {
              ...p.settings,
              ...newSettings,
            },
          };
        }
        return p;
      })
    );
  };

  // Action: Record activity completion (advances progress and logs to history)
  const recordActivityCompletion = (childId, { activityId, module, label, score = 3, maxScore = 3 }) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === childId) {
          return appendCompletion(p, { activityId, module, label, score, maxScore });
        }
        return p;
      })
    );
  };

  // Action: Reset profiles to default demo state
  const resetAllData = () => {
    setProfiles(migrateProfiles(INITIAL_CHILD_PROFILES, null));
    setSelectedChildId('local-child');
    try {
      sessionStorage.removeItem('bubliiProfiles');
      sessionStorage.removeItem('bubliiChildId');
      sessionStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem('bubliiChildId');
    } catch {
      // ignore
    }
  };

  const value = {
    currentRole,
    setCurrentRole,
    selectedChildId,
    activeChild,
    profiles,
    switchChild,
    updateSettings,
    recordActivityCompletion,
    resetAllData,
  };

  return <BubliiContext.Provider value={value}>{children}</BubliiContext.Provider>;
}

export function useBublii() {
  const context = useContext(BubliiContext);
  if (!context) {
    throw new Error('useBublii must be used within a BubliiProvider');
  }
  return context;
}

export default BubliiContext;
