import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {rand} from '../theme';

/** Marlin or sailfish, facing left. Native 1000x360. kind: 'marlin' | 'sail'. */
export const Billfish: React.FC<{kind: 'marlin' | 'sail'; x: number; y: number; w?: number; rot?: number; flip?: boolean; phase?: number; dark?: number; glow?: string}> = ({kind, x, y, w = 800, rot = 0, flip, phase = 0, dark = 0, glow}) => {
  const f = useCurrentFrame() + phase;
  const t = Math.sin(f / 5) * 10;
  const back = interpolateColors(dark, [0, 1], [kind === 'marlin' ? '#1f3f7a' : '#27406e', '#0b0f18']);
  const belly = interpolateColors(dark, [0, 1], ['#d7e0e6', '#1a2026']);
  const fin = interpolateColors(dark, [0, 1], [kind === 'marlin' ? '#1a2f5c' : '#1e3560', '#080a10']);
  const h = (w * 360) / 1000;
  const id = `bf-${kind}-${phase}`;
  return (
    <svg width={w} height={h} viewBox="0 0 1000 360" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible', transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`, filter: glow ? `drop-shadow(0 0 18px ${glow})` : undefined}}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={back} />
          <stop offset="0.5" stopColor={back} />
          <stop offset="0.6" stopColor={belly} />
          <stop offset="1" stopColor={belly} />
        </linearGradient>
      </defs>
      {/* round spear bill */}
      <path d="M 0 214 L 300 198 L 300 214 Z" fill={fin} />
      {kind === 'sail' ? (
        <path d={`M 360 172 C 380 60, 430 ${20 + t * 0.2}, 520 ${10 + t * 0.2} C 640 ${5 + t * 0.2}, 720 60, 760 168 Z`} fill={fin} opacity={0.95} />
      ) : (
        <path d="M 380 170 C 400 110, 420 80, 440 70 C 450 110, 470 150, 520 166 L 760 172 L 760 178 L 380 178 Z" fill={fin} />
      )}
      {kind === 'sail' && Array.from({length: 7}, (_, i) => <circle key={i} cx={420 + i * 45} cy={110 + (i % 2) * 20} r={7} fill="#5b86c9" opacity={0.6 * (1 - dark)} />)}
      {/* tail */}
      <path d={`M 850 200 C 890 ${150 + t}, 930 ${95 + t}, ${990 + t * 0.3} ${50 + t} C 960 ${120 + t}, 950 170, 935 200 C 950 230, 960 ${280 + t}, ${990 + t * 0.3} ${350 + t} C 930 ${305 + t}, 890 ${250 + t}, 850 200 Z`} fill={fin} />
      {/* body */}
      <path d="M 290 200 C 380 150, 560 150, 700 160 C 790 170, 840 188, 860 200 C 840 212, 790 230, 700 240 C 560 254, 380 250, 290 214 Z" fill={`url(#${id})`} />
      {kind === 'marlin' && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${460 + i * 55} 160 L ${470 + i * 55} 215`} stroke="#8fb6ff" strokeWidth={5} opacity={0.35 * (1 - dark)} />)}
      {/* pectoral + pelvic */}
      <path d={`M 400 225 C 440 260, 470 ${290 + t * 0.4}, 500 ${296 + t * 0.4} C 480 260, 460 240, 440 226 Z`} fill={fin} />
      <path d="M 450 240 L 470 300 L 478 242 Z" fill={fin} />
      <path d="M 820 182 L 845 170 L 848 188 Z" fill={fin} />
      <circle cx={330} cy={196} r={10} fill="#0a0d12" />
      <circle cx={327} cy={193} r={3} fill="#fff" opacity={0.8 * (1 - dark)} />
    </svg>
  );
};

/** Sport-fishing boat, side view, bow to the right. Native 900x420. Cockpit (stern) on the left. */
export const SportBoat: React.FC<{x: number; y: number; w?: number; roll?: number; rod?: number}> = ({x, y, w = 900, roll = 0, rod = 0}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 12) * 5;
  const h = (w * 420) / 900;
  const bend = rod; // 0..1 rod bend
  return (
    <svg width={w} height={h} viewBox="0 0 900 420" style={{position: 'absolute', left: x - w / 2, top: y - h + bob, overflow: 'visible', transform: `rotate(${roll + Math.sin(f / 16) * 1.2}deg)`, transformOrigin: '50% 90%'}}>
      {/* outrigger + tower */}
      <path d="M 460 250 L 500 70 L 600 70 L 640 250" stroke="#cfd6da" strokeWidth={8} fill="none" />
      <rect x={480} y={60} width={140} height={14} fill="#e9ecee" />
      <line x1={560} y1={70} x2={300} y2={10} stroke="#9aa5ab" strokeWidth={4} />
      {/* cabin */}
      <path d="M 420 250 L 450 170 L 720 170 L 760 250 Z" fill="#f4f6f7" />
      {[0, 1, 2].map((i) => <rect key={i} x={480 + i * 80} y={186} width={60} height={34} fill="#22323d" />)}
      {/* hull */}
      <path d="M 40 250 L 860 250 C 880 250, 895 262, 900 270 L 860 330 C 700 345, 200 345, 70 330 Z" fill="#ffffff" />
      <path d="M 70 312 C 200 326, 700 326, 868 312 L 860 330 C 700 345, 200 345, 70 330 Z" fill="#1d4f7a" />
      {/* fighting chair + rod in cockpit */}
      <rect x={150} y={210} width={40} height={40} fill="#c8d0d4" />
      <rect x={168} y={180} width={8} height={30} fill="#9aa5ab" />
      <path d={`M 172 200 Q ${100 - bend * 40} ${110 + bend * 40} ${40 - bend * 120} ${60 + bend * 130}`} stroke="#2b3338" strokeWidth={5} fill="none" />
    </svg>
  );
};

/** 19th-century sailing ship silhouette, bow to the right. Native 900x700. */
export const SailShip: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 900}) => {
  const f = useCurrentFrame();
  const h = (w * 700) / 900;
  const sway = Math.sin(f / 20) * 1.5;
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', transform: `rotate(${sway}deg)`, transformOrigin: '50% 95%'}}>
      {[220, 450, 670].map((mx, i) => (
        <g key={mx}>
          <rect x={mx - 6} y={60 + i * 10} width={12} height={540} fill="#2a1d14" />
          {[0, 1, 2].map((k) => <path key={k} d={`M ${mx - 120 + k * 15} ${110 + i * 10 + k * 140} Q ${mx} ${150 + i * 10 + k * 140} ${mx + 120 - k * 15} ${110 + i * 10 + k * 140} L ${mx + 110 - k * 15} ${230 + i * 10 + k * 140} Q ${mx} ${260 + i * 10 + k * 140} ${mx - 110 + k * 15} ${230 + i * 10 + k * 140} Z`} fill="#e6dcc6" opacity={0.95} />)}
        </g>
      ))}
      <path d="M 40 590 L 860 590 L 800 690 L 110 690 Z" fill="#3a2717" />
      <path d="M 860 590 L 900 560 L 880 600 Z" fill="#3a2717" />
      <rect x={60} y={610} width={760} height={10} fill="#c9a24e" opacity={0.7} />
    </svg>
  );
};

/** Wooden plank cross-section with two bills embedded. */
export const Plank: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 1300}) => {
  const h = w * 0.36;
  return (
    <svg width={w} height={h} viewBox="0 0 1300 470" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible'}}>
      <rect x={0} y={60} width={1300} height={350} rx={18} fill="#8a5a33" />
      {Array.from({length: 16}, (_, i) => <path key={i} d={`M 0 ${80 + i * 21} C 300 ${70 + i * 21 + Math.sin(i) * 12}, 800 ${92 + i * 21}, 1300 ${78 + i * 21}`} stroke="#6b4325" strokeWidth={3} fill="none" opacity={0.7} />)}
      {/* bills entering from below-left at slight angles */}
      <path d="M 300 470 L 470 150 L 480 156 L 330 470 Z" fill="#3b3f4a" />
      <path d="M 760 470 L 860 120 L 872 124 L 792 470 Z" fill="#3b3f4a" />
      <circle cx={470} cy={152} r={6} fill="#1f160e" />
      <circle cx={862} cy={122} r={6} fill="#1f160e" />
    </svg>
  );
};

/** Fishing reel (front view) spinning; speed in rotations/frame. */
export const Reel: React.FC<{x: number; y: number; r?: number; spin?: number}> = ({x, y, r = 220, spin = 0.3}) => {
  const f = useCurrentFrame();
  const a = f * spin * 360;
  return (
    <svg width={r * 2.4} height={r * 2.4} viewBox="-120 -120 240 240" style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, overflow: 'visible'}}>
      <circle r={100} fill="#c9cfd3" stroke="#6d7a82" strokeWidth={6} />
      <circle r={78} fill="#e7b04a" />
      <g transform={`rotate(${a})`}>
        {[0, 60, 120, 180, 240, 300].map((d) => <rect key={d} x={-4} y={-74} width={8} height={36} fill="#a0721f" transform={`rotate(${d})`} />)}
      </g>
      <circle r={24} fill="#6d7a82" />
      <g transform={`rotate(${a * 0.5})`}><rect x={-6} y={-6} width={70} height={12} rx={6} fill="#2b3338" /><circle cx={64} r={12} fill="#2b3338" /></g>
    </svg>
  );
};

/** School of sardines: n dots around (cx,cy); scatter 0..1; injured fraction highlighted. */
export const Sardines: React.FC<{cx: number; cy: number; n?: number; rx?: number; ry?: number; scatter?: number; hit?: number; seed?: number}> = ({cx, cy, n = 260, rx = 420, ry = 220, scatter = 0, hit = 0, seed = 3}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const a = rand(i + seed) * Math.PI * 2, r = Math.sqrt(rand(i + seed + 1));
        const sx = Math.cos(a) * r * rx * (1 + scatter * (0.6 + rand(i) * 0.8)), sy = Math.sin(a) * r * ry * (1 + scatter * (0.6 + rand(i + 2)));
        const x = cx + sx + Math.sin(f / 9 + i) * 6, y = cy + sy + Math.cos(f / 11 + i) * 4;
        const injured = rand(i + seed + 7) < hit;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 22, height: 7, borderRadius: '50% 40% 40% 50%', background: injured ? '#ff6a5a' : '#cfe3ec', boxShadow: injured ? '0 0 8px #ff3b3b' : undefined, transform: `rotate(${Math.sin(f / 15 + i) * 8 + (injured ? 40 : 0)}deg)`, opacity: 0.9}} />;
      })}
    </>
  );
};
