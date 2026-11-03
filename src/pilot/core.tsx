import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import timings from './timings.json';
import maps from './maps.json';
import {C, HEAD, MONO, rand} from '../theme';
import {Camera, FPS, Grain, Vignette, lerp} from '../opening/kit';

export {C, HEAD, MONO, rand, FPS, lerp, Camera, Vignette, Grain};

/* ---------- timing ---------- */
type Line = {id: string; text: string; s: number; e: number};
export const LINES: Record<string, Line> = {};
timings.lines.forEach((l: any) => (LINES[l.id] = {id: l.id, text: l.text, s: Math.round(l.start * FPS), e: Math.round(l.end * FPS)}));
export const TOTAL_FRAMES = Math.round(timings.duration * FPS);
/** Register another episode's VO timings (ids must be unique across episodes). */
export const addTimings = (t: {lines: any[]}) =>
  t.lines.forEach((l: any) => (LINES[l.id] = {id: l.id, text: l.text, s: Math.round(l.start * FPS), e: Math.round(l.end * FPS)}));

export const ShotCtx = createContext<{t0: number; dur: number; off?: number; cam?: Cam; camDur?: number}>({t0: 0, dur: 1});
/** Hook giving local-frame helpers for the current shot. */
export const useShot = () => {
  const {t0, dur, off = 0} = useContext(ShotCtx);
  const f = useCurrentFrame() + off;
  /** local frame where line `id` starts (+frac of its length) */
  const at = (id: string, frac = 0) => {
    const l = LINES[id];
    return l.s + frac * (l.e - l.s) - t0;
  };
  /** local frame where `word` (first occurrence) is spoken in line `id` (char-proportional estimate) */
  const atWord = (id: string, word: string) => {
    const l = LINES[id];
    const i = l.text.toLowerCase().indexOf(word.toLowerCase());
    const frac = i < 0 ? 0 : i / l.text.length;
    return l.s + frac * (l.e - l.s) - t0;
  };
  const end = (id: string) => LINES[id].e - t0;
  return {f, dur, at, atWord, end};
};

/* ---------- camera keyframes ---------- */
export type Cam = {s?: [number, number]; x?: [number, number]; y?: [number, number]; r?: [number, number]; shake?: {at: number; amp: number; len?: number}[]};
export const Shot: React.FC<{cam?: Cam; bg?: string; vignette?: number; children: React.ReactNode; over?: React.ReactNode}> = ({cam = {}, bg = '#01060a', vignette = 0.85, children, over}) => {
  const ctx = useContext(ShotCtx);
  const f = useCurrentFrame();
  const dur = ctx.camDur ?? ctx.dur;
  if (ctx.cam) cam = {...ctx.cam, shake: cam.shake};
  const off = ctx.off ?? 0;
  const k = (v?: [number, number], d = 0) => (v ? interpolate(f, [0, dur], v, {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)}) : d);
  let sh = 0;
  (cam.shake || []).forEach(({at, amp, len = 18}) => {
    const g = f + off;
    if (g >= at && g < at + len) sh = Math.max(sh, amp * (1 - (g - at) / len));
  });
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <Camera scale={k(cam.s, 1)} x={k(cam.x)} y={k(cam.y)} rot={k(cam.r)} shake={sh}>
        {children}
      </Camera>
      {vignette > 0 && <Vignette strength={vignette} />}
      {over}
    </AbsoluteFill>
  );
};

/* ---------- small helpers ---------- */
export const appear = (f: number, at: number, len = 8) => lerp(f, at, at + len, 0, 1, Easing.out(Easing.cubic));
export const pop = (f: number, at: number) => lerp(f, at, at + 9, 0, 1, Easing.out(Easing.back(2.2)));
export const flash3 = (f: number, phase = 0, hz = 3) => {
  const v = Math.sin((2 * Math.PI * hz * f) / FPS + phase);
  return Math.max(0, Math.min(1, v * 2 + 0.5));
};

