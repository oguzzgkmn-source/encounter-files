import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile} from 'remotion';
import timings from './test_timings.json';
import {Bracket, Snow} from '../opening/kit';
import {C, Grain, HEAD, Headline, Label, LINES, MONO, Shot, ShotCtx, Stamp, addTimings, appear, lerp, rand, useShot} from '../pilot/core';
import {Sub, Swordfish, Tender} from './art';

addTimings(timings);
export const F2TEST_FRAMES = Math.round(timings.duration * 30);
export const IMPACT_LOCAL = 24; // frames after T5 start

const Deep: React.FC<{k?: number}> = ({k = 1}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 60% 40%, rgba(10,40,70,${0.9 * k}) 0%, #01040a 70%)`}} />
);
const Depth: React.FC<{v: number; color?: string}> = ({v, color = C.white}) => (
  <div style={{position: 'absolute', left: 110, top: 80, fontFamily: MONO}}>
    <div style={{color: C.grey, fontSize: 22, letterSpacing: 4}}>DEPTH</div>
    <div style={{color, fontSize: 56, fontWeight: 700}}>{Math.round(v)} m</div>
  </div>
);

/* T1 — date card */
const T1: React.FC = () => {
  const {f} = useShot();
  const n = Math.floor(f * 1.2);
  const d = 'JULY 6, 1967';
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#000" vignette={0.6}>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 400, textAlign: 'center', fontFamily: HEAD, fontSize: 170, color: C.white, letterSpacing: 8}}>{d.slice(0, n)}<span style={{opacity: Math.floor(f / 8) % 2}}>▌</span></div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 620, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.amber, letterSpacing: 10, opacity: appear(f, 30)}}>BLAKE PLATEAU · OFF FLORIDA</div>
      <div style={{position: 'absolute', left: 950, top: lerp(f, 0, 110, 760, 900), width: 10, height: 10, borderRadius: 5, background: '#fff6d8', boxShadow: '0 0 20px #fff6d8', opacity: 0.8}} />
    </Shot>
  );
};

/* T2 — Alvin descending */
const T2: React.FC = () => {
  const {f, dur} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.15], x: [0, -40]}} over={<><Depth v={lerp(f, 0, dur, 120, 610, Easing.out(Easing.quad))} /><Label text="DSV ALVIN · DIVE 202" at={10} /></>}>
      <Deep />
      <Snow n={110} dim={0.25} />
      <Sub x={lerp(f, 0, dur, 760, 900, Easing.linear)} y={lerp(f, 0, dur, 420, 600, Easing.linear)} w={780} tilt={8} lights={1} />
      {Array.from({length: 14}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 560 + rand(i) * 120, top: ((rand(i + 3) * 600 - f * 3) % 600 + 600) % 600 + 150, width: 8, height: 8, borderRadius: '50%', border: '2px solid rgba(220,245,255,0.5)'}} />
      ))}
    </Shot>
  );
};

/* T3 — no light, no sound */
const T3: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.25, 1.1]}} bg="#000" over={
      <div style={{position: 'absolute', right: 120, top: 90, fontFamily: MONO, fontSize: 30, color: C.grey, textAlign: 'right', lineHeight: 1.6}}>
        <div style={{opacity: appear(f, 6)}}>SUNLIGHT: <span style={{color: C.white}}>0%</span></div>
        <div style={{opacity: appear(f, 40)}}>SOUND: <span style={{color: C.white}}>—</span></div>
      </div>
    }>
      <Deep k={0.25} />
      <Snow n={60} dim={0.12} />
      <Sub x={960} y={560} w={420} lights={0.35} />
    </Shot>
  );
};

