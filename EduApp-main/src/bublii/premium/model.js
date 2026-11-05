import { ACTIVITY_CATALOG, entryDate } from '../data/progress.js';
import { dayKey } from '../parent/parentMetrics.js';

export const WORKSPACE_KEY = 'bobliiWorkspaceV1';
export const DOMAIN_NAMES = { learn: 'Apprendre', communicate: 'Communiquer', move: 'Bouger', grow: 'Grandir' };
export const emptyWorkspace = () => ({ version: 1, goals: [], goalPlans: {}, preferences: {}, sessions: [], templates: [], shares: [], feedback: [], decisions: {}, events: [], notifications: [], resources: [], objectiveTemplates: [] });
export const uid = () => crypto.randomUUID();
export const goalKey = (childId, goalId) => `${childId}:${goalId}`;
export const goalsFor = (child, data) => [...(child.objectives || []).map((goal) => ({ ...goal, source: 'demo' })), ...data.goals.filter((goal) => goal.childId === child.id)];
export const labelDate = (date) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'medium' }).format(new Date(date));
export const todayKey = () => dayKey(new Date());
export function rangeFor(days = 7, now = new Date()) {
  const end = dayKey(now);
  const start = new Date(`${end}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { start: dayKey(start), end };
}
export function inRange(date, range) {
  if (!date || Number.isNaN(new Date(date).getTime())) return false;
  const key = dayKey(new Date(date));
  return key >= range.start && key <= range.end;
}
export function previousRange(range) {
  const start = new Date(`${range.start}T12:00:00Z`);
  const end = new Date(`${range.end}T12:00:00Z`);
  const length = Math.round((end - start) / 86400000) + 1;
  const previousEnd = new Date(start); previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(start); previousStart.setUTCDate(previousStart.getUTCDate() - length);
  return { start: dayKey(previousStart), end: dayKey(previousEnd) };
}
export function loadWorkspace(storage) {
  const raw = storage.getItem(WORKSPACE_KEY);
  if (!raw) return emptyWorkspace();
  const value = JSON.parse(raw);
  const defaults = emptyWorkspace();
  if (value.version !== 1 || Object.keys(defaults).some((key) => key !== 'version' &&
    (Array.isArray(defaults[key]) ? !Array.isArray(value[key]) : !value[key] || typeof value[key] !== 'object' || Array.isArray(value[key])))) {
    throw new Error('La mémoire de travail ne peut pas être lue. Les anciennes données ont été conservées.');
  }
  return value;
}

const ACTIVITY_TAGS = {
  'associer-mots-images': [['mots', 'animaux', 'vie quotidienne'], ['images', 'oral']],
  'construire-le-mot': [['mots', 'animaux'], ['écrit', 'images', 'oral']],
  'compter-des-objets': [['nombres', 'animaux'], ['images', 'écrit', 'oral']],
  'problemes-simples': [['animaux', 'vie quotidienne'], ['images', 'oral']],
  'reconnaitre-les-emotions': [['émotions'], ['images', 'oral']],
  'exprimer-ses-besoins': [['vie quotidienne'], ['images', 'oral']],
  'construire-une-phrase': [['mots', 'vie quotidienne'], ['images', 'écrit', 'oral']],
  'situations-sociales': [['vie quotidienne'], ['images', 'oral']],
};
// Editorial links to the themes actually present in the games, not abilities
// inferred from a child's age or diagnosis. Unknown wording falls back to domain.
const OBJECTIVE_THEMES = {
  'associer-mots-images': /associer|appari|image.*mot|mot.*image/,
  'construire-le-mot': /lettre|ecri|construire.*mot/,
  'compter-des-objets': /compt|nombre|denombr/,
  'problemes-simples': /logique|probleme|raisonn/,
  'reconnaitre-les-emotions': /emotion/,
  'exprimer-ses-besoins': /besoin|faim|soif/,
  'construire-une-phrase': /phrase/,
  'situations-sociales': /social|college|bonjour/,
  'imiter-le-mouvement': /imiter|bras|geste/,
  'gauche-droite-haut-bas': /gauche|droite|direction|orientation/,
  'sequences-de-mouvement': /sequence|enchain.*mouvement/,
  'identifier-parties-corps': /corps|partie.*corporel/,
  'dents-propres': /dent|brossage/,
  'ordre-du-matin': /matin/,
  'sac-de-ecole': /sac/,
  'routine-du-soir': /soir/,
};
const themeMatches = (activity, goal) => OBJECTIVE_THEMES[activity.id]?.test(goal.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
export const CATALOG = Object.entries(ACTIVITY_CATALOG).flatMap(([module, activities]) => activities.map(([id, title]) => ({
  id, title, module,
  interests: ACTIVITY_TAGS[id]?.[0] || (module === 'move' ? ['mouvement'] : ['routines', 'vie quotidienne']),
  communication: ACTIVITY_TAGS[id]?.[1] || (module === 'move' ? ['gestes', 'oral'] : ['images', 'oral']),
})));

export function periodSummary(child, notes, data, range, includeDemo = false) {
  const entries = (child.history || []).filter((entry) => {
    const date = entryDate(entry);
    return date && date <= new Date() && inRange(date, range) && (includeDemo || entry.source !== 'demo');
  });
  const observations = notes.filter((note) => inRange(note.createdAt, range));
  const sessions = data.sessions.filter((session) => session.childId === child.id && session.status === 'completed' && inRange(session.completedAt, range));
  const feedback = data.feedback.filter((item) => item.childId === child.id && inRange(item.createdAt, range));
  return { entries, observations, sessions, feedback, unique: new Set(entries.map((item) => item.activityId)).size,
    domains: Object.keys(DOMAIN_NAMES).map((module) => ({ module, count: entries.filter((entry) => entry.module === module).length })),
  };
}

export function recommendActivities(child, notes, data, now = new Date()) {
  const goals = goalsFor(child, data);
  const preferences = data.preferences[child.id] || { interests: [], communication: [] };
  return CATALOG.flatMap((activity) => {
    const linked = goals.filter((goal) => goal.module === activity.module).sort((a, b) => Number(themeMatches(activity, b)) - Number(themeMatches(activity, a)));
    if (!linked.length) return [];
    const reasons = [{ text: `Même domaine que l’objectif « ${linked[0].title} ». Il s’agit d’un rapprochement par domaine, à confirmer par le professionnel.`, ref: linked[0].id }];
    let weight = 2;
    if (themeMatches(activity, linked[0])) {
      reasons.push({ text: 'Le thème explicite de cet objectif correspond au contenu de cette activité, selon le catalogue éditorial. La proposition reste à confirmer.', ref: linked[0].id });
      weight += 8;
    }
    const explored = child.history.some((entry) => entry.activityId === activity.id);
    if (!explored) { reasons.push({ text: 'Aucune partie de cette activité dans le parcours disponible.', ref: `history:${child.id}` }); weight += 2; }
    const interests = preferences.interests.filter((interest) => activity.interests.includes(interest));
    if (interests.length) { reasons.push({ text: `Intérêt renseigné : ${interests.join(', ')}.`, ref: `preferences:${child.id}` }); weight += 2; }
    const communication = preferences.communication.filter((method) => activity.communication.includes(method));
    if (communication.length) { reasons.push({ text: `Support préféré renseigné : ${communication.join(', ')}.`, ref: `preferences:${child.id}` }); weight++; }
    const positive = data.feedback.filter((feedback) => feedback.childId === child.id && feedback.participation === 'positive' && data.shares.some((share) => share.id === feedback.shareId && share.activityId === activity.id));
    if (positive.length) { reasons.push({ text: `${positive.length} retour(s) de participation positive saisi(s) par la famille pour cette proposition.`, ref: positive.map((item) => item.id).join(', ') }); weight += 2; }
    const recommended = data.shares.filter((share) => share.childId === child.id && share.activityId === activity.id);
    if (recommended.length) { reasons.push({ text: 'Cette activité a été proposée à la famille par un professionnel.', ref: recommended[0].id }); weight++; }
    const decision = data.decisions[goalKey(child.id, activity.id)];
    if (decision?.status === 'accepted' || decision?.status === 'modified') weight++;
    return [{ ...activity, goals: linked, reasons, weight, decision, generatedAt: now.toISOString(), method: 'rules' }];
  }).sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title, 'fr'));
}

export function buildInsights(child, notes, data, range, includeDemo = false, now = new Date()) {
  const result = [];
  const summary = periodSummary(child, notes, data, range, includeDemo);
  result.push({ id: 'practice', kind: 'Calcul automatique', title: 'La pratique sur la période', text: `${summary.entries.length} partie(s), ${summary.unique} activité(s) différente(s), ${summary.observations.length} observation(s) et ${summary.sessions.length} séance(s) clôturée(s).`,
    evidence: [...summary.entries.map((entry) => ({ id: entry.id, text: `${entry.label} · ${labelDate(entryDate(entry))}${entry.source === 'demo' ? ' · Exemple' : ''}` })), ...summary.observations.map((note) => ({ id: note.id, text: `Observation de ${note.author} · ${labelDate(note.createdAt)}` })), ...summary.sessions.map((session) => ({ id: session.id, text: `Bilan de « ${session.title} » · ${labelDate(session.completedAt)}` }))],
    action: 'Comparer ces faits avec les observations de l’équipe, sans en déduire un progrès du développement.' });
  for (const goal of goalsFor(child, data)) {
    const practices = data.sessions.filter((session) => session.childId === child.id && session.status === 'completed' && session.activities.some((activity) => activity.objectiveIds?.includes(goal.id) && ['done', 'adapted'].includes(activity.actualStatus)));
    const recent = practices.some((session) => inRange(session.completedAt, range));
    if (!recent) result.push({ id: `goal-${goal.id}`, kind: 'Suggestion par règles', title: 'Objectif à remettre à l’ordre du jour', text: goal.title,
      evidence: [{ id: goal.id, text: `Objectif du profil${goal.source === 'demo' ? ' de démonstration' : ''}. Aucune séance terminée explicitement liée à cet objectif sur la période. Les parties du même domaine ne prouvent pas qu’il a été travaillé.` }, ...practices.slice(-1).map((session) => ({ id: session.id, text: `Dernière séance liée : ${session.title} · ${labelDate(session.completedAt)}` }))],
      action: 'Vérifier avec l’équipe s’il a été pratiqué ailleurs, puis envisager une séance liée.' });
  }
  const changes = data.events.filter((event) => event.childId === child.id && event.type === 'Suivi d’objectif' && event.field === 'status' && inRange(event.createdAt, range));
  if (changes.length) result.push({ id: 'goal-history', kind: 'Faits saisis par l’équipe', title: 'Évolution documentée des objectifs', text: `${changes.length} changement(s) d’état renseigné(s) sur la période.`, evidence: changes.map((event) => ({ id: event.id, text: `${labelDate(event.createdAt)} · ${event.text}` })), action: 'Relire les changements avec leurs observations. Un état saisi ne constitue pas une évaluation clinique.' });
  const groups = new Map();
  summary.observations.forEach((note) => {
    if (!note.help || note.help === 'Non précisée') return;
    const key = `${note.objectiveId || 'general'}:${note.help}`;
    groups.set(key, [...(groups.get(key) || []), note]);
  });
  for (const [key, matching] of groups) {
    if (matching.length < 2 || new Set(matching.map((note) => dayKey(new Date(note.createdAt)))).size < 2) continue;
    result.push({ id: `recurring-${key}`, kind: 'Calcul automatique', title: 'Une aide revient dans les observations', text: `${matching.length} observations, sur plusieurs dates, mentionnent « ${matching[0].help} ».`, evidence: matching.map((note) => ({ id: note.id, text: `${note.author} · ${labelDate(note.createdAt)} : ${note.text}` })), action: 'Échanger sur l’utilité de cette aide ; sa fréquence ne démontre pas son efficacité.' });
  }
  const positive = summary.sessions.flatMap((session) => session.activities.filter((activity) => activity.participation === 'positive' && ['done', 'adapted'].includes(activity.actualStatus)).map((activity) => ({ session, activity })));
  const sessionSupports = new Map();
  summary.sessions.forEach((session) => session.activities.forEach((activity) => {
    if (!activity.actualSupport?.trim() || !['done', 'adapted'].includes(activity.actualStatus)) return;
    const key = `${activity.module}:${activity.actualSupport.trim().toLowerCase()}`;
    sessionSupports.set(key, [...(sessionSupports.get(key) || []), { session, activity }]);
  }));
  for (const [key, matches] of sessionSupports) {
    const uniqueSessions = [...new Map(matches.map((item) => [item.session.id, item])).values()];
    if (uniqueSessions.length < 2) continue;
    result.push({ id: `session-support-${key}`, kind: 'Calcul automatique', title: 'Une aide revient dans les séances', text: `${uniqueSessions.length} bilans mentionnent l’aide réellement apportée « ${matches[0].activity.actualSupport} ».`, evidence: uniqueSessions.map(({ session, activity }) => ({ id: session.id, text: `${session.title} · ${labelDate(session.completedAt)} · aide renseignée : ${activity.actualSupport} · ${activity.outcome || 'Aucun commentaire complémentaire.'}` })), action: 'Relire les conditions d’utilisation avec l’équipe. La répétition d’une aide ne démontre pas son efficacité.' });
  }
  for (const { session, activity } of positive) result.push({ id: `positive-${session.id}-${activity.id}`, kind: 'Fait saisi par un professionnel', title: 'Participation positive renseignée', text: activity.title, evidence: [{ id: session.id, text: `${session.title} · ${labelDate(session.completedAt)} · ${activity.outcome || 'Participation positive sélectionnée dans le bilan de séance.'}` }], action: 'Envisager de reproposer cette activité dans des conditions similaires, après avis du professionnel.' });
  return result;
}

export function sharedTimeline(child, notes, data) {
  return [
    ...child.history.filter((entry) => entryDate(entry)).map((entry) => ({ id: entry.id, at: entryDate(entry).toISOString(), type: entry.source === 'demo' ? 'Exemple de jeu' : 'Partie enregistrée', text: entry.label })),
    ...notes.map((note) => ({ id: note.id, at: note.createdAt, type: 'Observation de l’équipe', text: `${note.author} : ${note.text}` })),
    ...data.events.filter((event) => event.childId === child.id).map((event) => ({ id: event.id, at: event.createdAt, type: event.type, text: event.text })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
}

export function makeSession(draft, child, now = new Date()) {
  if (!draft.title.trim() || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(draft.start) || Number.isNaN(Date.parse(draft.start)) || !draft.objectiveIds.length || !draft.activities.length) {
    throw new Error('Indiquez un titre, une date, au moins un objectif et une activité.');
  }
  if (draft.activities.some((activity) => !Number.isFinite(Number(activity.minutes)) || Number(activity.minutes) < 1 || Number(activity.minutes) > 180)) throw new Error('Chaque activité doit durer entre 1 et 180 minutes.');
  return { ...draft, id: draft.id || uid(), childId: child.id, title: draft.title.trim(), status: draft.status || 'planned', createdAt: draft.createdAt || now.toISOString(), updatedAt: now.toISOString() };
}

export function closeSession(session, outcomes, now = new Date()) {
  if (session.status === 'completed') throw new Error('Cette séance est déjà clôturée.');
  const activities = session.activities.map((activity) => ({ ...activity, ...outcomes[activity.id] }));
  if (activities.some((activity) => !['done', 'adapted', 'not-done'].includes(activity.actualStatus))) throw new Error('Renseignez ce qui s’est passé pour chaque activité.');
  if (activities.some((activity) => activity.actualMinutes !== '' && activity.actualMinutes !== undefined && (!Number.isFinite(Number(activity.actualMinutes)) || Number(activity.actualMinutes) < 0 || Number(activity.actualMinutes) > 300))) throw new Error('Les durées réelles doivent être comprises entre 0 et 300 minutes.');
  return { ...session, activities, status: 'completed', completedAt: now.toISOString() };
}

export function makeTemplate(session, title) {
  if (!title.trim() || !session.activities.length) throw new Error('Donnez un nom au modèle et ajoutez au moins une activité.');
  return { id: uid(), title: title.trim(), objectiveIds: session.objectiveIds, notes: session.notes, activities: session.activities.map(({ id, module, activityId, title: activityTitle, minutes, support, objectiveIds }) => ({ id, module, activityId, title: activityTitle, minutes, support, objectiveIds })) };
}

export function applyTemplate(template, childGoals) {
  const ids = childGoals.map((goal) => goal.id);
  return { title: template.title, start: '', objectiveIds: template.objectiveIds.filter((id) => ids.includes(id)), notes: template.notes || '', activities: template.activities.map((activity) => ({ ...activity, id: uid(), objectiveIds: (activity.objectiveIds || []).filter((id) => ids.includes(id)), actualStatus: '', actualMinutes: '', participation: 'not-recorded', outcome: '' })) };
}
