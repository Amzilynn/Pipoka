import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import { useWorkspace } from './WorkspaceContext';
import { DOMAIN_NAMES, goalsFor, inRange, labelDate, periodSummary, previousRange, rangeFor } from './model';
import { notesFor, PeriodFields } from './SharedUI';

function ReportDocument({ child, data, notes, range, family, includeDemo, sections }) {
  const current = periodSummary(child, notes, data, range, includeDemo);
  const previous = periodSummary(child, notes, data, previousRange(range), includeDemo);
  const comparable = current.entries.length > 0 && previous.entries.length > 0;
  const goals = goalsFor(child, data);
  const objectiveHistory = data.events.filter((event) => event.childId === child.id && event.objectiveId && inRange(event.createdAt, range));
  return <article className="work-report-document">
    <header><div className="work-report-brand">Boblii <span>Suivi éducatif</span></div><p>{family ? 'Les repères pour la famille' : 'Rapport de suivi des activités'}</p><h1>{child.firstName}</h1><p>Du {labelDate(`${range.start}T12:00:00Z`)} au {labelDate(`${range.end}T12:00:00Z`)}</p><small>Généré le {labelDate(new Date())} · {includeDemo ? 'Données de démonstration incluses' : 'Parties enregistrées uniquement'}</small></header>
    <p className="work-report-notice">Ce document décrit des activités et des observations éducatives. Il ne constitue pas une évaluation du développement. Les éléments d’exemple sont identifiés. Version locale à relire avant tout partage.</p>
    <section><h2>{family ? 'Ce qui a été fait' : 'Synthèse factuelle de la période'}</h2><div className="work-report-stats"><div><strong>{current.entries.length}</strong><span>parties terminées</span></div><div><strong>{current.unique}</strong><span>activités différentes</span></div><div><strong>{current.observations.length}</strong><span>observations saisies</span></div><div><strong>{current.sessions.length}</strong><span>séances clôturées</span></div></div><p>Les résultats des mini-jeux ne sont pas convertis en score global de réussite.</p></section>
    {sections.objectives && <section><h2>{family ? 'Les objectifs accompagnés' : 'Objectifs et historique documenté'}</h2>{!goals.length && <p>Aucun objectif renseigné.</p>}{goals.map((goal) => {
      const goalNotes = current.observations.filter((note) => note.objectiveId === goal.id);
      const events = objectiveHistory.filter((event) => event.objectiveId === goal.id);
      const sessions = current.sessions.filter((session) => session.activities.some((activity) => activity.objectiveIds?.includes(goal.id) && ['done', 'adapted'].includes(activity.actualStatus)));
      return <div className="work-report-goal" key={goal.id}><h3>{goal.title}</h3><p>{DOMAIN_NAMES[goal.module]}{goal.source === 'demo' ? ' · Objectif d’exemple' : ' · Objectif saisi'}</p><p>{goalNotes.length} observation(s) liée(s), {sessions.length} séance(s) explicitement liée(s) sur la période.</p>{!events.length && <p>Aucun changement d’état documenté sur cette période.</p>}<ul>{events.map((event) => <li key={event.id}>{labelDate(event.createdAt)} · {event.field === 'status' ? `État renseigné : ${event.value}` : `Révision prévue : ${event.value || 'non précisée'}`}</li>)}</ul>{!family && goalNotes.map((note) => <p key={note.id}>{labelDate(note.createdAt)} · {note.author} : {note.text}</p>)}</div>;
    })}</section>}
    {sections.activities && <section><h2>{family ? 'Les jeux explorés' : 'Répartition des parties par domaine'}</h2>{current.domains.map((domain) => <div className="work-report-domain" key={domain.module}><span>{DOMAIN_NAMES[domain.module]}</span><div aria-hidden="true"><span style={{ width: `${current.entries.length ? domain.count / current.entries.length * 100 : 0}%` }} /></div><strong>{domain.count}</strong></div>)}
      <table><caption>Parties de la période</caption><thead><tr><th>Activité</th><th>Date</th><th>Origine</th></tr></thead><tbody>{current.entries.map((entry) => <tr key={entry.id}><td>{entry.label}</td><td>{labelDate(entry.completedAt || Number(/^h-(\d+)/.exec(entry.id)?.[1]))}</td><td>{entry.source === 'demo' ? 'Exemple' : 'Partie enregistrée'}</td></tr>)}</tbody></table>{!current.entries.length && <p>Aucune partie dans la sélection.</p>}
    </section>}
    {sections.observations && <section><h2>{family ? 'Les observations et retours' : 'Observations éducatives consignées'}</h2>{!current.observations.length && <p>Aucune observation professionnelle sur la période.</p>}{current.observations.map((note) => <div className="work-report-note" key={note.id}><h3>{note.author} · {labelDate(note.createdAt)}</h3><p>{note.context} · Aide : {note.help}</p><p>{note.text}</p>{note.nextStep && <p><strong>Prochaine étape :</strong> {note.nextStep}</p>}</div>)}{current.feedback.map((feedback) => <div className="work-report-note" key={feedback.id}><h3>Retour de la famille · {labelDate(feedback.createdAt)}</h3><p>{feedback.text}</p></div>)}</section>}
    <section><h2>{family ? 'D’une période à l’autre' : 'Comparaison descriptive des périodes'}</h2>{comparable ? <><p>Période précédente : du {labelDate(`${previousRange(range).start}T12:00:00Z`)} au {labelDate(`${previousRange(range).end}T12:00:00Z`)}.</p><table><thead><tr><th>Repère</th><th>Précédente</th><th>Sélectionnée</th></tr></thead><tbody><tr><td>Parties</td><td>{previous.entries.length}</td><td>{current.entries.length}</td></tr><tr><td>Activités différentes</td><td>{previous.unique}</td><td>{current.unique}</td></tr><tr><td>Observations</td><td>{previous.observations.length}</td><td>{current.observations.length}</td></tr></tbody></table><p>Il s’agit d’une comparaison de pratique disponible, pas d’une mesure des progrès de l’enfant.</p></> : <p>Pas assez de parties dans les deux périodes pour proposer une comparaison. Aucun progrès n’est déduit des données manquantes.</p>}</section>
    {!family && <section><h2>Séances : prévu et réalisé</h2>{!current.sessions.length && <p>Aucun bilan de séance sur la période.</p>}{current.sessions.map((session) => <div key={session.id} className="work-report-note"><h3>{session.title} · {labelDate(session.completedAt)}</h3>{session.activities.map((activity) => <p key={activity.id}>{activity.title} : {activity.minutes} min prévues ; {activity.actualMinutes !== '' && activity.actualMinutes !== undefined ? `${activity.actualMinutes} min renseignées` : 'durée réelle non renseignée'} ; {{ done: 'réalisée', adapted: 'adaptée', 'not-done': 'non réalisée' }[activity.actualStatus]}. {activity.outcome}</p>)}</div>)}</section>}
    <footer>Boblii · Document éducatif local · Les objectifs ne sont pas validés automatiquement par les jeux.</footer>
  </article>;
}

