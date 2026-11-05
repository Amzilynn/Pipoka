import test from 'node:test';
import assert from 'node:assert/strict';
import { makeRoutine, recordRoutineStep, routineDay, routineKey, routinesOn } from './routines.js';
const draft = { title: 'Mon sac', steps: 'Je prends mon cahier.\nJe ferme mon sac.', repeat: 'daily', date: '', icon: '🎒' };
test('routine creation validates short steps and scheduled dates', () => {
  const r = makeRoutine(draft, 'lea', 'parent');
  assert.equal(r.steps.length, 2);
  assert.throws(() => makeRoutine({ ...draft, steps: '' }, 'lea', 'parent'));
  assert.throws(() => makeRoutine({ ...draft, steps: Array(16).fill('Faire une étape') }, 'lea', 'parent'));
  assert.throws(() => makeRoutine({ ...draft, repeat: 'once', date: '2026-02-30' }, 'lea', 'parent'));
});
test('calendar separates children, dates and archived routines', () => {
  const r = makeRoutine({ ...draft, repeat: 'once', date: routineDay() }, 'lea', 'esms');
  assert.equal(routinesOn([r], 'lea', routineDay()).length, 1);
  assert.equal(routinesOn([r], 'noah', routineDay()).length, 0);
  assert.equal(routinesOn([r], 'lea', '2020-01-01').length, 0);
  assert.equal(routinesOn([{ ...r, archived: true }], 'lea', routineDay()).length, 0);
});
test('checked steps persist per day and cannot be recorded for another child or a future date', () => {
  const r = makeRoutine(draft, 'lea', 'parent');
  const data = { routines: [r], progress: {} };
  const next = recordRoutineStep(data, r, 'lea', routineDay(), 1);
  assert.equal(next.progress[routineKey(r, routineDay())], 1);
  assert.equal(next.progress[routineKey(r, '2020-01-01')], undefined);
  assert.equal(data.progress[routineKey(r, routineDay())], undefined);
  assert.throws(() => recordRoutineStep(data, r, 'noah', routineDay(), 1));
  assert.throws(() => recordRoutineStep(data, r, 'lea', '2999-01-01', 1));
  assert.throws(() => recordRoutineStep(data, r, 'lea', routineDay(), 3));
});
test('editing keeps identity and resets step tracking without mutating past records', () => {
  const r = makeRoutine(draft, 'lea', 'parent');
  const edited = makeRoutine({ ...draft, steps: 'Une nouvelle étape.' }, 'lea', 'esms', r);
  assert.equal(edited.id, r.id);
  assert.notEqual(routineKey(edited, routineDay()), routineKey(r, routineDay()));
});
