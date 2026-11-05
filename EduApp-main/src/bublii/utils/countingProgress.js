// Counting progression is independent of age, response speed, and other activities.
export const COUNTING_ACTIVITY_ID = 'compter-des-objets';
export const COUNTING_LEVELS = {
  1: { max: 3, choices: 2 },
  2: { max: 5, choices: 3 },
  3: { max: 10, choices: 4 },
};
export function freshCountingProgress() {
  return { version: 1, level: 1, successStreak: 0, successSessions: [], errorStreak: 0, attempts: [] };
}
export function normalizeCountingProgress(value) {
  if (!value || value.version !== 1 || !Number.isInteger(value.level) || !COUNTING_LEVELS[value.level]) return freshCountingProgress();
  return {
    ...freshCountingProgress(),
    level: value.level,
    successStreak: Number.isInteger(value.successStreak) ? Math.max(0, Math.min(5, value.successStreak)) : 0,
    successSessions: Array.isArray(value.successSessions) ? value.successSessions.filter(id => typeof id === 'string').slice(-6) : [],
    errorStreak: value.errorStreak === 1 ? 1 : 0,
    attempts: Array.isArray(value.attempts) ? value.attempts.slice(-200) : [],
  };
}
export function countingStorageKey(childId) {
  return 'bublii:learning:v1:' + encodeURIComponent(childId) + ':' + COUNTING_ACTIVITY_ID;
}
export function readCountingProgress(storage, childId) {
  try { return normalizeCountingProgress(JSON.parse(storage.getItem(countingStorageKey(childId)))); }
  catch { return freshCountingProgress(); }
}
export function saveCountingProgress(storage, childId, progress) {
  try { storage.setItem(countingStorageKey(childId), JSON.stringify(progress)); return true; }
  catch { return false; }
}
export function recordCountingAttempt(previous, attempt) {
  const next = normalizeCountingProgress(previous);
  next.attempts = [...next.attempts, attempt].slice(-200);
  if (attempt.correct && !attempt.helpUsed && !attempt.hadError) {
    next.errorStreak = 0;
    next.successStreak += 1;
    next.successSessions = [...new Set([...next.successSessions, attempt.sessionId])];
    if (next.successStreak >= 6 && next.successSessions.length >= 2) {
      next.level = Math.min(3, next.level + 1);
      next.successStreak = 0;
      next.successSessions = [];
    } else if (next.successStreak >= 6) {
      next.successStreak = 5;
    }
  } else {
    next.successStreak = 0;
    next.successSessions = [];
    if (!attempt.correct) {
      next.errorStreak += 1;
      if (next.errorStreak >= 2) {
        next.level = Math.max(1, next.level - 1);
        next.errorStreak = 0;
      }
    } else {
      next.errorStreak = 0;
    }
  }
  return next;
}
export function createCountingRound(level, random = Math.random) {
  const config = COUNTING_LEVELS[level] || COUNTING_LEVELS[1];
  const count = 1 + Math.floor(random() * config.max);
  const candidates = Array.from({ length: config.max }, (_, i) => i + 1).filter(n => n !== count);
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return { level, count, options: [count, ...candidates.slice(0, config.choices - 1)].sort((a, b) => a - b) };
}
