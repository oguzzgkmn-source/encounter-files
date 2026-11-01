import React from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {C, MONO, rand} from '../theme';

export const FPS = 30;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const lerp = (f: number, a: number, b: number, v0: number, v1: number, e = ease) =>
  interpolate(f, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Virtual camera: everything inside is moved/zoomed/shaken. */
export const Camera: React.FC<{scale?: number; x?: number; y?: number; rot?: number; shake?: number; children: React.ReactNode}> = ({scale = 1, x = 0, y = 0, rot = 0, shake = 0, children}) => {
  const f = useCurrentFrame();
  const sx = shake * (Math.sin(f * 1.9) * 0.6 + Math.sin(f * 3.7 + 1) * 0.4) * 18;
  const sy = shake * (Math.sin(f * 2.3 + 2) * 0.6 + Math.sin(f * 4.1) * 0.4) * 18;
  return <AbsoluteFill style={{transform: `translate(${x + sx}px, ${y + sy}px) scale(${scale}) rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>;
};

/** Marine snow; particles inside the torch beam light up. */
export const Snow: React.FC<{n?: number; beam?: {ox: number; oy: number; len: number; half: number}; dim?: number; seed?: number}> = ({n = 90, beam, dim = 0.25, seed = 0}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const x = (rand(i + seed) * 2100 - 90 + f * (0.4 + rand(i + 7) * 0.5)) % 2100 - 90;
        const y = (rand(i + 100 + seed) * 1200 + f * (0.25 + rand(i + 200) * 0.5)) % 1200 - 60;
        let a = dim * (0.3 + rand(i + 300) * 0.7);
        let s = 1.5 + rand(i + 400) * 2.5;
        if (beam) {
          const dx = x - beam.ox, dy = y - beam.oy;
          if (dx > 0 && dx < beam.len && Math.abs(Math.atan2(dy, dx)) < beam.half) {
            a = 0.95 * (1 - dx / beam.len) + 0.15;
            s *= 1.4;
          }
        }
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: `rgba(225,240,245,${a})`}} />;
      })}
    </>
  );
};

/** Side-view diver facing right, kicking. Origin = hip. Beam rendered from torch. */
export const Diver2: React.FC<{x: number; y: number; s?: number; beamLen?: number; beamHalf?: number; beamOn?: number; silhouette?: boolean; kick?: number; tilt?: number}> = ({x, y, s = 1, beamLen = 0, beamHalf = 0.24, beamOn = 1, silhouette, kick = 1, tilt = 0}) => {
  const f = useCurrentFrame();
  const suit = silhouette ? '#02070b' : '#1b2a33';
  const tank = silhouette ? '#02070b' : '#93a4ac';
  const fin = silhouette ? '#02070b' : '#22343e';
  const k = f * 0.22 * kick;
  const leg = (ph: number) => {
    const th = Math.PI + 0.12 + 0.2 * Math.sin(k + ph);
    const b = -0.15 - 0.25 * (1 + Math.sin(k + ph + 1)) / 2;
    const hip = {x: -60, y: 8};
    const knee = {x: hip.x + 95 * Math.cos(th), y: hip.y + 95 * Math.sin(th)};
    const ang = th + b;
    const ank = {x: knee.x + 88 * Math.cos(ang), y: knee.y + 88 * Math.sin(ang)};
    const tip = {x: ank.x + 95 * Math.cos(ang - 0.1), y: ank.y + 95 * Math.sin(ang - 0.1)};
    const nx = -Math.sin(ang) * 20, ny = Math.cos(ang) * 20;
    return (
      <g key={ph}>
        <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke={suit} strokeWidth={30} strokeLinecap="round" />
        <line x1={knee.x} y1={knee.y} x2={ank.x} y2={ank.y} stroke={suit} strokeWidth={24} strokeLinecap="round" />
        <polygon points={`${ank.x + nx * 0.4},${ank.y + ny * 0.4} ${ank.x - nx * 0.4},${ank.y - ny * 0.4} ${tip.x - nx},${tip.y - ny} ${tip.x + nx},${tip.y + ny}`} fill={fin} />
        {!silhouette && <line x1={tip.x - nx} y1={tip.y - ny} x2={tip.x + nx} y2={tip.y + ny} stroke={C.sonar} strokeWidth={4} opacity={0.8} />}
      </g>
    );
  };
  const bob = Math.sin(f / 20) * 6;
  const flick = beamOn * (0.92 + 0.08 * Math.sin(f * 1.3) * Math.sin(f * 0.7));
  const L = beamLen, ty = Math.tan(beamHalf);
  return (
    <div style={{position: 'absolute', left: x, top: y + bob, width: 0, height: 0, transform: `scale(${s}) rotate(${tilt}deg)`}}>
      <svg width={10} height={10} style={{overflow: 'visible', position: 'absolute'}}>
        <defs>
          <linearGradient id="bm" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff6d8" stopOpacity={0.75 * flick} />
            <stop offset="0.45" stopColor="#e9f3f0" stopOpacity={0.22 * flick} />
            <stop offset="1" stopColor="#e9f3f0" stopOpacity="0" />
          </linearGradient>
          <filter id="bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        {L > 0 && <polygon points={`205,14 ${205 + L},${14 - L * ty} ${205 + L},${14 + L * ty}`} fill="url(#bm)" filter="url(#bl)" />}
        {leg(0)}
        {leg(Math.PI)}
        <rect x={-75} y={-30} width={150} height={58} rx={29} fill={suit} />
        {!silhouette && <rect x={-60} y={-4} width={110} height={5} rx={2} fill={C.sonar} opacity={0.55} />}
        <rect x={-55} y={-62} width={105} height={34} rx={17} fill={tank} />
        <circle cx={98} cy={-6} r={27} fill={suit} />
        {!silhouette && <rect x={104} y={-21} width={24} height={16} rx={5} fill="#7fe8ff" opacity={0.75} />}
        <line x1={60} y1={-2} x2={148} y2={16} stroke={suit} strokeWidth={18} strokeLinecap="round" />
        <rect x={145} y={6} width={60} height={16} rx={4} fill={silhouette ? suit : '#3c4a52'} />
        {L > 0 && <circle cx={205} cy={14} r={9} fill="#fffbe8" opacity={flick} filter="url(#bl)" />}
      </svg>
    </div>
  );
};

/** Squid facing left; redness 0..1 drives chromatophore colour; lit 0..1 drives visibility. */
export const Squid2: React.FC<{x: number; y: number; w?: number; red?: number; lit?: number; rot?: number; phase?: number; flip?: boolean; trail?: number}> = ({x, y, w = 300, red = 0, lit = 1, rot = 0, phase = 0, flip, trail = 0}) => {
  const f = useCurrentFrame() + phase;
  const base = interpolateColors(lit, [0, 1], ['#0b151c', '#cdd6d8']);
  const col = interpolateColors(red, [0, 1], [base, '#e8232c']);
  const pulse = 1 + Math.sin(f / 5) * 0.04;
  const arms = Array.from({length: 8}, (_, i) => {
    const y0 = 128 + i * 6, spread = (i - 3.5) * 12, wv = Math.sin(f / 7 + i) * 9;
    return <path key={i} d={`M 215 ${y0} C 160 ${y0 + spread * 0.4 + wv}, 110 ${150 + spread + wv}, ${40 + (i % 3) * 18} ${150 + spread * 1.5 - wv}`} stroke={col} strokeWidth={9 - Math.abs(i - 3.5)} fill="none" strokeLinecap="round" />;
  });
  const t = Math.sin(f / 9) * 14;
  const body = (
    <svg width={w} height={(w * 300) / 1020} viewBox="-120 0 1020 300" style={{overflow: 'visible', filter: red > 0.3 ? `drop-shadow(0 0 ${22 * red}px rgba(255,40,40,${0.8 * red}))` : lit > 0.5 ? 'drop-shadow(0 0 6px rgba(255,255,255,0.25))' : undefined}}>
      <path d={`M 215 140 C 120 ${110 + t}, 20 ${120 - t}, -80 ${125 + t}`} stroke={col} strokeWidth={4} fill="none" />
      <ellipse cx={-85} cy={125 + t} rx={22} ry={7} fill={col} />
      <path d={`M 215 160 C 120 ${190 - t}, 20 ${180 + t}, -70 ${178 - t}`} stroke={col} strokeWidth={4} fill="none" />
      <ellipse cx={-75} cy={178 - t} rx={22} ry={7} fill={col} />
      {arms}
      <g transform={`translate(250 150) scale(1 ${pulse}) translate(-250 -150)`}>
        <path d="M 250 105 C 420 72, 640 100, 820 150 C 640 200, 420 228, 250 195 Z" fill={col} />
        <path d="M 260 160 C 420 175, 620 168, 800 152 C 620 196, 420 222, 260 192 Z" fill="#000" opacity={0.18} />
        <path d="M 640 128 L 745 62 L 830 150 L 745 238 L 640 172 Z" fill={col} />
      </g>
      <ellipse cx={240} cy={150} rx={48} ry={44} fill={col} />
      <circle cx={232} cy={136} r={13} fill="#04070a" />
      <circle cx={228} cy={132} r={4} fill="#fff" opacity={0.3 + 0.6 * Math.max(lit, red)} />
    </svg>
  );
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - (w * 300) / 1020 / 2, transform: `rotate(${rot}deg) scaleX(${flip ? -1 : 1})`}}>
      {trail > 0 && [3, 2, 1].map((k) => (
        <div key={k} style={{position: 'absolute', left: k * trail, top: 0, opacity: 0.12 * (4 - k)}}>{body}</div>
      ))}
      <div style={{position: 'relative'}}>{body}</div>
    </div>
  );
};

/** Targeting bracket that snaps on. */
export const Bracket: React.FC<{x: number; y: number; w: number; h: number; at: number; label?: string; color?: string}> = ({x, y, w, h, at, label, color = C.red}) => {
  const f = useCurrentFrame();
  const p = lerp(f, at, at + 6, 0, 1, Easing.out(Easing.back(2)));
  if (f < at) return null;
  const g = (1 - p) * 40;
  const c: React.CSSProperties = {position: 'absolute', width: 22, height: 22, borderColor: color, borderStyle: 'solid', borderWidth: 0};
  return (
    <div style={{position: 'absolute', left: x - w / 2 - g, top: y - h / 2 - g, width: w + 2 * g, height: h + 2 * g, opacity: p}}>
      <div style={{...c, left: 0, top: 0, borderTopWidth: 3, borderLeftWidth: 3}} />
      <div style={{...c, right: 0, top: 0, borderTopWidth: 3, borderRightWidth: 3}} />
      <div style={{...c, left: 0, bottom: 0, borderBottomWidth: 3, borderLeftWidth: 3}} />
      <div style={{...c, right: 0, bottom: 0, borderBottomWidth: 3, borderRightWidth: 3}} />
      {label && <div style={{position: 'absolute', left: 0, top: -30, fontFamily: MONO, fontSize: 18, fontWeight: 700, color, letterSpacing: 2, whiteSpace: 'nowrap'}}>{label}</div>}
    </div>
  );
};

/** Small HUD label (our signature lower-left tag). */
export const Tag: React.FC<{text: string; at: number; color?: string; x?: number; y?: number}> = ({text, at, color = C.sonar, x = 110, y = 960}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.floor((f - at) * 1.6);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: MONO, fontSize: 24, letterSpacing: 4, color, padding: '8px 16px', border: `1px solid ${color}55`, background: 'rgba(0,0,0,0.45)'}}>
      <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0.4}}>■ </span>{text.slice(0, n)}
    </div>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.8, color = '0,0,0'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 45%, rgba(${color},${strength}) 100%)`, pointerEvents: 'none'}} />
);
export const Grain: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)', pointerEvents: 'none'}} />
);
