import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import { ACTIVITY_CATALOG } from '../data/progress';
import { summarizeHistory, dayKey } from '../parent/parentMetrics';
import { createObservation, readObservations, saveObservation } from '../esms/observations';
import './SpecialistDashboard.css';

const DOMAINS = [
  { id: 'learn', name: 'Apprendre', detail: 'Mots, nombres et logique', color: '#2458bd', soft: '#e1ebff' },
  { id: 'communicate', name: 'Communiquer', detail: 'Émotions et expression', color: '#b32f50', soft: '#ffe5ec' },
  { id: 'move', name: 'Bouger', detail: 'Gestes et repères corporels', color: '#08735d', soft: '#d8f3e9' },
  { id: 'grow', name: 'Grandir', detail: 'Routines du quotidien', color: '#865600', soft: '#fff0c9' },
];
const SETTINGS = [
  { key: 'answerChoices', label: 'Réponses proposées', help: 'Nombre de choix dans les activités compatibles.', options: [[2, '2 choix'], [3, '3 choix'], [4, '4 choix']] },
  { key: 'audio', label: 'Lecture des consignes', help: 'Aide vocale pendant les activités.', options: [[true, 'Activée'], [false, 'Désactivée']] },
  { key: 'hints', label: 'Indices disponibles', help: 'Maximum d’indices dans les activités compatibles.', options: [[1, '1 indice'], [2, '2 indices'], [3, '3 indices']] },
  { key: 'difficulty', label: 'Difficulté du jeu', help: 'Niveau du jeu, sans correspondance avec un âge de développement.', options: [[3, 'Niveau 3'], [4, 'Niveau 4'], [5, 'Niveau 5']] },
];
const EMPTY_DRAFT = { author: '', objectiveId: '', context: 'Séance éducative', help: 'Non précisée', text: '', nextStep: '' };
const domainName = (id) => DOMAINS.find((domain) => domain.id === id)?.name || 'Autre';
const dateLabel = (date, withTime = true) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', day: 'numeric', month: 'short', year: 'numeric',
  ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
}).format(new Date(date));

function Goals({ child }) {
  return <div className="esms-goals">
    {(child.objectives || []).map((goal, index) => <article key={goal.id}>
      <span className="esms-goal-number" aria-hidden="true">{index + 1}</span>
      <div><p className="esms-eyebrow">{domainName(goal.module)}</p><h3>{goal.title}</h3></div>
    </article>)}
    {!child.objectives?.length && <p className="esms-empty">Aucun objectif renseigné pour cet enfant.</p>}
  </div>;
}

