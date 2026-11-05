import React, { useState } from 'react';
import { useWorkspace } from './WorkspaceContext';
import { buildInsights, recommendActivities, rangeFor, goalKey } from './model';
import { notesFor, PeriodFields, Evidence } from './SharedUI';

export function Preferences({ child }) {
  const { data, commit } = useWorkspace();
  const values = data.preferences[child.id] || { interests: [], communication: [] };
  const save = (key, value, checked) => {
    try { commit((previous) => ({ ...previous, preferences: { ...previous.preferences, [child.id]: { ...values, [key]: checked ? [...values[key], value] : values[key].filter((item) => item !== value) } } })); }
    catch { /* The workspace error remains visible; no false save confirmation. */ }
  };
  return <details className="work-preferences"><summary>Centres d’intérêt et supports préférés</summary><p className="work-muted">Renseignés par la famille ou le professionnel. Aucune préférence n’est déduite de l’âge ou du diagnostic.</p>
    {[['interests', 'Centres d’intérêt', ['animaux', 'mots', 'nombres', 'musique', 'mouvement', 'émotions', 'routines', 'vie quotidienne']], ['communication', 'Supports préférés', ['images', 'gestes', 'oral', 'écrit']]].map(([key, title, choices]) => <fieldset className="work-checks" key={key}><legend>{title}</legend>{choices.map((value) => <label key={value}><input type="checkbox" checked={values[key].includes(value)} onChange={(event) => save(key, value, event.target.checked)} />{value}</label>)}</fieldset>)}
  </details>;
}

function RecommendationCard({ recommendation, child }) {
  const { commit } = useWorkspace();
  const [note, setNote] = useState(recommendation.decision?.note || '');
  const decide = (status) => { try { commit((previous) => ({ ...previous, decisions: { ...previous.decisions, [goalKey(child.id, recommendation.id)]: { status, note: note.trim(), updatedAt: new Date().toISOString() } } })); } catch { /* The page displays the storage error. */ } };
  return <article className="work-card"><span className="work-tag">Suggestion par règles</span><h3>{recommendation.title}</h3><p>Objectif associé : {recommendation.goals[0].title}</p>
    <Evidence items={recommendation.reasons} />
    <details className="work-disclosure"><summary>Adapter ou écarter cette idée</summary><label>Adaptation proposée<textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} maxLength={400} placeholder="Ajuster le support, le contexte ou la consigne…" /></label><div className="work-actions"><button type="button" disabled={!note.trim()} onClick={() => decide('modified')}>Enregistrer l’adaptation</button><button type="button" onClick={() => decide('dismissed')}>Écarter</button></div></details>
    {recommendation.decision && <p className="work-muted">Décision : {{ accepted: 'retenue', dismissed: 'écartée', modified: 'adaptée' }[recommendation.decision.status]}{recommendation.decision.note ? ` · ${recommendation.decision.note}` : ''}</p>}
    <div className="work-actions"><button type="button" onClick={() => decide('accepted')}>Retenir cette idée</button></div>
  </article>;
}

export default function Insights({ child }) {
  const { data } = useWorkspace();
  const [range, setRange] = useState(rangeFor(14));
  const [includeDemo, setIncludeDemo] = useState(false);
  const [showDismissed, setShowDismissed] = useState(false);
  const [limit, setLimit] = useState(4);
  const [moreInsights, setMoreInsights] = useState(false);
  const { notes, error } = notesFor(child.id);
  const valid = Boolean(range.start && range.end && range.start <= range.end);
  const insights = valid ? buildInsights(child, notes, data, range, includeDemo) : [];
  const recommendations = recommendActivities(child, notes, data).filter((item) => showDismissed || item.decision?.status !== 'dismissed');
  return <div className="work-area">
    <section className="esms-panel"><div className="esms-section-heading"><div><p className="esms-eyebrow">CHOISIR LA PROCHAINE ACTIVITÉ</p><h2>Faire le point avant de proposer un jeu</h2></div><span className="esms-badge">Règles explicites · aucune IA connectée</span></div>
      <p className="esms-description">Consultez les activités et observations enregistrées, puis les idées de jeux ci-dessous pour préparer votre prochaine séance avec l’enfant. Un objectif signalé ici est une piste à vérifier avec l’équipe, pas une difficulté détectée automatiquement.</p>
      <details className="work-disclosure"><summary>Changer la période ou les données utilisées</summary><PeriodFields range={range} onChange={setRange} /><label className="work-inline"><input type="checkbox" checked={includeDemo} onChange={(event) => setIncludeDemo(event.target.checked)} />Inclure les parties d’exemple dans les calculs</label></details>
      {!valid && <p role="alert">Choisissez une période valide.</p>}{error && <p role="alert">{error}</p>}
      <div className="work-card-grid">{(moreInsights ? insights : insights.slice(0, 2)).map((insight) => <article className="work-card" key={insight.id}><span className="work-tag">{insight.kind}</span><h3>{insight.title}</h3><p>{insight.text}</p><Evidence items={insight.evidence} /><p className="work-next">{insight.action}</p></article>)}</div>
      {insights.length > 2 && <button type="button" onClick={() => setMoreInsights(!moreInsights)}>{moreInsights ? 'Réduire les éclairages' : `Voir les autres éclairages (${insights.length - 2})`}</button>}
    </section>
    <section className="esms-panel"><h2>Choisir des jeux en lien avec ses objectifs</h2><p className="esms-description">Boblii propose des jeux selon les objectifs de l’enfant, les activités déjà découvertes et les centres d’intérêt renseignés. Consultez « Pourquoi cette proposition ? », puis retenez une idée, ajoutez une consigne d’adaptation ou écartez-la. Vous pourrez ensuite préparer une séance dans « Séances ». Retenir une idée l’enregistre ici ; cela ne lance pas de jeu et ne partage rien au parent.</p>
      <Preferences child={child} /><label className="work-inline"><input type="checkbox" checked={showDismissed} onChange={(event) => setShowDismissed(event.target.checked)} />Afficher aussi les propositions écartées</label>
      <div className="work-card-grid">{recommendations.slice(0, limit).map((item) => <RecommendationCard key={item.id} recommendation={item} child={child} />)}</div>
      {recommendations.length > limit && <button type="button" onClick={() => setLimit(limit + 4)}>Afficher d’autres pistes ({recommendations.length - limit})</button>}
      {!recommendations.length && <p className="esms-empty">Aucune proposition disponible. Renseignez un objectif ou réaffichez les propositions écartées.</p>}
    </section>
  </div>;
}
