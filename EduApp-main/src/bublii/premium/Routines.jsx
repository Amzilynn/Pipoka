import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import TTSButton from '../components/TTSButton';
import { makeRoutine, recordRoutineStep, routineDay, routineKey, routinesOn, ROUTINE_MODELS, ROUTINES_KEY } from './routines.js';
import './routines.css';

const RoutinesContext = createContext(null);
function read() {
  const raw = localStorage.getItem(ROUTINES_KEY);
  if (!raw) return { version: 1, routines: [], progress: {} };
  const value = JSON.parse(raw);
  if (value.version !== 1 || !Array.isArray(value.routines) || !value.progress || typeof value.progress !== 'object' || Array.isArray(value.progress) || value.routines.some((r) => !r.id || !r.revision || !r.childId || !Array.isArray(r.steps) || !r.steps.length || r.steps.some((s) => typeof s !== 'string') || typeof r.title !== 'string' || !['daily', 'once'].includes(r.repeat))) throw new Error('Les routines enregistrées ne peuvent pas être lues. Elles sont conservées sans modification.');
  return value;
}
export function RoutinesProvider({ children }) {
  const [initial] = useState(() => { try { return { data: read(), error: '' }; } catch { return { data: { version: 1, routines: [], progress: {} }, error: 'Les routines ne sont pas accessibles. Les données existantes sont conservées.' }; } });
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error);
  const blocked = useRef(Boolean(initial.error));
  const ref = useRef(data);
  const commit = (update) => {
    if (blocked.current) throw new Error('Les routines ne sont pas accessibles. Rechargez la page avant de réessayer.');
    const next = update(ref.current);
    try { localStorage.setItem(ROUTINES_KEY, JSON.stringify(next)); }
    catch { setError('Enregistrement impossible dans ce navigateur. Votre action n’a pas été sauvegardée.'); throw new Error('Enregistrement impossible. Réessayez sans fermer cette page.'); }
    ref.current = next; setData(next); setError('');
  };
  useEffect(() => {
    const refresh = (event) => { if (event.key !== ROUTINES_KEY && event.key !== null) return; try { const next = read(); ref.current = next; setData(next); blocked.current = false; setError(''); } catch { blocked.current = true; setError('Une mise à jour des routines ne peut pas être lue.'); } };
    window.addEventListener('storage', refresh); return () => window.removeEventListener('storage', refresh);
  }, []);
  return <RoutinesContext.Provider value={{ data, commit, error }}>{children}</RoutinesContext.Provider>;
}

