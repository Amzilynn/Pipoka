import React, { createContext, useContext, useReducer } from 'react';

const SpeechMuteContext = createContext(null);

const initialMute = {
  isMuted: false,
};

function muteReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, isMuted: !state.isMuted };
    case 'SET':
      return { ...state, isMuted: action.payload };
    default:
      return state;
  }
}

export function SpeechMuteProvider({ children }) {
  const [mute, dispatch] = useReducer(muteReducer, initialMute);
  return (
    <SpeechMuteContext.Provider value={{ mute, dispatch }}>
      {children}
    </SpeechMuteContext.Provider>
  );
}

export function useSpeechMute() {
  const ctx = useContext(SpeechMuteContext);
  if (!ctx) throw new Error('useSpeechMute must be used within SpeechMuteProvider');
  return ctx;
}

export default SpeechMuteContext;