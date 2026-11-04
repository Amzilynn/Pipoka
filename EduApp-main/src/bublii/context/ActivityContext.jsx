import React, { createContext, useContext, useReducer } from 'react';

const ActivityContext = createContext(null);

const initialActivity = {
  currentIndex: 0,
  completedTrials: 0,
  totalTrials: 0,
  activityType: null,
  moduleId: null,
  childId: null,
  pause: false,
};

function activityReducer(state, action) {
  switch (action.type) {
    case 'SET_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'SET_COMPLETED':
      return {
        ...state,
        completedTrials: state.completedTrials + (action.payload ? 1 : 0),
        totalTrials: state.totalTrials + 1,
      };
    case 'RESET':
      return initialActivity;
    case 'SET_TYPE':
      return { ...state, activityType: action.payload.type, moduleId: action.payload.moduleId };
    case 'SET_CHILD':
      return { ...state, childId: action.payload };
    case 'SET_PAUSE':
      return { ...state, pause: action.payload };
    default:
      return state;
  }
}

export function ActivityProvider({ children, initial = {} }) {
  const [activity, dispatch] = useReducer(activityReducer, initialActivity);
  return (
    <ActivityContext.Provider value={{ activity, dispatch, setIndex: (i) => dispatch({ type: 'SET_INDEX', payload: i }) }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}

export default ActivityContext;