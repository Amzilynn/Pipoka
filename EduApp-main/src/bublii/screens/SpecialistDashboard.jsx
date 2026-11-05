import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CalendarShortcut from '../components/CalendarShortcut';
import { useBublii } from '../context/BubliiContext';

export default function SpecialistDashboard() {
  const navigate = useNavigate();
  const {
    profiles,
    selectedChildId,
    switchChild,
    activeChild,
    updateSettings,
    setCurrentRole,
  } = useBublii();

  const [activeTab, setActiveTab] = useState('objectives'); // 'objectives' | 'settings' | 'history' | 'synthesis'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExitToRoles = () => {
    setCurrentRole(null);
    navigate('/');
  };

  const currentSettings = activeChild.settings;

  return (
    <div className="min-h-screen bg-[#F4E8D8] text-[#2D3748] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e783a] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Specialist Header */}
      <header className="bg-white border-b border-[#D1D5DB] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExitToRoles}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#6B7A8C] hover:text-[#2D3748] hover:bg-slate-100 transition-colors"
            >
              ← Rôles
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <div>
                <h1 className="font-['Fredoka'] text-lg font-bold text-[#2D3748] leading-tight">
                  Espace Spécialiste & ESMS
                </h1>
                <p className="text-[11px] text-[#6B7A8C] hidden sm:block">
                  Suivi pluridisciplinaire, objectifs individualisés et adaptation pédagogique
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <CalendarShortcut role="specialiste" compact />
            <button
              type="button"
              onClick={() => {
                setCurrentRole('enfant');
                navigate('/enfant');
              }}
              className="px-3.5 py-2 rounded-xl bg-[#2A6FB5] text-white text-xs font-bold hover:bg-[#1e5a96] transition-colors shadow-xs"
            >
              Aperçu élève ({activeChild.firstName}) →
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Child Roster Navigation */}
        <section className="bg-white rounded-2xl p-4 border border-[#D1D5DB] shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7A8C]">
              File active des profils suivis ({profiles.length}) :
            </span>
            <span className="text-xs text-[#6B7A8C]">
              Sélectionnez un profil pour consulter sa grille d'évaluation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {profiles.map((p) => {
              const isSelected = p.id === selectedChildId;
              const totalStars = Object.values(p.moduleProgress).reduce((acc, curr) => acc + curr.stars, 0);

              return (
                <div
                  key={p.id}
                  onClick={() => switchChild(p.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#2A6FB5] bg-[#EBF4FF]/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                      style={{ background: p.avatar.color }}
                    >
                      {p.avatar.initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#2D3748]">
                        {p.firstName}
                      </p>
                      <span className="text-[11px] text-[#6B7A8C]">
                        {p.age ? `${p.age} ans` : 'Âge non renseigné'} • {p.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#2A6FB5] block">
                      {totalStars} ⭐
                    </span>
                    <span className="text-[10px] bg-slate-200/80 text-[#2D3748] px-2 py-0.5 rounded-md font-semibold">
                      {p.settings.independence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Active Child Overview Card */}
        <section className="bg-white rounded-3xl p-6 border border-[#D1D5DB] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-['Fredoka'] text-2xl font-bold text-[#2D3748]">
                  Dossier éducatif : {activeChild.firstName}
                </h2>
                <span className="bg-[#2A6FB5]/10 text-[#2A6FB5] text-xs font-bold px-3 py-1 rounded-full">
                  Niveau {activeChild.settings.difficulty} / 5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7A8C] mt-1">
                Profil Trisomie 21 • Modalité d'accompagnement : <strong>{activeChild.settings.independence}</strong> • {activeChild.settings.answerChoices} choix de réponses
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              {[
                { id: 'objectives', label: 'Objectifs ciblés' },
                { id: 'settings', label: 'Paramétrage fin' },
                { id: 'history', label: 'Historique de session' },
                { id: 'synthesis', label: 'Synthèse pluridisciplinaire' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-[#2D3748] shadow-xs'
                      : 'text-[#6B7A8C] hover:text-[#2D3748]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Objectives & Clinical Domains */}
          {activeTab === 'objectives' && (
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeChild.objectives.map((obj) => (
                  <div key={obj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold uppercase tracking-wider text-[#2A6FB5]">
                        {obj.module}
                      </span>
                      <span className="font-extrabold text-[#2D3748]">
                        {obj.progress}%
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#2D3748] mb-3 leading-snug">
                      {obj.title}
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2A6FB5]"
                        style={{ width: `${obj.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Competency by module */}
              <div className="mt-6">
                <h4 className="font-bold text-sm text-[#2D3748] mb-3">
                  Synthèse des compétences validées dans la session
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'learn', label: 'APPRENDRE', color: '#2A6FB5', note: 'Appariement & Dénombrement' },
                    { id: 'communicate', label: 'COMMUNIQUER', color: '#E84545', note: 'Discrimination des émotions' },
                    { id: 'move', label: 'BOUGER (Caméra)', color: '#22a06b', note: 'Coordination & Imitation motrice' },
                    { id: 'grow', label: 'GRANDIR', color: '#F5A623', note: 'Séquençage chronologique' },
                  ].map((m) => {
                    const prog = activeChild.moduleProgress[m.id] || { completedCount: 0, totalActivities: 4, stars: 0 };
                    return (
                      <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <span className="text-xs font-bold" style={{ color: m.color }}>
                          {m.label}
                        </span>
                        <p className="text-xs text-[#6B7A8C] mt-0.5 mb-2">{m.note}</p>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-bold text-[#2D3748]">
                            {prog.completedCount} / {prog.totalActivities} validés
                          </span>
                          <span className="font-bold text-amber-500">
                            {prog.stars} ⭐
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Fine-grained clinical settings */}
          {activeTab === 'settings' && (
            <div className="pt-6 space-y-6">
              <p className="text-xs text-[#6B7A8C]">
                Ajustez les paramètres techniques appliqués aux activités de {activeChild.firstName}. Ces options s'accordent avec le PPA (Projet Personnalisé d'Accompagnement).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-[#2D3748] mb-1">
                    Charge cognitive (Choix de réponses)
                  </label>
                  <p className="text-[11px] text-[#6B7A8C] mb-3">
                    Nombre d'items concurrents proposés à l'écran.
                  </p>
                  <div className="flex gap-2">
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          updateSettings(activeChild.id, { answerChoices: n });
                          showToast(`Choix réglés sur ${n}`);
                        }}
                        className={`flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                          currentSettings.answerChoices === n
                            ? 'bg-[#2A6FB5] text-white'
                            : 'bg-white border border-slate-200 text-[#2D3748]'
                        }`}
                      >
                        {n} choix
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-[#2D3748] mb-1">
                    Double encodage (Synthèse vocale)
                  </label>
                  <p className="text-[11px] text-[#6B7A8C] mb-3">
                    Lecture systématique des consignes et retours sonores.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings(activeChild.id, { audio: true });
                        showToast('Audio activé');
                      }}
                      className={`flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                        currentSettings.audio
                          ? 'bg-[#2A6FB5] text-white'
                          : 'bg-white border border-slate-200 text-[#2D3748]'
                      }`}
                    >
                      Oui (Soutenu)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings(activeChild.id, { audio: false });
                        showToast('Audio coupé');
                      }}
                      className={`flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                        !currentSettings.audio
                          ? 'bg-[#2A6FB5] text-white'
                          : 'bg-white border border-slate-200 text-[#2D3748]'
                      }`}
                    >
                      Non (Autonome)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-[#2D3748] mb-1">
                    Niveau d'étayage (Indices)
                  </label>
                  <p className="text-[11px] text-[#6B7A8C] mb-3">
                    Nombre d'aides graduées fournies avant résolution.
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          updateSettings(activeChild.id, { hints: h });
                          showToast(`${h} indice(s) maximum`);
                        }}
                        className={`flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition-all ${
                          currentSettings.hints === h
                            ? 'bg-[#F5A623] text-white'
                            : 'bg-white border border-slate-200 text-[#2D3748]'
                        }`}
                      >
                        {h} max
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Detailed History */}
          {activeTab === 'history' && (
            <div className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[#6B7A8C]">
                      <th className="py-2.5 font-bold">Activité</th>
                      <th className="py-2.5 font-bold">Module</th>
                      <th className="py-2.5 font-bold">Date & Heure</th>
                      <th className="py-2.5 font-bold text-right">Résultat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeChild.history.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-[#2D3748]">{h.label}</td>
                        <td className="py-3 uppercase text-[10px] font-bold text-[#2A6FB5]">{h.module}</td>
                        <td className="py-3 text-[#6B7A8C]">{h.date}</td>
                        <td className="py-3 text-right font-bold text-amber-500">
                          {h.score} / {h.maxScore} ⭐
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Synthesis & Printable Note */}
          {activeTab === 'synthesis' && (
            <div className="pt-6 space-y-4">
              <div className="p-5 rounded-2xl bg-[#EBF4FF]/30 border border-[#2A6FB5]/30">
                <h4 className="font-bold text-sm text-[#2A6FB5] mb-2">
                  Synthèse d'observation pour l'équipe éducative & thérapeutique
                </h4>
                <p className="text-xs text-[#2D3748] leading-relaxed mb-3">
                  L'élève <strong>{activeChild.firstName}</strong> {activeChild.age ? `(${activeChild.age} ans)` : ''} présente un engagement positif dans les activités à fort étayage visuel. La limitation à <strong>{activeChild.settings.answerChoices} choix</strong> et le maintien de la synthèse vocale facilitent son entrée dans la tâche sans découragement.
                </p>
                <div className="text-xs font-semibold text-[#6B7A8C] flex flex-wrap gap-4 pt-2 border-t border-[#2A6FB5]/20">
                  <span>Recommandation motrice : Poursuivre le travail de posture avec la caméra</span>
                  <span>Autonomie : Favoriser l'enchaînement de la routine du brossage</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
