import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import BigButton from '../components/ui/BigButton';
import LevelCard from '../components/ui/LevelCard';
import ScreenWrapper from '../components/layout/ScreenWrapper';
import FloatingDecorations from '../components/ui/FloatingDecorations';
import SettingsIsland from '../components/ui/SettingsIsland';
import './ConfigScreen.css';

const LEVELS = [
  { id: 3, name: 'Petite Section' },
  { id: 4, name: 'Moyenne Section' },
  { id: 5, name: 'Grande Section' },
];

export default function ConfigScreen() {
  const { settings, dispatch } = useSettings();
  const navigate = useNavigate();
  const isAr = settings.language === 'ar';

  const canStart = settings.level && settings.language && settings.voiceType;

  function handleStart() {
    dispatch({ type: 'CONFIRM' });
    navigate('/categories');
  }

  return (
    <ScreenWrapper 
      noHeader
      dataLevel={settings.level || 3}
      dir="ltr"
      className="config-screen-v2 edukids-home-8k"
    >
      <FloatingDecorations />

      <div className="central-visual-path">
        {/* Top Branding */}
        <motion.div 
          className="brand-logo-area"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="edukids-logo-colorful" dir="ltr">
            <span className="logo-letter c1">E</span>
            <span className="logo-letter c2">d</span>
            <span className="logo-letter c3">u</span>
            <span className="logo-letter c4">K</span>
            <span className="logo-letter c5">i</span>
            <span className="logo-letter c6">d</span>
            <span className="logo-letter c1">s</span>
          </div>
          <motion.div 
            className="instruction-badge"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <h3>{isAr ? 'كم عمرك؟' : 'Quel âge as-tu ?'}</h3>
            <span className="down-arrow-icon">↓</span>
          </motion.div>
        </motion.div>

        {/* Central Age Selection */}
        <section className="age-selection-band">
          <div className="age-pill-grid">
            {LEVELS.map(lvl => (
              <LevelCard
                key={lvl.id}
                level={lvl}
                isSelected={settings.level === lvl.id}
                onSelect={(id) => dispatch({ type: 'SET_LEVEL', payload: id })}
                isAr={isAr}
              />
            ))}
          </div>
        </section>

        {/* Settings Island */}
        <SettingsIsland 
          settings={settings}
          isAr={isAr}
          onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
          onVoiceChange={(voice) => dispatch({ type: 'SET_VOICE', payload: voice })}
        />

        {/* Global CTA */}
        <div className="cta-container-8k">
          <BigButton
            onClick={handleStart}
            disabled={!canStart}
            variant="primary"
          >
            <span className="btn-text">{isAr ? 'ابدأ الأن' : 'COMMENCER'}</span>
            <span className="play-icon">▶</span>
          </BigButton>
        </div>

      </div>
    </ScreenWrapper>
  );
}
