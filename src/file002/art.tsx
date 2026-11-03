import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';

/** Swordfish, facing left. Native box 1000x320; flat sword on the left. */
export const Swordfish: React.FC<{x: number; y: number; w?: number; rot?: number; flip?: boolean; dark?: number; phase?: number; noSword?: boolean}> = ({x, y, w = 800, rot = 0, flip, dark = 0, phase = 0, noSword}) => {
  const f = useCurrentFrame() + phase;
  const t = Math.sin(f / 5) * 10; // tail beat
  const back = interpolateColors(dark, [0, 1], ['#3a3f63', '#0c0f18']);
  const belly = interpolateColors(dark, [0, 1], ['#cfd8de', '#1a2026']);
  const fin = interpolateColors(dark, [0, 1], ['#2b2f4d', '#080a10']);
  const h = (w * 320) / 1000;
  return (
    <svg width={w} height={h} viewBox="0 0 1000 320" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible', transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`}}>
      <defs>
        <linearGradient id={`sf-body-${phase}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={back} />
          <stop offset="0.55" stopColor={back} />
          <stop offset="0.62" stopColor={belly} />
          <stop offset="1" stopColor={belly} />
        </linearGradient>
      </defs>
      {/* sword */}
      {!noSword && <path d="M 0 168 L 330 150 L 330 178 Z" fill={interpolateColors(dark, [0, 1], ['#59607a', '#10131c'])} />}
      {/* dorsal fin (tall sickle) */}
      <path d="M 430 120 C 450 40, 480 10, 500 0 C 505 40, 520 90, 560 122 Z" fill={fin} />
      {/* second dorsal + anal small */}
      <path d="M 820 150 L 845 132 L 850 152 Z" fill={fin} />
      <path d="M 820 190 L 845 206 L 850 186 Z" fill={fin} />
      {/* tail (crescent) */}
      <path d={`M 860 170 C 900 ${120 + t}, 940 ${70 + t}, ${990 + t * 0.3} ${30 + t} C 960 ${100 + t}, 950 140, 935 170 C 950 200, 960 ${240 + t}, ${990 + t * 0.3} ${310 + t} C 940 ${270 + t}, 900 ${220 + t}, 860 170 Z`} fill={fin} />
      {/* body */}
      <path d="M 320 150 C 400 112, 560 112, 700 128 C 790 140, 850 158, 870 170 C 850 182, 790 200, 700 210 C 560 226, 400 222, 320 186 Z" fill={`url(#sf-body-${phase})`} />
      {/* keel */}
      <path d="M 840 166 L 875 170 L 840 174 Z" fill={fin} />
      {/* pectoral */}
      <path d={`M 420 196 C 450 230, 480 ${255 + t * 0.4}, 500 ${262 + t * 0.4} C 485 230, 470 210, 455 196 Z`} fill={fin} />
      {/* eye */}
      <circle cx={362} cy={158} r={13} fill="#0a0d12" />
      <circle cx={358} cy={154} r={4} fill="#fff" opacity={0.8 * (1 - dark)} />
    </svg>
  );
};

/** DSV Alvin-like submersible, facing right. Native 640x300. lights 0..1 */
export const Sub: React.FC<{x: number; y: number; w?: number; lights?: number; tilt?: number; stuck?: boolean}> = ({x, y, w = 600, lights = 1, tilt = 0, stuck}) => {
  const f = useCurrentFrame();
  const h = (w * 300) / 640;
  const blink = Math.floor(f / 20) % 2;
  return (
    <svg width={w} height={h} viewBox="0 0 640 300" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible', transform: `rotate(${tilt}deg)`}}>
      <defs>
        <linearGradient id="beamR" x1="0" x2="1">
          <stop offset="0" stopColor="#fff6d8" stopOpacity={0.6 * lights} />
          <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
        </linearGradient>
        <filter id="subBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      {lights > 0 && <polygon points="560,170 1150,60 1150,330" fill="url(#beamR)" filter="url(#subBlur)" />}
      {/* thrusters */}
      <rect x={40} y={150} width={50} height={40} rx={10} fill="#6d7a82" />
      <rect x={20} y={140} width={22} height={60} rx={6} fill="#4d585f" />
      {/* hull */}
      <path d="M 80 120 C 140 90, 440 90, 540 110 C 600 125, 620 160, 600 200 C 580 235, 440 245, 300 245 C 180 245, 100 235, 80 200 Z" fill="#e9ecee" />
      <path d="M 80 185 C 180 205, 460 210, 610 182 C 600 215, 560 240, 300 246 C 160 246, 100 236, 80 200 Z" fill="#c75a2a" />
      {/* sail */}
      <path d="M 250 98 L 280 40 L 400 40 L 420 98 Z" fill="#f4f6f7" />
      <rect x={300} y={22} width={14} height={24} fill="#9aa5ab" />
      <circle cx={307} cy={20} r={6} fill={blink ? '#ff4a3a' : '#5a1a14'} />
      {/* stripe + label */}
      <rect x={120} y={150} width={420} height={8} fill="#f0b030" />
      <text x={200} y={140} fontFamily="Oswald, sans-serif" fontSize={34} fill="#2b3338" letterSpacing={6}>ALVIN</text>
      {/* viewport */}
      <circle cx={560} cy={168} r={22} fill="#1d3a4a" stroke="#9aa5ab" strokeWidth={6} />
      <circle cx={553} cy={161} r={6} fill="#bfe8ff" opacity={0.7} />
      {/* manipulator arm */}
      <path d="M 520 220 L 590 250 L 630 236" stroke="#8b979d" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* lights */}
      <circle cx={590} cy={140} r={8} fill="#fff6d8" opacity={0.4 + 0.6 * lights} />
      <circle cx={600} cy={200} r={8} fill="#fff6d8" opacity={0.4 + 0.6 * lights} />
      {stuck && <path d="M 470 236 L 520 300" stroke="#59607a" strokeWidth={10} strokeLinecap="round" />}
    </svg>
  );
};

/** Support ship (catamaran with A-frame) at the surface. Native 900x300. */
export const Tender: React.FC<{x: number; y: number; w?: number; lift?: number}> = ({x, y, w = 900, lift = 0}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 14) * 4;
  const h = (w * 300) / 900;
  return (
    <svg width={w} height={h} viewBox="0 0 900 300" style={{position: 'absolute', left: x - w / 2, top: y - h + bob, overflow: 'visible'}}>
      <path d="M 40 240 L 860 240 L 820 290 L 80 290 Z" fill="#1c2833" />
      <rect x={120} y={170} width={420} height={70} fill="#d8dde0" />
      <rect x={160} y={120} width={240} height={50} fill="#eef1f2" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={180 + i * 44} y={134} width={26} height={18} fill="#2b3a46" />)}
      {/* A-frame */}
      <path d="M 620 240 L 700 60 L 760 60 L 840 240" stroke="#f0b030" strokeWidth={14} fill="none" strokeLinejoin="round" />
      <line x1={730} y1={60} x2={730} y2={120 + (1 - lift) * 150} stroke="#2b3338" strokeWidth={4} />
    </svg>
  );
};