function Overview({ child, metrics, onNotes }) {
  return <>
    <section className="esms-panel" aria-labelledby="esms-path-title">
      <div className="esms-section-heading"><div><p className="esms-eyebrow">LES ACTIVITÉS DÉCOUVERTES</p><h2 id="esms-path-title">Son parcours dans Boblii</h2></div><span className="esms-muted">Depuis le début · jeux rejouables</span></div>
      <div className="esms-domains">{DOMAINS.map((domain) => {
        const progress = child.moduleProgress[domain.id];
        return <article key={domain.id} style={{ '--domain-color': domain.color, background: domain.soft }}>
          <h3>{domain.name}</h3><p>{domain.detail}</p>
          <strong>{progress.completedCount}<span> / {progress.totalActivities}</span></strong>
          <div className="esms-progress" role="progressbar" aria-label={`${domain.name} : activités terminées`} aria-valuemin={0} aria-valuemax={progress.totalActivities} aria-valuenow={progress.completedCount}><span style={{ width: `${progress.completedCount / progress.totalActivities * 100}%` }} /></div>
          <p>{progress.completedCount === progress.totalActivities ? 'Tous les jeux découverts' : 'Activités différentes terminées'}</p>
        </article>;
      })}</div>
    </section>

    <div className="esms-overview-columns">
      <section className="esms-panel" aria-labelledby="esms-support-title">
        <h2 id="esms-support-title">Repères pour l’accompagner</h2>
        <div className="esms-support"><h3>Points d’appui</h3><div className="esms-tags">{child.strengths.map((item) => <span key={item}>{item}</span>)}</div></div>
        <div className="esms-support"><h3>Besoins d’accompagnement</h3><ul>{child.supportNeeds.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <p className="esms-muted">Repères du profil de démonstration.</p>
      </section>
      <section className="esms-panel" aria-labelledby="esms-goals-overview">
        <div className="esms-section-heading"><h2 id="esms-goals-overview">Ses objectifs d’accompagnement</h2><span className="esms-badge">Exemples</span></div>
        <Goals child={child} />
        <button type="button" className="esms-button esms-button-secondary" onClick={onNotes}>Noter une observation →</button>
      </section>
    </div>
    <section className="esms-panel" aria-labelledby="esms-last-title">
      <div className="esms-section-heading"><h2 id="esms-last-title">Dernières activités</h2><span className="esms-muted">Les 3 dernières parties</span></div>
      <History entries={metrics.entries.slice(0, 3)} />
    </section>
  </>;
}

function History({ entries }) {
  if (!entries.length) return <p className="esms-empty">Aucune partie pour cette sélection.</p>;
  return <ul className="esms-history">{entries.map((entry) => <li key={entry.id}>
    <div><h3>{entry.label || 'Activité terminée'}</h3><p>{domainName(entry.module)} · <time dateTime={entry.completedAt.toISOString()}>{dateLabel(entry.completedAt)}</time></p></div>
    <span className={`esms-badge ${entry.source === 'demo' ? '' : 'esms-badge-recorded'}`}>{entry.source === 'demo' ? 'Exemple' : 'Partie enregistrée'}</span>
  </li>)}</ul>;
}

function Activities({ child }) {
  const [period, setPeriod] = useState('all');
  const [domain, setDomain] = useState('all');
  const [origin, setOrigin] = useState('all');
  const [limit, setLimit] = useState(10);
  const sourceHistory = child.history.filter((entry) => origin === 'all' || entry.source === origin);
  const metrics = summarizeHistory(sourceHistory, period);
  const entries = metrics.entries.filter((entry) => domain === 'all' || entry.module === domain);
  const days = metrics.days.map((day) => ({ ...day, count: entries.filter((entry) =>
    dayKey(entry.completedAt) === day.key
  ).length }));
  const max = Math.max(1, ...days.map((day) => day.count));
  return <>
    <section className="esms-panel" aria-labelledby="esms-activity-title">
      <div className="esms-section-heading"><div><h2 id="esms-activity-title">Activités réalisées</h2><p className="esms-description">Retrouver une partie par période, domaine ou origine.</p></div><strong className="esms-badge">{entries.length} partie{entries.length > 1 ? 's' : ''}</strong></div>
      <div className="esms-filters">
        <label>Période<select value={period} onChange={(event) => { setPeriod(event.target.value); setLimit(10); }}><option value="all">Depuis le début</option><option value="week">Les 7 derniers jours</option></select></label>
        <label>Domaine<select value={domain} onChange={(event) => { setDomain(event.target.value); setLimit(10); }}><option value="all">Tous les domaines</option>{DOMAINS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Origine<select value={origin} onChange={(event) => { setOrigin(event.target.value); setLimit(10); }}><option value="all">Toutes les parties</option><option value="recorded">Parties enregistrées</option><option value="demo">Exemples de démonstration</option></select></label>
      </div>
      <History entries={entries.slice(0, limit)} />
      {entries.length > limit && <button type="button" className="esms-button esms-button-secondary" onClick={() => setLimit(limit + 10)}>Afficher les parties suivantes</button>}
    </section>
    <section className="esms-panel" aria-labelledby="esms-week-title">
      <h2 id="esms-week-title">La pratique sur 7 jours</h2><p className="esms-description">Nombre de parties terminées selon les filtres choisis.</p>
      {days.some((day) => day.count) ? <>
        <div className="esms-chart" aria-hidden="true">{days.map((day) => <div key={day.key}><strong>{day.count}</strong><div className="esms-chart-track"><span style={{ height: `${day.count / max * 100}%` }} /></div><span>{new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', day: 'numeric' }).format(day.date)}</span></div>)}</div>
        <table className="esms-sr-only"><caption>Parties par jour</caption><thead><tr><th scope="col">Date</th><th scope="col">Parties</th></tr></thead><tbody>{days.map((day) => <tr key={day.key}><th scope="row">{dateLabel(day.date, false)}</th><td>{day.count}</td></tr>)}</tbody></table>
      </> : <p className="esms-empty">Aucune partie ces 7 derniers jours pour cette sélection.</p>}
    </section>
  </>;
}

function Observations({ child, draft, onDraft }) {
  const [initial] = useState(() => {
    try { return { notes: readObservations(localStorage, child.id), error: '' }; }
    catch { return { notes: [], error: 'Les observations conservées ne sont pas accessibles dans ce navigateur.' }; }
  });
  const [notes, setNotes] = useState(initial.notes);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(initial.error);
  const field = (name) => ({ value: draft[name], onChange: (event) => onDraft({ ...draft, [name]: event.target.value }) });
  const submit = (event) => {
    event.preventDefault();
    if (initial.error) return;
    let note;
    try { note = createObservation(child.id, draft); }
    catch (cause) { setError(cause.message); return; }
    try {
      setNotes(saveObservation(localStorage, child.id, notes, note));
      onDraft({ ...EMPTY_DRAFT, author: draft.author });
      setError(''); setMessage(`Observation enregistrée pour ${child.firstName}.`);
    } catch { setError('Enregistrement impossible. Votre texte est conservé dans le formulaire ; copiez-le avant de quitter la page.'); }
  };
  return <>
    <section className="esms-panel" aria-labelledby="esms-objectives-title"><div className="esms-section-heading"><div><h2 id="esms-objectives-title">Objectifs d’accompagnement</h2><p className="esms-description">Des repères pour préparer la prochaine séance avec {child.firstName}.</p></div><span className="esms-badge">Exemples du profil</span></div><Goals child={child} /></section>
    <div className="esms-notes-columns">
      <section className="esms-panel" aria-labelledby="esms-new-note">
        <h2 id="esms-new-note">Nouvelle observation</h2><p className="esms-description">Décrire une situation observée, l’aide apportée et la suite envisagée.</p>
        <form className="esms-note-form" onSubmit={submit}>
          <label>Rédigé par <span aria-hidden="true">*</span><input required maxLength={80} autoComplete="name" {...field('author')} placeholder="Nom du professionnel" /></label>
          <label>Objectif concerné<select {...field('objectiveId')}><option value="">Observation générale</option>{child.objectives.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}</select></label>
          <div className="esms-form-pair"><label>Contexte<select {...field('context')}>{['Séance éducative', 'Activité en classe', 'Vie quotidienne', 'Échange avec la famille'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Aide apportée<select {...field('help')}>{['Non précisée', 'Sans aide', 'Indice visuel', 'Rappel oral', 'Accompagnement d’un adulte', 'Plusieurs aides'].map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <label>Ce qui a été observé <span aria-hidden="true">*</span><textarea required maxLength={1200} rows={4} {...field('text')} placeholder="Décrire les faits et les conditions de l’activité…" /></label>
          <label>Prochaine étape <span className="esms-optional">facultatif</span><textarea maxLength={400} rows={2} {...field('nextStep')} placeholder="Ce que l’équipe souhaite proposer ensuite…" /></label>
          {error && <p className="esms-error" role="alert">{error}</p>}
          <p className="esms-save-status" role="status">{message}</p>
          <button type="submit" className="esms-button esms-button-primary" disabled={Boolean(initial.error)}>Enregistrer l’observation</button>
        </form>
      </section>
      <section className="esms-panel" aria-labelledby="esms-notes-title">
        <div className="esms-section-heading"><h2 id="esms-notes-title">Journal d’observations</h2><span className="esms-badge">{notes.length}</span></div>
        {!notes.length && <p className="esms-empty">Aucune observation ajoutée pour {child.firstName}. Le journal se remplit avec les notes de l’équipe.</p>}
        <ol className="esms-observations">{notes.map((note) => <li key={note.id}>
          <div className="esms-section-heading"><strong>{note.author}</strong><time dateTime={note.createdAt}>{dateLabel(note.createdAt)}</time></div>
          <p className="esms-note-context">{note.context} · Aide : {note.help}</p>
          {note.objectiveId && <p className="esms-linked-goal">Objectif : {child.objectives.find((goal) => goal.id === note.objectiveId)?.title || 'Objectif du dossier'}</p>}
          <p className="esms-note-text">{note.text}</p>
          {note.nextStep && <div className="esms-next-step"><h3>Prochaine étape</h3><p>{note.nextStep}</p></div>}
        </li>)}</ol>
      </section>
    </div>
  </>;
}

function Settings({ child, updateSettings }) {
  const [status, setStatus] = useState('');
  return <section className="esms-panel" aria-labelledby="esms-settings-title"><h2 id="esms-settings-title">Adapter les activités de {child.firstName}</h2>
    <p className="esms-description">Ces réglages sont communs avec l’espace Parent et s’appliquent dans les jeux compatibles.</p>
    <div className="esms-settings-grid">{SETTINGS.map((setting) => <div key={setting.key}>
      <label htmlFor={`esms-${setting.key}`}>{setting.label}</label>
      <select id={`esms-${setting.key}`} value={String(child.settings[setting.key])} aria-describedby={`esms-${setting.key}-help`} onChange={(event) => {
        const [value, label] = setting.options.find(([option]) => String(option) === event.target.value);
        updateSettings(child.id, { [setting.key]: value }); setStatus(`${setting.label} : ${label}, pour ${child.firstName}.`);
      }}>{setting.options.map(([value, label]) => <option key={String(value)} value={String(value)}>{label}</option>)}</select>
      <p id={`esms-${setting.key}-help`}>{setting.help}</p>
    </div>)}</div><p className="esms-save-status" role="status">{status}</p>
  </section>;
}

export default function SpecialistDashboard() {
  const navigate = useNavigate();
  const { profiles, activeChild, switchChild, updateSettings, setCurrentRole } = useBublii();
  const [view, setView] = useState('overview');
  const [drafts, setDrafts] = useState({});
  const metrics = summarizeHistory(activeChild.history);
  const weekly = summarizeHistory(activeChild.history, 'week');
  const discovered = Object.values(activeChild.moduleProgress).reduce((sum, item) => sum + item.completedCount, 0);
  const total = Object.values(ACTIVITY_CATALOG).reduce((sum, items) => sum + items.length, 0);
  const exit = () => { setCurrentRole(null); navigate('/'); };

  return <div className="esms-dashboard">
    <a className="esms-skip" href="#esms-main">Aller au dossier</a>
    <header className="esms-header"><div className="esms-header-inner">
      <button type="button" className="esms-brand" onClick={exit} aria-label="Boblii, choisir un espace"><span className="esms-brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>Boblii <span>Établissement</span></button>
      <button type="button" className="esms-button esms-button-quiet" onClick={exit}>← Changer d’espace</button>
    </div></header>
    <main id="esms-main" className="esms-main">
      <div className="esms-welcome"><div><p className="esms-eyebrow">ÉQUIPE ÉDUCATIVE</p><h1>Accompagner chaque parcours</h1><p>Les activités, les objectifs et les observations, réunis par enfant.</p></div><span className="esms-badge">Démonstration</span></div>

      <section className="esms-selector esms-panel" aria-labelledby="esms-children-title">
        <div><h2 id="esms-children-title">Enfants accompagnés <span>({profiles.length})</span></h2><p>Ouvrir un dossier individuel.</p></div>
        <label htmlFor="esms-child-select">Choisir l’enfant<select id="esms-child-select" value={activeChild.id} onChange={(event) => switchChild(event.target.value)}>{profiles.map((child) => <option key={child.id} value={child.id}>{child.firstName} · {child.age} ans</option>)}</select></label>
      </section>

      <section className="esms-dossier" aria-labelledby="esms-dossier-title">
        <div className="esms-identity"><span className="esms-avatar" style={{ background: activeChild.avatar.bg, color: activeChild.avatar.color }} aria-hidden="true">{activeChild.avatar.initial}</span><div><h2 id="esms-dossier-title">Dossier de {activeChild.firstName}</h2><p>{activeChild.age} ans · {activeChild.tagline}</p></div></div>
        <button type="button" className="esms-button esms-button-secondary" onClick={() => { setCurrentRole('enfant'); navigate('/enfant'); }}>Ouvrir ses activités ↗</button>
      </section>

      <div className="esms-stats">
        <div><h3>Activités découvertes</h3><strong>{discovered}<span> / {total}</span></strong><p>Des jeux à faire et à refaire.</p></div>
        <div><h3>Parties cette semaine</h3><strong>{weekly.total}</strong><p>Sur les 7 derniers jours.</p></div>
        <div><h3>Dernière partie</h3><strong className="esms-stat-date">{metrics.entries.length ? dateLabel(metrics.entries[0].completedAt, false) : 'À découvrir'}</strong><p>{metrics.entries[0]?.label || 'Aucune partie enregistrée.'}</p></div>
      </div>

      <nav className="esms-navigation" aria-label="Rubriques du dossier">{[
        ['overview', 'Vue d’ensemble'], ['observations', 'Objectifs & observations'], ['activities', 'Activités'], ['settings', 'Réglages'],
      ].map(([id, label]) => <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</nav>

      <div className="esms-view" key={`${activeChild.id}-${view}`}>
        {view === 'overview' && <Overview child={activeChild} metrics={metrics} onNotes={() => setView('observations')} />}
        {view === 'observations' && <Observations child={activeChild} draft={drafts[activeChild.id] || EMPTY_DRAFT} onDraft={(draft) => setDrafts((previous) => ({ ...previous, [activeChild.id]: draft }))} />}
        {view === 'activities' && <Activities child={activeChild} />}
        {view === 'settings' && <Settings child={activeChild} updateSettings={updateSettings} />}
      </div>

      <details className="esms-method"><summary>À propos de ce suivi</summary>
        <p>Les profils et objectifs sont des exemples de démonstration. Les parties fictives sont marquées « Exemple » ; les nouvelles parties s’y ajoutent. Les activités terminées ne constituent pas une évaluation des compétences ou du développement.</p>
        <p>Les observations sont saisies par l’équipe et conservées uniquement dans ce navigateur, séparément des résultats des jeux. Il n’y a pas encore de partage entre professionnels ou appareils. Les brouillons restent disponibles en changeant de rubrique ou d’enfant, jusqu’à l’actualisation de la page.</p>
        <p>La présentation s’appuie sur les principes d’accompagnement individuel et de coopération avec les familles : <a href="https://www.has-sante.fr/jcms/p_3287349/" target="_blank" rel="noreferrer">HAS — Accompagner la scolarité</a> et <a href="https://ds-int.org/recommendations-for-the-education-of-learners-with-down-syndrome/" target="_blank" rel="noreferrer">Down Syndrome International — recommandations pour l’éducation</a>.</p>
      </details>
      <footer className="esms-footer">Boblii · Observer, adapter, accompagner.</footer>
    </main>
  </div>;
}
