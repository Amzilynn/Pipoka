import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig, AnimatePresence } from 'framer-motion';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import ConfigScreen from './screens/ConfigScreen';
import CategoryMenuScreen from './screens/CategoryMenuScreen';
import ActivityScreen from './screens/ActivityScreen';

import { useLocation } from 'react-router-dom';

function AppRoutes() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language === 'ar' ? 'ar' : 'fr';
    document.body.className = `level-${settings.level || 3}`;
  }, [settings.language, settings.level]);

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ConfigScreen />} />
          <Route
            path="/categories"
            element={settings.configured ? <CategoryMenuScreen /> : <Navigate to="/" />}
          />
          <Route
            path="/activity/:categoryId"
            element={settings.configured ? <ActivityScreen /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SettingsProvider>
  );
}
