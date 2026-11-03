import React, { createContext, useContext, useReducer } from 'react';

const SettingsContext = createContext(null);

const initialSettings = {
  level: null,       // 3 | 4 | 5
  language: null,    // 'fr' | 'ar'
  voiceType: null,   // 'child_female' | 'child_male'
  configured: false,
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, level: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_VOICE':
      return { ...state, voiceType: action.payload };
    case 'CONFIRM':
      return { ...state, configured: true };
    case 'RESET':
      return { ...initialSettings };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
