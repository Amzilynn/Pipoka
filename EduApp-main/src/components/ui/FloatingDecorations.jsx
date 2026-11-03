import React from 'react';
import { motion } from 'framer-motion';
import './FloatingDecorations.css';

const shapes = [
  { id: 1, type: 'cube', color: '#B2EBF2', size: 40, top: '15%', left: '10%', duration: 8 },
  { id: 2, type: 'sphere', color: '#FFF9C4', size: 60, top: '70%', left: '80%', duration: 10 },
  { id: 3, type: 'pyramid', color: '#F8BBD0', size: 30, top: '40%', left: '85%', duration: 7 },
  { id: 4, type: 'torus', color: '#E1BEE7', size: 50, top: '80%', left: '15%', duration: 12 },
  { id: 5, type: 'cube', color: '#C8E6C9', size: 35, top: '10%', left: '70%', duration: 9 },
];

const Sparkle = ({ style }) => (
  <motion.div
    className="deco-sparkle"
    style={style}
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.8, 0.3],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

export default function FloatingDecorations() {
  return (
    <div className="decorations-container">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`deco-shape ${shape.type}-3d`}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            background: shape.color,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Random Sparkles */}
      <Sparkle style={{ top: '20%', left: '30%' }} />
      <Sparkle style={{ top: '60%', left: '20%' }} />
      <Sparkle style={{ top: '40%', left: '60%' }} />
      <Sparkle style={{ top: '85%', left: '50%' }} />
      <Sparkle style={{ top: '15%', left: '90%' }} />
    </div>
  );
}
