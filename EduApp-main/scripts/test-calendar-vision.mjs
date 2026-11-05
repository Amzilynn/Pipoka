import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { parseVerification, verifyPhoto, calendarVisionPlugin } from '../services/calendarVision.mjs';

test('only confident positive evidence passes', () => {
  assert.equal(parseVerification({ verdict: 'verified', confidence: 0.94, feedback: 'Bravo !' }).verdict, 'verified');
  assert.equal(parseVerification({ verdict: 'verified', confidence: 0.84, feedback: 'Pas bien visible.' }).verdict, 'uncertain');
  for (const verdict of ['retry', 'uncertain']) {
    assert.equal(parseVerification({ verdict, confidence: 0.99, feedback: 'Montre le cahier dans le sac.' }).verdict, verdict);
  }
});

test('invalid model output cannot complete a step', () => {
  for (const value of ['not json', '{}', null, { verdict: 'verified', confidence: 2, feedback: 'ok' },
    { verdict: 'verified', confidence: '0.99', feedback: 'ok' },
    { verdict: 'verified', confidence: 0.99, feedback: '' }]) {
    assert.throws(() => parseVerification(value));
  }
});

test('photo and spatial requirements reach the vision model', async () => {
  let request;
  const result = await verifyPhoto({ image: 'encoded-photo', title: 'Cahier dans le sac', instruction: 'Cahier visible dans le sac ouvert' },
    { host: 'http://localhost:11434/', model: 'test-vision', fetcher: async (url, options) => {
      assert.equal(url, 'http://localhost:11434/api/chat'); request = JSON.parse(options.body);
      return { ok: true, json: async () => ({ message: { content: JSON.stringify({ verdict: 'retry', confidence: 0.98, feedback: 'Mets le cahier dans le sac.' }) } }) };
    } });
  assert.deepEqual(request.messages[1].images, ['encoded-photo']);
  assert.match(request.messages[0].content, /NEXT TO a bag is NOT inside/);
  assert.equal(request.model, 'test-vision');
  assert.equal(request.format.properties.verdict.type, 'string');
  assert.equal(result.verdict, 'retry');
});

test('offline and malformed model services reject verification', async () => {
  const payload = { image: 'photo', title: 'Sac', instruction: 'Fermer' };
  await assert.rejects(verifyPhoto(payload, { host: 'http://localhost', model: 'test',
    fetcher: async () => ({ ok: false }) }));
  await assert.rejects(verifyPhoto(payload, { host: 'http://localhost', model: 'test',
    fetcher: async () => ({ ok: true, json: async () => ({ message: { content: '{}' } }) }) }));
});

test('HTTP route validates method, payload, size and unavailable service', async () => {
  let middleware;
  calendarVisionPlugin({ host: 'http://127.0.0.1:1', model: 'missing' }).configureServer({
    middlewares: { use(handler) { middleware = handler; } },
  });
  const server = createServer((req, res) => middleware(req, res, () => { res.writeHead(404); res.end(); }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/calendar/verify`;
  try {
    assert.equal((await fetch(url)).status, 405);
    assert.equal((await fetch(url, { method: 'POST', body: '{' })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', body: JSON.stringify({ image: 'bad', title: 'Sac', instruction: '' }) })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', body: 'x'.repeat(3 * 1024 * 1024 + 1) })).status, 413);
    const response = await fetch(url, { method: 'POST', body: JSON.stringify({ image: 'a'.repeat(30), title: 'Sac', instruction: 'Ferme le sac' }) });
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /indisponible/);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
