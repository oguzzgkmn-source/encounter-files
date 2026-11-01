import React from 'react';
import {Easing, interpolateColors, useCurrentFrame} from 'remotion';
import {Squid2} from '../opening/kit';
import {C, MONO, flash3, lerp, rand} from './core';

/* ---------- silhouettes ---------- */
export const Shark: React.FC<{x: number; y: number; w?: number; color?: string; flip?: boolean}> = ({x, y, w = 600, color = '#2b3f4a', flip}) => {
  const f = useCurrentFrame();
  const t = Math.sin(f / 6) * 8;
  return (
    <svg width={w} height={w / 3} viewBox="0 0 600 200" style={{position: 'absolute', left: x - w / 2, top: y - w / 6, transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible'}}>
      <path d={`M 20 110 C 80 80, 200 70, 300 72 L 330 18 L 362 74 C 430 78, 500 90, 540 102 L ${600 + t} ${48 + t} L 585 110 L ${600 + t} ${168 + t} L 540 120 C 480 132, 380 140, 300 138 L 268 172 L 248 136 C 160 134, 70 128, 20 110 Z`} fill={color} />
      <circle cx={70} cy={100} r={5} fill="#000" />
      <path d="M 40 118 L 120 120" stroke="#000" strokeWidth={3} opacity={0.5} />
    </svg>
  );
};

export const Human: React.FC<{x: number; y: number; h?: number; color?: string}> = ({x, y, h = 350, color = '#9fb3bd'}) => (
  <svg width={h * 0.32} height={h} viewBox="0 0 112 350" style={{position: 'absolute', left: x - h * 0.16, top: y - h}}>
    <circle cx={56} cy={24} r={22} fill={color} />
    <rect x={32} y={52} width={48} height={120} rx={20} fill={color} />
    <rect x={12} y={58} width={16} height={110} rx={8} fill={color} />
    <rect x={84} y={58} width={16} height={110} rx={8} fill={color} />
    <rect x={34} y={160} width={19} height={190} rx={9} fill={color} />
    <rect x={59} y={160} width={19} height={190} rx={9} fill={color} />
  </svg>
);

export const Dog: React.FC<{x: number; y: number; w?: number; color?: string}> = ({x, y, w = 420, color = '#9fb3bd'}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 420 260" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.62}}>
    <ellipse cx={200} cy={120} rx={130} ry={55} fill={color} />
    <rect x={95} y={130} width={26} height={130} rx={12} fill={color} />
    <rect x={135} y={135} width={26} height={125} rx={12} fill={color} />
    <rect x={250} y={135} width={26} height={125} rx={12} fill={color} />
    <rect x={290} y={130} width={26} height={130} rx={12} fill={color} />
    <path d="M 300 95 L 345 40 L 395 52 L 410 80 L 370 100 L 330 125 Z" fill={color} />
    <path d="M 345 40 L 352 8 L 372 44 Z" fill={color} />
    <path d="M 75 105 C 40 90, 25 60, 20 40" stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
  </svg>
);

export const Boat: React.FC<{x: number; y: number; w?: number; lamp?: number}> = ({x, y, w = 420, lamp = 1}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 12 + x) * 4;
  return (
    <>
      <div style={{position: 'absolute', left: x - w * 0.35, top: y - w * 0.45 + bob, width: w * 0.7, height: w * 0.7, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,215,130,${0.5 * lamp}), transparent 65%)`}} />
      <div style={{position: 'absolute', left: x - w * 0.12, top: y + 10, width: w * 0.24, height: w * 0.9, background: `linear-gradient(180deg, rgba(255,215,130,${0.3 * lamp}), transparent)`, filter: 'blur(14px)'}} />
      <svg width={w} height={w * 0.26} viewBox="0 0 420 110" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.2 + bob}}>
        <path d="M 10 80 L 410 80 L 370 104 L 40 104 Z" fill="#04070b" />
        <rect x={250} y={30} width={50} height={50} fill="#04070b" />
        <line x1={150} y1={80} x2={150} y2={10} stroke="#04070b" strokeWidth={5} />
        <circle cx={150} cy={12} r={10} fill="#ffe0a0" opacity={lamp} />
      </svg>
    </>
  );
};

/* ---------- squid field ---------- */
export type FieldOpts = {n: number; seed?: number; cx?: number; cy?: number; rx?: number; ry?: number; inner?: number; w?: [number, number]; lit?: number; red?: number | 'flash'; redAt?: number; fadeAt?: number; fadeLen?: number; drift?: number; face?: 'center' | 'random' | 'left' | 'right'; opacity?: number};
export const SquidField: React.FC<FieldOpts> = ({n, seed = 1, cx = 960, cy = 540, rx = 900, ry = 520, inner = 0.3, w = [120, 260], lit = 0.15, red = 0, redAt, fadeAt, fadeLen = 40, drift = 0, face = 'center', opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      {Array.from({length: n}, (_, i) => {
        const a = rand(i * 7 + seed) * Math.PI * 2;
        const r = inner + (1 - inner) * Math.sqrt(rand(i * 7 + seed + 1));
        const rr = Math.max(0.12, r - drift * f * 0.001);
        const x = cx + Math.cos(a) * rr * rx, y = cy + Math.sin(a) * rr * ry;
        const ww = w[0] + (w[1] - w[0]) * rand(i * 7 + seed + 2);
        let rd = 0;
        if (red === 'flash') rd = flash3(f, rand(i + seed) * 6, 2.6 + rand(i + 3) * 0.8);
        else if (typeof red === 'number') rd = red;
        if (redAt !== undefined) {
          const d = redAt + r * 10;
          rd = lerp(f, d, d + 5, 0, 1) * (red === 'flash' ? flash3(f, rand(i) * 6) : 0.85 + 0.15 * Math.sin(f * 1.4 + i));
        }
        if (fadeAt !== undefined) rd *= lerp(f, fadeAt + r * 20, fadeAt + r * 20 + fadeLen, 1, 0);
        const fade = fadeAt !== undefined ? lerp(f, fadeAt + fadeLen * 0.5 + r * 20, fadeAt + fadeLen * 1.5 + r * 20, 1, 0) : 1;
        let rot = 0, flip = false;
        if (face === 'center') rot = (a * 180) / Math.PI;
        else if (face === 'random') rot = (rand(i + seed + 9) - 0.5) * 60, (flip = rand(i + seed + 11) > 0.5);
        else if (face === 'right') flip = true;
        return (
          <div key={i} style={{opacity: fade}}>
            <Squid2 x={x + Math.sin(f / 18 + i) * 10} y={y + Math.cos(f / 22 + i) * 8} w={ww} lit={lit} red={rd} rot={rot} flip={flip} phase={i * 7} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- close-ups ---------- */
/** Sucker seen face-on, ring of teeth. close 0..1 closes the teeth inward. */
export const Sucker: React.FC<{x: number; y: number; r?: number; close?: number; teeth?: number}> = ({x, y, r = 300, close = 0, teeth = 1}) => {
  const n = 22;
  return (
    <svg width={r * 2.4} height={r * 2.4} viewBox="-120 -120 240 240" style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, overflow: 'visible'}}>
      <circle r={110} fill="#c9a8a0" />
      <circle r={100} fill="#b38c84" />
      <circle r={78} fill="#e9dcd4" stroke="#8a6a64" strokeWidth={3} />
      <circle r={70 - close * 18} fill="#3a1f1e" />
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r0 = 76, r1 = 76 - (16 + close * 18) * teeth;
        const w = 0.11;
        const p = (rad: number, ang: number) => `${(Math.cos(ang) * rad).toFixed(1)},${(Math.sin(ang) * rad).toFixed(1)}`;
        return <polygon key={i} points={`${p(r0, a - w)} ${p(r1, a)} ${p(r0, a + w)}`} fill="#f7f3ea" stroke="#6b5550" strokeWidth={1} opacity={teeth} />;
      })}
    </svg>
  );
};

/** Front view: ring of arms with the beak in the middle. open 0..1 */
export const Beak: React.FC<{x: number; y: number; s?: number; open?: number}> = ({x, y, s = 1, open = 0}) => {
  const f = useCurrentFrame();
  return (
    <svg width={900 * s} height={900 * s} viewBox="-450 -450 900 900" style={{position: 'absolute', left: x - 450 * s, top: y - 450 * s, overflow: 'visible'}}>
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + Math.sin(f / 20 + i) * 0.05;
        const len = i % 5 === 2 ? 440 : 330;
        const x1 = Math.cos(a) * len, y1 = Math.sin(a) * len;
        const cx1 = Math.cos(a + 0.25) * len * 0.5, cy1 = Math.sin(a + 0.25) * len * 0.5;
        return (
          <g key={i}>
            <path d={`M 0 0 Q ${cx1} ${cy1} ${x1} ${y1}`} stroke="#b9475a" strokeWidth={70 - (i % 5 === 2 ? 40 : 0)} strokeLinecap="round" fill="none" />
            {Array.from({length: 6}, (_, j) => {
              const t = 0.3 + j * 0.11;
              const px = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * cx1 + t * t * x1;
              const py = 2 * (1 - t) * t * cy1 + t * t * y1;
              return <circle key={j} cx={px} cy={py} r={12 - j} fill="#e9d6d0" stroke="#6b3a40" strokeWidth={2} />;
            })}
          </g>
        );
      })}
      <circle r={120} fill="#7e2c3b" />
      <circle r={95} fill="#3a1218" />
      <g transform={`translate(0 ${-10 - open * 22})`}>
        <path d="M -55 10 C -50 -50, 30 -70, 60 -10 C 40 -30, 0 -25, -10 15 Z" fill="#1a0f0a" stroke="#3b2a1e" strokeWidth={3} />
      </g>
      <g transform={`translate(0 ${10 + open * 22})`}>
        <path d="M -50 -5 C -40 45, 30 55, 55 5 C 30 25, 0 20, -5 -12 Z" fill="#221510" stroke="#3b2a1e" strokeWidth={3} />
      </g>
    </svg>
  );
};

/** Chromatophore skin patch: dots expand (red) / contract (white skin). expand 0..1 */
export const Skin: React.FC<{expand: number; w?: number; h?: number; x?: number; y?: number}> = ({expand, w = 1920, h = 1080, x = 0, y = 0}) => {
  const cols = 24, rows = 14, cw = w / cols, ch = h / rows;
  const bg = interpolateColors(expand, [0, 1], ['#efe4dc', '#5a0a0e']);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: bg, overflow: 'hidden'}}>
      {Array.from({length: cols * rows}, (_, i) => {
        const cx = (i % cols) * cw + cw / 2 + (Math.floor(i / cols) % 2 ? cw / 2 : 0) + (rand(i) - 0.5) * 18;
        const cy = Math.floor(i / cols) * ch + ch / 2 + (rand(i + 50) - 0.5) * 18;
        const r = 5 + expand * (cw * 0.62) * (0.8 + rand(i + 9) * 0.4);
        return <div key={i} style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: expand > 0.5 ? '#c3161f' : '#8a1c1f', boxShadow: `0 0 ${6 + expand * 10}px rgba(150,10,15,0.6)`}} />;
      })}
    </div>
  );
};

/** Simple icon set (stroke icons) */
export const Icon: React.FC<{name: 'lungs' | 'ear' | 'arm' | 'head' | 'eye' | 'light' | 'shield' | 'people' | 'warning'; x: number; y: number; size?: number; color?: string}> = ({name, x, y, size = 160, color = C.red}) => {
  const p: Record<string, React.ReactNode> = {
    lungs: (
      <>
        <path d="M50 10 V45 M50 45 L35 55 M50 45 L65 55" />
        <path d="M33 30 C15 35, 10 70, 15 85 C25 92, 40 88, 42 75 L42 40 Z" />
        <path d="M67 30 C85 35, 90 70, 85 85 C75 92, 60 88, 58 75 L58 40 Z" />
      </>
    ),
    ear: <path d="M35 80 C25 70, 25 55, 35 50 C45 45, 40 30, 50 20 C65 10, 80 25, 75 45 C72 60, 55 60, 55 75 C55 88, 42 92, 35 80 Z" />,
    arm: <path d="M20 30 L45 30 L75 60 L85 85 M45 30 L45 22 M20 30 L20 40" />,
    head: <><circle cx={50} cy={45} r={28} /><path d="M30 80 L70 80" /></>,
    eye: <><path d="M10 50 C30 20, 70 20, 90 50 C70 80, 30 80, 10 50 Z" /><circle cx={50} cy={50} r={12} /></>,
    light: <><rect x={20} y={40} width={35} height={20} rx={4} /><path d="M55 35 L85 20 M55 50 L90 50 M55 65 L85 80" /></>,
    shield: <path d="M50 10 L85 22 C85 55, 72 78, 50 90 C28 78, 15 55, 15 22 Z" />,
    people: <><circle cx={35} cy={35} r={12} /><circle cx={65} cy={35} r={12} /><path d="M15 80 C15 55, 55 55, 55 80 M45 80 C45 55, 85 55, 85 80" /></>,
    warning: <><path d="M50 12 L90 85 L10 85 Z" /><path d="M50 38 V62 M50 72 V74" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible'}} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
};

/** Pairs of glowing eyes in darkness. */
export const Eyes: React.FC<{n?: number; seed?: number; on?: number}> = ({n = 26, seed = 3, on = 1}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const x = 80 + rand(i + seed) * 1760, y = 80 + rand(i + seed + 40) * 920;
        const s = 14 + rand(i + seed + 80) * 22;
        const blink = Math.sin(f / 9 + i * 3) > 0.97 ? 0.1 : 1;
        const o = on * blink * lerp(f, i * 1.5, i * 1.5 + 10, 0, 1);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle, #fffbe0 0%, #c9d8a0 35%, rgba(120,160,90,0) 70%)', opacity: o, boxShadow: `0 0 ${s}px rgba(200,230,150,${0.5 * o})`}} />
        );
      })}
    </>
  );
};

/** Plate of calamari rings (top view). */
export const Plate: React.FC<{x: number; y: number; s?: number; n?: number}> = ({x, y, s = 1, n = 9}) => (
  <svg width={700 * s} height={700 * s} viewBox="-350 -350 700 700" style={{position: 'absolute', left: x - 350 * s, top: y - 350 * s}}>
    <circle r={330} fill="#dfe6e8" />
    <circle r={280} fill="#f3f6f7" stroke="#cdd6d9" strokeWidth={4} />
    {Array.from({length: n}, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = i === 0 ? 0 : 150;
      return (
        <g key={i} transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r}) rotate(${i * 40})`}>
          <ellipse rx={70} ry={58} fill="#d8a656" />
          <ellipse rx={40} ry={30} fill="#f3f6f7" />
          <ellipse rx={70} ry={58} fill="none" stroke="#b8822f" strokeWidth={6} />
        </g>
      );
    })}
    <path d="M 160 -230 A 70 70 0 0 1 250 -150 L 160 -230 Z" fill="#f4dd4a" stroke="#d7bd20" strokeWidth={4} />
  </svg>
);

/** Small mono caption box (quote / data) */
export const Panel: React.FC<{x: number; y: number; w: number; at: number; title?: string; children: React.ReactNode; color?: string}> = ({x, y, w, at, title, children, color = C.amber}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = lerp(f, at, at + 8, 0, 1, Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: 'rgba(3,10,16,0.88)', border: `2px solid ${color}55`, borderLeft: `6px solid ${color}`, padding: '28px 36px'}}>
      {title && <div style={{fontFamily: MONO, fontSize: 24, color, letterSpacing: 6, marginBottom: 14}}>{title}</div>}
      {children}
    </div>
  );
};
