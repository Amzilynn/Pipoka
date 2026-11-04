export const observationKey = (childId) => `bubliiEsmsObservationsV1:${childId}`;

export function readObservations(storage, childId) {
  const raw = storage.getItem(observationKey(childId));
  if (!raw) return [];
  const notes = JSON.parse(raw);
  if (!Array.isArray(notes) || !notes.every((note) =>
    note && typeof note.id === 'string' && note.childId === childId &&
    typeof note.text === 'string' && typeof note.author === 'string' &&
    typeof note.createdAt === 'string' && Number.isFinite(Date.parse(note.createdAt))
  )) throw new Error('Format des observations invalide');
  return notes;
}

export function createObservation(childId, draft, now = new Date()) {
  const author = (draft.author || '').trim();
  const text = (draft.text || '').trim();
  if (!author || !text) throw new Error('Indiquez votre nom et une observation avant d’enregistrer.');
  if (author.length > 80 || text.length > 1200 || (draft.nextStep || '').length > 400) {
    throw new Error('Le texte dépasse la longueur autorisée.');
  }
  return {
    id: crypto.randomUUID(), childId, author, text,
    objectiveId: draft.objectiveId || '',
    context: draft.context || 'Séance éducative',
    help: draft.help || 'Non précisée',
    nextStep: (draft.nextStep || '').trim(),
    createdAt: now.toISOString(), source: 'team',
  };
}

export function saveObservation(storage, childId, previous, observation) {
  if (observation.childId !== childId) throw new Error('Cette observation concerne un autre enfant.');
  const notes = [observation, ...previous];
  // Persist before announcing success, so a blocked/full storage keeps the draft.
  storage.setItem(observationKey(childId), JSON.stringify(notes));
  return notes;
}
