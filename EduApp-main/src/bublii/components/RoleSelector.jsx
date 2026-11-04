import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBublii } from '../context/BubliiContext';

import Logo from './Logo';

export default function RoleSelector() {
  const navigate = useNavigate();
  const { setCurrentRole, selectedChildId, switchChild, profiles, activeChild } = useBublii();

  const handleSelectRole = (roleKey, targetPath) => {
    setCurrentRole(roleKey);
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen bublii-bg-canvas text-[#1E293B] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header & Brand */}
      <header className="brand-welcome max-w-4xl mx-auto w-full pt-4 text-center">
        <Logo size="lg" />

        {/* Profile Selector */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-sm">
          <span className="text-xs font-black text-[#64748B] px-2 uppercase tracking-wider">
            Enfant :
          </span>
          {profiles.map((p) => {
            const isSelected = p.id === selectedChildId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => switchChild(p.id)}
                className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A6FB5] text-white shadow-sm ring-2 ring-[#2A6FB5]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#1E293B]'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-black"
                  style={{ background: p.avatar.color }}
                >
                  {p.avatar.initial}
                </span>
                <span>{p.firstName}</span>
                <span className="opacity-80 text-[10px]">({p.age} ans)</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Role Selection 3-Card Grid (Simplified, Beautiful) */}
      <main className="max-w-4xl mx-auto w-full my-8">

        <h2 className="sr-only">Choisissez votre espace</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. ENFANT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('enfant', '/enfant')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectRole('enfant', '/enfant')}
            className="group bg-white rounded-[2rem] p-7 border-4 border-[#2A6FB5]/30 hover:border-[#2A6FB5] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            style={{
              boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(42, 111, 177, 0.2)'
            }}
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#EBF4FF] text-[#2A6FB5] flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform shadow-xs">
                E
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#2A6FB5]/15 text-[#2A6FB5] mb-2">
                Espace Enfant
              </div>
              <h3 className="font-['Fredoka'] text-2xl font-black text-[#1E293B] group-hover:text-[#2A6FB5] transition-colors">
                Je joue et j'explore
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-base font-black text-[#2A6FB5]">
              <span>Jouer avec {activeChild.firstName}</span>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>

          {/* 2. PARENT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('parent', '/parent')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectRole('parent', '/parent')}
            className="group bg-white rounded-[2rem] p-7 border-4 border-[#E84545]/30 hover:border-[#E84545] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            style={{
              boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(232, 69, 69, 0.2)'
            }}
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#FFF5F5] text-[#E84545] flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform shadow-xs">
                P
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E84545]/15 text-[#E84545] mb-2">
                Espace Parent
              </div>
              <h3 className="font-['Fredoka'] text-2xl font-black text-[#1E293B] group-hover:text-[#E84545] transition-colors">
                Suivi & Réglages
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-base font-black text-[#E84545]">
              <span>Tableau de bord</span>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>

          {/* 3. SPÉCIALISTE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectRole('specialiste', '/specialiste')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectRole('specialiste', '/specialiste')}
            className="group bg-white rounded-[2rem] p-7 border-4 border-[#22A06B]/30 hover:border-[#22A06B] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            style={{
              boxShadow: '0 8px 0 #E2E8F0, 0 16px 28px -10px rgba(34, 160, 107, 0.2)'
            }}
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] text-[#22A06B] flex items-center justify-center text-3xl font-black mb-4 group-hover:scale-110 transition-transform shadow-xs">
                S
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#22A06B]/15 text-[#22A06B] mb-2">
                Spécialiste & ESMS
              </div>
              <h3 className="font-['Fredoka'] text-2xl font-black text-[#1E293B] group-hover:text-[#22A06B] transition-colors">
                PPA & Objectifs
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-base font-black text-[#22A06B]">
              <span>Espace pro</span>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-bold text-[#64748B]">
        Boblii • Espace adapté à la trisomie 21
      </footer>
    </div>
  );
}
