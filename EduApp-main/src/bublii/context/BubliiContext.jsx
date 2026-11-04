import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// BUBLII UNIFIED CONTEXT
// Single source of truth for child profiles, active settings, session progress,
// and current user role. All state is local and reactive, synced with sessionStorage.
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
  const [selectedChildId, setSelectedChildId] = useState('local-child');

  // 3. Child profiles with settings and progress
  const [profiles, setProfiles] = useState(() => {
    try {
      const stored = sessionStorage.getItem('bubliiProfiles');
      const saved = stored ? JSON.parse(stored) : null;
      const local = Array.isArray(saved) ? saved.find(profile => profile.id === 'local-child') : null;
      return local ? [local] : INITIAL_CHILD_PROFILES;
    } catch {
      return INITIAL_CHILD_PROFILES;
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
    } catch {
      // ignore
    }
  }, [selectedChildId]);

  useEffect(() => {
    try {
      sessionStorage.setItem('bubliiProfiles', JSON.stringify(profiles));
    } catch {
      // ignore
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
          const mod = p.moduleProgress[module] || { completedCount: 0, totalActivities: 4, stars: 0 };
          const updatedModule = {
            ...mod,
            completedCount: Math.min(mod.totalActivities, mod.completedCount + 1),
            stars: mod.stars + score,
            lastActivity: label,
          };

          const newHistoryItem = {
            id: `h-${Date.now()}`,
            activityId,
            module,
            label,
            date: 'À l’instant',
            score,
            maxScore,
          };

          return {
            ...p,
            moduleProgress: {
              ...p.moduleProgress,
              [module]: updatedModule,
            },
            history: [newHistoryItem, ...(p.history || []).slice(0, 9)],
          };
        }
        return p;
      })
    );
  };

  // Action: Reset profiles to default demo state
  const resetAllData = () => {
    setProfiles(INITIAL_CHILD_PROFILES);
    setSelectedChildId('local-child');
    try {
      sessionStorage.removeItem('bubliiProfiles');
      sessionStorage.removeItem('bubliiChildId');
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
