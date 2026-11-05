import React from 'react';
import { useWorkspace } from './WorkspaceContext';
import { labelDate, sharedTimeline, DOMAIN_NAMES } from './model';
import { readObservations } from '../esms/observations';

export function notesFor(childId) {
  try { return { notes: readObservations(localStorage, childId), error: '' }; }
  catch { return { notes: [], error: 'Les observations ne sont pas accessibles. Elles sont exclues de cette vue.' }; }
}
export function PeriodFields({ range, onChange }) {
  return <div className="work-fields"><label>Du<input type="date" required value={range.start} onChange={(event) => onChange({ ...range, start: event.target.value })} /></label><label>Au<input type="date" required min={range.start} value={range.end} onChange={(event) => onChange({ ...range, end: event.target.value })} /></label></div>;
}
export function Evidence({ items }) {
  return <details className="work-evidence"><summary>Pourquoi cette proposition ? ({items.length} élément{items.length > 1 ? 's' : ''})</summary><ul>{items.map((item, index) => <li key={index}>{item.text}<small>Référence : {item.id || item.ref}</small></li>)}</ul>{!items.length && <p>Aucun enregistrement sur cette période. Le compteur est calculé sur l’historique disponible.</p>}</details>;
}
export function Notifications({ child, role }) {
  const { data, commit } = useWorkspace();
  const notes = data.notifications.filter((item) => item.childId === child.id && item.recipient === role);
  const unread = notes.filter((item) => !item.read).length;
  return <details className="work-notifications"><summary>Nouveaux échanges et mises à jour de {child.firstName} {unread > 0 && <span className="esms-badge">{unread} nouvelle(s)</span>}</summary>
    {!notes.length ? <p>Aucune nouvelle actualité.</p> : <><ul>{notes.slice(0, 8).map((item) => <li key={item.id}>{!item.read && <strong>Nouveau · </strong>}{item.title}<small>{labelDate(item.createdAt)}</small></li>)}</ul><button type="button" onClick={() => { try { commit((previous) => ({ ...previous, notifications: previous.notifications.map((item) => item.childId === child.id && item.recipient === role ? { ...item, read: true } : item) })); } catch { /* Workspace error is displayed by the page. */ } }}>Marquer comme lu</button></>}
  </details>;
}
export function Timeline({ child }) {
  const { data } = useWorkspace();
  const events = sharedTimeline(child, [], data);
  return <details className="work-timeline"><summary>Historique des activités et des échanges</summary><p className="work-muted">Événements partagés et parties, dans ce navigateur. Les notes privées de l’équipe ne sont pas partagées automatiquement.</p>
    {!events.length && <p>Le fil se remplira avec les premières activités et les échanges.</p>}
    <ol>{events.slice(0, 30).map((event) => <li key={event.id}><span className="work-tag">{event.type}</span><p>{event.text}</p><small>{labelDate(event.at)}</small></li>)}</ol>
  </details>;
}
export function GoalChoices({ goals, selected, onChange }) {
  return <fieldset className="work-choices"><legend>Objectifs de la séance</legend>{goals.map((goal) => <label key={goal.id}><input type="checkbox" checked={selected.includes(goal.id)} onChange={(event) => onChange(event.target.checked ? [...selected, goal.id] : selected.filter((id) => id !== goal.id))} /><span>{goal.title}<small>{DOMAIN_NAMES[goal.module]}{goal.source === 'demo' ? ' · Objectif de démonstration' : ''}</small></span></label>)}{!goals.length && <p>Ajoutez un objectif dans « Famille & objectifs ».</p>}</fieldset>;
}
