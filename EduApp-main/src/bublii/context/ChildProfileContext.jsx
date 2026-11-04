import React, { createContext, useContext, useReducer } from 'react';

const ChildProfileContext = createContext(null);

const initialProfile = {
  id: null,
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
  strengths: [],
  needs: [],
  isMuted: false,
};

function profileReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, ...action.payload };
    case 'UPDATE_AVATAR':
      return {
        ...state,
        avatar: { ...state.avatar, ...action.payload.avatar },
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'ADD_STRENGTH':
      return { ...state, strengths: [...(state.strengths || []), action.payload] };
    case 'ADD_NEED':
      return { ...state, needs: [...(state.needs || []), action.payload] };
    case 'RESET':
      return initialProfile;
    default:
      return state;
  }
}

export function ChildProfileProvider({ children }) {
  const [profile, dispatch] = useReducer(profileReducer, initialProfile);
  return (
    <ChildProfileContext.Provider value={{ profile, dispatch }}>
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const ctx = useContext(ChildProfileContext);
  if (!ctx) throw new Error('useChildProfile must be used within ChildProfileProvider');
  return ctx;
}

export default ChildProfileContext;