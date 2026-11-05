import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { setStorageAccount } from '../utils/accountStorage';

const AuthContext = createContext(null);
async function request(path, body) {
  let response;
  try {
    response = await fetch(`/api/auth/${path}`, { method: body ? 'POST' : 'GET', credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  } catch { throw new Error('Connexion au serveur impossible. Réessayez.'); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !Object.hasOwn(data, 'user') || (['signup', 'login'].includes(path) && !data.user)) throw new Error(data.error || 'Connexion indisponible. Réessayez.');
  return data.user;
}
export function AuthProvider({ children }) {
  const { pathname } = useLocation();
  // A restored cookie must not skip a fresh parent login in this page visit.
  const [parentLoginId, setParentLoginId] = useState(null);
  useEffect(() => {
    if (pathname === '/' || /^\/(connexion|login)(\/parent)?\/?$/.test(pathname)) setParentLoginId(null);
  }, [pathname]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const applyUser = useCallback(next => { setStorageAccount(next?.id); setUser(next); }, []);
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    try { const next = await request('session'); if (version === generation.current) { applyUser(next); setError(''); } }
    catch (problem) { if (version === generation.current) { applyUser(null); setError(problem.message); } }
    finally { if (version === generation.current) setLoading(false); }
  }, [applyUser]);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [user?.id, refresh]);
  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('boblii-auth') : null;
    if (channel) channel.onmessage = () => { setLoading(true); refresh(); };
    const visibility = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { channel?.close(); document.removeEventListener('visibilitychange', visibility); };
  }, [refresh]);
  const notify = () => { if (typeof BroadcastChannel !== 'undefined') { const channel = new BroadcastChannel('boblii-auth'); channel.postMessage('changed'); channel.close(); } };
  const authenticate = async (mode, values) => { ++generation.current; const next = await request(mode, values); ++generation.current; applyUser(next); setParentLoginId(next?.role === 'parent' ? next.id : null); setLoading(false); setError(''); notify(); return next; };
  const logout = async () => { ++generation.current; await request('logout', {}); ++generation.current; applyUser(null); setParentLoginId(null); setLoading(false); setError(''); notify(); };
  return <AuthContext.Provider value={{ user, loading, error, authenticate, logout, refresh, parentLoginVerified: Boolean(user && parentLoginId === user.id) }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export function RequireAdult({ role, children }) {
  const { user, loading, error, refresh, parentLoginVerified } = useAuth();
  const location = useLocation();
  if (loading) return <main className="auth-loading" role="status">Vérification de votre connexion…</main>;
  if (error) return <main className="auth-loading"><p role="alert">{error}</p><button onClick={refresh}>Réessayer</button><Link to="/">Retour à l’accueil</Link></main>;
  if (!user || user.role !== role || (role === 'parent' && !parentLoginVerified)) return <Navigate to={`/connexion/${role}`} replace state={{ from: location.pathname + location.search }} />;
  return children;
}