export const Water: React.FC<{top?: string; bottom?: string; rays?: number}> = ({top = '#06192a', bottom = '#01050a', rays = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 85%)`}}>
      {rays > 0 &&
        Array.from({length: 6}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 200 + i * 300 + Math.sin(f / 30 + i) * 30, top: -200, width: 120 + rand(i) * 80, height: 1300, background: 'linear-gradient(180deg, rgba(160,215,240,0.18), transparent 70%)', transform: `rotate(${-12 + i * 4}deg)`, transformOrigin: 'top', filter: 'blur(16px)', opacity: rays * (0.5 + 0.5 * Math.sin(f / 15 + i * 2))}} />
        ))}
    </AbsoluteFill>
  );
};

/** HUD-style lower-left label that types on. */
export const Label: React.FC<{text: string; at: number; color?: string; x?: number; y?: number; size?: number}> = ({text, at, color = C.sonar, x = 110, y = 950, size = 26}) => {
  const {f} = useShot();
  if (f < at) return null;
  const n = Math.floor((f - at) * 1.8);
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: MONO, fontSize: size, letterSpacing: 4, color, padding: '10px 18px', border: `1px solid ${color}66`, background: 'rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>
      <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0.4}}>■ </span>
      {text.slice(0, n)}
    </div>
  );
};

/** Big headline text that slams in. */
export const Headline: React.FC<{text: React.ReactNode; at: number; size?: number; color?: string; y?: number; x?: number; align?: 'center' | 'left'; font?: string; spacing?: number}> = ({text, at, size = 120, color = C.white, y = 470, x, align = 'center', font = HEAD, spacing = 2}) => {
  const {f} = useShot();
  if (f < at) return null;
  const p = lerp(f, at, at + 7, 0, 1, Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', left: align === 'center' ? 0 : x, width: align === 'center' ? 1920 : undefined, top: y, textAlign: align, fontFamily: font, fontSize: size, lineHeight: 1.02, color, letterSpacing: spacing, opacity: p, transform: `scale(${1.25 - 0.25 * p})`, transformOrigin: align === 'center' ? '50% 50%' : '0% 50%', textShadow: '0 6px 30px rgba(0,0,0,0.7)'}}>
      {text}
    </div>
  );
};

/** Words appear one by one, timed across a VO line. */
export const KineticLine: React.FC<{line: string; text?: string; y?: number; size?: number; color?: string; accent?: string[]; accentColor?: string; font?: string; maxWidth?: number}> = ({line, text, y = 440, size = 96, color = C.white, accent = [], accentColor = C.red, font = HEAD, maxWidth = 1500}) => {
  const {f, at, end} = useShot();
  const words = (text ?? LINES[line].text).split(' ');
  const s = at(line), e = end(line);
  return (
    <div style={{position: 'absolute', left: (1920 - maxWidth) / 2, width: maxWidth, top: y, textAlign: 'center', fontFamily: font, fontSize: size, lineHeight: 1.1, color}}>
      {words.map((w, i) => {
        const wa = s + ((e - s) * i) / words.length;
        const p = lerp(f, wa, wa + 5, 0, 1, Easing.out(Easing.cubic));
        const isAcc = accent.some((a) => w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(a));
        return (
          <span key={i} style={{display: 'inline-block', marginRight: size * 0.28, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, color: isAcc ? accentColor : color}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Stamp (rotated, bordered) that slams on. */
export const Stamp: React.FC<{text: string; at: number; x: number; y: number; color?: string; rot?: number; size?: number}> = ({text, at, x, y, color = C.red, rot = -8, size = 56}) => {
  const {f} = useShot();
  if (f < at) return null;
  const p = lerp(f, at, at + 6, 0, 1, Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2 - p})`, opacity: p, fontFamily: HEAD, fontSize: size, color, border: `6px solid ${color}`, padding: '6px 26px', letterSpacing: 6, whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.25)'}}>
      {text}
    </div>
  );
};

