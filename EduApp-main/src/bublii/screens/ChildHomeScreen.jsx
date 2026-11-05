import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBublii } from '../context/BubliiContext';
import { speakText } from '../utils/speech';
import ModuleIllustration from '../components/ModuleIllustration';
import Logo from '../components/Logo';
import CalendarShortcut, { DayExample } from '../components/CalendarShortcut';

const moduleIconStyles = {
  learn: {
    label: 'Apprendre',
    symbol: 'A',
    accent: '#2A6FB5',
  },
  communicate: {
    label: 'Communiquer',
    symbol: 'C',
    accent: '#E84545',
  },
  move: {
    label: 'Bouger',
    symbol: 'M',
    accent: '#22A06B',
  },
  grow: {
    label: 'Grandir',
    symbol: 'G',
    accent: '#F5A623',
  },
};

export const MODULE_DEFINITIONS = [
  {
    id: 'learn',
    title: 'Apprendre',
    icon: moduleIconStyles.learn.symbol,
    description: 'Mots, sons, nombres et logique',
    color: '#2A6FB5',
    colorDark: '#1B4C7E',
    colorBg: '#EBF4FF',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    activities: [
      { id: 'associer-mots-images', title: 'Mots & Images', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80' },
      { id: 'construire-le-mot', title: 'Lettres & Mots', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80' },
      { id: 'compter-des-objets', title: 'Compter', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80' },
      { id: 'problemes-simples', title: 'Logique', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'communicate',
    title: 'Communiquer',
    icon: moduleIconStyles.communicate.symbol,
    description: 'Exprimer ses émotions et ses besoins',
    color: '#E84545',
    colorDark: '#A82525',
    colorBg: '#FFF5F5',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    activities: [
      { id: 'reconnaitre-les-emotions', title: 'Les Émotions', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
      { id: 'exprimer-ses-besoins', title: 'Mes Besoins', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
      { id: 'construire-une-phrase', title: 'Faire une phrase', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
      { id: 'situations-sociales', title: 'Dire bonjour', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'move',
    title: 'Bouger',
    icon: moduleIconStyles.move.symbol,
    description: 'Mouvement, directions et rythme',
    color: '#22A06B',
    colorDark: '#146844',
    colorBg: '#E6FFFA',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
    activities: [
      { id: 'imiter-le-mouvement', title: 'Caméra & Gestes', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80' },
      { id: 'gauche-droite-haut-bas', title: 'Les Directions', image: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=900&q=80' },
      { id: 'sequences-de-mouvement', title: 'En rythme', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=900&q=80' },
      { id: 'identifier-parties-corps', title: 'Mon Corps', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'grow',
    title: 'Grandir',
    icon: moduleIconStyles.grow.symbol,
    description: 'Routines, habitudes et autonomie',
    color: '#F5A623',
    colorDark: '#B5740C',
    colorBg: '#FFFDF0',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    activities: [
      { id: 'dents-propres', title: 'Brosser les dents', image: 'https://images.unsplash.com/photo-1588776814546-da5e4aef4754?auto=format&fit=crop&w=900&q=80' },
      { id: 'ordre-du-matin', title: 'Le matin', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80' },
      { id: 'sac-de-ecole', title: 'Mon sac', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
      { id: 'routine-du-soir', title: 'Le soir', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80' },
    ],
  },
];

export default function ChildHomeScreen() {
  const navigate = useNavigate();
  const { activeChild, setCurrentRole } = useBublii();

  const handleLaunchActivity = (moduleId) => {
    navigate(`/enfant/activite?module=${moduleId}`);
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
    <div className="min-h-screen bublii-bg-canvas text-[#1E293B] pb-16">
      {/* ── HEADER ── */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="child-home-header max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">

          <div className="child-home-brand"><Logo size="sm" /></div>

          {/* Back */}
          <button
            type="button"
            onClick={handleExitToRoles}
            className="min-h-[52px] min-w-[52px] flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95 text-slate-700 font-black"
            aria-label="Retour"
          >
            ←
          </button>

          {/* Child name */}
          <div className="child-home-greeting flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm ring-2 ring-white flex-shrink-0"
              style={{ background: activeChild.avatar.color }}
            >
              {activeChild.avatar.initial}
            </div>
            <span className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#1E293B]">
              Bonjour {activeChild.firstName} !
            </span>
            <button
              type="button"
              onClick={() => speakText(`Bonjour ${activeChild.firstName} ! Choisis un jeu !`, true)}
              className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer border border-slate-200 text-sm font-bold text-slate-700"
              aria-label="Écouter"
            >
              Audio
            </button>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-xs text-[#1E293B]">
            <span className="text-xl font-black">★</span>
            <span className="font-['Fredoka'] text-xl font-black">{totalStars}</span>
          </div>

        </div>
      </header>

      {/* ── 4 MODULE CARDS ── */}
      <main className="child-home-layout max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <aside className="child-home-sidebar" aria-label="Ma journée"><CalendarShortcut /><DayExample compact /></aside>
        <section className="child-home-modules" aria-label="Mes activités">

        {/* Instruction label */}
        <p className="font-['Fredoka'] text-center text-xl sm:text-2xl font-bold text-slate-500 mb-7">
          Qu'est-ce que tu veux faire ?
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {MODULE_DEFINITIONS.map((mod, idx) => {
            const progress = activeChild.moduleProgress[mod.id] || { stars: 0 };

            return (
              <motion.button
                key={mod.id}
                type="button"
                onClick={() => handleLaunchActivity(mod.id)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                whileTap={{ scale: 0.99 }}
                className="group w-full overflow-hidden rounded-[2rem] border-2 border-white bg-white p-4 text-left shadow-[0_8px_0_rgba(15,23,42,0.06)] transition-shadow hover:shadow-xl focus-visible:outline-4 focus-visible:outline-offset-2"
                style={{
                  outlineColor: mod.color,
                  background: `linear-gradient(180deg, ${mod.colorBg} 0%, #ffffff 100%)`,
                }}
                aria-label={`Ouvrir le module ${mod.title}`}
              >
                <div className="mb-4 overflow-hidden rounded-[1.4rem]" style={{ background: mod.colorBg }}>
                  <ModuleIllustration theme={mod.id} title={mod.title} />
                </div>
                <div className="flex items-center gap-3 px-1 pb-2">
                <div className="flex-1 min-w-0">
                  <span className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-slate-800 leading-none block">
                    {mod.title}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-relaxed text-slate-600">{mod.description}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {progress.stars > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-black text-amber-700 border-2 border-amber-200">
                      <span>★</span>
                      <span>{progress.stars}</span>
                    </span>
                  )}
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-base font-black text-white shadow-sm"
                    style={{ background: mod.color }}
                  >
                    →
                  </span>
                </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        </section>
      </main>
    </div>
  );
}
