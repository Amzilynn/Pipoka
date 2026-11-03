import React, { useEffect, useState } from 'react';
import './Sparkles.css';

const Sparkles = ({ active, x = 0, y = 0 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        index: i
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="sparkles-container" style={{ left: x, top: y }}>
      {particles.map(p => (
        <div key={p.id} className="sparkle-particle"></div>
      ))}
    </div>
  );
};

export default Sparkles;
