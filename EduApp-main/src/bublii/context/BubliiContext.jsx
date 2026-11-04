import React, { createContext, useContext, useState, useEffect } from 'react';
import { appendCompletion, migrateProfiles, readSavedProfiles, PROFILES_STORAGE_KEY } from '../data/progress';

// ============================================================================
// BUBLII UNIFIED CONTEXT
// Single source of truth for child profiles, active settings, session progress,
// and current user role. Profiles persist locally; role remains per tab.
// ============================================================================

export const INITIAL_CHILD_PROFILES = [
  {
    id: 'lea',
    firstName: 'Léna',
    age: 9,
    tagline: 'Dynamique & visuelle',
    avatar: {
      initial: 'L',
      bg: '#EBF4FF',
      color: '#2A6FB5',
      borderColor: '#2A6FB5',
    },
    strengths: ['Mémoire visuelle', 'Imitation gestuelle', 'Enthousiasme'],
    supportNeeds: ['Temps d’assimilation', 'Consignes courtes et visuelles'],
    objectives: [
      { id: 'obj-1', title: 'Reconnaître et nommer les 4 émotions de base', progress: 75, module: 'communicate' },
      { id: 'obj-2', title: 'Enchaîner la routine du brossage de dents sans oubli', progress: 60, module: 'grow' },
      { id: 'obj-3', title: 'Imiter le geste bras levés face à la caméra', progress: 85, module: 'move' },
    ],
    settings: {
      answerChoices: 4,      // 2, 3 ou 4 options
      audio: true,           // Synthèse vocale / lecture consigne activée
      hints: 3,              // Nombre d'indices autorisés (1, 2, 3)
      difficulty: 4,         // Niveau de complexité (3 à 5)
      timer: false,          // Chronomètre facultatif (jamais imposé)
      independence: 'Progressif', // 'Assisté' | 'Progressif' | 'Autonome'
      useAlternatives: false // Mode tactile sans caméra
    },
    moduleProgress: {
      learn: { completedCount: 3, totalActivities: 4, stars: 9, lastActivity: 'Associer mots et images' },
      communicate: { completedCount: 2, totalActivities: 4, stars: 6, lastActivity: 'Reconnaître les émotions' },
      move: { completedCount: 3, totalActivities: 4, stars: 8, lastActivity: 'Imiter le mouvement' },
      grow: { completedCount: 2, totalActivities: 4, stars: 5, lastActivity: 'Je me brosse les dents' },
    },
    history: [
      { id: 'h-1', activityId: 'associer-mots-images', module: 'learn', label: 'Associer mots et images', date: 'Aujourd’hui, 14:20', score: 3, maxScore: 3 },
      { id: 'h-2', activityId: 'imiter-le-mouvement', module: 'move', label: 'Imiter le mouvement (Bras levés)', date: 'Aujourd’hui, 14:05', score: 3, maxScore: 3 },
      { id: 'h-3', activityId: 'dents-propres', module: 'grow', label: 'Je me brosse les dents', date: 'Hier, 18:30', score: 2, maxScore: 3 },
    ]
  },
  {
    id: 'noah',
    firstName: 'Noah',
    age: 6,
    tagline: 'Curieux & sensible aux sons',
    avatar: {
      initial: 'N',
      bg: '#E6FFFA',
      color: '#2FC48D',
      borderColor: '#2FC48D',
    },
    strengths: ['Sensibilité auditive', 'Motivation par le jeu', 'Curiosité'],
    supportNeeds: ['Motricité fine', 'Besoin de répétitions sécurisantes'],
    objectives: [
      { id: 'obj-4', title: 'Associer 5 mots clés du quotidien avec leurs images', progress: 50, module: 'learn' },
      { id: 'obj-5', title: 'Exprimer la faim et la soif avec les pictogrammes', progress: 65, module: 'communicate' },
      { id: 'obj-6', title: 'Lever les bras en rythme avec le modèle', progress: 40, module: 'move' },
    ],
    settings: {
      answerChoices: 2,      // Simplification maximale à 2 choix
      audio: true,
      hints: 3,
      difficulty: 3,
      timer: false,
      independence: 'Assisté',
      useAlternatives: false
    },
    moduleProgress: {
      learn: { completedCount: 1, totalActivities: 4, stars: 3, lastActivity: 'Associer mots et images' },
      communicate: { completedCount: 2, totalActivities: 4, stars: 5, lastActivity: 'Exprimer ses besoins' },
      move: { completedCount: 1, totalActivities: 4, stars: 2, lastActivity: 'Imiter le mouvement' },
      grow: { completedCount: 1, totalActivities: 4, stars: 3, lastActivity: 'Ma routine du matin' },
    },
    history: [
      { id: 'h-4', activityId: 'exprimer-ses-besoins', module: 'communicate', label: 'Exprimer ses besoins', date: 'Aujourd’hui, 10:15', score: 2, maxScore: 3 },
      { id: 'h-5', activityId: 'ordre-du-matin', module: 'grow', label: 'Ma routine du matin', date: 'Hier, 08:45', score: 3, maxScore: 3 },
    ]
  },
  {
    id: 'ines',
    firstName: 'Inès',
    age: 14,
    tagline: 'Adolescente autonome',
    avatar: {
      initial: 'I',
      bg: '#FFF5F5',
      color: '#E84545',
      borderColor: '#E84545',
    },
    strengths: ['Compréhension sociale', 'Expression orale', 'Envie d’autonomie'],
    supportNeeds: ['Structuration du temps', 'Gestion des imprévus'],
    objectives: [
      { id: 'obj-7', title: 'Préparer son sac d’école sans aide d’un adulte', progress: 90, module: 'grow' },
      { id: 'obj-8', title: 'Résoudre des situations sociales du collège', progress: 80, module: 'communicate' },
      { id: 'obj-9', title: 'Enchaîner une séquence de 3 mouvements corporels', progress: 70, module: 'move' },
    ],
    settings: {
      answerChoices: 4,
      audio: false,          // Inès lit de manière autonome
      hints: 1,
      difficulty: 5,
      timer: true,           // Timer doux pour stimuler l'organisation
      independence: 'Autonome',
      useAlternatives: false
    },
    moduleProgress: {
      learn: { completedCount: 4, totalActivities: 4, stars: 12, lastActivity: 'Résoudre un problème' },
      communicate: { completedCount: 3, totalActivities: 4, stars: 9, lastActivity: 'Situations sociales' },
      move: { completedCount: 2, totalActivities: 4, stars: 6, lastActivity: 'Reproduire une séquence' },
      grow: { completedCount: 4, totalActivities: 4, stars: 11, lastActivity: 'Je prépare mon sac' },
    },
    history: [
      { id: 'h-6', activityId: 'sac-de-ecole', module: 'grow', label: 'Je prépare mon sac', date: 'Hier, 19:10', score: 3, maxScore: 3 },
      { id: 'h-7', activityId: 'situations-sociales', module: 'communicate', label: 'Situations sociales', date: 'Il y a 2 jours', score: 3, maxScore: 3 },
    ]
  }
];

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
      return localStorage.getItem('bubliiChildId') || sessionStorage.getItem('bubliiChildId') || 'lea';
    } catch {
      return 'lea';
    }
  });

  // 3. Child profiles with settings and progress
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = readSavedProfiles(localStorage) || readSavedProfiles(sessionStorage);
      if (saved) return saved;
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
    setSelectedChildId('lea');
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

