import React, { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBublii } from '../context/BubliiContext';
import './SiteNavigation.css';

const roles = ['enfant', 'parent', 'specialiste'];
export default function SiteNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const toggle = useRef(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('focusin', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('focusin', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  const { currentRole, setCurrentRole } = useBublii();
  const routeRole = pathname.split('/')[1];
  const calendarRole = roles.includes(routeRole) ? routeRole : roles.includes(currentRole) ? currentRole : 'enfant';
  const links = [
    { to: '/', label: 'Accueil', icon: '⌂', end: true },
    { to: '/connexion', label: 'Choisir un espace', icon: '▦' },
    { to: currentRole === 'enfant' ? '/enfant' : '/connexion/enfant', label: 'Enfant', icon: '☺', role: 'enfant', end: true },
    { to: '/connexion/parent', label: 'Parent', icon: '♡', role: 'parent', end: true },
    { to: '/specialiste', label: 'Spécialiste', icon: '✧', role: 'specialiste', end: true },
    { to: calendarRole === 'parent' ? '/parent?view=calendar' : calendarRole === 'enfant' ? '/enfant/routines' : '/specialiste', label: 'Calendrier', icon: '▣' },
    { to: '/enfant/routines', label: 'Petites étapes', icon: '✓', role: 'enfant' },
  ];
  if (pathname === '/' || pathname.startsWith('/connexion') || pathname.startsWith('/login')) return null;
  return <div className="site-navigation" ref={container}>
    <button type="button" className="site-navigation-toggle" ref={toggle} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(previous => !previous)}>
      <span aria-hidden="true">{open ? '\u00d7' : '\u2630'}</span> {open ? 'Fermer' : 'Naviguer'}
    </button>
    <nav id={panelId} className="site-navigation-panel" aria-label="Navigation principale" hidden={!open}>
    <div className="site-navigation-links">{links.map(({ to, label, icon, role, end }) =>
      <NavLink key={label} to={to} end={end} onClick={() => setOpen(false)}
        className={({ isActive }) => `site-navigation-link${isActive ? ' is-active' : ''}`}>
        <span aria-hidden="true">{icon}</span><span>{label}</span>
      </NavLink>
    )}</div>
    {user && <div className="site-navigation-account"><p>{user.name}</p>
      <button type="button" disabled={loggingOut} onClick={async () => {
        setLoggingOut(true); setLogoutError('');
        try { await logout(); setCurrentRole(null); setOpen(false); navigate('/', { replace: true }); }
        catch (error) { setLogoutError(error.message); setLoggingOut(false); }
      }}>{loggingOut ? 'Un instant…' : 'Se déconnecter'}</button>
      {logoutError && <p role="alert">{logoutError}</p>}
    </div>}
    </nav>
  </div>;
}
