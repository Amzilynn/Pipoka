import React from 'react';
import './ProgressStars.css';

const ProgressStars = ({ total, current, variant = 'standard' }) => {
  const isV3 = variant === 'v3-stars';

  return (
    <div className={`progress-stars ${variant}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span 
          key={i} 
          className={`star-unit ${i < current ? 'earned' : ''}`}
        >
          {i < current ? '⭐' : isV3 ? '🔘' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default ProgressStars;
