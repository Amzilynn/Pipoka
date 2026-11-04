import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBublii } from '../context/BubliiContext';
import TTSButton from '../components/TTSButton';

export const MODULE_DEFINITIONS = [
  {
    id: 'learn',
    title: 'APPRENDRE',
    color: '#2A6FB5',
    colorDark: '#1B4C7E',
    colorBg: '#EBF4FF',
    icon: '📚',
    activities: [
      { id: 'associer-mots-images', title: 'Mots & Images', icon: '🖼️' },
      { id: 'construire-le-mot', title: 'Lettres & Mots', icon: '🔤' },
      { id: 'compter-des-objets', title: 'Compter', icon: '🔢' },
      { id: 'problemes-simples', title: 'Logique', icon: '🧩' },
    ],
  },
  {
    id: 'communicate',
    title: 'COMMUNIQUER',
    color: '#E84545',
    colorDark: '#A82525',
    colorBg: '#FFF5F5',
    icon: '💬',
    activities: [
      { id: 'reconnaitre-les-emotions', title: 'Les Émotions', icon: '😊' },
      { id: 'exprimer-ses-besoins', title: 'Mes Besoins', icon: '🙋' },
      { id: 'construire-une-phrase', title: 'Faire une phrase', icon: '🗣️' },
      { id: 'situations-sociales', title: 'Dire bonjour', icon: '🤝' },
    ],
  },
  {
    id: 'move',
    title: 'BOUGER',
    color: '#22A06B',
    colorDark: '#146844',
    colorBg: '#E6FFFA',
    icon: '🏃',
    activities: [
      { id: 'imiter-le-mouvement', title: 'Caméra & Gestes', icon: '🤸' },
      { id: 'gauche-droite-haut-bas', title: 'Les Directions', icon: '🧭' },
      { id: 'sequences-de-mouvement', title: 'En rythme', icon: '🎶' },
      { id: 'identifier-parties-corps', title: 'Mon Corps', icon: '🙌' },
    ],
  },
  {
    id: 'grow',
    title: 'GRANDIR',
    color: '#F5A623',
    colorDark: '#B5740C',
    colorBg: '#FFFDF0',
    icon: '🌱',
    activities: [
      { id: 'dents-propres', title: 'Brosser les dents', icon: '🪥' },
      { id: 'ordre-du-matin', title: 'Le matin', icon: '☀️' },
      { id: 'sac-de-ecole', title: 'Mon sac', icon: '🎒' },
      { id: 'routine-du-soir', title: 'Le soir', icon: '🌙' },
    ],
  },
];

export default function ChildHomeScreen() {
  const navigate = useNavigate();
  const { activeChild, setCurrentRole } = useBublii();

  const handleLaunchActivity = (moduleId, activityId) => {
    navigate(`/enfant/activite?module=${moduleId}&activity=${activityId}`);
  };

  const handleExitToRoles = () => {
    setCurrentRole(null);
    navigate('/');
  };

  const totalStars = Object.values(activeChild.moduleProgress).reduce(
    (acc, curr) => acc + (curr.stars || 0),
    0
  );

  return (
    <div className="min-h-screen bublii-bg-canvas text-[#1E293B] pb-20">
      {/* Top Accessible Header */}
      <header className="bg-white/95 backdrop-blur-md border-b-3 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Home / Back button */}
          <button
            type="button"
            onClick={handleExitToRoles}
            className="min-h-[52px] flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-extrabold text-[#1E293B] bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Retour au choix du rôle"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-['Fredoka'] font-bold hidden sm:inline">Accueil</span>
          </button>

          {/* Child Identity Banner */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border-2 border-slate-200 shadow-xs">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm ring-2 ring-white"
              style={{ background: activeChild.avatar.color }}
            >
              {activeChild.avatar.initial}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Fredoka'] text-xl sm:text-2xl font-bold leading-tight text-[#1E293B]">
                Bonjour {activeChild.firstName} !
              </h1>
              <TTSButton text={`Bonjour ${activeChild.firstName} ! Choisis un jeu !`} size="sm" />
            </div>
          </div>

          {/* Star Counter Pill */}
          <div className="flex items-center gap-2 bg-[#FFFDF0] border-3 border-[#F5A623] px-4 py-2 rounded-2xl shadow-xs">
            <span className="text-2xl animate-pulse">⭐</span>
            <span className="font-['Fredoka'] text-xl font-black text-[#1E293B]">
              {totalStars}
            </span>
          </div>
        </div>
      </header>

      {/* Main 4 Cards Stage (Simplified, Visual, Zero text clutter) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MODULE_DEFINITIONS.map((mod, idx) => {
            const progress = activeChild.moduleProgress[mod.id] || { stars: 0 };

            return (
              <motion.article
                key={mod.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white rounded-[2.5rem] p-7 sm:p-8 border-4 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
                style={{
                  borderColor: `${mod.color}50`,
                  boxShadow: `0 10px 0 #E2E8F0, 0 20px 32px -10px ${mod.color}25`
                }}
              >
                <div>
                  {/* Card Header: Big Icon, Giant Title, Star Count, Audio */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-sm border-2 border-white"
                        style={{ background: mod.colorBg }}
                      >
                        {mod.icon}
                      </div>
                      <h2
                        className="font-['Fredoka'] text-3xl sm:text-4xl font-black"
                        style={{ color: mod.color }}
                      >
                        {mod.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <TTSButton text={mod.title} size="sm" />
                      <div className="flex items-center gap-1.5 bg-[#FFFDF0] px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-xs">
                        <span className="text-amber-500 text-lg">⭐</span>
                        <span className="text-base font-black text-[#1E293B]">
                          {progress.stars}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Large Clean Activity Buttons */}
                  <div className="grid grid-cols-2 gap-3.5 mb-6">
                    {mod.activities.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleLaunchActivity(mod.id, act.id)}
                        className="min-h-[76px] p-3.5 rounded-3xl bg-slate-50 hover:bg-slate-100 border-3 border-slate-200 hover:border-slate-300 transition-all flex items-center gap-3 cursor-pointer shadow-xs active:scale-95"
                      >
                        <span className="text-3xl select-none">{act.icon}</span>
                        <span className="font-['Fredoka'] text-base sm:text-lg font-bold text-[#1E293B] text-left leading-tight">
                          {act.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Direct Start Button */}
                <button
                  type="button"
                  onClick={() => handleLaunchActivity(mod.id, mod.activities[0].id)}
                  className="w-full min-h-[60px] py-4 px-6 rounded-2xl text-white font-['Fredoka'] text-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-lg"
                  style={{
                    background: mod.color,
                    boxShadow: `0 6px 0 ${mod.colorDark}`
                  }}
                >
                  <span>Jouer</span>
                  <span className="text-2xl">✨</span>
                </button>
              </motion.article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
