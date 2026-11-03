import React from 'react';

/**
 * Inline SVG Family Member Illustrations
 * Friendly, rounded, cartoon-style characters
 */

const FAMILY_MEMBERS = {
  'family-mere': { emoji: '👩', label: 'Mère', primaryColor: '#FF9A9E', hairColor: '#4A3728', skinColor: '#F9C784', clothColor: '#FF6B9D' },
  'family-pere': { emoji: '👨', label: 'Père', primaryColor: '#4D96FF', hairColor: '#2C2C2C', skinColor: '#F9C784', clothColor: '#4D96FF' },
  'family-frere': { emoji: '👦', label: 'Frère', primaryColor: '#6BCB77', hairColor: '#4A3728', skinColor: '#F9C784', clothColor: '#6BCB77' },
  'family-soeur': { emoji: '👧', label: 'Sœur', primaryColor: '#C77DFF', hairColor: '#8B4513', skinColor: '#F9C784', clothColor: '#C77DFF' },
  'family-grandmere': { emoji: '👵', label: 'Grand-mère', primaryColor: '#FF6B6B', hairColor: '#A0A0A0', skinColor: '#F4B77E', clothColor: '#FF6B6B' },
  'family-grandpere': { emoji: '👴', label: 'Grand-père', primaryColor: '#FFD93D', hairColor: '#A0A0A0', skinColor: '#F4B77E', clothColor: '#FFD93D' },
};

function PersonSVG({ config, size = 100, isGrandparent = false, isMale = true }) {
  const { skinColor, hairColor, clothColor } = config;
  const w = size;
  const h = size;

  return (
    <svg width={w} height={h} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="95" rx="28" ry="22" fill={clothColor} stroke="#2D2D2D" strokeWidth="3.5" />
      {/* Neck */}
      <rect x="44" y="68" width="12" height="12" rx="4" fill={skinColor} />
      {/* Head */}
      <ellipse cx="50" cy="55" rx="26" ry="28" fill={skinColor} stroke="#2D2D2D" strokeWidth="3.5" />
      {/* Hair */}
      {isGrandparent ? (
        <>
          <ellipse cx="50" cy="32" rx="26" ry="14" fill={hairColor} />
          {isMale && <ellipse cx="50" cy="28" rx="12" ry="7" fill="#C0C0C0" />}
        </>
      ) : isMale ? (
        <ellipse cx="50" cy="31" rx="26" ry="13" fill={hairColor} />
      ) : (
        <>
          <ellipse cx="50" cy="31" rx="26" ry="13" fill={hairColor} />
          <ellipse cx="26" cy="55" rx="7" ry="18" fill={hairColor} />
          <ellipse cx="74" cy="55" rx="7" ry="18" fill={hairColor} />
        </>
      )}
      {/* Eyes */}
      <ellipse cx="40" cy="55" rx="5" ry="6" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <ellipse cx="60" cy="55" rx="5" ry="6" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="41" cy="56" r="3" fill="#2D2D2D" />
      <circle cx="61" cy="56" r="3" fill="#2D2D2D" />
      <circle cx="42" cy="54" r="1" fill="white" />
      <circle cx="62" cy="54" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="64" rx="3" ry="2.5" fill={skinColor} stroke="#2D2D2D" strokeWidth="1.5" />
      {/* Smile */}
      <path d="M 40 72 Q 50 80 60 72" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Rosy cheeks */}
      <circle cx="35" cy="67" r="5" fill="rgba(255,100,100,0.25)" />
      <circle cx="65" cy="67" r="5" fill="rgba(255,100,100,0.25)" />
      {/* Arms */}
      <ellipse cx="22" cy="90" rx="8" ry="14" fill={clothColor} stroke="#2D2D2D" strokeWidth="3.5" />
      <ellipse cx="78" cy="90" rx="8" ry="14" fill={clothColor} stroke="#2D2D2D" strokeWidth="3.5" />
    </svg>
  );
}

export default function FamilyIllustration({ memberId, size = 100 }) {
  const config = FAMILY_MEMBERS[memberId];
  const [useFallback, setUseFallback] = React.useState(false);
  
  // Real images are stored in public/assets/images/[memberId].png
  const imagePath = `/assets/images/${memberId}.png`;

  if (!config) {
    return <span style={{ fontSize: size * 0.7 }}>👤</span>;
  }

  const isGrandparent = memberId.includes('grand');
  const isMale = memberId.includes('pere') || memberId.includes('frere') || memberId.includes('grandpere');

  return (
    <div className="v3-family-illustration-wrap" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!useFallback ? (
        <img 
          src={imagePath} 
          alt={config.label}
          className="v3-clay-illustration"
          onError={() => setUseFallback(true)}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain', /* KEY FIX: stop cropping */
            display: 'block'
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white/50 rounded-[20px] backdrop-blur-sm shadow-sm border-2 border-white/20">
          <PersonSVG config={config} size={60} isGrandparent={isGrandparent} isMale={isMale} />
        </div>
      )}
    </div>
  );
}
