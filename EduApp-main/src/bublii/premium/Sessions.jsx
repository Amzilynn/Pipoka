import React, { useState } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { closeSession, todayKey, uid } from './model';

const dayAdd = (day, amount) => { const date = new Date(`${day}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0, 10); };

export function WeeklyCalendar({ sessions, profiles, onEdit }) {
  const [day, setDay] = useState(todayKey());
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  const start = dayAdd(day, -(weekday === 0 ? 6 : weekday - 1));
  return <section className="esms-panel"><div className="esms-section-heading"><div><h2>Calendrier de la semaine</h2><p className="work-muted">Horaires de Paris · Cliquer sur une séance pour la consulter ou l’éditer.</p></div><div className="work-actions"><button type="button" onClick={() => setDay(dayAdd(day, -7))}>← Semaine</button><label>Semaine du<input type="date" value={day} onChange={(event) => event.target.value && setDay(event.target.value)} /></label><button type="button" onClick={() => setDay(dayAdd(day, 7))}>Semaine →</button></div></div>
    <div className="work-week">{Array.from({ length: 7 }, (_, index) => dayAdd(start, index)).map((date) => <div key={date}><h3>{new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00Z`))}</h3>{sessions.filter((session) => session.start.startsWith(date)).sort((a, b) => a.start.localeCompare(b.start)).map((session) => <button key={session.id} type="button" onClick={() => onEdit(session)}><strong>{session.start.slice(11)} · {session.title}</strong><span>{profiles.find((profile) => profile.id === session.childId)?.firstName}</span><small>{session.status === 'completed' ? 'Bilan enregistré' : 'Prévue'} · {session.activities.reduce((sum, item) => sum + Number(item.minutes), 0)} min prévues</small></button>)}{!sessions.some((session) => session.start.startsWith(date)) && <p className="work-muted">Aucune séance</p>}</div>)}</div>
  </section>;
}

export function SessionOutcome({ session, onClose }) {
  const { commit } = useWorkspace();
  const [outcomes, setOutcomes] = useState({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const change = (activity, key, value) => setOutcomes((previous) => ({ ...previous, [activity.id]: { ...previous[activity.id], [key]: value } }));
  const finish = (event) => {
    event.preventDefault();
    try {
      const completed = closeSession(session, outcomes);
      commit((previous) => ({ ...previous, sessions: previous.sessions.map((item) => item.id === session.id ? completed : item), events: [{ id: uid(), childId: session.childId, createdAt: completed.completedAt, type: 'Bilan de séance', text: `Séance « ${session.title} » clôturée par le professionnel.`, sessionId: session.id }, ...previous.events] }));
      setSaved(true); setError('');
    } catch (cause) { setError(cause.message); }
  };
  const completed = session.status === 'completed' || saved;
  return <section className="esms-panel work-session-outcome"><div className="esms-section-heading"><div><h2>{completed ? 'Prévu et réalisé' : 'Bilan de séance'} · {session.title}</h2><p className="work-muted">Les résultats sont saisis par le professionnel. Ils n’ajoutent pas de parties fictives aux mini-jeux.</p></div><button type="button" onClick={onClose}>Fermer le bilan</button></div>
    {saved && <p role="status">Bilan enregistré. Rouvrez la séance pour consulter la comparaison.</p>}
    <form onSubmit={finish}>{session.activities.map((activity) => <article className="work-card" key={activity.id}><h3>{activity.title}</h3><p>Prévu : {activity.minutes} min · Aide : {activity.support || 'Non précisée'}</p>
      {session.status === 'completed' ? <><p>Réalisé : {{ done: 'activité réalisée', adapted: 'activité adaptée', 'not-done': 'activité non réalisée' }[activity.actualStatus]} · {activity.actualMinutes !== '' && activity.actualMinutes !== undefined ? `${activity.actualMinutes} min` : 'durée non renseignée'}</p><p>Aide réellement apportée : {activity.actualSupport || 'non renseignée'}.</p><p>Participation observée : {{ positive: 'positive', mixed: 'variable', difficult: 'difficile', 'not-recorded': 'non renseignée' }[activity.participation || 'not-recorded']}</p><p>{activity.outcome || 'Aucune note de bilan.'}</p></> : !saved && <>
        <label>Ce qui s’est passé<select required value={outcomes[activity.id]?.actualStatus || ''} onChange={(event) => change(activity, 'actualStatus', event.target.value)}><option value="">À renseigner</option><option value="done">Réalisée</option><option value="adapted">Adaptée</option><option value="not-done">Non réalisée</option></select></label>
        <details className="work-disclosure"><summary>Ajouter des précisions, facultatif</summary><div className="work-fields"><label>Durée réelle (minutes)<input type="number" min={0} max={300} value={outcomes[activity.id]?.actualMinutes ?? ''} onChange={(event) => change(activity, 'actualMinutes', event.target.value)} /></label><label>Participation observée<select value={outcomes[activity.id]?.participation || 'not-recorded'} onChange={(event) => change(activity, 'participation', event.target.value)}><option value="not-recorded">Non renseignée</option><option value="positive">Positive</option><option value="mixed">Variable</option><option value="difficult">Difficile</option></select></label>
        <label>Aide réellement apportée<input maxLength={200} value={outcomes[activity.id]?.actualSupport || ''} onChange={(event) => change(activity, 'actualSupport', event.target.value)} placeholder="Laisser vide si non renseignée" /></label>
        <label>Faits observés / adaptations<textarea maxLength={1200} rows={2} value={outcomes[activity.id]?.outcome || ''} onChange={(event) => change(activity, 'outcome', event.target.value)} /></label>
</div></details>
      </>}
    </article>)}{error && <p role="alert">{error}</p>}{!completed && <button type="submit">Clôturer la séance</button>}</form>
  </section>;
}
