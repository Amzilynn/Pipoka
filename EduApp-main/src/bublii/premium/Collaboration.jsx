import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from './WorkspaceContext';
import { CATALOG, DOMAIN_NAMES, goalKey, goalsFor, labelDate, recommendActivities, uid } from './model';
import { Evidence, Notifications, Timeline } from './SharedUI';
import { Preferences } from './Insights';

export function ProfessionalCollaboration({ child }) {
  const { data, commit, publish } = useWorkspace();
  const goals = goalsFor(child, data);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]?.id || '');
  const [activityId, setActivityId] = useState('');
  const [home, setHome] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [module, setModule] = useState('learn');
  const selected = goals.find((goal) => goal.id === selectedGoal);
  const shares = data.shares.filter((share) => share.childId === child.id);
  const share = (event) => {
    event.preventDefault();
    if (!selected || !home.trim() || !author.trim()) return;
    const item = { id: uid(), childId: child.id, objectiveId: selected.id, objectiveTitle: selected.title, activityId, instructions: home.trim(), author: author.trim(), createdAt: new Date().toISOString() };
    try { publish(child.id, 'parent', 'Proposition de l’équipe', `${item.author} propose : ${selected.title}`, (previous) => ({ ...previous, shares: [item, ...previous.shares] })); setHome(''); setMessage('Proposition partagée dans l’espace Parent de ce navigateur.'); }
    catch (cause) { setMessage(cause.message); }
  };
  return <div className="work-area">
    <section className="esms-panel"><h2>Échanger avec la famille et suivre les objectifs</h2><p className="esms-description">Proposez une activité à essayer à la maison, puis retrouvez ici le retour du parent. Vous pouvez aussi ajouter les objectifs de l’enfant et noter où vous en êtes dans leur accompagnement.</p></section>
    <details className="esms-panel work-tool-section"><summary>Gérer les objectifs de {child.firstName}</summary><p className="work-muted">Les états et dates de révision sont renseignés par l’équipe, jamais déduits des mini-jeux.</p>
      <div className="work-card-grid">{goals.map((goal) => {
        const plan = data.goalPlans[goalKey(child.id, goal.id)] || {};
        const change = (key, value) => { try { publish(child.id, 'esms', 'Suivi d’objectif', `${goal.title} : ${key === 'status' ? value : `révision prévue le ${value || 'date à préciser'}`}`, (previous) => ({ ...previous, goalPlans: { ...previous.goalPlans, [goalKey(child.id, goal.id)]: { ...plan, [key]: value, updatedAt: new Date().toISOString() } } }), { objectiveId: goal.id, field: key, value }); } catch (cause) { setMessage(cause.message); } };
        return <article className="work-card" key={goal.id}><span className="work-tag">{goal.source === 'demo' ? 'Objectif de démonstration' : 'Objectif saisi'} · {DOMAIN_NAMES[goal.module]}</span><h3>{goal.title}</h3><label>État renseigné par l’équipe<select value={plan.status || 'À préciser'} onChange={(event) => change('status', event.target.value)}>{['À préciser', 'À travailler', 'En cours', 'À réobserver', 'Réalisé dans le contexte observé'].map((status) => <option key={status}>{status}</option>)}</select></label><label>Prochaine révision<input type="date" value={plan.reviewDate || ''} onChange={(event) => change('reviewDate', event.target.value)} /></label></article>;
      })}</div>
      <details><summary>Ajouter un objectif individuel</summary><form className="work-form" onSubmit={(event) => { event.preventDefault(); if (!newGoal.trim()) return; try { const goal = { id: uid(), childId: child.id, title: newGoal.trim(), module, source: 'team', createdAt: new Date().toISOString() }; commit((previous) => ({ ...previous, goals: [...previous.goals, goal] })); setNewGoal(''); setMessage('Objectif ajouté au dossier professionnel.'); } catch (cause) { setMessage(cause.message); } }}><label>Partir d’un modèle<select value="" onChange={(event) => { const template = data.objectiveTemplates.find((item) => item.id === event.target.value); if (template) { setNewGoal(template.title); setModule(template.module); } }}><option value="">Choisir un modèle d’objectif</option>{data.objectiveTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}</select></label><label>Objectif<input required value={newGoal} maxLength={200} onChange={(event) => setNewGoal(event.target.value)} /></label><label>Domaine<select value={module} onChange={(event) => setModule(event.target.value)}>{Object.entries(DOMAIN_NAMES).map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label><button type="submit">Ajouter l’objectif</button></form></details>
    </details>
    <section className="esms-panel"><h2>Proposer une activité à la maison</h2><p className="esms-description">Choisissez un objectif et décrivez ce que la famille peut essayer avec l’enfant. Vous pouvez y associer un jeu Boblii.</p><p className="work-local">Après « Partager au Parent », ouvrez l’espace Parent et sélectionnez le même enfant : la proposition apparaît dans « Des idées pour le quotidien ». Le parent peut y répondre avec « Faire un retour à l’équipe ». Pour ce prototype, utilisez le même navigateur : aucun e-mail ni message sur un autre appareil n’est envoyé.</p>
      <details className="work-disclosure"><summary>Rédiger une proposition pour la famille</summary><form className="work-form" onSubmit={share}><div className="work-fields"><label>Professionnel<input required maxLength={80} value={author} onChange={(event) => setAuthor(event.target.value)} /></label><label>Objectif partagé<select required value={selectedGoal} onChange={(event) => { setSelectedGoal(event.target.value); setActivityId(''); }}><option value="">Choisir un objectif</option>{goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}</select></label></div>
        <label>Activité Boblii associée, facultatif<select value={activityId} onChange={(event) => setActivityId(event.target.value)}><option value="">Activité pratique sans mini-jeu</option>{CATALOG.filter((activity) => !selected || activity.module === selected.module).map((activity) => <option key={activity.id} value={activity.id}>{activity.title}</option>)}</select></label><label>Proposition concrète pour la famille<textarea required maxLength={1000} rows={3} value={home} onChange={(event) => setHome(event.target.value)} placeholder="Indiquer le matériel, une consigne simple et les aides possibles…" /></label><button type="submit" disabled={!goals.length}>Partager au Parent</button></form></details><p role="status">{message}</p>
    </section>
    <section className="esms-panel"><h2>Retours de la famille</h2>{!data.feedback.some((feedback) => feedback.childId === child.id) && <p className="esms-empty">Aucun retour de la famille pour le moment.</p>}
      {data.feedback.filter((feedback) => feedback.childId === child.id).map((feedback) => <article className="work-card" key={feedback.id}><span className="work-tag">Fait déclaré par la famille</span><h3>{shares.find((item) => item.id === feedback.shareId)?.objectiveTitle || 'Retour sur une proposition'}</h3><p>{feedback.text}</p><p>Participation déclarée : {PARTICIPATION[feedback.participation]}</p><small>{labelDate(feedback.createdAt)}</small></article>)}
      <details><summary>Propositions déjà partagées ({shares.length})</summary>{shares.map((item) => <article key={item.id} className="work-card"><h3>{item.objectiveTitle}</h3><p>{item.instructions}</p><small>{item.author} · {labelDate(item.createdAt)}</small></article>)}</details>
    </section><Timeline child={child} />
  </div>;
}

