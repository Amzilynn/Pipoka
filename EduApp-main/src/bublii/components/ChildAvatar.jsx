import React from 'react';

/**
 * Inclusive illustrated avatars for the mock child profiles.
 * All faces are drawn so hair, skin, glasses and hearing aids can vary per child.
 */
export default function ChildAvatar({ child, size = 64, ring = false, className = '' }) {
  const avatar = child?.avatar || {
    skin: '#F1C7A5',
    hair: '#6B4226',
    shirt: '#8B7CF6',
    bg: '#EFECFF',
    style: 'short',
    accessory: 'none',
  };

  const { skin, hair, shirt, bg, style, accessory } = avatar;

  return (
    <span
      className={`avatar ${ring ? 'avatar--ring' : ''} ${className}`}
      style={{ width: size, height: size, background: bg, '--avatar-ring': shirt }}
      role="img"
      aria-label={child ? `Portrait de ${child.firstName}` : 'Portrait d’enfant'}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="50" fill={bg} />

        {/* soft background accents */}
        <circle cx="82" cy="18" r="13" fill="#fff" opacity="0.4" />
        <circle cx="17" cy="82" r="17" fill="#fff" opacity="0.28" />

        {/* shoulders */}
        <path d="M16 100c1-17 14-27 34-27s33 10 34 27Z" fill={shirt} />
        <path d="M42 76h16v10c0 5-3.6 8-8 8s-8-3-8-8Z" fill={skin} />
        <path d="M43 78c4 4 10 5 14 0" fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />

        {/* neck */}
        <rect x="43.5" y="63" width="13" height="14" rx="5" fill={skin} />

        {/* ears */}
        <circle cx="27.5" cy="48" r="4.6" fill={skin} />
        <circle cx="72.5" cy="48" r="4.6" fill={skin} />

        {/* hair back */}
        {style === 'curly' && (
          <>
            <circle cx="30" cy="35" r="10" fill={hair} />
            <circle cx="41" cy="26" r="11" fill={hair} />
            <circle cx="57" cy="24" r="12" fill={hair} />
            <circle cx="70" cy="33" r="10" fill={hair} />
            <circle cx="26" cy="47" r="8" fill={hair} />
            <circle cx="74" cy="47" r="8" fill={hair} />
          </>
        )}
        {style === 'buns' && (
          <>
            <circle cx="27" cy="28" r="11" fill={hair} />
            <circle cx="73" cy="28" r="11" fill={hair} />
          </>
        )}
        {style === 'braids' && (
          <>
            <path d="M24 46c-2 12 0 20 3 26" fill="none" stroke={hair} strokeWidth="9" strokeLinecap="round" />
            <path d="M76 46c2 12 0 20-3 26" fill="none" stroke={hair} strokeWidth="9" strokeLinecap="round" />
          </>
        )}

        {/* head */}
        <ellipse cx="50" cy="47" rx="22.5" ry="24.5" fill={skin} />

        {/* hair front */}
        {style === 'curly' && (
          <path d="M28 39c1-12 10-19 22-19s21 7 22 19c-5-5-12-7-22-7s-17 2-22 7Z" fill={hair} />
        )}
        {style === 'short' && (
          <path d="M27.8 40c0-13 9-20 22.2-20S72.2 27 72.2 40c-4-4-7-9-10-8-5 2-12 0-17-1-4 3-9 5-17.4 9Z" fill={hair} />
        )}
        {style === 'buns' && (
          <path d="M28 39c1-11 9-17 22-17s21 6 22 17c-6-3-13-5-22-5s-16 2-22 5Z" fill={hair} />
        )}
        {style === 'braids' && (
          <path d="M27.5 40c0-12 9-19 22.5-19s22.5 7 22.5 19c-5-6-13-8-22.5-8s-17.5 2-22.5 8Z" fill={hair} />
        )}
        {style === 'wavy' && (
          <path d="M27.5 41c-1-14 9-22 22.5-22s23.5 8 22.5 22c-3-3-4-8-8-7-3 1-7 3-14 3s-12-3-15-3c-3 0-5 4-8 7Z" fill={hair} />
        )}

        {/* eyebrows */}
        <path d="M38 38.5c2-1.2 4-1.2 6-.3M56 38.2c2-1 4-1 6 .3" fill="none" stroke="#4A3026" strokeOpacity="0.55" strokeWidth="1.7" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx="40.5" cy="46.5" rx="3" ry="3.4" fill="#332B2B" />
        <ellipse cx="59.5" cy="46.5" rx="3" ry="3.4" fill="#332B2B" />
        <circle cx="41.5" cy="45.3" r="1" fill="#fff" />
        <circle cx="60.5" cy="45.3" r="1" fill="#fff" />

        {/* cheeks */}
        <ellipse cx="34" cy="55" rx="4.2" ry="2.6" fill="#FF8FA3" opacity="0.4" />
        <ellipse cx="66" cy="55" rx="4.2" ry="2.6" fill="#FF8FA3" opacity="0.4" />

        {/* smile */}
        <path d="M44.5 56c1.7 3 3.5 4.4 5.5 4.4s3.8-1.4 5.5-4.4" fill="none" stroke="#9C4C3D" strokeWidth="2.2" strokeLinecap="round" />

        {/* accessories */}
        {accessory === 'glasses' && (
          <g fill="none" stroke="#3C3654" strokeWidth="1.7">
            <rect x="32.2" y="41.2" width="16.5" height="12.5" rx="5.5" fill="#fff" fillOpacity="0.18" />
            <rect x="51.3" y="41.2" width="16.5" height="12.5" rx="5.5" fill="#fff" fillOpacity="0.18" />
            <path d="M48.7 46.5h2.6M32.2 45.5l-4.5-1M67.8 45.5l4.5-1" />
          </g>
        )}

        {accessory === 'hearingAid' && (
          <g>
            <rect x="68.5" y="49" width="5.2" height="9" rx="2.4" fill="#2FC48D" />
            <path d="M73.4 53c4 2 5 6 3 9" fill="none" stroke="#1E9E70" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="70.2" cy="52" r="1.1" fill="#fff" />
          </g>
        )}

        {accessory === 'freckles' && (
          <g fill="#B87352" opacity="0.5">
            <circle cx="35" cy="51.5" r="0.8" />
            <circle cx="38" cy="52.8" r="0.7" />
            <circle cx="62" cy="51.5" r="0.8" />
            <circle cx="65" cy="52.8" r="0.7" />
          </g>
        )}
      </svg>
    </span>
  );
}
