import React from 'react';
import './InstructionBanner.css';

const InstructionBanner = ({ text, onSpeak }) => {
  return (
    <div className="instruction-banner" onClick={onSpeak}>
      <div className="speaker-icon">
        🔊
      </div>
      <p className="instruction-text">{text}</p>
    </div>
  );
};

export default InstructionBanner;
