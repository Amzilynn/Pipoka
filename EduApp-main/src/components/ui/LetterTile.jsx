import React from 'react';
import './LetterTile.css';

const LetterTile = ({ letter, onClick, tapped, used, index = 0 }) => {
  return (
    <div 
      className={`letter-tile ${tapped ? 'tapped' : ''} ${used ? 'used' : ''}`}
      onClick={onClick}
      style={{ '--tile-delay': `${index * 50}ms` }}
    >
      {letter}
    </div>
  );
};

export default LetterTile;
