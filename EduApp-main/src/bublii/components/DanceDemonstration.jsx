import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const REST = ['M110 104 Q87 135 91 163', 'M190 104 Q213 135 209 163'];
const POSES = {
  arms: ['M110 104 Q78 78 80 30', 'M190 104 Q222 78 220 30', [80,30], [220,30]],
  head: ['M110 104 Q83 65 130 37', 'M190 104 Q217 65 170 37', [130,37], [170,37]],
  clap: ['M110 104 Q98 142 146 126', 'M190 104 Q202 142 154 126', [146,126], [154,126]],
};

export default function DanceDemonstration({ gesture, still, onComplete }) {
  const reduced = useReducedMotion();
  const pose = POSES[gesture] || POSES.arms;
  const animate = !reduced && !still;
  // With reduced motion, leave time to observe the pose before the child's turn.
  useEffect(() => {
    if (animate || !onComplete) return;
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [animate, onComplete]);
  const transition = { duration: 3.2, times: [0, 0.2, 0.7, 1], ease: 'easeInOut' };
  return <svg viewBox="0 0 300 280" role="img" aria-label="Modèle du mouvement à imiter" className="h-full w-full">
    <ellipse cx="150" cy="263" rx="65" ry="7" fill="#D7E7DF" />
    <path d="M136 174 L129 218 L124 252 M164 174 L171 218 L176 252" stroke="#6275A0" strokeWidth="19" strokeLinecap="round" fill="none" />
    <path d="M111 101 Q150 86 189 101 L181 180 Q150 193 119 180 Z" fill="#43886D" />
    <path d="M139 80 V100 Q150 108 161 100 V80" fill="#EAB18C" />
    <circle cx="150" cy="58" r="32" fill="#F3C7A5" />
    <path d="M119 54 Q110 20 149 23 Q188 18 182 53 L168 42 Q145 57 126 43Z" fill="#634A42" />
    <circle cx="139" cy="59" r="3" fill="#303C49" /><circle cx="161" cy="59" r="3" fill="#303C49" />
    <path d="M139 72 Q150 83 161 72" stroke="#694B42" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[0,1].map(i => <React.Fragment key={`${gesture}-${i}`}>
      <motion.path d={pose[i]} initial={animate ? { d: REST[i] } : false} animate={{ d: animate ? [REST[i], REST[i], pose[i], pose[i]] : pose[i] }} transition={transition} onAnimationComplete={animate && i === 0 ? onComplete : undefined} fill="none" stroke="#F3C7A5" strokeWidth="14" strokeLinecap="round" />
      <motion.circle r="9" fill="#F3C7A5" initial={animate ? { cx: i ? 209 : 91, cy: 163 } : false} animate={{ cx: animate ? [i ? 209 : 91, i ? 209 : 91, pose[i+2][0], pose[i+2][0]] : pose[i+2][0], cy: animate ? [163,163,pose[i+2][1],pose[i+2][1]] : pose[i+2][1] }} transition={transition} />
    </React.Fragment>)}
  </svg>;
}