import React from 'react';

export default function NeedScene({ need, title }) {
  const rest = need === 'rest';
  const help = need === 'help';
  return <svg viewBox="0 0 300 220" role="img" aria-label={title} className="h-full w-full">
    <rect width="300" height="220" rx="22" fill={{ water: '#EDF7FC', food: '#FFF5E5', rest: '#F3F0FB', help: '#EDF6EF' }[need]} />
    {rest && <><rect x="36" y="163" width="228" height="36" rx="12" fill="#A69BD3" /><rect x="39" y="142" width="79" height="31" rx="14" fill="white" /></>}
    <path d={rest ? 'M80 184 Q80 120 139 122 Q189 125 190 184' : 'M63 196 Q63 119 120 119 Q177 119 177 196'} fill="#7EA7D5" />
    <path d={rest ? 'M115 105 V134 Q130 146 146 134 V105' : 'M105 105 V132 Q120 143 135 132 V105'} fill="#E8AD87" />
    <g transform={rest ? 'translate(14 9) rotate(-10 120 80)' : ''}>
      <circle cx="120" cy="79" r="44" fill="#F4C19D" />
      <path d="M76 76 Q66 25 118 30 Q168 18 164 77 L145 51 Q116 70 88 54 Z" fill="#66483F" />
      <g fill="none" stroke="#3E4359" strokeWidth="3.5" strokeLinecap="round">
        {rest ? <path d="M95 81 Q103 88 111 81 M131 81 Q139 88 147 81" /> : <><circle cx="104" cy="79" r="3" fill="#3E4359" /><circle cx="137" cy="79" r="3" fill="#3E4359" /></>}
        {rest ? <ellipse cx="121" cy="102" rx="9" ry="12" fill="#AB6970" stroke="none" /> : <path d={help ? 'M111 103 Q121 98 131 103' : 'M109 99 Q120 110 132 99'} />}
      </g>
    </g>
    {need === 'water' && <>
      <path d="M205 103 H255 L247 174 H213 Z" fill="white" stroke="#6CADD0" strokeWidth="4" />
      <path d="M211 131 H250 L245 170 H216 Z" fill="#93D6ED" />
      <path d="M231 58 Q212 81 231 87 Q250 82 231 58" fill="#79C5E4" />
      <path d="M157 150 L197 158" stroke="#F4C19D" strokeWidth="13" strokeLinecap="round" />
    </>}
    {need === 'food' && <>
      <ellipse cx="226" cy="173" rx="49" ry="13" fill="white" stroke="#D9C5AA" strokeWidth="3" />
      <path d="M194 149 Q194 111 228 111 Q262 111 262 149 Z" fill="#E4B773" /><path d="M194 149 H262 L253 164 H202 Z" fill="#F5D69A" /><path d="M198 151 H257" stroke="#7CB17F" strokeWidth="6" />
      <path d="M154 151 L111 169" stroke="#F4C19D" strokeWidth="13" strokeLinecap="round" />
    </>}
    {rest && <><path d="M110 156 Q139 136 161 157" stroke="#F4C19D" strokeWidth="13" fill="none" strokeLinecap="round" /><text x="215" y="87" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill="#A296C9">Z</text><text x="244" y="57" fontFamily="sans-serif" fontSize="19" fontWeight="700" fill="#A296C9">z</text></>}
    {help && <>
      <rect x="174" y="146" width="83" height="49" rx="6" fill="#E4BB82" /><path d="M169 144 H262 V153 H169 Z" fill="#D5A871" />
      <path d="M151 151 L173 147 M268 90 Q250 109 250 135 L238 145" stroke="#F4C19D" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M267 90 L286 66" stroke="#88B69C" strokeWidth="25" strokeLinecap="round" />
      <path d="M237 126 L243 119 M230 121 L232 113" stroke="#97B3A1" strokeWidth="3" strokeLinecap="round" />
    </>}
  </svg>;
}
