import test from 'node:test';
import assert from 'node:assert/strict';
import { openCamera, cameraErrorMessage } from '../src/bublii/utils/loginCamera.js';

test('camera starts without any enrolled face', async () => {
  let requested = false;
  const stream = { getTracks: () => [] };
  const result = await openCamera({ secure: true, mediaDevices: { getUserMedia: async options => { requested = true; assert.equal(options.audio, false); return stream; } } });
  assert.equal(requested, true); assert.equal(result, stream);
});
test('unsupported and insecure contexts give distinct errors', async () => {
  await assert.rejects(openCamera({ secure: false, mediaDevices: {} }), { name: 'InsecureContextError' });
  await assert.rejects(openCamera({ secure: true, mediaDevices: {} }), { name: 'UnsupportedCameraError' });
});
test('permission and busy-camera failures are preserved', async () => {
  for (const name of ['NotAllowedError', 'NotReadableError', 'NotFoundError']) {
    await assert.rejects(openCamera({ secure: true, mediaDevices: { getUserMedia: async () => { throw new DOMException('camera error', name); } } }), { name });
  }
  assert.notEqual(cameraErrorMessage({ name: 'NotAllowedError' }), cameraErrorMessage({ name: 'NotReadableError' }));
});
test('unsupported constraints retry with any camera', async () => {
  let calls = 0;
  const stream = { getTracks: () => [] };
  assert.equal(await openCamera({ secure: true, mediaDevices: { getUserMedia: async options => { if (++calls === 1) throw new DOMException('constraint', 'OverconstrainedError'); assert.equal(options.video, true); return stream; } } }), stream);
  assert.equal(calls, 2);
});
test('a late camera is released after cancellation', async () => {
  const controller = new AbortController(); let complete; let stopped = false;
  const result = openCamera({ secure: true, signal: controller.signal, mediaDevices: { getUserMedia: () => new Promise(resolve => { complete = resolve; }) } });
  controller.abort(); await assert.rejects(result, { name: 'AbortError' });
  complete({ getTracks: () => [{ stop: () => { stopped = true; } }] });
  await new Promise(resolve => setImmediate(resolve)); assert.equal(stopped, true);
});
test('unanswered permission request times out and releases a late camera', async () => {
  let complete; let stopped = false;
  const result = openCamera({ secure: true, timeout: 5, mediaDevices: { getUserMedia: () => new Promise(resolve => { complete = resolve; }) } });
  await assert.rejects(result, { name: 'TimeoutError' });
  complete({ getTracks: () => [{ stop: () => { stopped = true; } }] });
  await new Promise(resolve => setImmediate(resolve)); assert.equal(stopped, true);
});
