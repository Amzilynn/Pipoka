import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createAuthService } from './auth.mjs';

async function fixture(t, options = {}) {
  const service = createAuthService({ databasePath: ':memory:', rateLimit: 100, ...options });
  const server = createServer((req, res) => service.handle(req, res));
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); service.close(); });
  async function call(path, input, cookie, headers = {}) {
    const response = await fetch(origin + (path.startsWith('/') ? path : '/api/auth/' + path), { method: input === undefined ? 'GET' : 'POST',
      headers: { Origin: origin, ...(input === undefined ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}), ...headers },
      body: input === undefined ? undefined : JSON.stringify(input) });
    return { status: response.status, data: response.headers.get('content-type')?.includes('application/json') ? await response.json() : Buffer.from(await response.arrayBuffer()), cookie: response.headers.get('set-cookie'), headers: response.headers };
  }
  return { call, origin };
}
const account = (role = 'parent') => ({ name: 'Test Account', email: 'parent@example.test', password: 'a long secret phrase!', role });

test('signup persists a hashed password and session across service restarts', async t => {
  const path = join(tmpdir(), `boblii-auth-test-${randomUUID()}.sqlite`);
  const first = await fixture(t, { databasePath: path });
  const signup = await first.call('signup', account());
  assert.equal(signup.status, 201);
  assert.equal(signup.data.user.role, 'parent');
  assert.deepEqual(Object.keys(signup.data.user).sort(), ['email', 'id', 'name', 'role']);
  assert.match(signup.cookie, /HttpOnly; SameSite=Strict/);
  const db = new DatabaseSync(path);
  const saved = db.prepare('SELECT * FROM users').get();
  assert.notEqual(saved.password_hash, account().password);
  assert.equal(saved.password_hash.length, 128);
  const token = signup.cookie.split(';')[0].split('=')[1];
  assert.notEqual(db.prepare('SELECT token_hash FROM sessions').get().token_hash, token);
  db.close();
  const persistedChild = await first.call('/api/children', { firstName: 'Persistent child', age: 7 }, signup.cookie);
  assert.equal(persistedChild.status, 201);
  const persistedProfile = await first.call(`/api/children/${persistedChild.data.child.id}/profile`, { firstName: 'Persistent child', age: 7, revision: 0, behavior: 'Persistent behavior', interests: 'Music' }, signup.cookie);
  assert.equal(persistedProfile.status, 200);
  const second = await fixture(t, { databasePath: path });
  t.after(() => { for (const file of [path, path + '-wal', path + '-shm']) rmSync(file, { force: true }); });
  assert.equal((await second.call('session', undefined, signup.cookie)).data.user.id, signup.data.user.id);
  assert.equal((await second.call('/api/children', undefined, signup.cookie)).data.children[0].id, persistedChild.data.child.id);
  assert.equal((await second.call('/api/children', undefined, signup.cookie)).data.children[0].behavior, 'Persistent behavior');
});

test('wrong passwords, wrong roles and forged session cookies are rejected', async t => {
  const { call } = await fixture(t);
  await call('signup', account());
  assert.equal((await call('login', { ...account(), password: 'incorrect password' })).status, 401);
  assert.equal((await call('login', { ...account(), role: 'specialiste' })).status, 401);
  assert.equal((await call('session', undefined, 'boblii_session=' + 'a'.repeat(64))).data.user, null);
  const login = await call('login', account());
  assert.equal(login.status, 200);
  assert.equal((await call('session', undefined, login.cookie)).data.user.role, 'parent');
});

test('sessions rotate on login and are revoked by logout', async t => {
  const { call } = await fixture(t);
  const signup = await call('signup', account('specialiste'));
  const login = await call('login', account('specialiste'), signup.cookie);
  assert.notEqual(login.cookie, signup.cookie);
  assert.equal((await call('session', undefined, signup.cookie)).data.user, null);
  assert.equal((await call('session', undefined, login.cookie)).data.user.role, 'specialiste');
  const logout = await call('logout', {}, login.cookie);
  assert.equal(logout.status, 200);
  assert.match(logout.cookie, /Max-Age=0/);
  assert.equal((await call('session', undefined, login.cookie)).data.user, null);
});

