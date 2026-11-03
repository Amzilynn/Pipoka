import React from 'react';
import './ScreenWrapper.css';

const DECORATIONS = [
  { char: '⭐', style: { top: '5%', left: '3%', '--d': '3.2s', '--delay': '0s' } },
  { char: '💛', style: { top: '8%', right: '5%', '--d': '4s', '--delay': '0.5s' } },
  { char: '✨', style: { top: '15%', left: '8%', '--d': '5s', '--delay': '1.2s' } },
  { char: '🌸', style: { bottom: '20%', left: '4%', '--d': '3.8s', '--delay': '0.8s' } },
  { char: '🍀', style: { bottom: '15%', right: '3%', '--d': '4.5s', '--delay': '0.3s' } },
  { char: '💫', style: { top: '50%', left: '1%', '--d': '6s', '--delay': '1.5s' } },
  { char: '🌟', style: { top: '40%', right: '1%', '--d': '4.2s', '--delay': '0.7s' } },
];

import { motion } from 'framer-motion';

export default function ScreenWrapper({ 
  children, 
  header, 
  footer, 
  className = '', 
  dataLevel,
  dir = 'ltr' 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`screen ${className}`} 
      data-level={dataLevel} 
      dir={dir}
    >
      <div className="bg-decorations" aria-hidden="true">
        {DECORATIONS.map((deco, i) => (
          <span 
            key={i} 
            className="deco" 
            style={{ 
              ...deco.style, 
              fontSize: 'clamp(14px, 2.5vmin, 22px)' 
            }}
          >
            {deco.char}
          </span>
        ))}
      </div>

      {header && <header className="app-header">{header}</header>}
      
      <main className="screen-content">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
          style={{ 
            width: '100%', 
            flex: 1,
            minHeight: 0,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </motion.div>
      </main>

      {footer && <footer className="app-footer">{footer}</footer>}
    </motion.div>
  );
}
