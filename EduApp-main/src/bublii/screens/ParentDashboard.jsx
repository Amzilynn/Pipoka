import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBublii } from '../context/BubliiContext';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const {
    activeChild,
    profiles,
    switchChild,
    updateSettings,
    setCurrentRole,
  } = useBublii();

  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSettingChange = (key, value) => {
    updateSettings(activeChild.id, { [key]: value });
    showToast(`Réglage mis à jour : ${key} = ${value}`);
  };

  const handleExitToRoles = () => {
    setCurrentRole(null);
    navigate('/');
  };

  const currentSettings = activeChild.settings;

  return (
    <div className="min-h-screen bg-[#F4E8D8] text-[#2D3748] pb-16">
      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 bg-[#2D3748] text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-lg border border-white/20 flex items-center gap-3"
        >
          <span>✓</span>
          <span>{notification}</span>
        </motion.div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-[#D1D5DB] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleExitToRoles}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#6B7A8C] hover:text-[#2D3748] hover:bg-slate-100 transition-colors"
          >
            <span>←</span>
            <span>Changer d'espace</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <h1 className="font-['Fredoka'] text-xl font-bold text-[#2D3748]">
              Tableau de bord Parent
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentRole('enfant');
              navigate('/enfant');
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#2A6FB5] text-white text-xs sm:text-sm font-bold hover:bg-[#1e5a96] transition-colors shadow-xs"
          >
            Tester l'espace enfant →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        <button type="button" onClick={() => navigate('/parent/calendrier')} className="mb-6 w-full rounded-2xl border-2 border-blue-200 bg-white p-5 text-left font-bold text-blue-800 shadow-sm hover:bg-blue-50">Mon calendrier · Tâches et étapes en photos →</button>
        {/* Child Profile Switcher & Identity Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D1D5DB] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                style={{ background: activeChild.avatar.color }}
              >
                {activeChild.avatar.initial}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-[#2D3748]">
                    {activeChild.firstName}
                  </h2>
                  <span className="bg-slate-100 text-[#6B7A8C] text-xs font-bold px-2.5 py-1 rounded-full">
                    {activeChild.age ? `${activeChild.age} ans` : 'Âge non renseigné'}
                  </span>
                </div>
                <p className="text-sm text-[#6B7A8C] mt-0.5">
                  {activeChild.tagline}
                </p>
              </div>
            </div>

            {/* Child Profile Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-xs font-bold text-[#6B7A8C] uppercase tracking-wider">
                Changer d'enfant :
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {profiles.map((p) => {
                  const isCurrent = p.id === activeChild.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => switchChild(p.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-white text-[#2D3748] shadow-sm'
                          : 'text-[#6B7A8C] hover:text-[#2D3748]'
                      }`}
                    >
                      {p.firstName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Strengths & Support Needs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="bg-[#E6FFFA]/50 border border-[#2FC48D]/30 rounded-2xl p-4 sm:p-5">
              <h3 className="font-bold text-sm text-[#127a58] flex items-center gap-2 mb-2">
                <span>🌟</span>
                <span>Forces & points d'appui observés</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeChild.strengths.map((str, i) => (
                  <span
                    key={i}
                    className="bg-white text-[#127a58] border border-[#2FC48D]/40 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFDF0] border border-[#F5A623]/30 rounded-2xl p-4 sm:p-5">
              <h3 className="font-bold text-sm text-[#a45b06] flex items-center gap-2 mb-2">
                <span>💡</span>
                <span>Besoins d'accompagnement privilégiés</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeChild.supportNeeds.map((need, i) => (
                  <span
                    key={i}
                    className="bg-white text-[#a45b06] border border-[#F5A623]/40 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Real Personalisation Settings Panel */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D1D5DB] shadow-sm">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2A6FB5]/10 text-[#2A6FB5] mb-1">
              Configuration Active
            </div>
            <h2 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748]">
              Paramètres d'adaptation de l'expérience
            </h2>
            <p className="text-sm text-[#6B7A8C] mt-1">
              Ces réglages modifient immédiatement le comportement des activités de {activeChild.firstName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Setting 1: Nombre de choix de réponse */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Choix de réponse</span>
                  <span className="text-xs font-extrabold bg-[#2A6FB5] text-white px-2 py-0.5 rounded-md">
                    {currentSettings.answerChoices} options
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Nombre de propositions à l'écran
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  2 options réduisent la surcharge cognitive ; 4 augmentent le défi.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleSettingChange('answerChoices', n)}
                    className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                      currentSettings.answerChoices === n
                        ? 'bg-[#2A6FB5] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                    }`}
                  >
                    {n} choix
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 2: Assistance Audio */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Aide Vocale</span>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      currentSettings.audio
                        ? 'bg-[#6DD58F] text-[#127a58]'
                        : 'bg-slate-200 text-[#6B7A8C]'
                    }`}
                  >
                    {currentSettings.audio ? 'Activée' : 'Désactivée'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Lecture sonore des consignes
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  Énonciation vocale claire pour soutenir la compréhension orale.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSettingChange('audio', true)}
                  className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                    currentSettings.audio
                      ? 'bg-[#2A6FB5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                  }`}
                >
                  🔊 Audio Oui
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('audio', false)}
                  className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                    !currentSettings.audio
                      ? 'bg-[#2A6FB5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                  }`}
                >
                  🔇 Sans audio
                </button>
              </div>
            </div>

            {/* Setting 3: Fréquence des indices */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Indices</span>
                  <span className="text-xs font-extrabold bg-[#F5A623] text-white px-2 py-0.5 rounded-md">
                    {currentSettings.hints} indices max
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Disponibilité des indices d'aide
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  Quantité d'indices visuels accessibles lors des blocages.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleSettingChange('hints', h)}
                    className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                      currentSettings.hints === h
                        ? 'bg-[#F5A623] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                    }`}
                  >
                    {h} {h > 1 ? 'indices' : 'indice'}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 4: Niveau de difficulté */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Complexité</span>
                  <span className="text-xs font-extrabold bg-[#E84545] text-white px-2 py-0.5 rounded-md">
                    Niveau {currentSettings.difficulty}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Complexité du contenu
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  Ajuste la richesse du vocabulaire et la longueur des séquences.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSettingChange('difficulty', lvl)}
                    className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                      currentSettings.difficulty === lvl
                        ? 'bg-[#E84545] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                    }`}
                  >
                    Niveau {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 5: Autonomie & Guidance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Guidance</span>
                  <span className="text-xs font-extrabold bg-[#6DD58F] text-[#127a58] px-2 py-0.5 rounded-md">
                    {currentSettings.independence}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Accompagnement à l'écran
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  Niveau d'étayage visuel (surlignage des cibles, flèches guides).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['Assisté', 'Progressif', 'Autonome'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSettingChange('independence', mode)}
                    className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                      currentSettings.independence === mode
                        ? 'bg-[#22a06b] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 6: Chronomètre doux */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#6B7A8C]">Temps</span>
                  <span className="text-xs font-extrabold bg-slate-200 text-[#6B7A8C] px-2 py-0.5 rounded-md">
                    {currentSettings.timer ? 'Visible' : 'Désactivé'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                  Chronomètre facultatif
                </h4>
                <p className="text-xs text-[#6B7A8C] mb-4">
                  Jamais éliminatoire : simple repère visuel pour les plus grands.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSettingChange('timer', false)}
                  className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                    !currentSettings.timer
                      ? 'bg-[#2A6FB5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                  }`}
                >
                  Sans limite
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange('timer', true)}
                  className={`min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                    currentSettings.timer
                      ? 'bg-[#2A6FB5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-[#2D3748] border border-slate-200'
                  }`}
                >
                  Timer actif
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress by Module & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module Progress Overview (2 cols) */}
          <section className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#D1D5DB] shadow-sm">
            <h3 className="font-['Fredoka'] text-xl font-bold text-[#2D3748] mb-5">
              Progression par domaine d'apprentissage
            </h3>

            <div className="space-y-5">
              {[
                { id: 'learn', name: 'APPRENDRE', color: '#2A6FB5', icon: '📚' },
                { id: 'communicate', name: 'COMMUNIQUER', color: '#E84545', icon: '💬' },
                { id: 'move', name: 'BOUGER (Caméra)', color: '#22a06b', icon: '🏃' },
                { id: 'grow', name: 'GRANDIR (Routines)', color: '#F5A623', icon: '🌱' },
              ].map((mod) => {
                const p = activeChild.moduleProgress[mod.id] || { completedCount: 0, totalActivities: 4, stars: 0, lastActivity: '-' };
                const pct = Math.round((p.completedCount / p.totalActivities) * 100);

                return (
                  <div key={mod.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{mod.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#2D3748]">
                            {mod.name}
                          </h4>
                          <span className="text-xs text-[#6B7A8C]">
                            Dernière activité : {p.lastActivity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold" style={{ color: mod.color }}>
                          {pct}%
                        </span>
                        <span className="text-xs text-[#6B7A8C] block">
                          {p.completedCount} / {p.totalActivities} réussies
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: mod.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* History of Completed Activities (1 col) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D1D5DB] shadow-sm">
            <h3 className="font-['Fredoka'] text-xl font-bold text-[#2D3748] mb-5">
              Dernières activités
            </h3>

            {activeChild.history && activeChild.history.length > 0 ? (
              <div className="space-y-3">
                {activeChild.history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#2D3748]">{item.label}</p>
                      <span className="text-[10px] text-[#6B7A8C]">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-700 font-bold">
                      <span>⭐</span>
                      <span>{item.score}/{item.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B7A8C] italic text-center py-8">
                Aucune activité enregistrée dans cette session pour l'instant.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
