import React from 'react';
import './DragChip.css';

const DragChip = ({ text, color, dragging, placed, onDragStart, onDragEnd, style, index = 0 }) => {
  const palette = ['#FFF8D6', '#FFE8E8', '#E8F8FF', '#E8FFE8', '#F5EEFF', '#FFF4E8'];
  const borderPalette = ['#FFD93D55', '#FF6B6B55', '#74C7EC55', '#6BCB7755', '#C77DFF55', '#FF9A3C55'];
  
  const bg = palette[index % palette.length];
  const border = borderPalette[index % borderPalette.length];

  return (
    <div 
      className={`drag-chip ${dragging ? 'dragging' : ''} ${placed ? 'placed' : ''}`}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      style={{ 
        '--chip-color': color, 
        backgroundColor: bg,
        borderColor: border,
        ...style 
      }}
    >
      <span className="chip-dot"></span>
      <span className="chip-text">{text}</span>
    </div>
  );
};

export default DragChip;
