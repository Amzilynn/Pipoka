import React from 'react';

/**
 * Premium SVG Quantity Illustrations
 * Renders Apples, Stars, or Balloons with details
 */
export default function QuantityIllustration({ type = 'apple', size = 40, color }) {
  const [useFallback, setUseFallback] = React.useState(false);
  const imagePath = `/assets/images/${type}.png`;
  
  const s = size;
  const stroke = "#2D2D2D";
  const strokeW = 4;

  if (!useFallback) {
    return (
      <img 
        src={imagePath} 
        alt={type}
        width={s}
        height={s}
        className="object-contain"
        onError={() => setUseFallback(true)}
        style={color ? { filter: `hue-rotate(${Math.random() * 360}deg)` } : {}}
      />
    );
  }

  // Define default colors if none provided
  const primaryColor = color || {
    apple: '#FF6B6B',
    star: '#FFD93D',
    balloon: '#4D96FF',
    cake: '#F4A261',
    tree: '#4CAF50',
    candy: '#FECFEF',
    car: '#4D96FF',
    flower: '#FFB7B2',
    heart: '#FF4D4D',
    moon: '#FFD700'
  }[type] || '#FFD93D';

  switch (type) {
    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stem */}
          <path d="M50 25C50 15 55 10 60 8" stroke="#4A2D1B" strokeWidth="4" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M50 20C40 10 30 15 32 25C34 35 48 25 50 20Z" fill="#6BCB77" stroke={stroke} strokeWidth="2" />
          {/* Fruit */}
          <path d="M50 30C35 30 20 40 20 60C20 85 40 92 50 92C60 92 80 85 80 60C80 40 65 30 50 30Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} />
          {/* Highlight */}
          <circle cx="35" cy="50" r="6" fill="white" fillOpacity="0.3" />
        </svg>
      );
    case 'star':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L63 35L95 35L70 55L80 85L50 70L20 85L30 55L5 35L37 35L50 5Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Detail */}
          <path d="M50 20L58 38H78L62 50L68 70L50 60Z" fill="white" fillOpacity="0.25" />
        </svg>
      );
    case 'balloon':
      return (
        <svg width={s} height={s} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* String */}
          <path d="M50 85Q50 95 45 105" stroke={stroke} strokeWidth="2" strokeDasharray="4 4" />
          {/* Balloon body */}
          <ellipse cx="50" cy="45" rx="35" ry="40" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} />
          {/* Bottom knot */}
          <path d="M42 85L58 85L50 78Z" fill={primaryColor} stroke={stroke} strokeWidth="2" />
          {/* Shine */}
          <ellipse cx="35" cy="30" rx="10" ry="8" fill="white" fillOpacity="0.35" transform="rotate(-30 35 30)" />
        </svg>
      );
    case 'cake':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base */}
          <path d="M20 70H80V80C80 85.5228 75.5228 90 70 90H30C24.4772 90 20 85.5228 20 80V70Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} />
          {/* Top icing */}
          <path d="M15 70C15 65 20 60 25 60C30 60 35 65 40 65C45 65 50 60 55 60C60 60 65 65 70 65C75 65 80 60 85 60C90 60 92 65 85 70H15Z" fill="#FFB5A7" stroke={stroke} strokeWidth={strokeW} strokeLinecap="round" />
          <path d="M25 60V40H75V60" fill="#FFCDB2" stroke={stroke} strokeWidth={strokeW} />
          {/* Candle */}
          <path d="M48 40V25H52V40H48Z" fill="#E9C46A" stroke={stroke} strokeWidth="2" />
          <path d="M50 22C48 20 48 15 50 10C52 15 52 20 50 22Z" fill="#E76F51" />
        </svg>
      );
    case 'tree':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trunk */}
          <path d="M40 90H60L55 50H45L40 90Z" fill="#8B5A2B" stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Leaves */}
          <path d="M50 10C35 10 20 25 25 45C15 45 10 60 20 70C25 75 35 75 40 70C45 75 55 75 60 70C70 75 80 75 85 70C95 60 90 45 80 45C85 25 70 10 50 10Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
        </svg>
      );
    case 'candy':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left wrapper */}
          <path d="M30 50L10 35V65L30 50Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Right wrapper */}
          <path d="M70 50L90 35V65L70 50Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Candy body */}
          <circle cx="50" cy="50" r="20" fill={primaryColor} fillOpacity="0.5" stroke={stroke} strokeWidth={strokeW} />
          {/* Swirl */}
          <path d="M40 40C50 35 60 45 50 60C40 70 30 60 40 50" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'car':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top */}
          <path d="M30 40L40 25H70L80 40" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Body */}
          <path d="M15 40H85C90.5228 40 95 44.4772 95 50V60C95 65.5228 90.5228 70 85 70H15C9.47715 70 5 65.5228 5 60V50C5 44.4772 9.47715 40 15 40Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Windows */}
          <path d="M40 25V40M70 25V40" stroke={stroke} strokeWidth={strokeW} />
          {/* Wheels */}
          <circle cx="30" cy="70" r="12" fill="#333" stroke={stroke} strokeWidth="3" />
          <circle cx="30" cy="70" r="4" fill="#CCC" />
          <circle cx="70" cy="70" r="12" fill="#333" stroke={stroke} strokeWidth="3" />
          <circle cx="70" cy="70" r="4" fill="#CCC" />
        </svg>
      );
    case 'flower':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stem */}
          <path d="M50 50V90" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 70C40 70 35 60 30 55" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
          {/* Petals */}
          <circle cx="50" cy="25" r="15" fill={primaryColor} stroke={stroke} strokeWidth="2" />
          <circle cx="75" cy="50" r="15" fill={primaryColor} stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="75" r="15" fill={primaryColor} stroke={stroke} strokeWidth="2" />
          <circle cx="25" cy="50" r="15" fill={primaryColor} stroke={stroke} strokeWidth="2" />
          {/* Center */}
          <circle cx="50" cy="50" r="15" fill="#FFD700" stroke={stroke} strokeWidth="3" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 85C50 85 15 55 15 35C15 20 28 15 37 20C44 24 50 32 50 32C50 32 56 24 63 20C72 15 85 20 85 35C85 55 50 85 50 85Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
          <path d="M75 30C80 35 80 40 75 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 15C30 20 20 35 20 50C20 70 35 85 55 85C70 85 80 75 85 60C75 70 55 70 45 55C35 40 40 25 45 15Z" fill={primaryColor} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
        </svg>
      );
    default:
      return <span>❓</span>;
  }
}