const PARTICIPATION = { 'not-tried': 'Pas encore essayé', positive: 'Moment agréable', mixed: 'Variable', difficult: 'Difficile cette fois' };
function FamilyFeedback({ share, child }) {
  const { publish } = useWorkspace();
  const [text, setText] = useState('');
  const [participation, setParticipation] = useState('not-tried');
  const [message, setMessage] = useState('');
  return <form className="work-form" onSubmit={(event) => { event.preventDefault(); if (!text.trim()) return; const feedback = { id: uid(), shareId: share.id, childId: child.id, text: text.trim(), participation, createdAt: new Date().toISOString() }; try { publish(child.id, 'esms', 'Retour de la famille', `Retour sur « ${share.objectiveTitle} » : ${feedback.text}`, (previous) => ({ ...previous, feedback: [feedback, ...previous.feedback] })); setText(''); setMessage('Retour disponible dans l’espace Établissement de ce navigateur.'); } catch (cause) { setMessage(cause.message); } }}>
    <label>Comment s’est passée l’activité ?<select value={participation} onChange={(event) => setParticipation(event.target.value)}>{Object.entries(PARTICIPATION).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label><label>Votre retour<textarea required maxLength={1200} rows={2} value={text} onChange={(event) => setText(event.target.value)} placeholder="Une réussite, une difficulté ou une question…" /></label><button type="submit">Transmettre mon retour localement</button><p role="status">{message}</p>
  </form>;
}

export function ParentCollaboration({ child }) {
  const { data, error } = useWorkspace();
  const navigate = useNavigate();
  const shares = data.shares.filter((share) => share.childId === child.id);
  const recommendations = recommendActivities(child, [], data).filter((item) => item.decision?.status !== 'dismissed').slice(0, 3);
  return <section className="parent-panel work-area work-family" aria-labelledby="work-family-title"><div className="parent-section-heading"><div><p className="parent-eyebrow">FAMILLE & ÉQUIPE</p><h2 id="work-family-title">Des idées pour le quotidien</h2></div><span className="parent-pill">Échanges locaux</span></div>
    <p className="work-local">Propositions et retours partagés uniquement dans ce navigateur. Aucun message n’est envoyé à un établissement réel.</p>{error && <p role="alert">{error}</p>}<Notifications child={child} role="parent" />
    {!shares.length && <p>Aucune proposition du professionnel pour le moment.</p>}
    {shares.map((share) => <article className="work-card" key={share.id}><span className="work-tag">Proposition de {share.author}</span><h3>{share.objectiveTitle}</h3><p>{share.instructions}</p>{share.activityId && <button type="button" onClick={() => { const activity = CATALOG.find((item) => item.id === share.activityId); if (activity) navigate(`/enfant/activite?module=${activity.module}&activity=${activity.id}`); }}>Ouvrir l’activité associée</button>}<details><summary>Faire un retour à l’équipe</summary><FamilyFeedback share={share} child={child} /></details></article>)}
    <Preferences child={child} /><details><summary>Explorer d’autres idées d’activités</summary><p className="work-muted">Suggestions automatiques par règles, à adapter avec l’équipe. Elles ne constituent pas une prescription.</p>{recommendations.map((activity) => <article key={activity.id} className="work-card"><h3>{activity.title}</h3><p>Objectif associé : {activity.goals[0].title}</p><p>Proposer un moment de jeu autour de cette activité, avec les supports préférés renseignés. L’enfant peut faire une pause ou choisir une autre activité.</p><Evidence items={activity.reasons} />{activity.decision?.note && <p>Adaptation du professionnel : {activity.decision.note}</p>}<button type="button" onClick={() => navigate(`/enfant/activite?module=${activity.module}&activity=${activity.id}`)}>Découvrir le jeu</button></article>)}{!recommendations.length && <p>Aucune idée liée à un objectif disponible pour cet enfant.</p>}</details>
    <Timeline child={child} />
  </section>;
}
