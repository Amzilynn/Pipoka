import React from 'react';

// Left and right always refer to the child's screen, with a back-facing model.
export default function MovementPicture({ pose, title, bodyPart = false }) {
  const direction = ['up', 'down', 'left', 'right'].includes(pose);
  const raised = pose === 'up' || pose === 'arms';
  const knees = pose === 'knees';
  const head = pose === 'head';
  const shoulders = pose === 'shoulders';
  const hands = pose === 'hands';
  const clap = pose === 'clap';
  const leftArm = raised ? 'M127 111 L105 77 L104 33' : head ? 'M127 111 L109 70 L141 40' : shoulders ? 'M127 111 L107 145 L129 107' : knees ? 'M127 111 L113 156 L132 186' : clap ? 'M127 111 L115 143 L155 129' : hands ? 'M127 111 L101 133 L77 110' : pose === 'left' ? 'M127 111 L90 105 L47 105' : 'M127 111 L116 151';
  const rightArm = raised ? 'M183 111 L205 77 L206 33' : head ? 'M183 111 L201 70 L169 40' : shoulders ? 'M183 111 L203 145 L181 107' : knees ? 'M183 111 L197 156 L178 186' : clap ? 'M183 111 L195 143 L161 129' : hands ? 'M183 111 L209 133 L233 110' : pose === 'right' ? 'M183 111 L221 105 L264 105' : 'M183 111 L194 151';
  const tips = raised ? [[104,33],[206,33]] : head ? [[141,40],[169,40]] : shoulders ? [[129,107],[181,107]] : knees ? [[132,186],[178,186]] : clap ? [[155,129],[161,129]] : hands ? [[77,110],[233,110]] : [];
  const highlights = !bodyPart ? [] : head ? [[155,55,35]] : shoulders ? [[127,108,17],[183,108,17]] : hands ? [[77,110,20],[233,110,20]] : [[132,186,17],[178,186,17]];
  return <svg viewBox="0 0 310 280" role="img" aria-label={title} className="h-full w-full">
    <rect width="310" height="280" rx="18" fill="#F1F8F5" />
    <ellipse cx="155" cy="260" rx="66" ry="7" fill="#C6DCD1" />
    <path d="M141 177 L132 216 L128 254 M169 177 L178 216 L182 254" fill="none" stroke="#52789D" strokeWidth="18" strokeLinecap="round" />
    <path d="M124 108 Q155 91 186 108 L185 178 Q155 190 125 178 Z" fill="#75AF96" />
    <path d="M142 83 V104 Q155 112 168 104 V83" fill="#E7AD87" />
    <circle cx="155" cy="61" r="33" fill="#F4C39E" />
    <path d={direction ? 'M122 70 Q109 23 154 24 Q200 18 188 75 Q156 92 122 70' : 'M122 59 Q109 23 154 24 Q200 18 188 59 L173 43 Q150 60 129 44 Z'} fill="#654A40" />
    {!direction && <><circle cx="144" cy="61" r="2.7" fill="#394259" /><circle cx="167" cy="61" r="2.7" fill="#394259" /><path d="M145 76 Q155 85 166 76" fill="none" stroke="#394259" strokeWidth="3" strokeLinecap="round" /></>}
    <g fill="none" stroke="#F4C39E" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"><path d={leftArm} /><path d={rightArm} /></g>
    {tips.map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y} rx="8" ry="10" fill="#F4C39E" />{hands && <path d={`M${x-7} ${y-4} l-4 -9 M${x-3} ${y-7} v-12 M${x+2} ${y-8} l2 -12 M${x+6} ${y-5} l6 -10`} stroke="#F4C39E" strokeWidth="4" strokeLinecap="round" />}</g>)}
    {highlights.map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#D39731" strokeWidth="4" />)}
    {clap && <path d="M144 116 L137 108 M156 111 V100 M168 115 L176 106" fill="none" stroke="#D39731" strokeWidth="4" strokeLinecap="round" />}
    {direction && <g fill="none" stroke="#287C59" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {pose === 'up' && <path d="M155 66 V15 M140 30 L155 15 L170 30" />}
      {pose === 'down' && <path d="M239 180 V239 M224 224 L239 239 L254 224" />}
      {pose === 'left' && <path d="M91 71 H25 M41 55 L25 71 L41 87" />}
      {pose === 'right' && <path d="M219 71 H285 M269 55 L285 71 L269 87" />}
    </g>}
  </svg>;
}
