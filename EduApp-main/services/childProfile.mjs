const textFields = { lastName: 60, behavior: 2000, interests: 1000, communication: 1000, calmingStrategies: 1000, notes: 2000 };
export function validateProfile(input) {
  const firstName = typeof input.firstName === 'string' ? input.firstName.trim() : '';
  const age = input.age === null || input.age === '' || input.age === undefined ? null : input.age;
  if (!firstName || firstName.length > 60 || /[<>\x00-\x1f]/.test(firstName) || (age !== null && (!Number.isInteger(age) || age < 0 || age > 25))) throw new Error('Vérifiez le prénom et l’âge (0 à 25 ans, facultatif).');
  if (!Number.isSafeInteger(input.revision) || input.revision < 0) throw new Error('Actualisez le profil avant de l’enregistrer.');
  const details = {};
  for (const [key, max] of Object.entries(textFields)) {
    if (input[key] !== undefined && typeof input[key] !== 'string') throw new Error('Un champ du profil est invalide.');
    const value = (input[key] || '').trim();
    if (value.length > max) throw new Error(`Le champ ${key} dépasse ${max} caractères.`);
    details[key] = value;
  }
  for (const key of ['strengths', 'supportNeeds']) {
    const items = input[key] ?? [];
    if (!Array.isArray(items) || items.some(item => typeof item !== 'string')) throw new Error('Le texte des points d’appui ou des besoins est invalide.');
    details[key] = [...new Set(items.map(item => item.trim()).filter(Boolean))];
  }
  let photo;
  if (input.photo === null) photo = { data: null, mime: null };
  else if (input.photo !== undefined) {
    if (typeof input.photo !== 'string' || input.photo.length > 360000) throw new Error('La photo est trop volumineuse.');
    const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(input.photo);
    if (!match) throw new Error('Choisissez une photo JPEG, PNG ou WebP.');
    const data = Buffer.from(match[2], 'base64');
    const valid = match[1] === 'image/jpeg' ? data.length >= 4 && data[0] === 255 && data[1] === 216 && data[2] === 255 && data.at(-2) === 255 && data.at(-1) === 217 : match[1] === 'image/png' ? data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
    if (!valid || data.length > 256 * 1024) throw new Error('Photo invalide ou trop volumineuse. Choisissez une autre image.');
    photo = { data, mime: match[1] };
  }
  return { firstName, age, details, photo, revision: input.revision };
}
