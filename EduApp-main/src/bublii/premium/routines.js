export const ROUTINES_KEY = 'bobliiRoutinesV1';
export const routineDay = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris' }).format(new Date());
export const routineKey = (routine, date) => `${routine.id}:${routine.revision}:${date}`;
export const routinesOn = (routines, childId, date) => routines.filter((item) => item.childId === childId && !item.archived && (item.repeat === 'daily' || item.date === date));
export const ROUTINE_MODELS = [
  { title: 'Préparer ma visite chez l’ophtalmologiste', icon: '👓', steps: ['Je demande à un adulte ce que je dois emporter.', 'Je mets mon carnet dans mon sac avec un adulte.', 'Je prends mes lunettes si j’en porte.', 'Je mets mon manteau.', 'Je pars avec l’adulte qui m’accompagne.'] },
  { title: 'Me préparer le matin', icon: '☀️', steps: ['Je me lève.', 'Je vais aux toilettes.', 'Je prends mon petit-déjeuner.', 'Je me lave avec de l’aide si besoin.', 'Je mets mes vêtements.'] },
  { title: 'Me préparer pour dormir', icon: '🌙', steps: ['Je mets mon pyjama.', 'Je me brosse les dents avec de l’aide si besoin.', 'Je choisis une histoire avec un adulte.', 'Je me mets au lit.'] },
  { title: 'Me brosser les dents', icon: '🪥', steps: ['Je prends ma brosse à dents.', 'Je demande à un adulte de m’aider avec le dentifrice.', 'Je brosse mes dents avec de l’aide si besoin.', 'Je crache le dentifrice.', 'Je rince et je range ma brosse.'] },
];
export function makeRoutine({ title, steps, date, repeat, icon }, childId, author, existing) {
  const list = typeof steps === 'string' ? steps.split('\n').map((step) => step.trim()).filter(Boolean) : steps;
  if (!childId || !title?.trim() || title.trim().length > 100 || !Array.isArray(list) || !list.length || list.length > 15 || list.some((step) => typeof step !== 'string' || !step.trim() || step.length > 180)) throw new Error('Indiquez un titre et entre 1 et 15 étapes courtes (180 caractères maximum par étape).');
  if (!['daily', 'once'].includes(repeat) || (repeat === 'once' && (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date))) throw new Error('Choisissez un jour valide pour cette routine.');
  return { id: existing?.id || crypto.randomUUID(), revision: crypto.randomUUID(), childId, title: title.trim(), steps: list.map((step) => step.trim()), repeat, date: repeat === 'daily' ? '' : date, icon: ['👓', '☀️', '🌙', '🪥', '🎒', '⭐'].includes(icon) ? icon : '⭐', author, archived: false };
}
export function recordRoutineStep(data, routine, childId, date, count) {
  if (!routinesOn(data.routines, childId, date).some((item) => item.id === routine.id && item.revision === routine.revision) || date > routineDay() || !Number.isInteger(count) || count < 0 || count > routine.steps.length) throw new Error('Cette étape ne peut pas être enregistrée.');
  return { ...data, progress: { ...data.progress, [routineKey(routine, date)]: count } };
}
