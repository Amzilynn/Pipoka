import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBublii } from '../context/BubliiContext';
import { MODULE_DEFINITIONS } from './ChildHomeScreen';
import TTSButton from '../components/TTSButton';

// 1. APPRENDRE Activities
import LearnActivity from '../activities/LearnActivity';
import LearnWordBuilderActivity from '../activities/LearnWordBuilderActivity';
import LearnCountingActivity from '../activities/LearnCountingActivity';
import LearnProblemSolvingActivity from '../activities/LearnProblemSolvingActivity';

// 2. COMMUNIQUER Activities
import CommunicateActivity from '../activities/CommunicateActivity';
import CommunicateNeedsActivity from '../activities/CommunicateNeedsActivity';
import CommunicateSentenceActivity from '../activities/CommunicateSentenceActivity';
import CommunicateSocialActivity from '../activities/CommunicateSocialActivity';

// 3. BOUGER Activities
import MoveCameraActivity from '../activities/MoveCameraActivity';
import MoveDirectionActivity from '../activities/MoveDirectionActivity';
import MoveSequenceActivity from '../activities/MoveSequenceActivity';
import MoveBodyPartsActivity from '../activities/MoveBodyPartsActivity';

// 4. GRANDIR Activities
import GrowRoutineActivity from '../activities/GrowRoutineActivity';
import GrowMorningActivity from '../activities/GrowMorningActivity';
import GrowSchoolBagActivity from '../activities/GrowSchoolBagActivity';
import GrowEveningActivity from '../activities/GrowEveningActivity';

export default function ActivityScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeChild, recordActivityCompletion } = useBublii();

  const moduleId = searchParams.get('module') || 'learn';
  const activityId = searchParams.get('activity') || 'associer-mots-images';

  const currentModule = MODULE_DEFINITIONS.find((m) => m.id === moduleId) || MODULE_DEFINITIONS[0];
  const currentActivity =
    currentModule.activities.find((a) => a.id === activityId) || currentModule.activities[0];

  const handleBackToChildHome = () => {
    navigate('/enfant');
  };

  const handleActivityComplete = ({ score, maxScore, label, module }) => {
    recordActivityCompletion(activeChild.id, {
      activityId: currentActivity.id,
      module: module || currentModule.id,
      label: label || currentActivity.title,
      score: score ?? 3,
      maxScore: maxScore ?? 3,
    });
    navigate('/enfant');
  };

  // Exact 1-to-1 mapping for each of the 16 activities
  const renderActivityComponent = () => {
    switch (activityId) {
      // APPRENDRE (4)
      case 'associer-mots-images':
        return <LearnActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'construire-le-mot':
        return <LearnWordBuilderActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'compter-des-objets':
        return <LearnCountingActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'problemes-simples':
        return <LearnProblemSolvingActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;

      // COMMUNIQUER (4)
      case 'reconnaitre-les-emotions':
        return <CommunicateActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'exprimer-ses-besoins':
        return <CommunicateNeedsActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'construire-une-phrase':
        return <CommunicateSentenceActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'situations-sociales':
        return <CommunicateSocialActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;

      // BOUGER (4)
      case 'imiter-le-mouvement':
        return <MoveCameraActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'gauche-droite-haut-bas':
        return <MoveDirectionActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'sequences-de-mouvement':
        return <MoveSequenceActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'identifier-parties-corps':
        return <MoveBodyPartsActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;

      // GRANDIR (4)
      case 'dents-propres':
        return <GrowRoutineActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'ordre-du-matin':
        return <GrowMorningActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'sac-de-ecole':
        return <GrowSchoolBagActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
      case 'routine-du-soir':
        return <GrowEveningActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;

      default:
        // Default module fallback if an unknown id is passed
        if (moduleId === 'learn') return <LearnActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
        if (moduleId === 'communicate') return <CommunicateActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
        if (moduleId === 'move') return <MoveCameraActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
        return <GrowRoutineActivity childSettings={activeChild.settings} onComplete={handleActivityComplete} />;
    }
  };

  return (
    <div className="min-h-screen bublii-bg-canvas text-[#1E293B] flex flex-col justify-between">
      {/* Top Accessible Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-3 border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-xs sticky top-0 z-30">
        <button
          type="button"
          onClick={handleBackToChildHome}
          className="min-h-[56px] flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-base font-extrabold text-[#1E293B] hover:text-black bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Retour à l'accueil des activités"
        >
          <span className="text-2xl">🏠</span>
          <span className="font-['Fredoka'] text-lg font-bold">Accueil</span>
        </button>

        {/* Current Module & Activity Title with Audio Reader */}
        <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border-2 border-slate-200 shadow-xs">
          <span
            className="w-4 h-4 rounded-full ring-2 ring-white shrink-0"
            style={{ background: currentModule.color }}
          />
          <div className="flex items-center gap-2.5">
            <span
              className="font-['Fredoka'] text-base sm:text-xl font-black uppercase tracking-wider"
              style={{ color: currentModule.color }}
            >
              {currentModule.title} : {currentActivity.title}
            </span>
            <TTSButton
              text={`${currentModule.title} : ${currentActivity.title}`}
              size="sm"
            />
          </div>
        </div>

        {/* Child Badge */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-xs">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shadow-xs ring-2 ring-white"
            style={{ background: activeChild.avatar.color }}
          >
            {activeChild.avatar.initial}
          </div>
          <span className="text-sm font-black text-[#1E293B] hidden sm:inline">
            {activeChild.firstName}
          </span>
        </div>
      </header>

      {/* Main Activity Stage */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col justify-center">
        {renderActivityComponent()}
      </main>

      {/* Bottom Footer */}
      <footer className="text-center py-4 text-xs font-bold text-[#64748B]">
        Booblii • {currentModule.title} • {currentActivity.title} • {activeChild.firstName}
      </footer>
    </div>
  );
}
