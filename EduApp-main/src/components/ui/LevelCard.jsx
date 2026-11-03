import React from 'react';
import { motion } from 'framer-motion';
import Mascot from '../Mascot';
import './LevelCard.css';

export default function LevelCard({ level, isSelected, onSelect, isAr }) {
  const mascotType = level.id === 3 ? 'sunny' : level.id === 4 ? 'heart' : 'star';
  
  
  const ageText = isAr 
    ? (level.id === 1 ? 'سنة' : 'سنوات')
    : (level.id === 1 ? 'An' : 'Ans');

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(level.id)}
      className={`level-card-3d ${isSelected ? 'selected' : ''}`}
    >
      <div className="card-inner-glow"></div>
      <div className="level-card-content">
         <div className="mascot-wrapper-3d">
            <Mascot type={mascotType} />
         </div>
         <div className="mascot-age-label">
           {level.id} {ageText}
         </div>
      </div>
    </motion.div>
  );
}
