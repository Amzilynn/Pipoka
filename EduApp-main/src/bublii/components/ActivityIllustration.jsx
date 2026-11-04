import React from 'react';

const ink = '#354263';
function ObjectShape({ kind }) {
  switch (kind) {
    case 'chat': return <g><path d="M43 64 L40 20 L73 40 Q100 28 127 40 L160 20 L157 64" fill="#ECAA64" /><ellipse cx="100" cy="101" rx="65" ry="62" fill="#F2BB7F" /><path d="M61 80 Q70 70 79 80 M121 80 Q130 70 139 80" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" /><path d="M92 101 L108 101 L100 110 Z" fill="#D96C80" /><path d="M100 110 Q86 128 78 115 M100 110 Q114 128 122 115 M60 106 L22 100 M60 117 L25 124 M140 106 L178 100 M140 117 L175 124" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" /></g>;
    case 'pomme': return <g><path d="M100 52 Q89 25 109 16" fill="none" stroke="#806047" strokeWidth="9" strokeLinecap="round" /><path d="M107 35 Q126 5 153 23 Q137 49 107 35" fill="#6BAB65" /><path d="M100 56 C22 19 15 118 62 155 Q84 174 100 158 Q123 174 143 152 C187 103 166 21 100 56" fill="#EC6971" /><path d="M61 69 Q43 84 46 105" fill="none" stroke="#FFBDC0" strokeWidth="10" strokeLinecap="round" /></g>;
    case 'voiture': return <g><path d="M38 101 L64 57 H128 L160 101" fill="#8CD1E8" stroke="#497CBF" strokeWidth="8" strokeLinejoin="round" /><rect x="18" y="96" width="164" height="51" rx="18" fill="#658FE0" /><circle cx="55" cy="144" r="22" fill={ink} /><circle cx="147" cy="144" r="22" fill={ink} /><circle cx="55" cy="144" r="10" fill="#DDDFF0" /><circle cx="147" cy="144" r="10" fill="#DDDFF0" /><rect x="24" y="108" width="23" height="12" rx="5" fill="#FFF2B5" /></g>;
    case 'ballon': return <g><circle cx="100" cy="96" r="70" fill="#F3AD56" /><path d="M31 96 H169 M100 26 V166 M51 47 Q132 96 51 145 M149 47 Q68 96 149 145" fill="none" stroke="#FFF4DE" strokeWidth="5" /></g>;
    case 'fleur': return <g><path d="M100 90 V170" stroke="#52996A" strokeWidth="10" /><path d="M99 147 Q49 151 49 119 Q80 112 99 147 M102 132 Q149 133 151 104 Q121 105 102 132" fill="#7ABA7B" />{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="49" rx="21" ry="32" fill="#ED8BB0" transform={`rotate(${a} 100 80)`} />)}<circle cx="100" cy="80" r="24" fill="#F8D26B" /></g>;
    case 'arbre': return <g><path d="M85 96 H115 L124 172 H76 Z" fill="#AB7A57" /><circle cx="65" cy="83" r="42" fill="#79BE89" /><circle cx="135" cy="83" r="42" fill="#79BE89" /><circle cx="100" cy="49" r="44" fill="#98CD87" /></g>;
    case 'bag': return <g><path d="M69 50 V34 Q100 6 131 34 V50" fill="none" stroke="#5474B4" strokeWidth="12" /><rect x="42" y="47" width="116" height="128" rx="30" fill="#7E9DE0" /><rect x="59" y="108" width="82" height="51" rx="15" fill="#B8CDF5" /><path d="M72 122 H127" stroke="#5474B4" strokeWidth="5" strokeLinecap="round" /></g>;
    case 'tooth': return <g><path d="M100 39 C31 9 31 78 53 106 C62 123 55 170 76 169 L99 119 L124 169 C146 172 138 123 150 103 C175 58 160 12 100 39" fill="white" stroke="#99D4DE" strokeWidth="5" /><path d="M69 71 Q77 64 85 71 M116 71 Q124 64 132 71 M85 88 Q100 105 116 88" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" /></g>;
    default: return null;
  }
}
export function ObjectPicture({ kind, className = '' }) {
  return <svg viewBox="0 0 200 190" aria-hidden="true" className={className}><ObjectShape kind={kind} /></svg>;
}
function Face({ x, mood = 'happy' }) {
  return <g transform={`translate(${x} 42)`}><circle cx="0" cy="47" r="34" fill={mood === 'sad' ? '#ACD3F2' : '#F6CE70'} /><circle cx="-11" cy="42" r="3" fill={ink} /><circle cx="11" cy="42" r="3" fill={ink} /><path d={mood === 'sad' ? 'M-12 63 Q0 47 12 63' : 'M-13 55 Q0 74 13 55'} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" /></g>;
}
const object = (kind, x, y, scale = .6) => <g transform={`translate(${x} ${y}) scale(${scale})`}><ObjectShape kind={kind} /></g>;
const letters = (value, x, y, color = ink, size = 32) => <text x={x} y={y} textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize={size} fill={color}>{value}</text>;
function Person({ dance = false }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="180" cy="43" r="22" fill="#F2BA92" stroke="none" /><path d="M163 39 Q180 16 198 38" stroke="#624353" strokeWidth="10" /><path d="M180 81 V124" stroke="#8A8BD5" strokeWidth="32" /><path d={dance ? 'M160 83 L133 100 L115 77 M200 83 L222 60 L237 35' : 'M160 83 L122 109 M200 83 L238 109'} stroke="#F2BA92" strokeWidth="12" /><path d={dance ? 'M170 129 L147 157 L125 159 M190 129 L216 152 L239 139' : 'M170 129 L160 169 M190 129 L201 169'} stroke="#5977AE" strokeWidth="14" /></g>;
}
export default function ActivityIllustration({ activity, title, background = '#EBF4FF' }) {
  let scene;
  switch (activity) {
    case 'associer-mots-images': scene = <><rect x="29" y="60" width="126" height="58" rx="16" fill="white" />{letters('CHAT',92,99)}<path d="M168 89 H200 M191 80 L202 89 L191 98" stroke="#7696C3" strokeWidth="4" fill="none" />{object('chat',215,24,.76)}</>; break;
    case 'construire-le-mot': scene = <>{['C','H','A','T'].map((c,i)=><g key={c}><rect x={45+i*69} y={65+(i%2)*9} width="59" height="63" rx="12" fill={['#BBD5F6','#F7D58A','#C4E5CF','#F0BCD0'][i]} />{letters(c,74+i*69,108+(i%2)*9)}</g>)}</>; break;
    case 'compter-des-objets': scene = <>{[50,136,222].map(x=><React.Fragment key={x}>{object('pomme',x,29,.45)}</React.Fragment>)}{letters('1      2      3',180,158,'#6082B3',27)}</>; break;
    case 'problemes-simples': scene = <>{object('pomme',26,45,.45)}{letters('+',137,101)}{object('pomme',163,45,.45)}{letters('= ?',299,102)}</>; break;
    case 'reconnaitre-les-emotions': scene = <><Face x={105} /><Face x={255} mood="sad" />{letters('Les émotions',180,153,'#AD5C79',22)}</>; break;
    case 'exprimer-ses-besoins': scene = <><path d="M76 41 H278 Q298 41 298 61 V113 Q298 133 278 133 H195 L174 153 V133 H76 Q56 133 56 113 V61 Q56 41 76 41" fill="white" /><path d="M105 67 H145 L138 115 H113 Z" fill="#91CDDF" />{object('pomme',195,47,.38)}</>; break;
    case 'construire-une-phrase': scene = <>{['Je','veux','...'].map((v,i)=><g key={v}><rect x={32+i*100} y="62" width="91" height="65" rx="15" fill={['#E7D9F7','#FFD5C8','#C5E4F0'][i]} />{letters(v,77+i*100,104,ink,24)}</g>)}</>; break;
    case 'situations-sociales': scene = <><Face x={108} /><Face x={253} /><rect x="123" y="12" width="116" height="42" rx="18" fill="white" />{letters('Bonjour !',181,40,'#A75A79',21)}<path d="M74 154 L57 126 M286 154 L303 126" stroke="#E8AD89" strokeWidth="13" strokeLinecap="round" /></>; break;
    case 'imiter-le-mouvement': scene = <><rect x="87" y="10" width="186" height="171" rx="22" fill="white" /><Person dance /><circle cx="257" cy="25" r="5" fill="#68BA9B" /></>; break;
    case 'gauche-droite-haut-bas': scene = <>{letters('↑',180,59,'#4D9D83',57)}{letters('←',110,115,'#668CC5',57)}{letters('→',250,115,'#E6A251',57)}{letters('↓',180,170,'#B48AC5',57)}<circle cx="180" cy="97" r="13" fill="#8BCAB2" /></>; break;
    case 'sequences-de-mouvement': scene = <><Person dance />{letters('♪',80,91,'#64AE94',58)}{letters('♫',287,126,'#D2A354',58)}<path d="M70 150 H102 M268 54 H295" stroke="#77BBA5" strokeWidth="5" strokeLinecap="round" /></>; break;
    case 'identifier-parties-corps': scene = <><Person /><path d="M90 43 H147 M216 108 H278 M88 167 H143" stroke="#8ECAB5" strokeWidth="3" strokeDasharray="5 5" /><circle cx="87" cy="43" r="8" fill="#F0BB64" /><circle cx="283" cy="108" r="8" fill="#F0BB64" /><circle cx="83" cy="167" r="8" fill="#F0BB64" /></>; break;
    case 'dents-propres': scene = <>{object('tooth',90,12,.88)}<path d="M245 151 L272 64" stroke="#73BFB7" strokeWidth="11" strokeLinecap="round" /><path d="M271 64 L280 37" stroke="white" strokeWidth="20" strokeLinecap="round" /></>; break;
    case 'ordre-du-matin': scene = <><circle cx="107" cy="77" r="31" fill="#F3C75F" />{[0,45,90,135,180,225,270,315].map(a=><path key={a} d="M107 33 V22" transform={`rotate(${a} 107 77)`} stroke="#F3C75F" strokeWidth="5" strokeLinecap="round" />)}<rect x="196" y="97" width="103" height="47" rx="12" fill="#E9BA7E" /><path d="M207 102 V74 Q219 54 236 74 V102 M249 102 V74 Q261 54 278 74 V102" fill="#FFF0CA" stroke="#D9A568" strokeWidth="3" /></>; break;
    case 'sac-de-ecole': scene = <>{object('bag',109,6,.94)}<rect x="65" y="90" width="35" height="70" rx="5" fill="#E9AD77" transform="rotate(-12 65 90)" /><path d="M265 66 L278 142" stroke="#EDBC5E" strokeWidth="13" strokeLinecap="round" /></>; break;
    case 'routine-du-soir': scene = <><path d="M108 23 A43 43 0 1 0 147 89 A37 37 0 0 1 108 23" fill="#F3CA70" /><path d="M163 114 H292 V157 H163 Z" fill="#A5ACDE" /><rect x="153" y="100" width="38" height="27" rx="10" fill="white" /><path d="M151 92 V168 M296 110 V168" stroke="#7F88BD" strokeWidth="8" strokeLinecap="round" />{letters('z z',243,75,'#959BCE',26)}</>; break;
    default: scene = null;
  }
  return <svg viewBox="0 0 360 190" role="img" aria-label={title} className="h-full w-full transition-transform duration-300 group-hover:scale-105" style={{ background }}><ellipse cx="180" cy="172" rx="119" ry="9" fill={ink} opacity=".06" />{scene}</svg>;
}
