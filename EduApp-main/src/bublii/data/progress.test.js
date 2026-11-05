import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITY_CATALOG, createDemoProfile, migrateProfiles, appendCompletion, readSavedProfiles, PROFILES_STORAGE_KEY } from './progress.js';

const now = new Date('2026-11-04T12:00:00Z');
const profile = { id: 'lea', settings: { audio: true }, avatar: {},
  moduleProgress: Object.fromEntries(Object.keys(ACTIVITY_CATALOG).map((module) => [module, { completedCount: 2 }])),
};

test('demo history matches the distinct progress in every domain', () => {
  const demo = createDemoProfile(profile, now);
  assert.equal(demo.history.length, 8);
  assert.ok(demo.history.every((entry) => entry.source === 'demo' && new Date(entry.completedAt) < now));
  assert.ok(Object.values(demo.moduleProgress).every((progress) => progress.completedCount === 2));
});

test('replaying increases history but never inflates discovery bars; a new game does', () => {
  const demo = createDemoProfile(profile, now);
  const completion = { activityId: 'associer-mots-images', module: 'learn', label: 'Mots', score: 0, maxScore: 3 };
  const replay = appendCompletion(demo, completion, now);
  assert.equal(replay.history.length, 9);
  assert.equal(replay.history[0].score, 0);
  assert.equal(replay.history[0].source, 'recorded');
  assert.equal(replay.moduleProgress.learn.completedCount, 2);
  const next = appendCompletion(replay, { ...completion, activityId: 'compter-des-objets' }, now);
  assert.equal(next.moduleProgress.learn.completedCount, 3);
  assert.notEqual(next.history[0].id, next.history[1].id);
});

test('migration preserves previous settings and real games, replaces legacy examples', () => {
  const legacy = { ...profile, settings: { audio: false }, history: [
    { id: 'h-1', activityId: 'fake' },
    { id: `h-${now.getTime()}`, activityId: 'compter-des-objets', module: 'learn', score: 2 },
  ] };
  const migrated = migrateProfiles([profile], [legacy], now)[0];
  assert.equal(migrated.settings.audio, false);
  assert.equal(migrated.history.length, 9);
  assert.equal(migrated.history.filter((entry) => entry.source === 'recorded').length, 1);
  assert.equal(migrated.moduleProgress.learn.completedCount, 3);
});

test('saved demo dates do not move when restored later and malformed storage is ignored', () => {
  const demo = createDemoProfile(profile, now);
  const storage = { getItem: (key) => key === PROFILES_STORAGE_KEY ? JSON.stringify([demo]) : null };
  assert.equal(readSavedProfiles(storage)[0].history[0].completedAt, demo.history[0].completedAt);
  assert.equal(readSavedProfiles({ getItem: () => 'invalid json' }), null);
  assert.equal(readSavedProfiles({ getItem: () => '[{}]' }), null);
  assert.equal(readSavedProfiles({ getItem: () => { throw new Error('blocked'); } }), null);
});

test('history continues beyond ten entries and complete paths remain replayable', () => {
  let current = createDemoProfile({ ...profile, moduleProgress: Object.fromEntries(Object.keys(ACTIVITY_CATALOG).map((module) => [module, { completedCount: 4 }])) }, now);
  for (let index = 0; index < 12; index++) current = appendCompletion(current, { activityId: 'associer-mots-images', module: 'learn', score: 3 }, now);
  assert.equal(current.history.length, 28);
  assert.equal(current.moduleProgress.learn.completedCount, 4);
});
