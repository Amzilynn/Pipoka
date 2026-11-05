import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider, RequireAdult, useAuth } from './context/AuthContext';
import { BubliiProvider, useBublii } from './context/BubliiContext';
import LoginScreen from './screens/LoginScreen';
import LandingPage from './screens/LandingPage';
import ChildHomeScreen from './screens/ChildHomeScreen';
import ParentDashboard from './screens/ParentDashboard';
import SpecialistDashboard from './screens/SpecialistDashboard';
import ActivityScreen from './screens/ActivityScreen';
import CalendarScreen from './screens/CalendarScreen';
import SiteNavigation from './components/SiteNavigation';
import { ChildRosterGate } from './components/ChildManager';
import { WorkspaceProvider } from './premium/WorkspaceContext';
import { ReportPage } from './premium/Reports';
import { RoutinesProvider, ChildRoutines } from './premium/Routines.jsx';
import './premium/workspace.css';
import './screens/AdultDashboard.css';

function RequireChild({ children }) {
  const { currentRole } = useBublii();
  const { user } = useAuth();
  const content = currentRole === 'enfant' ? children : <Navigate to="/connexion/enfant" replace />;
  return user ? <ChildRosterGate>{content}</ChildRosterGate> : content;
}
function LoginRoute() {
  const { role } = useParams();
  const { user } = useAuth();
  return role === 'enfant' && user ? <ChildRosterGate><LoginScreen /></ChildRosterGate> : <LoginScreen />;
}
function CalendarRoute() {
  const { role } = useParams();
  if (role === 'enfant') return <RequireChild><CalendarScreen /></RequireChild>;
  if (role === 'parent') return <Navigate to="/parent?view=calendar" replace />;
  if (['specialiste'].includes(role)) return <RequireAdult role={role}><ChildRosterGate><CalendarScreen /></ChildRosterGate></RequireAdult>;
  return <Navigate to="/connexion" replace />;
}
function SessionApp() {
  const { user, loading } = useAuth();
  if (loading) return <main className="auth-loading" role="status">Chargement de Boblii…</main>;
  return <BubliiProvider key={user?.id || 'child-device'}><WorkspaceProvider><RoutinesProvider>
    <SiteNavigation />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/connexion" element={<LoginScreen />} />
      <Route path="/connexion/:role" element={<LoginRoute />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/login/:role" element={<LoginRoute />} />
      <Route path="/:role/calendrier" element={<CalendarRoute />} />
      <Route path="/enfant" element={<RequireChild><ChildHomeScreen /></RequireChild>} />
      <Route path="/enfant/routines" element={<RequireChild><ChildRoutines /></RequireChild>} />
      <Route path="/enfant/activite" element={<RequireChild><ActivityScreen /></RequireChild>} />
      <Route path="/parent" element={<RequireAdult role="parent"><ChildRosterGate><ParentDashboard /></ChildRosterGate></RequireAdult>} />
      <Route path="/specialiste" element={<RequireAdult role="specialiste"><ChildRosterGate><SpecialistDashboard /></ChildRosterGate></RequireAdult>} />
      <Route path="/specialiste/rapport" element={<RequireAdult role="specialiste"><ChildRosterGate><ReportPage /></ChildRosterGate></RequireAdult>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </RoutinesProvider></WorkspaceProvider></BubliiProvider>;
}
export default function BubliiApp() {
  return <BrowserRouter><AuthProvider><MotionConfig reducedMotion="user"><SessionApp /></MotionConfig></AuthProvider></BrowserRouter>;
}
