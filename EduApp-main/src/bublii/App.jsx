import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { BubliiProvider } from './context/BubliiContext';
import LoginScreen from './screens/LoginScreen';
import LandingPage from './screens/LandingPage';
import ChildHomeScreen from './screens/ChildHomeScreen';
import ParentDashboard from './screens/ParentDashboard';
import SpecialistDashboard from './screens/SpecialistDashboard';
import ActivityScreen from './screens/ActivityScreen';
import CalendarScreen from './screens/CalendarScreen';

export default function BubliiApp() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <BubliiProvider>
      <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
        <BrowserRouter>
          <Routes>
            <Route path=":role/calendrier" element={<CalendarScreen />} />
            {/* 1. Sélecteur de rôle d'entrée */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/connexion" element={<LoginScreen />} />
            <Route path="/connexion/:role" element={<LoginScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/login/:role" element={<LoginScreen />} />

            {/* 2. Espace Enfant */}
            <Route path="/enfant" element={<ChildHomeScreen />} />
            <Route path="/enfant/activite" element={<ActivityScreen />} />

            {/* 3. Espace Parent */}
            <Route path="/parent" element={<ParentDashboard />} />

            {/* 4. Espace Spécialiste / ESMS */}
            <Route path="/specialiste" element={<SpecialistDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </BubliiProvider>
  );
}
