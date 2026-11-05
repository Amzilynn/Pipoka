import test from 'node:test';
import assert from 'node:assert/strict';
import { freshCountingProgress, recordCountingAttempt, createCountingRound, readCountingProgress, saveCountingProgress, countingStorageKey } from '../src/bublii/utils/countingProgress.js';
const attempt = (overrides = {}) => ({ correct: true, helpUsed: false, hadError: false, sessionId: 'first', ...overrides });
test('promotion needs six independent successes across visits', () => {
  let p = freshCountingProgress();
  for (let i = 0; i < 3; i++) p = recordCountingAttempt(p, attempt());
  assert.equal(p.level, 1);
  for (let i = 0; i < 3; i++) p = recordCountingAttempt(p, attempt({ sessionId: 'second' }));
  assert.equal(p.level, 2);
  assert.equal(p.successStreak, 0);
});
test('one visit, hints and corrections do not establish mastery', () => {
  let p = freshCountingProgress();
  for (let i = 0; i < 8; i++) p = recordCountingAttempt(p, attempt());
  assert.equal(p.level, 1);
  p = recordCountingAttempt(p, attempt({ helpUsed: true }));
  assert.equal(p.successStreak, 0);
  p = recordCountingAttempt(p, attempt({ hadError: true }));
  assert.equal(p.successStreak, 0);
});
test('two incorrect attempts simplify future rounds, levels stay bounded', () => {
  let p = { ...freshCountingProgress(), level: 2 };
  p = recordCountingAttempt(p, attempt({ correct: false }));
  assert.equal(p.level, 2);
  p = recordCountingAttempt(p, attempt({ correct: false }));
  assert.equal(p.level, 1);
  for (let i = 0; i < 10; i++) p = recordCountingAttempt(p, attempt({ correct: false }));
  assert.equal(p.level, 1);
  p = { ...freshCountingProgress(), level: 3 };
  for (let i = 0; i < 12; i++) p = recordCountingAttempt(p, attempt({ sessionId: String(i) }));
  assert.equal(p.level, 3);
});
test('every generated round has unique choices, correct answer, and the right range', () => {
  for (const [level, max, choices] of [[1, 3, 2], [2, 5, 3], [3, 10, 4]]) {
    for (let i = 0; i < 300; i++) {
      const r = createCountingRound(level);
      assert.ok(r.count >= 1 && r.count <= max);
      assert.equal(r.options.length, choices);
      assert.equal(new Set(r.options).size, choices);
      assert.ok(r.options.includes(r.count));
      assert.ok(r.options.every(n => n >= 1 && n <= max));
    }
  }
});
test('storage isolates children, survives reload, and handles unavailable or invalid data', () => {
  const items = new Map();
  const storage = { getItem: k => items.get(k), setItem: (k, v) => items.set(k, v) };
  const p = recordCountingAttempt(freshCountingProgress(), attempt());
  assert.equal(saveCountingProgress(storage, 'one', p), true);
  assert.deepEqual(readCountingProgress(storage, 'one'), p);
  assert.deepEqual(readCountingProgress(storage, 'two'), freshCountingProgress());
  items.set(countingStorageKey('one'), '{broken');
  assert.deepEqual(readCountingProgress(storage, 'one'), freshCountingProgress());
  const blocked = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  assert.deepEqual(readCountingProgress(blocked, 'one'), freshCountingProgress());
  assert.equal(saveCountingProgress(blocked, 'one', p), false);
});
test('attempt history is bounded and retains the most recent observations', () => {
  let p = freshCountingProgress();
  for (let i = 0; i < 210; i++) p = recordCountingAttempt(p, attempt({ answer: i }));
  assert.equal(p.attempts.length, 200);
  assert.equal(p.attempts[0].answer, 10);
  assert.equal(p.attempts.at(-1).answer, 209);
});
