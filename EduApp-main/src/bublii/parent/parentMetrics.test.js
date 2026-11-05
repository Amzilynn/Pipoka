import test from 'node:test';
import assert from 'node:assert/strict';
import { completionDate, dayKey, summarizeHistory, formatGameScore } from './parentMetrics.js';

const now = new Date('2026-11-04T15:00:00Z');
const completion = (date, activityId = 'a', module = 'learn') => ({
  id: `h-${new Date(date).getTime()}`, activityId, module, score: 3, maxScore: 3,
});

test('empty and prefilled histories never become real results', () => {
  assert.equal(summarizeHistory([], 'all', now).total, 0);
  const result = summarizeHistory([{ id: 'h-1', score: 3, date: 'Aujourd’hui' }], 'all', now);
  assert.equal(result.total, 0);
  assert.equal(result.excluded, 1);
  assert.equal(completionDate({ id: 'h-invalid' }), null);
  assert.ok(result.days.every((day) => day.count === 0));
});

test('repeated games count as completions but not new activities or domains', () => {
  const result = summarizeHistory([
    completion('2026-11-04T10:00:00Z'), completion('2026-11-03T10:00:00Z'),
    completion('2026-11-02T10:00:00Z', 'b', 'grow'), { id: 'h-2' },
  ], 'all', now);
  assert.equal(result.total, 3);
  assert.equal(result.unique, 2);
  assert.equal(result.practicedDomains, 2);
  assert.deepEqual(result.domains.map((domain) => domain.count), [2, 0, 0, 1]);
});

test('week uses Paris calendar days and excludes future and old entries', () => {
  const result = summarizeHistory([
    completion('2026-10-28T23:30:00Z'), // 29 Oct in Paris: included
    completion('2026-10-28T20:00:00Z'),
    completion('2026-11-04T16:00:00Z'), // future
  ], 'week', now);
  assert.equal(result.total, 1);
  assert.equal(result.days[0].count, 1);
  assert.equal(result.days.reduce((sum, day) => sum + day.count, 0), 1);
});

test('calendar chart keeps seven distinct days across daylight saving', () => {
  const result = summarizeHistory([], 'all', new Date('2026-10-27T15:00:00Z'));
  assert.equal(new Set(result.days.map((day) => day.key)).size, 7);
  assert.equal(dayKey(new Date('2026-11-03T23:30:00Z')), '2026-11-04');
});

test('scores preserve zero and reject missing or inconsistent values', () => {
  assert.equal(formatGameScore({ score: 0, maxScore: 3 }), '0 / 3');
  for (const entry of [{}, { score: 4, maxScore: 3 }, { score: 0, maxScore: 0 }]) {
    assert.equal(formatGameScore(entry), 'Résultat indisponible');
  }
});

test('switching child data cannot retain another child’s counts', () => {
  assert.equal(summarizeHistory([completion('2026-11-04T10:00:00Z')], 'all', now).total, 1);
  assert.equal(summarizeHistory([{ id: 'h-4' }], 'all', now).total, 0);
});

test('dated demo games and new games share counts but retain their origin', () => {
  const result = summarizeHistory([
    { id: 'demo-lea-mots', source: 'demo', completedAt: '2026-11-03T10:00:00Z', activityId: 'a', module: 'learn' },
    { id: 'new-record', source: 'recorded', completedAt: now.toISOString(), activityId: 'a', module: 'learn' },
  ], 'all', now);
  assert.equal(result.total, 2);
  assert.equal(result.unique, 1);
  assert.equal(result.entries[0].source, 'recorded');
  assert.equal(result.entries[1].source, 'demo');
});