export default function Reports({ child }) {
  const { data } = useWorkspace();
  const [range, setRange] = useState(rangeFor(14));
  const [family, setFamily] = useState(false);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [sections, setSections] = useState({ objectives: true, activities: true, observations: true });
  const { notes, error } = notesFor(child.id);
  const valid = range.start && range.end && range.start <= range.end;
  const query = new URLSearchParams({ child: child.id, ...range, family: String(family), demo: String(includeDemo), sections: Object.keys(sections).filter((key) => sections[key]).join(',') });
  return <div className="work-area"><section className="esms-panel"><h2>Préparer un rapport</h2><p className="esms-description">Créer un bilan des activités de l’enfant à conserver ou à remettre à sa famille. Choisissez la période et les rubriques : jeux réalisés, objectifs, observations et retours familiaux. Le rapport reprend les données de cette période, sans copier toute la page du dossier.</p><PeriodFields range={range} onChange={setRange} /><div className="work-checks"><label><input type="checkbox" checked={family} onChange={(event) => setFamily(event.target.checked)} />Version simplifiée pour la famille</label><label><input type="checkbox" checked={includeDemo} onChange={(event) => setIncludeDemo(event.target.checked)} />Inclure les parties d’exemple</label>{Object.keys(sections).map((key) => <label key={key}><input type="checkbox" checked={sections[key]} onChange={(event) => setSections({ ...sections, [key]: event.target.checked })} />{{ objectives: 'Objectifs', activities: 'Activités', observations: 'Observations et retours' }[key]}</label>)}</div>{error && <p role="alert">{error}</p>}
      {valid ? <a className="work-link-button" href={`/specialiste/rapport?${query}`} target="_blank" rel="noreferrer">Ouvrir le rapport et exporter en PDF ↗</a> : <p role="alert">Choisissez une période valide.</p>}<p className="work-muted">Pour la famille, cochez « Version simplifiée », vérifiez les informations à partager dans l’aperçu, puis ouvrez le rapport. Choisissez « Enregistrer au format PDF » dans la fenêtre d’impression. Vous pourrez transmettre vous-même le fichier au parent ; Boblii ne l’envoie pas automatiquement.</p>
    </section>{valid && <details className="esms-panel work-tool-section"><summary>Afficher l’aperçu avant export</summary><ReportDocument child={child} data={data} notes={notes} range={range} family={family} includeDemo={includeDemo} sections={sections} /></details>}</div>;
}

export function ReportPage() {
  const { profiles } = useBublii();
  const { data } = useWorkspace();
  const [params] = useSearchParams();
  const child = profiles.find((profile) => profile.id === params.get('child'));
  const range = { start: params.get('start'), end: params.get('end') };
  const valid = child && /^\d{4}-\d{2}-\d{2}$/.test(range.start || '') && /^\d{4}-\d{2}-\d{2}$/.test(range.end || '') && Number.isFinite(Date.parse(range.start)) && Number.isFinite(Date.parse(range.end)) && range.start <= range.end;
  if (!valid) return <main className="work-report-page"><h1>Rapport indisponible</h1><p>Le profil ou la période n’est pas valide.</p><Link to="/specialiste">Retour à l’établissement</Link></main>;
  const { notes, error } = notesFor(child.id);
  const sections = Object.fromEntries(['objectives', 'activities', 'observations'].map((key) => [key, (params.get('sections') || '').split(',').includes(key)]));
  return <main className="work-report-page"><div className="work-print-toolbar"><Link to="/specialiste">← Retour à l’établissement</Link><button type="button" onClick={() => window.print()}>Imprimer / enregistrer en PDF</button><p>Choisir « Enregistrer au format PDF » dans la fenêtre d’impression.</p>{error && <p role="alert">{error}</p>}</div><ReportDocument child={child} data={data} notes={notes} range={range} family={params.get('family') === 'true'} includeDemo={params.get('demo') === 'true'} sections={sections} /></main>;
}
