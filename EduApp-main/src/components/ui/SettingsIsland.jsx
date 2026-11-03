import React from 'react';
import { motion } from 'framer-motion';
import './SettingsIsland.css';

const EiffelTower = () => (
  <svg viewBox="0 0 100 100" className="icon-svg tower">
    <path d="M50 10 L45 30 L55 30 Z" fill="#2D2D2D" />
    <path d="M45 30 L40 60 L60 60 L55 30 Z" fill="#4A4A4A" />
    <path d="M40 60 L30 90 L70 90 L60 60 Z" fill="#2D2D2D" />
    <rect x="35" y="85" width="30" height="5" fill="#4A4A4A" />
    <path d="M45 40 H55" stroke="white" strokeWidth="2" />
    <path d="M42 65 H58" stroke="white" strokeWidth="2" />
  </svg>
);

const CrescentMoon = () => (
  <svg viewBox="0 0 100 100" className="icon-svg moon">
    <path d="M70 20 A40 40 0 1 0 70 80 A30 30 0 1 1 70 20" fill="#FFD700" filter="drop-shadow(0 0 8px rgba(255,215,0,0.5))" />
    <path d="M65 45 L68 52 L75 52 L69 56 L71 63 L65 59 L59 63 L61 56 L55 52 L62 52 Z" fill="white" />
  </svg>
);

const Avatar = ({ type, active }) => (
  <div className={`avatar-3d ${type} ${active ? 'active' : ''}`}>
    <div className="avatar-head">
      <div className="avatar-face">
        <div className="avatar-eyes">
          <div className="avatar-eye"></div>
          <div className="avatar-eye"></div>
        </div>
        <div className="avatar-smile"></div>
      </div>
      {type === 'girl' ? <div className="avatar-hair-girl"></div> : <div className="avatar-hair-boy"></div>}
    </div>
    <div className="avatar-body"></div>
  </div>
);

export default function SettingsIsland({ settings, onLanguageChange, onVoiceChange, isAr }) {
  return (
    <motion.div 
      className="settings-island-frosted"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* Languages */}
      <div className="settings-section">
        <h4 className="settings-label">{isAr ? 'اللغة' : 'Langue'}</h4>
        <div className="settings-options-row">
          <button 
            className={`setting-pill-large ${settings.language === 'fr' ? 'active' : ''}`}
            onClick={() => onLanguageChange('fr')}
          >
            <div className="icon-container-3d"><EiffelTower /></div>
            <div className="flag-sub">FR</div>
          </button>
          <button 
            className={`setting-pill-large ${settings.language === 'ar' ? 'active' : ''}`}
            onClick={() => onLanguageChange('ar')}
          >
            <div className="icon-container-3d"><CrescentMoon /></div>
            <div className="flag-sub">AR</div>
          </button>
        </div>
      </div>

      <div className="settings-divider"></div>

      {/* Voices */}
      <div className="settings-section">
        <h4 className="settings-label">{isAr ? 'الصوت' : 'Voix'}</h4>
        <div className="settings-options-row">
          <button 
            className={`setting-pill-large ${settings.voiceType === 'child_female' ? 'active' : ''}`}
            onClick={() => onVoiceChange('child_female')}
          >
            <Avatar type="girl" active={settings.voiceType === 'child_female'} />
            <span className="avatar-label">{isAr ? 'بنت' : 'Fille'}</span>
          </button>
          <button 
            className={`setting-pill-large ${settings.voiceType === 'child_male' ? 'active' : ''}`}
            onClick={() => onVoiceChange('child_male')}
          >
            <Avatar type="boy" active={settings.voiceType === 'child_male'} />
            <span className="avatar-label">{isAr ? 'ولد' : 'Garçon'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
