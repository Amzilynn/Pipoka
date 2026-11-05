import test from 'node:test';
import assert from 'node:assert/strict';
import { registerChildAccess, readChildAccess, childForCode } from './childAccess.js';
import { matchFace } from './faceLogin.js';
const values = new Map();
globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
test('codes persist per child, select the correct child and rotate independently', () => {
  values.clear();
  const first = registerChildAccess({ id: 'first', firstName: 'First', settings: { audio: true }, behavior: 'private' });
  const second = registerChildAccess({ id: 'second', firstName: 'Second' });
  assert.match(first, /^\d{8}$/);
  assert.notEqual(first, second);
  assert.equal(registerChildAccess({ id: 'first', firstName: 'Updated' }), first);
  assert.equal(childForCode(`${first.slice(0, 4)} ${first.slice(4)}`), 'first');
  assert.equal(childForCode(second), 'second');
  assert.equal(readChildAccess().first.child.behavior, undefined);
  const rotated = registerChildAccess({ id: 'first', firstName: 'Updated' }, true);
  assert.notEqual(first, rotated);
  assert.equal(childForCode(first), null);
  assert.equal(childForCode(rotated), 'first');
  assert.equal(childForCode(second), 'second');
  assert.equal(childForCode('123'), null);
});
test('invalid device storage fails closed', () => {
  values.set('boblii-child-access-v1', '{broken');
  assert.deepEqual(readChildAccess(), {});
  assert.equal(childForCode('12345678'), null);
});
test('recognition selects a registered identity and rejects ambiguous or disallowed matches', () => {
  const sample = value => Array(128).fill(value);
  const record = value => ({ samples: [sample(value), sample(value), sample(value)] });
  assert.equal(matchFace(sample(0), { first: record(0), second: record(1) }, ['first', 'second']), 'first');
  assert.equal(matchFace(sample(1), { first: record(0), second: record(1) }, ['first', 'second']), 'second');
  assert.equal(matchFace(sample(0), { first: record(0) }, ['second']), null);
  assert.equal(matchFace(sample(0), { first: record(0), second: record(0) }, ['first', 'second']), null);
});
