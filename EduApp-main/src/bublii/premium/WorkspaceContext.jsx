import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { emptyWorkspace, loadWorkspace, WORKSPACE_KEY, uid } from './model';

const WorkspaceContext = createContext(null);
export function WorkspaceProvider({ children }) {
  const [initial] = useState(() => { try { return { data: loadWorkspace(localStorage), error: '' }; } catch (error) { return { data: emptyWorkspace(), error: error.message }; } });
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error);
  const ref = useRef(data);
  const commit = (update) => {
    if (initial.error) throw new Error(initial.error);
    const next = update(ref.current);
    try { localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next)); }
    catch { setError('Enregistrement indisponible. Gardez votre texte ouvert et réessayez.'); throw new Error('Enregistrement indisponible dans ce navigateur.'); }
    ref.current = next; setData(next); setError('');
  };
  useEffect(() => {
    const refresh = (event) => {
      if (event.key !== WORKSPACE_KEY) return;
      try { const next = loadWorkspace(localStorage); ref.current = next; setData(next); setError(''); }
      catch { setError('Une mise à jour locale n’a pas pu être lue.'); }
    };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);
  const publish = (childId, recipient, type, text, update = (previous) => previous, details = {}) => {
    const createdAt = new Date().toISOString();
    const event = { ...details, id: uid(), childId, type, text, createdAt };
    commit((previous) => ({ ...update(previous), events: [event, ...previous.events], notifications: [{ id: uid(), childId, recipient, title: text, createdAt, read: false, eventId: event.id }, ...previous.notifications] }));
  };
  return <WorkspaceContext.Provider value={{ data, commit, publish, error }}>{children}</WorkspaceContext.Provider>;
}
export const useWorkspace = () => useContext(WorkspaceContext);
