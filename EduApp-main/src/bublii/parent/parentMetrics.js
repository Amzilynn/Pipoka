import { entryDate } from '../data/progress.js';
export const completionDate = entryDate;

export const dayKey = (date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);

export function summarizeHistory(history = [], period = 'all', now = new Date()) {
  // UTC noon avoids missing/duplicating calendar days around daylight saving.
  const today = new Date(`${dayKey(now)}T12:00:00Z`);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - 6 + index);
    return { key: dayKey(date), date, count: 0 };
  });
  const recorded = history.flatMap((entry) => {
    const date = completionDate(entry);
    return date && date <= now ? [{ ...entry, completedAt: date }] : [];
  }).sort((a, b) => b.completedAt - a.completedAt);
  const entries = recorded.filter((entry) => period !== 'week' || dayKey(entry.completedAt) >= days[0].key);
  for (const entry of recorded) {
    const day = days.find((item) => item.key === dayKey(entry.completedAt));
    if (day) day.count += 1;
  }
  const domains = ['learn', 'communicate', 'move', 'grow'].map((id) => ({
    id,
    count: entries.filter((entry) => entry.module === id).length,
    unique: new Set(entries.filter((entry) => entry.module === id).map((entry) => entry.activityId).filter(Boolean)).size,
  }));
  return {
    entries, days, domains,
    total: entries.length,
    unique: new Set(entries.map((entry) => entry.activityId).filter(Boolean)).size,
    practicedDomains: domains.filter((domain) => domain.count > 0).length,
    excluded: history.length - recorded.length,
  };
}

export function formatGameScore(entry) {
  const { score, maxScore } = entry;
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || score < 0 || score > maxScore) {
    return 'Résultat indisponible';
  }
  return `${score} / ${maxScore}`;
}
