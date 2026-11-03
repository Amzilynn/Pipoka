import React from 'react';
import './DropZone.css';

const DropZone = ({ image, label, isOver, isFilled, hintGlow }) => {
  return (
    <div className={`drop-zone-card ${isOver ? 'drag-over' : ''} ${isFilled ? 'filled' : ''} ${hintGlow ? 'hint-glow' : ''}`}>
      <div className="image-area">
        {image && <img src={image} alt="target" className="target-image" />}
      </div>
      <div className="label-slot">
        {label || "???"}
      </div>
    </div>
  );
};

export default DropZone;