function RoutineEditor({ child, author, existing, onClose }) {
  const { commit } = useContext(RoutinesContext);
  const [draft, setDraft] = useState(existing ? { ...existing, steps: existing.steps.join('\n') } : { title: '', steps: '', repeat: 'once', date: routineDay(), icon: '⭐' });
  const [message, setMessage] = useState('');
  const change = (key, value) => setDraft((old) => ({ ...old, [key]: value }));
  return <form className="routine-form" onSubmit={(event) => { event.preventDefault(); try { const item = makeRoutine(draft, child.id, author, existing); commit((old) => ({ ...old, routines: existing ? old.routines.map((r) => r.id === existing.id ? item : r) : [...old.routines, item] })); onClose('Routine enregistrée et disponible dans le calendrier de l’enfant.'); } catch (cause) { setMessage(cause.message); } }}>
    <h3>{existing ? 'Modifier la routine' : 'Créer une routine pour ' + child.firstName}</h3>
    {!existing && <label>Partir d’un exemple, facultatif<select defaultValue="" onChange={(e) => { const model = ROUTINE_MODELS[Number(e.target.value)]; if (model) setDraft((old) => ({ ...old, ...model, steps: model.steps.join('\n') })); }}><option value="" disabled>Choisir un exemple à adapter</option>{ROUTINE_MODELS.map((m, i) => <option key={m.title} value={i}>{m.icon} {m.title}</option>)}</select></label>}
    <label>Titre que l’enfant verra<input required maxLength={100} value={draft.title} onChange={(e) => change('title', e.target.value)} placeholder="Par exemple : préparer mon sac" /></label>
    <div className="routine-fields"><label>Repère visuel<select value={draft.icon} onChange={(e) => change('icon', e.target.value)}>{['⭐', '👓', '☀️', '🌙', '🪥', '🎒'].map((icon) => <option key={icon}>{icon}</option>)}</select></label><label>Quand ?<select value={draft.repeat} onChange={(e) => change('repeat', e.target.value)}><option value="once">Un jour précis</option><option value="daily">Chaque jour</option></select></label>{draft.repeat === 'once' && <label>Jour prévu<input type="date" required value={draft.date} onChange={(e) => change('date', e.target.value)} /></label>}</div>
    <label>Étapes : une consigne courte par ligne<textarea required rows={6} value={draft.steps} onChange={(e) => change('steps', e.target.value)} placeholder={'Je prends mon cahier.\nJe mets mon cahier dans mon sac.\nJe ferme mon sac.'} /></label>
    <p>De 1 à 15 étapes. Adaptez les exemples aux habitudes de l’enfant et à l’aide d’un adulte. Modifier une routine remet son suivi à zéro ; les autres routines restent conservées.</p>
    {message && <p role="alert">{message}</p>}<div className="routine-actions"><button type="submit">Enregistrer la routine</button><button type="button" onClick={() => onClose('')}>Annuler</button></div>
  </form>;
}
export function RoutineManager({ child, author }) {
  const { data, commit, error } = useContext(RoutinesContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(routineDay());
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState('');
  const items = routinesOn(data.routines, child.id, date);
  return <details className="routine-manager"><summary>Calendrier du quotidien de {child.firstName}</summary><p>Préparez des petites tâches que l’enfant suivra une étape à la fois : son sac, le coucher ou un rendez-vous. Les routines créées ici sont communes aux espaces Parent et ESMS pour cet enfant, dans ce navigateur.</p>
    {error && <p role="alert">{error}</p>}<div className="routine-actions"><button type="button" onClick={() => { setEditor({}); setMessage(''); }}>+ Créer une routine</button><button type="button" onClick={() => navigate('/enfant/routines')}>Voir le calendrier côté enfant ↗</button></div>
    {editor && <RoutineEditor key={editor.id || 'new'} child={child} author={author} existing={editor.id ? editor : null} onClose={(text) => { setEditor(null); setMessage(text); }} />}
    <p role="status">{message}</p><label>Voir les routines d’un jour<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label>
    {!items.length && <p>Aucune routine prévue pour ce jour. Créez-en une ou choisissez une autre date.</p>}
    <ul className="routine-list">{items.map((item) => <li key={item.id}><h3>{item.icon} {item.title}</h3><p>{item.repeat === 'daily' ? 'Chaque jour' : 'Ce jour uniquement'} · Créée côté {item.author === 'parent' ? 'Parent' : 'ESMS'} · {Math.min(data.progress[routineKey(item, date)] || 0, item.steps.length)}/{item.steps.length} étapes cochées</p><div className="routine-actions"><button type="button" onClick={() => setEditor(item)}>Modifier</button><button type="button" onClick={() => { try { commit((old) => ({ ...old, routines: old.routines.map((r) => r.id === item.id ? { ...r, archived: true } : r) })); setMessage('Routine retirée du calendrier.'); } catch (cause) { setMessage(cause.message); } }}>Retirer du calendrier</button></div></li>)}</ul>
    <p>Les étapes cochées indiquent un suivi de la routine, pas une mesure de l’autonomie. Pour une routine quotidienne, chaque jour a son propre suivi.</p>
  </details>;
}

export function ChildRoutines() {
  const { activeChild } = useBublii();
  const { data, commit, error } = useContext(RoutinesContext);
  const navigate = useNavigate();
  const [date, setDate] = useState(routineDay());
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const heading = useRef(null);
  const items = routinesOn(data.routines, activeChild.id, date);
  const routine = items.find((r) => r.id === selected);
  const count = routine ? Math.min(data.progress[routineKey(routine, date)] || 0, routine.steps.length) : 0;
  useEffect(() => { heading.current?.focus(); }, [selected, count]);
  const record = (next) => { try { commit((old) => recordRoutineStep(old, routine, activeChild.id, date, next)); setMessage(''); } catch (cause) { setMessage(cause.message); } };
  return <main className="child-routines"><button type="button" onClick={() => routine ? setSelected('') : navigate('/enfant')}>{routine ? '← Mon calendrier' : '← Mes jeux'}</button><h1 ref={heading} tabIndex={-1}>{routine ? routine.title : `Le calendrier de ${activeChild.firstName}`}</h1>
    {(error || message) && <p role="alert">{error || message}</p>}
    {!routine ? <><label>Choisir un jour<input type="date" required value={date} onChange={(e) => { setDate(e.target.value); setSelected(''); }} /></label>{!items.length && <p>Rien de prévu ce jour. Un adulte peut ajouter une routine.</p>}<div className="child-routine-cards">{items.map((r) => { const done = Math.min(data.progress[routineKey(r, date)] || 0, r.steps.length); return <button type="button" key={r.id} onClick={() => setSelected(r.id)}><span aria-hidden="true">{r.icon}</span><strong>{r.title}</strong><small>{done === r.steps.length ? '✓ Terminé' : `${done} sur ${r.steps.length} étapes`}</small></button>; })}</div></> : <section className="child-routine-step">
      <span className="routine-big-icon" aria-hidden="true">{routine.icon}</span>
      {count === routine.steps.length ? <><h2>Tu as terminé !</h2><TTSButton text="Tu as terminé !" /><button type="button" onClick={() => setSelected('')}>Retour au calendrier</button><button type="button" onClick={() => record(0)}>Recommencer</button></> : <><p>Étape {count + 1} sur {routine.steps.length}</p><h2>{routine.steps[count]}</h2><TTSButton text={routine.steps[count]} /><p>Tu peux demander de l’aide à un adulte.</p>{date > routineDay() ? <p>Cette routine est prévue pour un autre jour. Tu pourras la cocher ce jour-là.</p> : <button type="button" className="routine-done" onClick={() => record(count + 1)}>✓ C’est fait</button>}{count > 0 && <button type="button" onClick={() => record(count - 1)}>← Étape précédente</button>}</>}
    </section>}
  </main>;
}
