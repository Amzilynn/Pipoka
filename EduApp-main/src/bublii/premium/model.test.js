import test from 'node:test';
import assert from 'node:assert/strict';
import { applyTemplate, buildInsights, CATALOG, closeSession, emptyWorkspace, goalsFor, inRange, loadWorkspace, makeSession, makeTemplate, periodSummary, previousRange, recommendActivities, sharedTimeline } from './model.js';

const now = new Date('2020-11-05T12:00:00Z');
const range = { start: '2020-10-30', end: '2020-11-05' };
const child = { id: 'lea', age: 9, objectives: [{ id: 'g1', module: 'learn', title: 'Associer un mot à une image' }], history: [] };
const completion = { id: 'record1', activityId: CATALOG[0].id, module: 'learn', label: 'Mots & Images', source: 'recorded', completedAt: '2020-11-04T12:00:00Z' };
const draft = { title: 'Séance images', start: '2020-11-05T14:00', objectiveIds: ['g1'], notes: 'Préparer des images.', activities: [{ id: 'step1', activityId: CATALOG[0].id, title: CATALOG[0].title, module: 'learn', objectiveIds: ['g1'], minutes: 5, support: 'Images', actualStatus: '', actualMinutes: '' }] };

test('workspace loads empty without fabricating sessions, preferences or observations', () => {
  const data = loadWorkspace({ getItem: () => null });
  assert.equal(data.sessions.length, 0); assert.deepEqual(data.preferences, {});
  assert.throws(() => loadWorkspace({ getItem: () => '{bad' }));
  assert.throws(() => loadWorkspace({ getItem: () => '{"version":2}' }));
});
test('period metrics separate example data from recorded facts', () => {
  const profile = { ...child, history: [completion, { ...completion, id: 'demo1', source: 'demo' }] };
  assert.equal(periodSummary(profile, [], emptyWorkspace(), range).entries.length, 1);
  assert.equal(periodSummary(profile, [], emptyWorkspace(), range, true).entries.length, 2);
  assert.equal(periodSummary(profile, [], emptyWorkspace(), range).unique, 1);
});
test('previous period has equal calendar duration across time changes', () => {
  assert.deepEqual(previousRange(range), { start: '2020-10-23', end: '2020-10-29' });
  assert.equal(inRange('2020-11-04T23:30:00Z', { start: '2020-11-05', end: '2020-11-05' }), true);
});
test('empty insights do not claim an objective is unpractised everywhere', () => {
  const insights = buildInsights(child, [], emptyWorkspace(), range, false, now);
  assert.match(insights[0].text, /0 partie/);
  assert.match(insights.find((item) => item.id === 'goal-g1').evidence[0].text, /Aucune séance terminée explicitement liée/);
  assert.ok(insights.every((item) => item.action && item.kind));
});
test('playing in a domain never proves that a specific objective was worked', () => {
  const insights = buildInsights({ ...child, history: [completion] }, [], emptyWorkspace(), range, false, now);
  assert.ok(insights.some((item) => item.id === 'goal-g1'));
});
test('completed sessions explicitly linked to an objective suppress the no-practice suggestion', () => {
  const data = emptyWorkspace();
  data.sessions = [closeSession(makeSession(draft, child, now), { step1: { actualStatus: 'done', participation: 'positive', actualMinutes: 4, outcome: 'A choisi une image.' } }, now)];
  const insights = buildInsights(child, [], data, range, false, now);
  assert.equal(insights.some((item) => item.id === 'goal-g1'), false);
  assert.equal(insights.filter((item) => item.title === 'Participation positive renseignée').length, 1);
});
test('positive participation is never inferred from a high mini-game score', () => {
  const insights = buildInsights({ ...child, history: [{ ...completion, score: 3, maxScore: 3 }] }, [], emptyWorkspace(), range, false, now);
  assert.equal(insights.some((item) => item.title === 'Participation positive renseignée'), false);
});
test('recurrence across sessions uses actual support and not just planned support', () => {
  const data = emptyWorkspace();
  data.sessions = [1, 2].map((index) => ({ ...closeSession(makeSession(draft, child, now), { step1: { actualStatus: 'done' } }, now), id: `session-${index}` }));
  assert.equal(buildInsights(child, [], data, range, false, now).some((item) => item.title === 'Une aide revient dans les séances'), false);
  data.sessions.forEach((session) => { session.activities[0].actualSupport = 'Images'; });
  const result = buildInsights(child, [], data, range, false, now).find((item) => item.title === 'Une aide revient dans les séances');
  assert.equal(result.evidence.length, 2);
  assert.match(result.text, /réellement apportée/);
});
test('recurrent help needs independent dates and retains observation references', () => {
  const notes = [1, 2].map((id) => ({ id: String(id), objectiveId: 'g1', help: 'Indice visuel', author: 'Test', text: 'Aide utilisée.', createdAt: `2020-11-0${id}T12:00:00Z` }));
  const insight = buildInsights(child, notes, emptyWorkspace(), range, false, now).find((item) => item.title.includes('Une aide revient'));
  assert.equal(insight.evidence.length, 2);
  assert.match(insight.action, /ne démontre pas son efficacité/);
  assert.equal(buildInsights(child, [notes[0], { ...notes[1], createdAt: notes[0].createdAt }], emptyWorkspace(), range, false, now).some((item) => item.title.includes('Une aide revient')), false);
});
test('recommendations have traceable reasons and do not use diagnosis or age', () => {
  const data = emptyWorkspace();
  data.preferences.lea = { interests: ['animaux'], communication: ['images'] };
  const a = recommendActivities(child, [], data, now);
  const b = recommendActivities({ ...child, age: 99, diagnosis: 'anything' }, [], data, now);
  assert.deepEqual(a, b);
  assert.ok(a.every((item) => item.reasons.length && item.reasons.every((reason) => reason.ref && reason.text)));
  assert.ok(a.every((item) => item.goals.every((goal) => goal.module === item.module)));
  assert.deepEqual(recommendActivities({ ...child, objectives: [] }, [], data, now), []);
});
test('family feedback only supports recommendations for its child and linked activity', () => {
  const data = emptyWorkspace();
  data.shares = [{ id: 's1', childId: 'lea', activityId: CATALOG[0].id }];
  data.feedback = [{ id: 'f1', childId: 'noah', shareId: 's1', participation: 'positive' }];
  assert.equal(recommendActivities(child, [], data, now)[0].reasons.some((reason) => reason.ref === 'f1'), false);
  data.feedback[0].childId = 'lea';
  assert.equal(recommendActivities(child, [], data, now).find((item) => item.id === CATALOG[0].id).reasons.some((reason) => reason.ref === 'f1'), true);
});
test('a precise objective theme ranks ahead of merely sharing its domain', () => {
  const profile = { ...child, objectives: [{ id: 'emotion', module: 'communicate', title: 'Reconnaître les émotions' }] };
  const recommendations = recommendActivities(profile, [], emptyWorkspace(), now);
  assert.equal(recommendations[0].id, 'reconnaitre-les-emotions');
  assert.ok(recommendations[0].reasons.some((reason) => reason.text.includes('catalogue éditorial')));
});
test('session validation rejects missing dates, objectives, activities and invalid durations', () => {
  for (const bad of [{ ...draft, start: '' }, { ...draft, objectiveIds: [] }, { ...draft, activities: [] }, { ...draft, activities: [{ ...draft.activities[0], minutes: 0 }] }]) assert.throws(() => makeSession(bad, child, now));
});
test('session outcome records plan versus actual without editing mini-game history', () => {
  const session = makeSession(draft, child, now);
  assert.throws(() => closeSession(session, {}));
  const completed = closeSession(session, { step1: { actualStatus: 'adapted', actualMinutes: 8, outcome: 'Support adapté.' } }, now);
  assert.equal(completed.activities[0].minutes, 5);
  assert.equal(completed.activities[0].actualMinutes, 8);
  assert.equal(child.history.length, 0);
  assert.throws(() => closeSession(completed, {}));
});
test('templates never copy real outcomes and do not copy another child’s objectives', () => {
  const session = closeSession(makeSession(draft, child, now), { step1: { actualStatus: 'done', participation: 'positive', actualMinutes: 8, outcome: 'Observation privée.' } }, now);
  const template = makeTemplate(session, 'Séance type');
  assert.equal(template.activities[0].outcome, undefined);
  const reused = applyTemplate(template, [{ id: 'otherGoal' }]);
  assert.deepEqual(reused.objectiveIds, []);
  assert.equal(reused.activities[0].actualStatus, '');
  assert.notEqual(reused.activities[0].id, session.activities[0].id);
});
test('timeline and added objectives are isolated by child', () => {
  const data = emptyWorkspace();
  data.goals = [{ id: 'custom', childId: 'noah' }];
  data.events = [{ id: 'event', childId: 'noah', text: 'Privé', createdAt: now.toISOString() }];
  assert.equal(goalsFor(child, data).length, 1);
  assert.equal(sharedTimeline(child, [], data).length, 0);
});
