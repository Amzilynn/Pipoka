import { representativeHistory } from './representation.js';
import { buildModuleProgress } from './progress.js';
const colors = [ ['#EBF4FF', '#2A6FB5'], ['#FFF5F5', '#B83838'], ['#E6FFFA', '#187653'], ['#FFFBEA', '#956016'] ];
export function childProfile(child, saved) {
  const index = [...child.id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % colors.length;
  const [bg, color] = colors[index];
  const previousHistory = Array.isArray(saved?.history) ? saved.history : [];
  const seeded = child.presentationKey && !saved?.presentationSeededAt;
  const history = seeded ? [...previousHistory, ...representativeHistory(child)] : previousHistory;
  return { ...saved, ...child, presentationSeededAt: saved?.presentationSeededAt || (seeded ? new Date().toISOString() : null), firstName: child.firstName, tagline: 'Mon espace personnel',
    avatar: { initial: [...child.firstName][0].toLocaleUpperCase('fr'), bg, color, borderColor: color },
    strengths: child.strengths ?? saved?.strengths ?? [], supportNeeds: child.supportNeeds ?? saved?.supportNeeds ?? [], objectives: child.objectives ?? saved?.objectives ?? [], history,
    settings: { answerChoices: 4, audio: true, hints: 3, difficulty: 3, timer: false, independence: 'Progressif', useAlternatives: false, ...saved?.settings },
    moduleProgress: buildModuleProgress(history),
  };
}
export function mergeChildProfiles(children, saved = []) {
  return children.map(child => childProfile(child, saved.find(profile => profile.id === child.id)));
}
