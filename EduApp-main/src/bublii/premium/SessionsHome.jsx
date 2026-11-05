import React, { useState } from 'react';
import { RoutineManager } from './Routines.jsx';
import { useWorkspace } from './WorkspaceContext';
import { applyTemplate, CATALOG, goalsFor, makeSession, makeTemplate, recommendActivities, todayKey, uid } from './model';
import { GoalChoices } from './SharedUI';
import { WeeklyCalendar, SessionOutcome } from './Sessions';

const blank = () => ({ title: '', start: `${todayKey()}T09:00`, objectiveIds: [], activities: [], notes: '' });

function SessionComposer({ child, initial, onClose }) {
  const { data, commit } = useWorkspace();
  const goals = goalsFor(child, data);
  const [draft, setDraft] = useState(initial || blank);
  const [step, setStep] = useState(1);
  const [templateName, setTemplateName] = useState('');
  const [message, setMessage] = useState('');
  const update = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));
  const suggestions = recommendActivities(child, [], data).filter((activity) => activity.goals.some((goal) => draft.objectiveIds.includes(goal.id)) && activity.decision?.status !== 'dismissed').slice(0, 3);
  const add = (activity) => update('activities', [...draft.activities, { id: uid(), activityId: activity.id, title: activity.title, module: activity.module, minutes: 5, support: '', objectiveIds: [], actualStatus: '', actualMinutes: '', participation: 'not-recorded', outcome: '' }]);
  const edit = (id, key, value) => update('activities', draft.activities.map((activity) => activity.id === id ? { ...activity, [key]: value } : activity));
  const reorder = (index, direction) => { const activities = [...draft.activities]; [activities[index], activities[index + direction]] = [activities[index + direction], activities[index]]; update('activities', activities); };
  const next = () => {
    if (step === 1 && (!draft.title.trim() || !draft.start || !draft.objectiveIds.length)) { setMessage('Indiquez un titre, une date et au moins un objectif.'); return; }
    if (step === 2) { try { makeSession(draft, child); } catch (error) { setMessage(error.message); return; } }
    setMessage(''); setStep(step + 1);
  };
  const save = (event) => {
    event.preventDefault();
    if (step < 3) { next(); return; }
    try {
      const session = makeSession({ ...draft, activities: draft.activities.map((activity) => ({ ...activity, objectiveIds: goals.filter((goal) => draft.objectiveIds.includes(goal.id) && goal.module === activity.module).map((goal) => goal.id) })) }, child);
      commit((previous) => ({ ...previous, sessions: [session, ...previous.sessions.filter((item) => item.id !== session.id)] }));
      onClose('Séance enregistrée.');
    } catch (error) { setMessage(error.message); }
  };
  return <section className="esms-panel work-composer" aria-labelledby="session-composer-title">
    <div className="esms-section-heading"><div><p className="esms-eyebrow">PRÉPARATION POUR {child.firstName}</p><h2 id="session-composer-title">{draft.id ? 'Modifier la séance' : 'Préparer une séance'}</h2></div><button type="button" onClick={() => onClose('Préparation fermée sans enregistrement.')}>Fermer</button></div>
    <ol className="work-steps" aria-label="Étapes de préparation">{['Objectifs', 'Activités', 'Vérification'].map((label, index) => <li key={label} aria-current={step === index + 1 ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
    <form className="work-form" onSubmit={save}>
      {step === 1 && <>
        {data.templates.length > 0 && <details className="work-disclosure"><summary>Utiliser une préparation déjà enregistrée</summary><label>Modèle de séance<select value="" onChange={(event) => { const template = data.templates.find((item) => item.id === event.target.value); if (template) { setDraft({ ...applyTemplate(template, goals), start: `${todayKey()}T09:00` }); setMessage('Modèle chargé. Vérifiez les objectifs et la date.'); } }}><option value="">Choisir un modèle…</option>{data.templates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}</select></label></details>}
        <h3 className="work-section-title">Quand et pour quoi ?</h3>
        <div className="work-fields"><label>Titre de la séance<input required maxLength={100} value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="Ex. Découvrir les émotions" /></label><label>Date et heure (Paris)<input required type="datetime-local" value={draft.start} onChange={(event) => update('start', event.target.value)} /></label></div>
        <GoalChoices goals={goals} selected={draft.objectiveIds} onChange={(ids) => update('objectiveIds', ids)} />
      </>}
      {step === 2 && <>
        <h3 className="work-section-title">Choisir et organiser les activités</h3>
        <div className="work-suggestions">{suggestions.map((activity) => <button type="button" key={activity.id} onClick={() => add(activity)}>+ {activity.title}</button>)}</div>
        <p className="work-muted">Ces idées correspondent aux objectifs choisis. Vous pouvez aussi choisir librement un jeu.</p>
        <label>Ajouter un jeu<select value="" onChange={(event) => { const activity = CATALOG.find((item) => item.id === event.target.value); if (activity) add(activity); }}><option value="">Choisir une activité…</option>{CATALOG.map((activity) => <option key={activity.id} value={activity.id}>{activity.title}</option>)}</select></label>
        {!draft.activities.length && <p className="work-empty-inline">Ajoutez une première activité pour préparer la séance.</p>}
        <ol className="work-session-steps">{draft.activities.map((activity, index) => <li key={activity.id}><div className="esms-section-heading"><h3>{index + 1}. {activity.title}</h3><div className="work-actions"><button type="button" disabled={index === 0} aria-label={`Monter ${activity.title}`} onClick={() => reorder(index, -1)}>↑</button><button type="button" disabled={index === draft.activities.length - 1} aria-label={`Descendre ${activity.title}`} onClick={() => reorder(index, 1)}>↓</button><button type="button" onClick={() => update('activities', draft.activities.filter((item) => item.id !== activity.id))}>Retirer</button></div></div><label className="work-duration">Durée prévue (minutes)<input required type="number" min={1} max={180} value={activity.minutes} onChange={(event) => edit(activity.id, 'minutes', event.target.value)} /></label><details><summary>Préciser le matériel ou les aides</summary><label>Aides à préparer<input maxLength={200} value={activity.support} onChange={(event) => edit(activity.id, 'support', event.target.value)} placeholder="Images, matériel, consignes…" /></label></details></li>)}</ol>
      </>}
      {step === 3 && <>
        <h3 className="work-section-title">La séance en un regard</h3>
        <div className="work-session-review"><h3>{draft.title}</h3><p>{draft.start.replace('T', ' à ')} · {draft.activities.reduce((sum, activity) => sum + Number(activity.minutes), 0)} minutes</p><ol>{draft.activities.map((activity) => <li key={activity.id}>{activity.title} <span>{activity.minutes} min</span>{activity.support && <small>Aide prévue : {activity.support}</small>}</li>)}</ol></div>
        <details className="work-disclosure"><summary>Ajouter une note de préparation, facultatif</summary><label>Notes de préparation<textarea rows={3} maxLength={1200} value={draft.notes} onChange={(event) => update('notes', event.target.value)} /></label></details>
        <details className="work-disclosure"><summary>Garder cette préparation comme modèle</summary><label>Nom du modèle<input maxLength={100} value={templateName} onChange={(event) => setTemplateName(event.target.value)} /></label><button type="button" onClick={() => { try { const template = makeTemplate(draft, templateName); commit((previous) => ({ ...previous, templates: [...previous.templates, template] })); setTemplateName(''); setMessage('Modèle enregistré.'); } catch (error) { setMessage(error.message); } }}>Enregistrer le modèle</button></details>
      </>}
      <p role="status">{message}</p><div className="work-form-footer">{step > 1 && <button type="button" onClick={() => { setStep(step - 1); setMessage(''); }}>← Précédent</button>}<button className="work-button-primary" type="submit">{step < 3 ? 'Continuer →' : 'Enregistrer la séance'}</button></div>
    </form>
  </section>;
}

export default function SessionsHome({ child, profiles }) {
  const { data } = useWorkspace();
  const [editor, setEditor] = useState(null);
  const [outcomeId, setOutcomeId] = useState('');
  const [message, setMessage] = useState('');
  const sessions = data.sessions.filter((session) => session.childId === child.id).sort((a, b) => b.start.localeCompare(a.start));
  const selected = data.sessions.find((session) => session.id === outcomeId);
  const edit = (session) => { if (session.status === 'completed') { setOutcomeId(session.id); setEditor(null); } else { setEditor(structuredClone(session)); setOutcomeId(''); } };
  return <div className="work-area">
    <RoutineManager key={child.id} child={child} author="esms" />
    {!editor && !selected && <section className="esms-panel"><div className="esms-section-heading"><div><h2>Les séances de {child.firstName}</h2><p className="esms-description">Préparer une séance, puis noter comment elle s’est passée.</p></div><button type="button" className="work-button-primary" onClick={() => { setEditor(blank()); setMessage(''); }}>+ Préparer une séance</button></div><p role="status">{message}</p>
      {!sessions.length && <p className="esms-empty">Aucune séance prévue. Commencez par une préparation simple.</p>}{sessions.map((session) => <article className="work-card" key={session.id}><div className="esms-section-heading"><div><h3>{session.title}</h3><p>{session.start.replace('T', ' à ')} · {session.activities.length} activités</p></div><div className="work-actions">{session.status !== 'completed' && <button type="button" onClick={() => edit(session)}>Modifier</button>}<button type="button" onClick={() => { setOutcomeId(session.id); setEditor(null); }}>{session.status === 'completed' ? 'Voir le bilan' : 'Noter le bilan'}</button></div></div></article>)}
      <details className="work-disclosure"><summary>Voir le calendrier de la semaine</summary><WeeklyCalendar sessions={sessions} profiles={profiles} onEdit={edit} /></details>
    </section>}
    {editor && <SessionComposer key={editor.id || 'new'} child={child} initial={editor} onClose={(status) => { setEditor(null); setMessage(status); }} />}
    {selected && <SessionOutcome key={selected.id} session={selected} onClose={() => setOutcomeId('')} />}
  </div>;
}
