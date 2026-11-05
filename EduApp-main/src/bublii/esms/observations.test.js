import test from 'node:test';
import assert from 'node:assert/strict';
import { createObservation, readObservations, saveObservation } from './observations.js';

const memory = () => {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
const draft = { author: ' Camille ', text: ' A demandé une pause avec une image. ', objectiveId: 'obj-1', help: 'Indice visuel', nextStep: ' Reproposer le support. ' };

test('saves an attributed observation and restores it without inferring a score', () => {
  const storage = memory();
  const note = createObservation('lea', draft, new Date('2026-11-04T12:00:00Z'));
  saveObservation(storage, 'lea', [], note);
  assert.equal(readObservations(storage, 'lea')[0].author, 'Camille');
  assert.equal(note.text, 'A demandé une pause avec une image.');
  assert.equal(note.nextStep, 'Reproposer le support.');
  assert.equal(note.source, 'team');
  assert.equal(note.score, undefined);
  assert.equal(note.objectiveId, 'obj-1');
});

test('observations are isolated by child, including after reopening', () => {
  const storage = memory();
  saveObservation(storage, 'lea', [], createObservation('lea', draft));
  assert.deepEqual(readObservations(storage, 'noah'), []);
  assert.equal(readObservations(storage, 'lea').length, 1);
  assert.throws(() => saveObservation(storage, 'noah', [], createObservation('lea', draft)));
});

test('blank or oversized observations are rejected', () => {
  assert.throws(() => createObservation('lea', { author: ' ', text: 'Texte' }));
  assert.throws(() => createObservation('lea', { author: 'Camille', text: ' ' }));
  assert.throws(() => createObservation('lea', { ...draft, text: 'x'.repeat(1201) }));
});

test('unavailable storage never reports a successful save or changes existing notes', () => {
  const previous = [];
  assert.throws(() => saveObservation({ setItem() { throw new Error('quota'); } }, 'lea', previous, createObservation('lea', draft)));
  assert.deepEqual(previous, []);
});

test('corrupt storage and wrong child records are detected', () => {
  assert.throws(() => readObservations({ getItem: () => 'bad json' }, 'lea'));
  assert.throws(() => readObservations({ getItem: () => JSON.stringify([createObservation('noah', draft)]) }, 'lea'));
});
