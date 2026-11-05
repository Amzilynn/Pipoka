import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeChildProfiles } from './childProfiles.js';

test('new children start empty and switching lists preserves only matching child progress', () => {
  const children = [{ id: 'a', firstName: 'Alice', age: 6 }, { id: 'b', firstName: 'Sam', age: null }];
  const first = mergeChildProfiles(children);
  assert.deepEqual(first.map(child => child.history), [[], []]);
  first[0].settings.audio = false;
  first[0].history = [{ id: 'h-1', activityId: 'associer-mots-images', module: 'learn', score: 2, label: 'Mots', completedAt: '2026-11-05T10:00:00Z' }];
  const restored = mergeChildProfiles(children.toReversed(), first);
  assert.equal(restored[0].id, 'b'); assert.equal(restored[0].settings.audio, true); assert.deepEqual(restored[0].history, []);
  assert.equal(restored[1].id, 'a'); assert.equal(restored[1].settings.audio, false); assert.equal(restored[1].moduleProgress.learn.completedCount, 1);
  assert.equal(mergeChildProfiles([children[1]], first).length, 1);
});


test('shared profile fields replace cached descriptions without resetting local progress', () => {
  const saved = [{ id: 'a', firstName: 'Old', strengths: ['Old'], supportNeeds: ['Old'], history: [], settings: { audio: false } }];
  const [profile] = mergeChildProfiles([{ id: 'a', firstName: 'New', age: 7, strengths: ['Music'], supportNeeds: [], behavior: 'Waits before joining.', photoUrl: '/api/children/a/photo?v=1', revision: 1 }], saved);
  assert.equal(profile.firstName, 'New'); assert.equal(profile.avatar.initial, 'N');
  assert.deepEqual(profile.strengths, ['Music']); assert.deepEqual(profile.supportNeeds, []);
  assert.equal(profile.settings.audio, false); assert.equal(profile.behavior, 'Waits before joining.');
  assert.equal(profile.photoUrl, '/api/children/a/photo?v=1');
});
