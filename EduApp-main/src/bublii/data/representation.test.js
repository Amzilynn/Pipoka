import test from 'node:test';
import assert from 'node:assert/strict';
import { representativeHistory, seedDailyRoutines } from './representation.js';
import { mergeChildProfiles } from './childProfiles.js';
import { summarizeHistory } from '../parent/parentMetrics.js';
import { recordRoutineStep, routineDay } from '../premium/routines.js';

test('representative history fills charts once without replacing new game results', () => {
  const child = { id: 'peter', firstName: 'Peter', age: 7, presentationKey: 'peter' };
  const first = mergeChildProfiles([child]);
  assert.ok(summarizeHistory(first[0].history, 'week').total > 10);
  const length = first[0].history.length;
  first[0].history.unshift({ id: 'real-completion', module: 'learn', activityId: 'associer-mots-images', score: 3, completedAt: new Date().toISOString() });
  const second = mergeChildProfiles([child], first);
  assert.equal(second[0].history.length, length + 1);
  assert.equal(second[0].history[0].id, 'real-completion');
  assert.ok(representativeHistory(child).every(entry => entry.source === 'presentation'));
});

test('daily tasks remain actionable and are not re-created after editing or archiving', () => {
  const child = { id: 'peter', presentationKey: 'peter' };
  const initial = { version: 1, routines: [], progress: {} };
  const seeded = seedDailyRoutines(initial, [child]);
  assert.equal(seeded.routines.length, 3);
  const routine = seeded.routines[1];
  const progressed = recordRoutineStep(seeded, routine, child.id, routineDay(), 2);
  progressed.routines[0].archived = true;
  assert.equal(seedDailyRoutines(progressed, [child]), progressed);
  assert.equal(progressed.routines.length, 3);
});
