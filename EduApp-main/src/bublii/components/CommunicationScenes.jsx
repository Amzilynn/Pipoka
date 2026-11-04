import React from 'react';

const ink = '#394259';
export function EmotionPortrait({ emotion, description }) {
  const sad = emotion === 'sc-tristesse';
  const surprised = emotion === 'sc-surprise';
  const calm = emotion === 'sc-calme';
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={description} className="h-full w-full">
      <rect width="300" height="300" rx="24" fill="#FFF6EF" />
      <path d="M65 300 Q65 229 150 229 Q235 229 235 300" fill="#81A9D6" />
      <path d="M131 220 V248 Q150 262 169 248 V220" fill="#EDB38C" />
      <ellipse cx="73" cy="151" rx="16" ry="22" fill="#F2BD98" /><ellipse cx="227" cy="151" rx="16" ry="22" fill="#F2BD98" />
      <ellipse cx="150" cy="146" rx="77" ry="94" fill="#F6C5A2" />
      <path d="M74 133 Q49 40 126 38 Q211 8 228 111 L224 131 Q203 107 196 79 Q145 116 93 91 L79 135" fill="#63473E" />
      <g fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round">
        <path d={sad ? 'M101 119 L124 109 M176 109 L199 119' : surprised ? 'M100 101 Q112 90 125 100 M175 100 Q188 90 201 101' : 'M101 111 Q113 103 125 111 M175 111 Q188 103 199 111'} />
        {calm ? <path d="M102 139 Q113 148 124 139 M176 139 Q187 148 198 139" /> : <>
          <ellipse cx="114" cy="139" rx={surprised ? 10 : 6} ry={surprised ? 15 : 9} fill={ink} stroke="none" />
          <ellipse cx="186" cy="139" rx={surprised ? 10 : 6} ry={surprised ? 15 : 9} fill={ink} stroke="none" />
        </>}
        <path d="M147 151 L141 165 H153" stroke="#CB977C" strokeWidth="3" />
        {sad ? <path d="M125 200 Q150 177 175 200" /> : surprised ? <ellipse cx="150" cy="195" rx="15" ry="21" fill="#A35F60" stroke="none" /> : calm ? <path d="M132 193 Q150 204 168 193" strokeWidth="4" /> : <path d="M118 183 Q150 194 182 183 Q179 225 150 224 Q121 221 118 183" fill="#A95261" stroke="none" />}
      </g>
      {!sad && !surprised && !calm && <path d="M122 186 Q150 195 178 186 L174 197 Q150 204 126 197 Z" fill="white" />}
      {sad && <path d="M111 153 Q99 171 111 177 Q124 173 111 153" fill="#84C5EA" />}
      <ellipse cx="101" cy="169" rx="12" ry="6" fill="#ED9D91" opacity=".5" /><ellipse cx="199" cy="169" rx="12" ry="6" fill="#ED9D91" opacity=".5" />
    </svg>
  );
}
function Person({ x, y = 50, adult = false, shirt = '#81A9D6', facingAway = false, wave = false, reach = false, talking = false }) {
  return <g transform={`translate(${x} ${y}) scale(${adult ? 1.2 : 1})`}>
    <path d="M-13 103 L-16 150 M13 103 L17 150" stroke="#586B8B" strokeWidth="15" strokeLinecap="round" />
    <path d="M-29 103 V65 Q0 47 29 65 V103 Z" fill={shirt} />
    <path d={wave ? 'M-25 71 L-43 51 L-46 24' : 'M-25 71 L-35 107'} fill="none" stroke="#EDB38E" strokeWidth="10" strokeLinecap="round" />
    <path d={reach ? 'M25 71 L63 79' : 'M25 71 L35 107'} fill="none" stroke="#EDB38E" strokeWidth="10" strokeLinecap="round" />
    <circle cy="30" r="28" fill="#F4C09A" />
    <path d={facingAway ? 'M-28 38 Q-37 -7 0 -2 Q39 -6 28 42 Q0 57 -28 38' : 'M-28 26 Q-34 -9 0 -2 Q34 -9 28 26 L15 12 Q-9 26 -22 15 Z'} fill="#62483D" />
    {!facingAway && <><circle cx="-9" cy="30" r="2.5" fill={ink} /><circle cx="9" cy="30" r="2.5" fill={ink} />{talking ? <ellipse cy="43" rx="5" ry="6" fill="#A35860" /> : <path d="M-8 42 Q0 50 8 42" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />}</>}
  </g>;
}
function Bubble({ text, x = 140, y = 12, width = 170 }) {
  return <g><path d={`M${x} ${y} h${width} q12 0 12 12 v31 q0 12 -12 12 h-${width-28} l-18 15 v-15 h-10 q-12 0 -12 -12 v-31 q0 -12 12 -12`} fill="white" stroke="#D7DFE9" strokeWidth="2" /><text x={x+width/2} y={y+34} textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="700" fill={ink}>{text}</text></g>;
}
function Toy({ x = 235, y = 138 }) {
  return <g transform={`translate(${x} ${y})`}><rect width="55" height="23" rx="7" fill="#D88766" /><path d="M11 1 L21 -17 H39 L48 1" fill="#9CCEDC" stroke="#D88766" strokeWidth="4" /><circle cx="12" cy="24" r="8" fill={ink} /><circle cx="44" cy="24" r="8" fill={ink} /></g>;
}
export function SocialScene({ scenario, action, description }) {
  const school = scenario === 'soc-1';
  const toy = scenario === 'soc-2';
  const leaving = action === 'ignorer' || action === 'partir';
  const grabbing = action === 'arracher';
  return <svg viewBox="0 0 400 250" role="img" aria-label={description} className="h-full w-full">
    <rect width="400" height="250" fill={school ? '#EFF5FC' : toy ? '#F4F1FB' : '#FFF7EB'} />
    <path d="M0 225 H400" stroke="#DCE2EA" strokeWidth="3" />
    {school ? <>
      <rect x="271" y="24" width="97" height="197" rx="6" fill="#C4D5E9" /><rect x="283" y="67" width="72" height="153" fill="#E1EAF4" /><circle cx="344" cy="147" r="4" fill="#879DB8" /><text x="318" y="50" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="700" fill={ink}>ÉCOLE</text>
      <Person x={241} y={37} adult shirt="#92B8A4" wave={action === 'bonjour'} />
      <Person x={leaving ? 76 : 123} y={70} facingAway={leaving} wave={action === 'bonjour'} talking={action === 'bonjour'} />
      <path d="M98 132 V173 Q85 178 82 164 V144 Q83 132 98 132" fill="#D6A365" />
      {action === 'bonjour' && <Bubble text="Bonjour !" x={46} y={12} width={112} />}
      {leaving && <path d="M71 220 H30 M43 210 L30 220 L43 230" stroke="#8D9BB0" strokeWidth="4" fill="none" strokeLinecap="round" />}
    </> : toy ? <>
      <rect x="37" y="191" width="326" height="37" rx="18" fill="#E4DCF1" />
      <Person x={109} y={66} shirt="#81A9D6" reach={grabbing} talking={action === 'demander'} />
      <Person x={292} y={66} shirt="#DEAD72" />
      <Toy x={grabbing ? 175 : 232} y={153} />
      {action === 'demander' && <Bubble text="Je peux jouer ?" x={24} y={8} width={165} />}
      {grabbing && <><path d="M175 146 L189 133 L184 149 L200 139" fill="none" stroke="#B77F6D" strokeWidth="3" /><path d="M282 108 Q292 101 302 108" stroke={ink} strokeWidth="3" fill="none" /></>}
    </> : <>
      <Person x={leaving ? 67 : 108} y={67} facingAway={leaving} talking={action === 'merci'} />
      <Person x={307} y={36} adult shirt="#92B8A4" />
      <path d="M149 154 H326 V169 H149 Z" fill="#D4AE88" /><path d="M164 169 V226 M310 169 V226" stroke="#BB926F" strokeWidth="8" />
      <ellipse cx="211" cy="151" rx="32" ry="8" fill="white" stroke="#BCCBDD" strokeWidth="3" /><path d="M259 128 H278 L275 151 H262 Z" fill="#ACD5E7" />
      {action === 'merci' && <Bubble text="Merci pour le repas !" x={22} y={8} width={206} />}
      {leaving && <path d="M72 220 H25 M38 210 L25 220 L38 230" stroke="#8D9BB0" strokeWidth="4" fill="none" strokeLinecap="round" />}
    </>}
  </svg>;
}
