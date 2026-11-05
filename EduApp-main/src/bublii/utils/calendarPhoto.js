export async function preparePhoto(file) {
  if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
    throw new Error('Choisis une photo de moins de 10 Mo.');
  }
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error('Cette photo ne peut pas être lue. Essaie une image JPEG ou PNG.'); }
  try {
    const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', 0.85);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob) throw new Error('Photo illisible. Essaie une autre photo.');
    return { image: data.split(',')[1], photo: blob };
  } finally { bitmap.close(); }
}

export async function checkPhoto(file, step, signal) {
  const prepared = await preparePhoto(file);
  const response = await fetch('/api/calendar/verify', {
    method: 'POST', signal, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: prepared.image, title: step.title, instruction: step.instruction }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'La vérification est indisponible. Réessaie avec un adulte.');
  if (!['verified', 'retry', 'uncertain'].includes(result.verdict)
    || typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1
    || typeof result.feedback !== 'string') throw new Error('La photo n’a pas pu être vérifiée. Réessaie.');
  return { photo: prepared.photo, verification: { ...result,
    verdict: result.verdict === 'verified' && result.confidence < 0.85 ? 'uncertain' : result.verdict,
    checkedAt: new Date().toISOString() } };
}