test('signup validates input, roles, duplicates and normalizes emails', async t => {
  const { call } = await fixture(t);
  for (const invalid of [{ role: 'admin' }, { password: 'short' }, { email: 'invalid' }, { name: '' }]) {
    assert.equal((await call('signup', { ...account(), ...invalid })).status, 400);
  }
  assert.equal((await call('signup', { ...account(), email: ' PARENT@EXAMPLE.TEST ' })).status, 201);
  assert.equal((await call('signup', account())).status, 409);
  assert.equal((await call('login', account())).status, 200);
});

test('cross-origin and non-JSON mutations are refused', async t => {
  const { call } = await fixture(t);
  assert.equal((await call('signup', account(), null, { Origin: 'https://attacker.invalid' })).status, 403);
  assert.equal((await call('signup', account(), null, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal((await call('signup', account(), null, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await call('logout', {}, null, { Origin: '' })).status, 403);
});

test('expired sessions cannot restore an account', async t => {
  const { call } = await fixture(t, { sessionMs: -1 });
  const signup = await call('signup', account());
  assert.equal((await call('session', undefined, signup.cookie)).data.user, null);
});

test('repeated attempts are rate limited', async t => {
  const { call } = await fixture(t, { rateLimit: 2 });
  await call('login', account()); await call('login', account());
  const limited = await call('login', account());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '900');
});


test('children require a valid session and validate names and ages', async t => {
  const { call } = await fixture(t);
  assert.equal((await call('/api/children')).status, 401);
  const signup = await call('signup', account());
  const cookie = signup.cookie;
  for (const input of [{ firstName: '' }, { firstName: 'x'.repeat(61) }, { firstName: 'Test', age: -1 }, { firstName: 'Test', age: 3.5 }, { firstName: 'Test', age: '5' }]) {
    assert.equal((await call('/api/children', input, cookie)).status, 400);
  }
  assert.equal((await call('/api/children', { firstName: 'Test' }, cookie, { Origin: 'https://attacker.invalid' })).status, 403);
});

test('specialists can keep multiple children while parents are limited to their own child', async t => {
  const { call } = await fixture(t);
  const specialist = await call('signup', account('specialiste'));
  const first = await call('/api/children', { firstName: 'Alice', age: 6 }, specialist.cookie);
  const second = await call('/api/children', { firstName: 'Sam', age: null }, specialist.cookie);
  assert.equal(first.status, 201); assert.equal(second.status, 201);
  assert.notEqual(first.data.child.id, second.data.child.id);
  assert.equal((await call('/api/children', undefined, specialist.cookie)).data.children.length, 2);
  const parent = await call('signup', account());
  assert.deepEqual((await call('/api/children', undefined, parent.cookie)).data.children, []);
  const own = await call('/api/children', { firstName: 'Peter', age: 7 }, parent.cookie);
  assert.equal(own.status, 201);
  assert.equal((await call('/api/children', { firstName: 'Another child' }, parent.cookie)).status, 409);
  assert.equal((await call('/api/children', undefined, parent.cookie)).data.children.length, 1);
  assert.equal((await call(`/api/children/${first.data.child.id}/invitation`, {}, parent.cookie)).status, 404);
  assert.equal((await call(`/api/children/${first.data.child.id}/profile`, { firstName: 'Not mine', age: 7, revision: 0 }, parent.cookie)).status, 404);
});

test('one-use invitations link the same child to an opposite-role adult only', async t => {
  const { call } = await fixture(t);
  const parent = await call('signup', account());
  const child = (await call('/api/children', { firstName: 'Alice', age: 6 }, parent.cookie)).data.child;
  const invite = await call(`/api/children/${child.id}/invitation`, {}, parent.cookie);
  assert.equal(invite.status, 201);
  assert.equal(invite.data.targetRole, 'specialiste');
  const anotherParent = await call('signup', { ...account(), email: 'other-parent@example.test' });
  assert.equal((await call('/api/children/associate', { code: invite.data.code }, anotherParent.cookie)).status, 400);
  const specialist = await call('signup', account('specialiste'));
  const associated = await call('/api/children/associate', { code: invite.data.code.toLowerCase() }, specialist.cookie);
  assert.equal(associated.status, 200); assert.equal(associated.data.childId, child.id);
  assert.equal(associated.data.children[0].id, child.id);
  assert.equal(associated.data.children[0].canInvite, false);
  assert.equal((await call(`/api/children/${child.id}/invitation`, {}, specialist.cookie)).status, 404);
  const secondSpecialist = await call('signup', { ...account('specialiste'), email: 'second@example.test' });
  assert.equal((await call('/api/children/associate', { code: invite.data.code }, secondSpecialist.cookie)).status, 400);
  assert.equal((await call('/api/children', undefined, parent.cookie)).data.children.length, 1);
});

test('regenerated invitations invalidate old codes and duplicates do not add a child twice', async t => {
  const { call } = await fixture(t);
  const specialist = await call('signup', account('specialiste'));
  const child = (await call('/api/children', { firstName: 'Sam', age: 0 }, specialist.cookie)).data.child;
  const old = await call(`/api/children/${child.id}/invitation`, {}, specialist.cookie);
  const current = await call(`/api/children/${child.id}/invitation`, {}, specialist.cookie);
  const parent = await call('signup', account());
  assert.equal((await call('/api/children/associate', { code: old.data.code }, parent.cookie)).status, 400);
  assert.equal((await call('/api/children/associate', { code: current.data.code }, parent.cookie)).status, 200);
  const repeated = await call(`/api/children/${child.id}/invitation`, {}, specialist.cookie);
  assert.equal((await call('/api/children/associate', { code: repeated.data.code }, parent.cookie)).status, 409);
  assert.equal((await call('/api/children', undefined, parent.cookie)).data.children.length, 1);
});


test('child profile edits and private photos are shared only with linked adults', async t => {
  const { call } = await fixture(t);
  const parent = await call('signup', account());
  const specialist = await call('signup', account('specialiste'));
  const stranger = await call('signup', { ...account(), email: 'stranger@example.test' });
  const child = (await call('/api/children', { firstName: 'Alice', age: 6 }, parent.cookie)).data.child;
  const invite = await call(`/api/children/${child.id}/invitation`, {}, parent.cookie);
  await call('/api/children/associate', { code: invite.data.code }, specialist.cookie);
  const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=';
  const profile = { firstName: 'Alice', lastName: 'Test', age: 7, revision: 0, behavior: 'Needs time in groups.', strengths: ['Pictures', 'Music'], supportNeeds: ['One instruction at a time'], interests: 'Books', communication: 'Words and gestures', calmingStrategies: 'Quiet space', notes: 'Prefers a predictable routine.', photo };
  const saved = await call(`/api/children/${child.id}/profile`, profile, parent.cookie);
  assert.equal(saved.status, 200); assert.equal(saved.data.child.revision, 1);
  const linked = (await call('/api/children', undefined, specialist.cookie)).data.children[0];
  assert.equal(linked.lastName, 'Test'); assert.equal(linked.age, 7); assert.equal(linked.behavior, profile.behavior);
  assert.deepEqual(linked.strengths, profile.strengths);
  const url = saved.data.child.photoUrl;
  const image = await call(url, undefined, specialist.cookie);
  assert.equal(image.status, 200); assert.equal(image.headers.get('content-type'), 'image/png');
  assert.ok(image.data.equals(Buffer.from(photo.split(',')[1], 'base64')));
  assert.equal((await call(url)).status, 401);
  assert.equal((await call(url, undefined, stranger.cookie)).status, 404);
  assert.equal((await call(`/api/children/${child.id}/profile`, profile, stranger.cookie)).status, 404);
  const conflict = await call(`/api/children/${child.id}/profile`, { ...profile, behavior: 'stale edit' }, specialist.cookie);
  assert.equal(conflict.status, 409);
  const changed = await call(`/api/children/${child.id}/profile`, { ...linked, behavior: 'Updated by specialist', photo: null }, specialist.cookie);
  assert.equal(changed.status, 200); assert.equal(changed.data.child.photoUrl, null);
  assert.equal((await call(url, undefined, parent.cookie)).status, 404);
  assert.equal((await call('/api/children', undefined, parent.cookie)).data.children[0].behavior, 'Updated by specialist');
});

test('profile edits reject invalid photos, excessive fields and invalid versions', async t => {
  const { call } = await fixture(t);
  const parent = await call('signup', account());
  const child = (await call('/api/children', { firstName: 'Sam' }, parent.cookie)).data.child;
  const base = { firstName: 'Sam', age: null, revision: 0 };
  for (const bad of [{ photo: 'https://example.test/image.jpg' }, { photo: 'data:image/svg+xml;base64,PHN2Zz4=' }, { photo: 'data:image/png;base64,YmFk' }, { behavior: 'x'.repeat(2001) }, { strengths: [123] }, { revision: -1 }, { firstName: '' }]) {
    assert.equal((await call(`/api/children/${child.id}/profile`, { ...base, ...bad }, parent.cookie)).status, 400);
  }
  const saved = await call(`/api/children/${child.id}/profile`, { ...base, notes: 'x'.repeat(2000), behavior: 'x'.repeat(2000), interests: 'x'.repeat(1000), communication: 'x'.repeat(1000), calmingStrategies: 'x'.repeat(1000), strengths: ['y'.repeat(3000), ...Array.from({ length: 25 }, (_, index) => `Point ${index}: ${'a'.repeat(200)}`)], supportNeeds: ['z'.repeat(3000)] }, parent.cookie);
  assert.equal(saved.status, 200);
  assert.equal(saved.data.child.strengths.length, 26);
  assert.equal(saved.data.child.strengths[0].length, 3000);
  assert.equal(saved.data.child.supportNeeds[0].length, 3000);
});


test('representative rosters are private, idempotent and keep existing profile information', async t => {
  const { call } = await fixture(t);
  const parent = await call('signup', account());
  const peter = (await call('/api/children', { firstName: 'Peter Can', age: 8 }, parent.cookie)).data.child;
  await call(`/api/children/${peter.id}/profile`, { firstName: 'Peter Can', age: 8, revision: 0, behavior: 'My own note' }, parent.cookie);
  const family = await call('/api/children/representation', {}, parent.cookie);
  assert.equal(family.status, 200); assert.equal(family.data.children.length, 1);
  assert.equal(family.data.children[0].id, peter.id); assert.equal(family.data.children[0].behavior, 'My own note');
  assert.equal(family.data.children[0].presentationKey, 'peter');
  const specialist = await call('signup', account('specialiste'));
  const roster = await call('/api/children/representation', {}, specialist.cookie);
  assert.equal(roster.data.children.length, 4);
  assert.deepEqual(roster.data.children.map(child => child.firstName).sort(), ['Amir', 'Emma', 'Noah', 'Peter']);
  const repeat = await call('/api/children/representation', {}, specialist.cookie);
  assert.deepEqual(repeat.data.children.map(child => child.id), roster.data.children.map(child => child.id));
  assert.equal((await call('/api/children', undefined, parent.cookie)).data.children.length, 1);
  assert.equal((await call(`/api/children/${roster.data.children[0].id}/profile`, { firstName: 'No access', age: 7, revision: 0 }, parent.cookie)).status, 404);
});
