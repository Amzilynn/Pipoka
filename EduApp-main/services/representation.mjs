import { randomUUID } from 'node:crypto';
export const CHILD_PRESETS = [
  { key: 'peter', name: 'Peter', age: 7, strengths: ['Mémoire visuelle', 'Curiosité', 'Sens du rythme'], supportNeeds: ['Une consigne à la fois', 'Des repères visuels'], interests: 'Les animaux, les puzzles et les histoires illustrées.', behavior: 'Peter participe volontiers quand les activités sont courtes. Il aime retrouver une routine connue et prend le temps de répondre.', communication: 'Utilise des phrases courtes et des gestes pour préciser ses demandes.', calmingStrategies: 'Une pause au calme, une histoire et un encouragement précis.' },
  { key: 'emma', name: 'Emma', age: 5, strengths: ['Imitation', 'Expression des émotions'], supportNeeds: ['Un adulte pour commencer'], interests: 'Les marionnettes et la musique.', behavior: 'Entre facilement dans une activité lorsqu’elle peut imiter un geste.' },
  { key: 'noah', name: 'Noah', age: 9, strengths: ['Autonomie quotidienne', 'Repérage spatial'], supportNeeds: ['Des consignes reformulées'], interests: 'Les parcours moteurs et les animaux.', behavior: 'S’engage davantage avec un objectif concret et visible.' },
  { key: 'amir', name: 'Amir', age: 7, strengths: ['Attention aux détails', 'Mémoire auditive'], supportNeeds: ['Un environnement calme'], interests: 'Les histoires et les jeux de mots.', behavior: 'Préfère les petits groupes et les activités structurées.' },
];
export function populateRepresentation(db, user, existing) {
  const presets = user.role === 'parent' ? CHILD_PRESETS.slice(0, 1) : CHILD_PRESETS;
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const preset of presets) {
      const found = user.role === 'parent' ? existing[0] : existing.find(child => child.firstName.toLowerCase().startsWith(preset.name.toLowerCase()));
      const id = found?.id || randomUUID();
      if (!found) {
        db.prepare('INSERT INTO children VALUES (?,?,?,?,?)').run(id, preset.name, preset.age, user.id, Date.now());
        db.prepare('INSERT INTO child_members VALUES (?,?)').run(id, user.id);
        if (user.role === 'parent') db.prepare('INSERT OR REPLACE INTO parent_child VALUES (?,?)').run(user.id, id);
      }
      if (db.prepare('SELECT 1 FROM child_presets WHERE child_id=?').get(id)) continue;
      const old = db.prepare('SELECT * FROM child_profiles WHERE child_id=?').get(id);
      const details = JSON.parse(old?.details || '{}');
      const values = { strengths: preset.strengths, supportNeeds: preset.supportNeeds, behavior: preset.behavior, interests: preset.interests, communication: preset.communication || 'Utilise les mots, les gestes et les supports visuels.', calmingStrategies: preset.calmingStrategies || 'Une pause et des repères familiers.', objectives: [
        { id: `${id}-words`, title: 'Associer les mots aux images du quotidien', module: 'learn', progress: 70 },
        { id: `${id}-routine`, title: 'Préparer son sac avec ses repères visuels', module: 'grow', progress: 60 },
        { id: `${id}-emotions`, title: 'Exprimer son émotion avec un mot ou une image', module: 'communicate', progress: 80 },
      ] };
      for (const [key, value] of Object.entries(values)) if (!details[key] || (Array.isArray(details[key]) && !details[key].length)) details[key] = value;
      db.prepare('UPDATE children SET age=COALESCE(age,?) WHERE id=?').run(preset.age, id);
      db.prepare('INSERT INTO child_profiles (child_id,details,photo_data,photo_mime,revision,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(child_id) DO UPDATE SET details=excluded.details,revision=excluded.revision,updated_at=excluded.updated_at').run(id, JSON.stringify(details), old?.photo_data ?? null, old?.photo_mime ?? null, (old?.revision || 0) + 1, new Date().toISOString());
      db.prepare('INSERT INTO child_presets VALUES (?,?)').run(id, preset.key);
    }
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
