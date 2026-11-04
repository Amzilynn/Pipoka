import React from 'react';

// Simple, expressive scenes stay sharp at every screen size and work offline.
export default function ModuleIllustration({ theme, title }) {
  const face = (x, y, skin = '#F6BD91', happy = true) => (
    <g>
      <circle cx={x} cy={y} r="25" fill={skin} />
      <path d={`M${x-24} ${y-6} Q${x-24} ${y-39} ${x+5} ${y-25} Q${x+29} ${y-29} ${x+24} ${y-6} Q${x+12} ${y-22} ${x-2} ${y-16} Z`} fill="#493047" />
      <circle cx={x-8} cy={y} r="2.8" fill="#352C49" /><circle cx={x+8} cy={y} r="2.8" fill="#352C49" />
      <ellipse cx={x-15} cy={y+8} rx="5" ry="3" fill="#ED8984" /><ellipse cx={x+15} cy={y+8} rx="5" ry="3" fill="#ED8984" />
      {happy ? <path d={`M${x-9} ${y+9} Q${x} ${y+24} ${x+10} ${y+9} Z`} fill="#A33E57" /> : <ellipse cx={x} cy={y+12} rx="5" ry="7" fill="#A33E57" />}
    </g>
  );
  return (
    <svg viewBox="0 0 360 200" role="img" aria-label={title} className="h-44 w-full transition-transform duration-300 group-hover:scale-105 sm:h-48">
      <ellipse cx="180" cy="177" rx="133" ry="12" fill="#23314B" opacity=".07" />
      {theme === 'learn' && <>
        <circle cx="180" cy="96" r="82" fill="#D4E8FF" />
        <rect x="47" y="48" width="46" height="48" rx="12" fill="#F7CA58" transform="rotate(-12 70 72)" /><text x="70" y="82" textAnchor="middle" fontSize="30" fontWeight="900" fill="#805C20">A</text>
        <rect x="268" y="97" width="44" height="45" rx="10" fill="#A9DCD1" transform="rotate(12 290 120)" /><text x="290" y="131" textAnchor="middle" fontSize="29" fontWeight="900" fill="#23786C">3</text>
        <path d="M130 161 Q129 101 180 106 Q229 100 232 161" fill="#6599EC" />
        {face(180, 79)}
        <path d="M108 130 Q143 120 180 140 Q216 120 253 130 L246 174 Q211 163 180 181 Q146 163 114 174 Z" fill="#FFFDF5" stroke="#6599EC" strokeWidth="4" strokeLinejoin="round" />
        <path d="M180 141 V178 M128 142 L161 149 M128 153 L159 160 M199 149 L234 141 M200 160 L232 153" fill="none" stroke="#B4C9E9" strokeWidth="3" strokeLinecap="round" />
        <path d="M257 39 L261 50 L273 54 L261 58 L257 70 L253 58 L241 54 L253 50 Z" fill="#F5BA41" />
      </>}
      {theme === 'communicate' && <>
        <circle cx="181" cy="100" r="83" fill="#FFE0E4" />
        <path d="M75 176 Q76 112 126 112 Q170 115 169 176" fill="#E87994" />
        <path d="M193 176 Q192 112 238 112 Q282 115 287 176" fill="#8A85D8" />
        {face(123, 88)}{face(239, 88, '#BA795C')}
        <path d="M35 24 H132 Q147 24 147 39 V58 Q147 72 132 72 H107 L93 86 V72 H35 Q21 72 21 58 V39 Q21 24 35 24" fill="#FFF" />
        <path d="M68 42 C57 29 42 48 68 61 C94 48 79 29 68 42" fill="#EC6D86" />
        <path d="M249 22 H315 Q333 22 333 40 V54 Q333 70 315 70 H285 L269 83 V70 H249 Q233 70 233 54 V40 Q233 22 249 22" fill="#FFF" />
        <circle cx="266" cy="46" r="4" fill="#8980CD" /><circle cx="283" cy="46" r="4" fill="#8980CD" /><circle cx="300" cy="46" r="4" fill="#8980CD" />
      </>}
      {theme === 'move' && <>
        <circle cx="180" cy="96" r="82" fill="#CDF1DE" />
        <g fill="none" strokeLinecap="round" strokeWidth="15"><path d="M165 101 L128 123 L103 96 M192 101 L222 77 L238 48" stroke="#BA795C" /><path d="M173 133 L147 163 L123 171 M189 135 L213 156 L242 144" stroke="#4465A4" /></g>
        <path d="M159 95 Q178 86 199 96 L204 139 Q179 151 153 136 Z" fill="#F3B947" />
        {face(177, 65, '#BA795C')}
        <path d="M79 58 L69 47 M74 74 L56 71 M269 80 L284 68 M273 96 L294 94" stroke="#37A47A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="281" cy="152" r="22" fill="#F48F79" /><path d="M264 139 Q290 142 290 171 M260 156 Q280 162 299 146" stroke="#FFF" strokeWidth="3" fill="none" />
        <path d="M70 121 V146 M70 124 L86 119 V140" stroke="#5BAE92" strokeWidth="4" fill="none" /><ellipse cx="65" cy="146" rx="7" ry="5" fill="#5BAE92" /><ellipse cx="81" cy="140" rx="7" ry="5" fill="#5BAE92" />
      </>}
      {theme === 'grow' && <>
        <circle cx="180" cy="97" r="83" fill="#FFF0C9" />
        <rect x="53" y="43" width="55" height="77" rx="12" fill="#FFF" stroke="#F1D48E" strokeWidth="3" />
        <path d="M64 65 L69 70 L79 58 M64 88 L69 93 L79 81" fill="none" stroke="#54AE91" strokeWidth="4" strokeLinecap="round" /><path d="M87 65 H96 M87 88 H96" stroke="#E1C984" strokeWidth="3" strokeLinecap="round" />
        <path d="M133 172 Q130 108 180 108 Q227 111 230 172" fill="#AD91D9" />
        {face(180, 81)}
        <path d="M147 133 L172 121 L194 106" fill="none" stroke="#F6BD91" strokeWidth="14" strokeLinecap="round" />
        <path d="M195 112 L207 80" stroke="#4AB5BB" strokeWidth="7" strokeLinecap="round" /><path d="M204 81 L209 68" stroke="#FFF" strokeWidth="11" strokeLinecap="round" />
        <circle cx="202" cy="102" r="5" fill="#FFF" /><circle cx="211" cy="100" r="4" fill="#FFF" />
        <rect x="256" y="119" width="49" height="54" rx="13" fill="#71BCAC" /><path d="M266 120 V109 Q281 91 295 109 V120" fill="none" stroke="#388C7B" strokeWidth="6" /><rect x="266" y="142" width="29" height="20" rx="6" fill="#A6DDC8" />
        <path d="M269 37 L273 48 L285 52 L273 56 L269 68 L265 56 L253 52 L265 48 Z" fill="#EAB64E" />
      </>}
    </svg>
  );
}
