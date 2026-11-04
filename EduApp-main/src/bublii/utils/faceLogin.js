const STORAGE = 'bublii-face-profiles-v1';
let loading;
export async function loadFaceEngine() {
  if (!loading) loading = (async () => {
    const root = `${import.meta.env.BASE_URL}assets/face-login/`;
    const api = await import(/* @vite-ignore */ `${root}dist/face-api.esm.js`);
    try { await api.tf.ready(); } catch { await api.tf.setBackend('cpu'); await api.tf.ready(); }
    await Promise.all([
      api.nets.tinyFaceDetector.loadFromUri(`${root}model`),
      api.nets.faceLandmark68TinyNet.loadFromUri(`${root}model`),
      api.nets.faceRecognitionNet.loadFromUri(`${root}model`),
    ]);
    return api;
  })().catch(error => { loading = null; throw error; });
  return loading;
}
export function readFaces() {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE)) || {};
    return Object.fromEntries(Object.entries(records).filter(([, record]) =>
      record && Array.isArray(record.samples) && record.samples.length === 3 && record.samples.every(sample =>
        Array.isArray(sample) && sample.length === 128 && sample.every(Number.isFinite))));
  } catch { return {}; }
}
export function saveFace(id, samples) {
  if (samples.length !== 3 || samples.some(sample => sample.length !== 128 || !Array.from(sample).every(Number.isFinite))) throw new Error('Invalid samples');
  const records = readFaces();
  records[id] = { samples: samples.map(sample => Array.from(sample)), createdAt: new Date().toISOString() };
  localStorage.setItem(STORAGE, JSON.stringify(records));
}
export function removeFace(id) {
  const records = readFaces(); delete records[id];
  localStorage.setItem(STORAGE, JSON.stringify(records));
}
export function distance(a, b) {
  if (a.length !== 128 || b.length !== 128) return Infinity;
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}
export function matchFace(descriptor, records, allowedIds) {
  const matches = Object.entries(records).filter(([id]) => allowedIds.includes(id))
    .map(([id, record]) => ({ id, score: Math.min(...record.samples.map(sample => distance(descriptor, sample))) }))
    .sort((a, b) => a.score - b.score);
  const best = matches[0];
  // Reject uncertain and ambiguous matches rather than choosing an arbitrary profile.
  return best && best.score < 0.45 && (!matches[1] || matches[1].score - best.score > 0.08) ? best.id : null;
}
export async function detectFace(api, video) {
  const detect = () => api.detectAllFaces(video, new api.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.6 })).withFaceLandmarks(true).withFaceDescriptors();
  try { return await detect(); } catch (error) {
    if (api.tf.getBackend() === 'cpu') throw error;
    await api.tf.setBackend('cpu'); await api.tf.ready();
    return detect();
  }
}

