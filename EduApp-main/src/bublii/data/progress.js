// Shared activity IDs: Parent and Child use the same distinct-activity counts.
export const ACTIVITY_CATALOG = {
  learn: [['associer-mots-images', 'Mots & Images'], ['construire-le-mot', 'Lettres & Mots'], ['compter-des-objets', 'Compter'], ['problemes-simples', 'Logique']],
  communicate: [['reconnaitre-les-emotions', 'Les émotions'], ['exprimer-ses-besoins', 'Mes besoins'], ['construire-une-phrase', 'Faire une phrase'], ['situations-sociales', 'Dire bonjour']],
  move: [['imiter-le-mouvement', 'Caméra & Gestes'], ['gauche-droite-haut-bas', 'Les directions'], ['sequences-de-mouvement', 'En rythme'], ['identifier-parties-corps', 'Mon corps']],
  grow: [['dents-propres', 'Brosser les dents'], ['ordre-du-matin', 'Le matin'], ['sac-de-ecole', 'Mon sac'], ['routine-du-soir', 'Le soir']],
};

export const PROFILES_STORAGE_KEY = 'bubliiProfilesV2';

export function entryDate(entry) {
  const legacy = /^h-(\d{13})$/.exec(entry?.id || '');
  const value = entry?.completedAt ?? (legacy ? Number(legacy[1]) : null);
  if (value === null) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function buildModuleProgress(history) {
  return Object.fromEntries(Object.entries(ACTIVITY_CATALOG).map(([module, activities]) => {
    const entries = history.filter((entry) => entry.module === module);
    const completedActivityIds = [...new Set(entries.map((entry) => entry.activityId))]
      .filter((id) => activities.some(([activityId]) => activityId === id));
    const latest = [...entries].sort((a, b) => (entryDate(b)?.getTime() || 0) - (entryDate(a)?.getTime() || 0))[0];
    return [module, {
      completedCount: completedActivityIds.length, completedActivityIds,
      totalActivities: activities.length,
      stars: entries.reduce((total, entry) => total + (Number.isFinite(entry.score) ? entry.score : 0), 0),
      lastActivity: latest?.label || 'À découvrir',
    }];
  }));
}

export function createDemoProfile(profile, now = new Date()) {
  let index = 0;
  const history = Object.entries(ACTIVITY_CATALOG).flatMap(([module, activities]) =>
    activities.slice(0, profile.moduleProgress[module].completedCount).map(([activityId, label]) => {
      const position = index++;
      // Seed once, across the preceding six days; never move dates on reload.
      const completedAt = new Date(now.getTime() - ((position % 6) + 1) * 86400000 - position * 1800000).toISOString();
      return { id: `demo-${profile.id}-${activityId}`, source: 'demo', completedAt,
        date: new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'short' }).format(new Date(completedAt)),
        activityId, module, label, score: 3, maxScore: 3 };
    }));
  history.sort((a, b) => entryDate(b) - entryDate(a));
  return { ...profile, history, moduleProgress: buildModuleProgress(history) };
}

export function migrateProfiles(defaults, previous, now = new Date()) {
  return defaults.map((profile) => {
    const saved = Array.isArray(previous) ? previous.find((item) => item?.id === profile.id) : null;
    const demo = createDemoProfile(profile, now);
    const recorded = (Array.isArray(saved?.history) ? saved.history : [])
      .filter((entry) => entryDate(entry) && entry.source !== 'demo')
      .map((entry) => ({ ...entry, source: 'recorded', completedAt: entryDate(entry).toISOString() }));
    const history = [...recorded, ...demo.history].sort((a, b) => entryDate(b) - entryDate(a));
    return { ...demo, settings: { ...profile.settings, ...saved?.settings }, history, moduleProgress: buildModuleProgress(history) };
  });
}

export function appendCompletion(profile, completion, now = new Date()) {
  const entry = { ...completion, id: `h-${now.getTime()}-${globalThis.crypto.randomUUID()}`,
    source: 'recorded', completedAt: now.toISOString(),
    date: new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(now),
  };
  const history = [entry, ...profile.history];
  return { ...profile, history, moduleProgress: buildModuleProgress(history) };
}

export function readSavedProfiles(storage) {
  try {
    const profiles = JSON.parse(storage.getItem(PROFILES_STORAGE_KEY));
    return Array.isArray(profiles) && profiles.length && profiles.every((profile) =>
      profile && typeof profile.id === 'string' && Array.isArray(profile.history) && profile.settings && profile.avatar
    ) ? profiles.map((profile) => ({ ...profile, moduleProgress: buildModuleProgress(profile.history) })) : null;
  } catch { return null; }
}