/** Count-up number. */
export const Counter: React.FC<{to: number; from?: number; at: number; len?: number; size?: number; color?: string; suffix?: string; prefix?: string; y?: number; label?: string; sub?: string; cx?: number}> = ({to, from = 0, at, len = 40, size = 220, color = C.white, suffix = '', prefix = '', y = 330, label, sub, cx = 960}) => {
  const {f} = useShot();
  const v = Math.round(lerp(f, at, at + len, from, to, Easing.out(Easing.cubic)));
  return (
    <div style={{position: 'absolute', left: cx - 960, width: 1920, top: y, textAlign: 'center', opacity: appear(f, at - 4)}}>
      {label && <div style={{fontFamily: MONO, fontSize: 30, color: C.grey, letterSpacing: 8, marginBottom: 10}}>{label}</div>}
      <div style={{fontFamily: HEAD, fontSize: size, color, lineHeight: 1}}>
        {prefix}
        {v.toLocaleString('en-US')}
        {suffix}
      </div>
      {sub && <div style={{fontFamily: MONO, fontSize: 30, color: C.white, letterSpacing: 4, marginTop: 20, opacity: appear(f, at + len - 10)}}>{sub}</div>}
    </div>
  );
};

/* ---------- maps ---------- */
type View = 'pacific' | 'baja';
export const project = (view: View, lon: number, lat: number) => {
  const m: any = (maps as any)[view];
  const merc = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return {x: m.ox + m.s * (((lon - m.lon0) * Math.PI) / 180), y: m.H - (m.oy + m.s * (merc - m.y0))};
};
export const MapBase: React.FC<{view: View; land?: string; stroke?: string}> = ({view, land = '#0d1f29', stroke = 'rgba(61,255,154,0.45)'}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <pattern id={`grid-${view}`} width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(61,255,154,0.07)" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="#020b12" />
    <rect width={1920} height={1080} fill={`url(#grid-${view})`} />
    <path d={(maps as any)[view].d} fill={land} stroke={stroke} strokeWidth={1.5} />
  </svg>
);
/** Animated route/region stroke along lon/lat points, revealed between from..to frames. */
export const MapTrail: React.FC<{view: View; pts: [number, number][]; from: number; to: number; color?: string; width?: number; dashed?: boolean; glow?: boolean}> = ({view, pts, from, to, color = C.red, width = 26, dashed, glow = true}) => {
  const {f} = useShot();
  const P = pts.map(([lo, la]) => project(view, lo, la));
  let len = 0;
  for (let i = 1; i < P.length; i++) len += Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
  const p = lerp(f, from, to, 0, 1, Easing.inOut(Easing.cubic));
  const d = 'M' + P.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join('L');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {glow && <path d={d} stroke={color} strokeWidth={width * 2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.25} strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{filter: 'blur(12px)'}} />}
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75} strokeDasharray={dashed ? undefined : len} strokeDashoffset={dashed ? undefined : len * (1 - p)} style={dashed ? {clipPath: `inset(${(1 - p) * 100}% 0 0 0)`} : undefined} />
    </svg>
  );
};
export const MapPin: React.FC<{view: View; lon: number; lat: number; at: number; label?: string; sub?: string; color?: string; side?: 'left' | 'right'}> = ({view, lon, lat, at, label, sub, color = C.red, side = 'right'}) => {
  const {f} = useShot();
  if (f < at) return null;
  const {x, y} = project(view, lon, lat);
  const p = pop(f, at);
  const ring = ((f - at) % 30) / 30;
  return (
    <>
      <div style={{position: 'absolute', left: x - 40 * ring, top: y - 40 * ring, width: 80 * ring, height: 80 * ring, borderRadius: '50%', border: `3px solid ${color}`, opacity: 1 - ring}} />
      <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: color, boxShadow: `0 0 20px ${color}`, transform: `scale(${p})`}} />
      {label && (
        <div style={{position: 'absolute', top: y - 24, ...(side === 'right' ? {left: x + 30} : {right: 1920 - x + 30}), textAlign: side === 'right' ? 'left' : 'right', fontFamily: MONO, opacity: p, whiteSpace: 'nowrap'}}>
          <div style={{fontSize: 30, fontWeight: 700, color: C.white, textShadow: '0 2px 8px #000'}}>{label}</div>
          {sub && <div style={{fontSize: 22, color, letterSpacing: 2}}>{sub}</div>}
        </div>
      )}
    </>
  );
};
