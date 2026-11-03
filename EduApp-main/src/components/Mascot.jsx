import React from 'react';
import './Mascot.css';

const Mascot = ({ type = 'sunny', state = 'idle', className = '' }) => {
  const isSunny = type === 'sunny';
  const isRiko = type === 'riko';
  const isLuna = type === 'luna';
  const isHeart = type === 'heart';
  const isStar = type === 'star';

  return (
    <div className={`mascot-container ${type} ${state} ${className}`}>
      <svg viewBox="0 0 100 120" className="mascot-svg">
        {/* Shadow Platform */}
        <ellipse 
          cx="50" cy="112" rx="35" ry="6" 
          fill="rgba(0,0,0,0.15)" 
          className="mascot-shadow" 
        />

        <g className="mascot-body-group">
          <defs>
            <radialGradient id="sunnyGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="100%" stopColor="var(--color-primary)" />
            </radialGradient>
            <radialGradient id="rikoGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFCC80" />
                <stop offset="100%" stopColor="var(--color-accent)" />
            </radialGradient>
            <radialGradient id="lunaGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#E1BEE7" />
                <stop offset="100%" stopColor="#C77DFF" />
            </radialGradient>
            <radialGradient id="heartGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff7eb3" />
                <stop offset="50%" stopColor="#ff758c" />
                <stop offset="100%" stopColor="#ff4b2b" />
            </radialGradient>
            <radialGradient id="starGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="40%" stopColor="#FFC107" />
                <stop offset="100%" stopColor="#FFA000" />
            </radialGradient>
          </defs>

          {isHeart && (
            <path 
              d="M50 40 C30 10 0 30 0 65 C0 95 50 115 50 115 C50 115 100 95 100 65 C100 30 70 10 50 40 Z" 
              fill="url(#heartGrad)" 
              className="body-part heartbeat" 
              transform="translate(0, -10)"
            />
          )}

          {isStar && (
             <path 
              d="M50 15 L61 45 L95 45 L68 65 L78 95 L50 75 L22 95 L32 65 L5 45 L39 45 Z" 
              fill="url(#starGrad)" 
              className="body-part star-rotate" 
            />
          )}

          {isSunny && (
            <>
              {/* Sunny the Chick */}
              <circle cx="50" cy="65" r="35" fill="url(#sunnyGrad)" className="body-part body" />
              {/* Mohawk */}
              <path d="M45 30 Q50 15 55 30" fill="var(--color-primary)" className="body-part mohawk" />
              {/* Cheeks */}
              <circle cx="35" cy="75" r="5" fill="#FF80AB" opacity="0.4" />
              <circle cx="65" cy="75" r="5" fill="#FF80AB" opacity="0.4" />
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="40" cy="65" r="4" fill="var(--color-text)" className="eye eye-left" />
                <circle cx="60" cy="65" r="4" fill="var(--color-text)" className="eye eye-right" />
              </g>
              {/* Beak */}
              <path d="M47 72 L53 72 L50 78 Z" fill="#FFA726" className="body-part beak" />
              {/* Wings */}
              <path d="M15 65 Q5 55 15 45" fill="var(--color-primary)" className="body-part wing wing-left" stroke="var(--color-primary-hover)" strokeWidth="1" />
              <path d="M85 65 Q95 55 85 45" fill="var(--color-primary)" className="body-part wing wing-right" stroke="var(--color-primary-hover)" strokeWidth="1" />
            </>
          )}

          {isRiko && (
            <>
              {/* Riko the Fox */}
              <path d="M20 90 Q50 110 80 90 L85 50 Q50 30 15 50 Z" fill="url(#rikoGrad)" className="body-part body" />
              {/* White chest */}
              <path d="M35 90 Q50 100 65 90 L60 70 Q50 65 40 70 Z" fill="white" opacity="0.8" />
              {/* Ears */}
              <path d="M25 45 L15 20 L40 35 Z" fill="var(--color-accent)" className="body-part ear ear-left" />
              <path d="M75 45 L85 20 L60 35 Z" fill="var(--color-accent)" className="body-part ear ear-right" />
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="40" cy="60" r="4" fill="var(--color-text)" className="eye eye-left" />
                <circle cx="60" cy="60" r="4" fill="var(--color-text)" className="eye eye-right" />
              </g>
              {/* Nose */}
              <circle cx="50" cy="75" r="3" fill="var(--color-text)" />
              {/* Tail */}
              <path d="M80 85 Q110 60 90 40" fill="var(--color-accent)" stroke="white" strokeWidth="4" className="body-part tail" />
            </>
          )}

          {isLuna && (
            <>
              {/* Luna the Owl */}
              <ellipse cx="50" cy="65" rx="35" ry="40" fill="url(#lunaGrad)" className="body-part body" />
              {/* Chest feathers */}
              <path d="M35 70 Q50 85 65 70" fill="rgba(255,255,255,0.3)" />
              <path d="M30 80 Q50 95 70 80" fill="rgba(255,255,255,0.2)" />
              {/* Glasses */}
              <g className="glasses-group">
                <circle cx="38" cy="60" r="10" fill="none" stroke="var(--color-text)" strokeWidth="2" />
                <circle cx="62" cy="60" r="10" fill="none" stroke="var(--color-text)" strokeWidth="2" />
                <line x1="48" y1="60" x2="52" y2="60" stroke="var(--color-text)" strokeWidth="2" />
              </g>
              {/* Eyes */}
              <g className="eyes-group">
                <circle cx="38" cy="60" r="3" fill="var(--color-text)" className="eye eye-left" />
                <circle cx="62" cy="60" r="3" fill="var(--color-text)" className="eye eye-right" />
              </g>
              {/* Beak */}
              <path d="M48 70 L52 70 L50 76 Z" fill="var(--color-primary)" className="body-part beak" />
              {/* Tuft Ears */}
              <path d="M30 35 L20 25 L40 30" fill="#B388FF" className="body-part ear-tuft" />
              <path d="M70 35 L80 25 L60 30" fill="#B388FF" className="body-part ear-tuft" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Mascot;
