import { readChildAccess } from '../utils/childAccess';
import { useAuth } from './AuthContext';
import { mergeChildProfiles, childProfile } from '../data/childProfiles';
import { childrenRequest } from '../utils/childrenApi';
import { accountLocalStorage, accountSessionStorage } from '../utils/accountStorage';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const { user } = useAuth();
  const [childrenLoading, setChildrenLoading] = useState(Boolean(user));
  const [childrenError, setChildrenError] = useState('');
  // 1. Current active role (enfant | parent | specialiste)
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return accountSessionStorage.getItem('bubliiRole') || null;
    } catch {
      return null;
    }
  });

  // 2. Selected child ID
  const [selectedChildId, setSelectedChildId] = useState(() => {
    try {
      return accountLocalStorage.getItem('bubliiChildId') || accountSessionStorage.getItem('bubliiChildId') || 'local-child';
    } catch {
      return 'local-child';
    }
  });

  // 3. Child profiles with settings and progress
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = readSavedProfiles(accountLocalStorage) || readSavedProfiles(accountSessionStorage);
      if (user) {
        if (user.role !== 'parent') return saved || [];
        const peter = saved?.find(profile => profile.firstName.toLowerCase().startsWith('peter'));
        return peter ? [peter] : (saved || []).slice(0, 1);
      }
      const registered = readChildAccess();
      const local = saved?.filter(profile => profile.id === 'local-child' || registered[profile.id]);
      if (local?.length) return local;
      const legacy = accountSessionStorage.getItem('bubliiProfiles');
      return migrateProfiles(INITIAL_CHILD_PROFILES, legacy ? JSON.parse(legacy) : null);
    } catch {
      return user ? [] : migrateProfiles(INITIAL_CHILD_PROFILES, null);
    }
  });

  const refreshChildren = useCallback(async () => {
    if (!user) return;
    setChildrenLoading(true); setChildrenError('');
    try {
      const current = await childrenRequest();
      const keys = new Set(current.children?.map(child => child.presentationKey));
      const needsContent = user.role === 'parent' ? !current.children?.[0]?.presentationKey : ['peter', 'emma', 'noah', 'amir'].some(key => !keys.has(key));
      const data = needsContent ? await childrenRequest('/representation', {}) : current;
      if (!Array.isArray(data.children)) throw new Error('La liste des enfants est indisponible.');
      setProfiles(previous => mergeChildProfiles(data.children, previous));
    } catch (error) { setChildrenError(error.message); }
    finally { setChildrenLoading(false); }
  }, [user?.id]);
  useEffect(() => { refreshChildren(); }, [refreshChildren]);
  const addChild = async input => {
    const data = await childrenRequest('', input);
    setProfiles(previous => mergeChildProfiles(data.children, previous));
    setSelectedChildId(data.child.id);
    return data.child;
  };
  const associateChild = async code => {
    const data = await childrenRequest('/associate', { code });
    setProfiles(previous => mergeChildProfiles(data.children, previous));
    setSelectedChildId(data.childId);
  };
  const updateChildProfile = async (id, input) => {
    const data = await childrenRequest(`/${id}/profile`, input);
    setProfiles(previous => mergeChildProfiles(data.children, previous));
    return data.child;
  };
  const inviteForChild = id => childrenRequest(`/${id}/invitation`, {});

  // Keep accountSessionStorage in sync
  useEffect(() => {
    try {
      if (currentRole) {
        accountSessionStorage.setItem('bubliiRole', currentRole);
      } else {
        accountSessionStorage.removeItem('bubliiRole');
      }
    } catch {
      // ignore in constrained storage
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      accountSessionStorage.setItem('bubliiChildId', selectedChildId);
      accountLocalStorage.setItem('bubliiChildId', selectedChildId);
    } catch {
      // ignore
    }
  }, [selectedChildId]);

  useEffect(() => {
    if (user && (childrenLoading || childrenError)) return;
    try {
      const old = accountLocalStorage.getItem(PROFILES_STORAGE_KEY);
      if (user && old && !accountLocalStorage.getItem('bubliiLegacyProfilesBackup')) accountLocalStorage.setItem('bubliiLegacyProfilesBackup', old);
      accountLocalStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch {
      try { accountSessionStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles)); } catch { /* In-memory fallback. */ }
    }
  }, [profiles, childrenLoading, childrenError, user?.id]);

  // The active child object
  const activeChild = profiles.find((p) => p.id === selectedChildId) || profiles[0] || INITIAL_CHILD_PROFILES[0];

  // Action: Switch active child
  const switchChild = (childId) => {
    if (profiles.some((p) => p.id === childId)) {
      setSelectedChildId(childId);
    }
  };

  const enterRegisteredChild = id => {
    if (user) {
      if (!profiles.some(profile => profile.id === id)) return false;
    } else {
      const registered = readChildAccess()[id]?.child;
      if (!registered) return false;
      setProfiles(previous => [...previous.filter(profile => profile.id !== id && profile.id !== 'local-child'), childProfile(registered, previous.find(profile => profile.id === id))]);
    }
    setSelectedChildId(id);
    return true;
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
    setProfiles(previous => user ? previous.map(profile => childProfile(profile)) : migrateProfiles(INITIAL_CHILD_PROFILES, null));
    setSelectedChildId('local-child');
    try {
      accountSessionStorage.removeItem('bubliiProfiles');
      accountSessionStorage.removeItem('bubliiChildId');
      accountSessionStorage.removeItem(PROFILES_STORAGE_KEY);
      accountLocalStorage.removeItem(PROFILES_STORAGE_KEY);
      accountLocalStorage.removeItem('bubliiChildId');
    } catch {
      // ignore
    }
  };

  const value = {
    childrenLoading, childrenError, refreshChildren, addChild, associateChild, inviteForChild, updateChildProfile,
    currentRole,
    setCurrentRole,
    selectedChildId,
    activeChild,
    profiles,
    switchChild, enterRegisteredChild,
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