/* T4 — sonar: a fast contact */
const T4: React.FC = () => {
  const {f, dur} = useShot();
  const R = 400;
  const p = lerp(f, 10, dur + 10, 0, 1, Easing.in(Easing.cubic));
  const cx = R + Math.cos(-0.3) * R * 0.95 * (1 - p), cy = R + Math.sin(-0.3) * R * 0.95 * (1 - p);
  return (
    <Shot cam={{s: [1.0, 1.12]}} bg="#010806" over={<Label text="CONTACT · CLOSING FAST" at={14} color={C.red} />}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 2 * R, height: 2 * R, borderRadius: R, border: `2px solid ${C.sonar}`, overflow: 'hidden', background: 'rgba(3,22,14,0.8)'}}>
          {[0.33, 0.66].map((k) => <div key={k} style={{position: 'absolute', left: R - R * k, top: R - R * k, width: 2 * R * k, height: 2 * R * k, borderRadius: '50%', border: `1px solid ${C.sonarDim}`}} />)}
          <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${(f * 10) % 360}deg, transparent 0deg, rgba(61,255,154,0.35) 45deg, transparent 45deg)`}} />
          {[0, 1, 2, 3].map((k) => <div key={k} style={{position: 'absolute', left: cx + Math.cos(-0.3) * k * 14 - 6, top: cy + Math.sin(-0.3) * k * 14 - 6, width: 12, height: 12, borderRadius: 6, background: C.red, opacity: f > 10 ? 1 - k * 0.25 : 0, boxShadow: `0 0 12px ${C.red}`}} />)}
          <div style={{position: 'absolute', left: R - 12, top: R - 12, width: 24, height: 24, background: C.sonar, transform: 'rotate(45deg)'}} />
          <div style={{position: 'absolute', left: R + 22, top: R - 14, fontFamily: MONO, color: C.sonar, fontSize: 22, fontWeight: 700}}>ALVIN</div>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* T5 — impact */
const T5: React.FC = () => {
  const {f} = useShot();
  const I = IMPACT_LOCAL;
  const fx = lerp(f, 0, I, 2350, 1227, Easing.in(Easing.quad));
  const fy = lerp(f, 0, I, 1020, 729, Easing.in(Easing.quad));
  const flash = f >= I ? lerp(f, I, I + 8, 1, 0) : 0;
  const shakeSub = f >= I ? Math.sin(f * 2.3) * lerp(f, I, I + 30, 14, 0) : 0;
  return (
    <Shot cam={{s: [1.0, 1.06], shake: [{at: I, amp: 1.2, len: 30}]}} over={
      <>
        <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />
        {f >= I && <Stamp text="IMPACT" at={I + 2} x={960} y={200} color={C.red} rot={-4} size={90} />}
        <Depth v={610} color={f >= I ? C.red : C.white} />
        {f >= I && <div style={{position: 'absolute', right: 110, top: 90, fontFamily: MONO, fontSize: 28, color: C.red, opacity: Math.floor(f / 5) % 2 ? 1 : 0.2}}>▲ HULL ALARM</div>}
      </>
    }>
      <Deep k={0.6} />
      <Snow n={90} dim={0.15} beam={{ox: 900, oy: 600, len: 1200, half: 0.3}} />
      <Swordfish x={fx} y={fy} w={800} rot={15} />
      <div style={{position: 'absolute', left: 0, top: shakeSub, width: 1920, height: 1080}}>
        <Sub x={620} y={560} w={700} lights={1} />
      </div>
    </Shot>
  );
};

/* T6 — surface recovery */
const T6: React.FC = () => {
  const {f, dur} = useShot();
  const lift = lerp(f, 10, dur, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <Shot cam={{s: [1.1, 1.0], y: [80, 0]}} bg="#7fb7d3" over={<Label text="SURFACE · RECOVERY" at={10} color={C.amber} />}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #8cc4dd 0%, #cfe6ef 55%)'}} />
      <div style={{position: 'absolute', left: 0, top: 640, width: 1920, height: 440, background: 'linear-gradient(180deg, #2b6f8f, #0d3248)'}} />
      {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: ((rand(i) * 2000 + f * 1.5) % 2000) - 40, top: 660 + rand(i + 2) * 380, width: 60 + rand(i + 3) * 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.35)'}} />)}
      <Tender x={820} y={650} w={1100} lift={lift} />
      <Sub x={1180} y={lerp(f, 10, dur, 760, 470, Easing.inOut(Easing.cubic))} w={420} lights={0} stuck />
    </Shot>
  );
};

/* T7 — the swordfish stuck in the hull */
const T7: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.05, 1.18], x: [0, -60], y: [0, -40]}} bg="#8cc4dd" over={<Bracket x={1300} y={830} w={440} h={380} at={14} label="CONTACT: XIPHIAS GLADIUS" color={C.red} />}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #8cc4dd 0%, #d6eaf2 100%)'}} />
      <Swordfish x={1256} y={850} w={900} rot={75} phase={4} />
      <Sub x={900} y={300} w={1500} lights={0} />
    </Shot>
  );
};

/* T8 — kinetic statement */
const T8: React.FC = () => {
  const {f, at} = useShot();
  const r = at('o9');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b">
      <Headline text={<>A FISH <span style={{color: C.red}}>ATTACKED</span> A SUBMARINE.</>} at={2} size={110} y={330} />
      {f > r && <Headline text={<>THE SUBMARINE <span style={{color: C.amber}}>RETREATED.</span></>} at={r} size={110} y={520} />}
      {f > r && <div style={{position: 'absolute', left: 940, top: lerp(f, r, r + 60, 820, 700), fontFamily: HEAD, fontSize: 80, color: C.amber, opacity: appear(f, r + 6)}}>▲</div>}
    </Shot>
  );
};

/* T9 — title */
const T9: React.FC = () => {
  const {f, dur} = useShot();
  const s1 = lerp(f, 4, 11, 1.6, 1, Easing.out(Easing.cubic));
  return (
    <Shot cam={{s: [1.0, 1.08], shake: [{at: 4, amp: 0.7, len: 16}]}} bg="#050102">
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #1c2238 0%, #030408 70%)'}} />
      <div style={{opacity: 0.35}}><Swordfish x={lerp(f, 0, dur, 1400, 600, Easing.linear)} y={620} w={1500} dark={0.4} /></div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{fontFamily: MONO, fontSize: 30, color: C.amber, letterSpacing: 12, opacity: appear(f, 20)}}>ENCOUNTER FILE #002</div>
        <div style={{fontFamily: HEAD, fontSize: 230, color: C.white, letterSpacing: 14, lineHeight: 1, transform: `scale(${s1})`, opacity: appear(f, 4, 4), textShadow: '0 0 40px rgba(120,140,220,0.4)'}}>THE SWORD</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: f >= 4 ? lerp(f, 4, 10, 0.6, 0) : 0}} />
    </Shot>
  );
};

const SHOTS: [string, React.FC, number?][] = [['o1', T1], ['o2', T2], ['o3', T3], ['o4', T4], ['o5', T5], ['o6', T6], ['o7', T7], ['o8', T8], ['o10', T9]];

export const F2Test: React.FC = () => {
  const starts = SHOTS.map(([id], i) => (i === 0 ? 0 : LINES[id].s - 4));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map(([id, Comp], i) => {
        const from = starts[i], to = i + 1 < SHOTS.length ? starts[i + 1] : F2TEST_FRAMES;
        return (
          <Sequence key={id} from={from} durationInFrames={to - from} name={id}>
            <ShotCtx.Provider value={{t0: from, dur: to - from}}>
              <Comp />
            </ShotCtx.Provider>
          </Sequence>
        );
      })}
      <Grain />
      <Audio src={staticFile('audio/f2test_vo.wav')} />
      <Audio src={staticFile('audio/f2test_sfx.wav')} />
    </AbsoluteFill>
  );
};
