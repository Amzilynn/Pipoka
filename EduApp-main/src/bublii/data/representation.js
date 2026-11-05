import { ACTIVITY_CATALOG } from './progress.js';
import { dayKey } from '../parent/parentMetrics.js';
export function representativeHistory(child, now = new Date()) {
  const offset = [...(child.presentationKey || child.id)].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 5;
  const modules = Object.keys(ACTIVITY_CATALOG), history = [];
  let sequence = offset;
  for (let day = 0; day < 21; day++) {
    const count = day < 7 ? [4, 3, 5, 2, 4, 3, 5][(day + offset) % 7] : 1 + (day + offset) % 3;
    for (let slot = 0; slot < count; slot++) {
      const module = modules[sequence % 4];
      const [activityId, label] = ACTIVITY_CATALOG[module][Math.floor(sequence / 4) % (module === 'move' ? 2 : module === 'learn' ? 4 : 3)];
      const completedAt = new Date(now.getTime() - day * 86400000 - (slot + 1) * 3600000).toISOString();
      history.push({ id: `presentation-${child.id}-${day}-${slot}`, activityId, module, label, source: 'presentation', completedAt, score: sequence % 5 === 0 ? 2 : 3, maxScore: 3 });
      sequence++;
    }
  }
  return history.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}
export function seedDailyRoutines(data, profiles, now = new Date()) {
  const pending = profiles.filter(child => child.presentationKey && !data.seededChildren?.[child.id]);
  if (!pending.length) return data;
  const next = { ...data, routines: [...data.routines], progress: { ...data.progress }, seededChildren: { ...data.seededChildren } };
  for (const child of pending) {
    const tasks = [
      { title: 'Préparer mon sac', time: '07:45', icon: '🎒', steps: ['Je prends mon cahier.', 'Je mets mon cahier et ma trousse dans mon sac.', 'Je prends ma gourde.', 'Je ferme mon sac.'] },
      { title: 'Mon moment lecture', time: '17:00', icon: '⭐', steps: ['Je choisis une histoire.', 'Je regarde les images avec mon adulte.', 'Je raconte mon passage préféré.'] },
      { title: 'Me brosser les dents', time: '19:30', icon: '🪥', steps: ['Je prends ma brosse.', 'Je mets le dentifrice avec mon adulte.', 'Je brosse mes dents.', 'Je rince et je range.'] },
    ];
    tasks.forEach((task, index) => {
      const routine = { ...task, id: `daily-${child.id}-${index}`, revision: `initial-${child.id}-${index}`, childId: child.id, repeat: 'daily', date: '', author: 'parent', archived: false };
      next.routines.push(routine);
      for (let day = 0; day < 7; day++) {
        const date = dayKey(new Date(now.getTime() - day * 86400000));
        next.progress[`${routine.id}:${routine.revision}:${date}`] = day === 0 ? (index === 0 ? task.steps.length : index === 1 ? 1 : 0) : day % 3 === index ? Math.max(1, task.steps.length - 1) : task.steps.length;
      }
    });
    next.seededChildren[child.id] = now.toISOString();
  }
  return next;
}
