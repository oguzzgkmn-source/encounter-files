import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Bracket, Diver2, Snow, Squid2} from '../opening/kit';
import {Beak, Icon, Skin, SquidField, Sucker} from './art';
import {Dive} from './secAB';
import {C, Counter, HEAD, Headline, KineticLine, Label, MONO, Shot, Stamp, Water, appear, flash3, lerp, pop, rand, useShot} from './core';

/* ================= SECTION C ================= */
const SLOTS = [
  {k: 'SPEED', icon: '»'},
  {k: 'GRIP', icon: '◎'},
  {k: 'BLADE', icon: '◆'},
];
/** Equipment board; `active` slot highlighted from `hl` line. */
export const Equip: React.FC<{active: number; hl: string; intro?: boolean}> = ({active, hl, intro}) => {
  const {f, at} = useShot();
  const h = at(hl);
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={intro ? <Label text="THE EQUIPMENT" at={4} color={C.amber} /> : null}>
      {SLOTS.map((s, i) => {
        const on = i === active && f >= h;
        const done = i < active;
        const p = intro ? pop(f, 4 + i * 6) : 1;
        return (
          <div key={s.k} style={{position: 'absolute', left: 260 + i * 480, top: 330, width: 420, height: 420, border: `3px solid ${on ? C.red : done ? C.sonar : 'rgba(255,255,255,0.2)'}`, background: on ? 'rgba(255,59,59,0.12)' : 'rgba(0,0,0,0.4)', transform: `scale(${p * (on ? 1.06 : 1)})`, boxShadow: on ? `0 0 40px rgba(255,59,59,0.4)` : undefined}}>
            <div style={{position: 'absolute', left: 30, top: 24, fontFamily: MONO, fontSize: 30, color: C.grey}}>0{i + 1}</div>
            <div style={{position: 'absolute', width: '100%', top: 90, textAlign: 'center', fontSize: 150, color: on ? C.red : done ? C.sonar : C.grey, fontFamily: HEAD}}>{s.icon}</div>
            <div style={{position: 'absolute', width: '100%', bottom: 50, textAlign: 'center', fontFamily: HEAD, fontSize: 70, color: on || done ? C.white : C.grey}}>{s.k}</div>
          </div>
        );
      })}
    </Shot>
  );
};
export const C3: React.FC = () => {
  const {f, at, atWord} = useShot();
  const suck = at('c4'), blast = atWord('c4', 'blasts');
  const lunge = f > blast ? lerp(f, blast, blast + 20, 0, 260, Easing.out(Easing.cubic)) : 0;
  return (
    <Shot cam={{s: [1.0, 1.1]}} over={<><Label text="JET PROPULSION" at={4} />{f > blast && <Label text="SIPHON → THRUST" at={blast} y={880} color={C.amber} />}</>}>
      <Water />
      <Snow n={60} dim={0.15} />
      <div style={{position: 'absolute', left: lunge, top: 0, width: 1920, height: 1080}}>
        <Squid2 x={1000} y={520} w={1300} lit={0.85} phase={1} />
        {/* mantle cavity outline */}
        <div style={{position: 'absolute', left: 1000 - 650 + 1300 * (370 / 1020), top: 470, width: 1300 * (380 / 1020), height: 100, borderRadius: 60, border: `3px dashed ${C.sonar}`, opacity: appear(f, suck)}} />
        {/* water in */}
        {f > suck && f < blast + 10 && Array.from({length: 12}, (_, i) => {
          const t = ((f - suck) * 0.04 + i / 12) % 1;
          return <div key={i} style={{position: 'absolute', left: 1000 - 650 + 1300 * (330 / 1020) + 300 * (1 - t), top: 440 + (i % 2) * 140 + (t * (i % 2 ? -40 : 40)), width: 10, height: 10, borderRadius: 5, background: '#8fe3ff', opacity: 1 - t}} />;
        })}
      </div>
      {/* jet out (toward the arms side = left) */}
      {f > blast && Array.from({length: 16}, (_, i) => {
        const t = ((f - blast) * 0.05 + i / 16) % 1;
        return <div key={i} style={{position: 'absolute', left: lunge + 1000 - 650 + 1300 * (300 / 1020) - 700 * t, top: 540 + Math.sin(i) * 40 * t, width: 30 * (1 - t) + 8, height: 8, borderRadius: 4, background: '#bff0ff', opacity: (1 - t) * appear(f, blast)}} />;
      })}
    </Shot>
  );
};
export const C5: React.FC = () => {
  const {f, at} = useShot();
  const you = at('c6'), lose = at('c7');
  const bar = (v: number, max: number, a: number) => (v / max) * 1200 * lerp(f, a, a + 30, 0, 1, Easing.out(Easing.cubic));
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b" over={f > lose ? <Headline text="YOU ARE NOT WINNING THIS." at={lose} size={80} y={830} color={C.red} /> : null}>
      <div style={{position: 'absolute', left: 200, top: 240, fontFamily: MONO, fontSize: 30, color: C.grey, letterSpacing: 6}}>TOP SPEED (SHORT BURSTS)</div>
      <div style={{position: 'absolute', left: 200, top: 330, fontFamily: HEAD, fontSize: 56, color: C.red}}>HUMBOLDT</div>
      <div style={{position: 'absolute', left: 200, top: 410, height: 70, width: bar(24, 24, 4), background: C.red, boxShadow: `0 0 30px ${C.red}`}} />
      <div style={{position: 'absolute', left: 220 + bar(24, 24, 4), top: 412, fontFamily: HEAD, fontSize: 60, color: C.white}}>20+ km/h</div>
      {f > you && (
        <>
          <div style={{position: 'absolute', left: 200, top: 540, fontFamily: HEAD, fontSize: 56, color: C.sonar}}>YOU (WITH FINS)</div>
          <div style={{position: 'absolute', left: 200, top: 620, height: 70, width: bar(3.5, 24, you), background: C.sonar}} />
          <div style={{position: 'absolute', left: 220 + bar(3.5, 24, you), top: 622, fontFamily: HEAD, fontSize: 60, color: C.white}}>~3–4 km/h</div>
        </>
      )}
    </Shot>
  );
};
export const C9: React.FC = () => {
  const {f, atWord} = useShot();
  const t = atWord('c9', 'tentacles');
  return (
    <Shot cam={{s: [1.15, 1.0], x: [100, 0]}} over={<><Label text="8 ARMS" at={6} />{f > t && <Label text="+ 2 TENTACLES" at={t} y={880} color={C.amber} />}</>}>
      <Water />
      <Squid2 x={1100} y={540} w={1500} lit={0.85} phase={2} />
      <Bracket x={540} y={540} w={520} h={300} at={6} color={C.amber} />
    </Shot>
  );
};
export const C10: React.FC = () => {
  const {f, at} = useShot();
  const teeth = at('c11');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#060a0d" over={null}>
      <div style={{position: 'absolute', left: 260, top: 180, width: 560, textAlign: 'center', opacity: appear(f, 2)}}>
        <div style={{fontFamily: MONO, fontSize: 30, color: C.grey, letterSpacing: 6, marginBottom: 20}}>OCTOPUS</div>
      </div>
      <div style={{opacity: appear(f, 2)}}>
        <Sucker x={540} y={560} r={220} teeth={0} />
      </div>
      {f > 20 && <div style={{position: 'absolute', left: 330, top: 674, width: 484 * appear(f, 20), height: 12, background: C.grey, transform: 'rotate(-30deg)', transformOrigin: 'left center'}} />}
      <div style={{position: 'absolute', left: 1100, top: 180, width: 560, textAlign: 'center', fontFamily: MONO, fontSize: 30, color: C.red, letterSpacing: 6, opacity: appear(f, 8)}}>HUMBOLDT</div>
      <div style={{opacity: appear(f, 8)}}>
        <Sucker x={1380} y={560} r={220} teeth={f > teeth ? appear(f, teeth, 12) : 0} />
      </div>
      {f > teeth && <Headline text="RINGED WITH TEETH" at={teeth + 6} size={70} y={880} color={C.red} />}
    </Shot>
  );
};
export const C12: React.FC = () => {
  const {f, atWord} = useShot();
  const dig = atWord('c12', 'dig');
  const close = lerp(f, 6, dig, 0, 0.4) + (f > dig ? lerp(f, dig, dig + 6, 0, 0.6) : 0);
  return (
    <Shot cam={{s: [1.0, 1.25], shake: [{at: dig, amp: 0.8, len: 16}]}} bg="#3a1f1e">
      <Sucker x={960} y={540} r={430} close={close} />
      {f > dig && <Headline text="THEY DIG IN." at={dig} size={110} y={860} color={C.white} />}
    </Shot>
  );
};
export const C14: React.FC = () => {
  const {f, at} = useShot();
  const tear = at('c15');
  const open = f > tear ? (Math.sin((f - tear) / 3) + 1) / 2 : lerp(f, 10, 30, 0, 0.6);
  return (
    <Shot cam={{s: [0.9, 1.2], r: [0, 8]}} bg="#120507" over={<><Label text="BEAK: HARD, HOOKED" at={8} color={C.amber} />{f > tear && <Label text="FUNCTION: TEAR" at={tear} y={880} color={C.red} />}</>}>
      <Beak x={960} y={540} s={1.1} open={open} />
    </Shot>
  );
};
export const C16: React.FC = () => {
  const {f, atWord} = useShot();
  const items = [
    {w: 'speed', t: 'SPEED', c: C.sonar},
    {w: 'grip', t: 'GRIP', c: C.amber},
    {w: 'blade', t: 'BLADE', c: C.red},
  ];
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b">
      {items.map((it, i) => {
        const a = atWord('c16', it.w);
        return (
          <div key={it.t} style={{position: 'absolute', left: 200 + i * 520, top: 400, width: 480, textAlign: 'center', fontFamily: HEAD, fontSize: 150, color: it.c, opacity: appear(f, a), transform: `scale(${1.3 - 0.3 * appear(f, a)})`}}>
            {it.t}
          </div>
        );
      })}
    </Shot>
  );
};
export const C17: React.FC = () => {
  const {f} = useShot();
  const n = Math.min(300, Math.floor(Math.pow(1.13, f)));
  return (
    <Shot cam={{s: [1.4, 1.0]}} bg="#01060a" over={<div style={{position: 'absolute', right: 120, top: 80, fontFamily: HEAD, fontSize: 160, color: C.red}}>×{n}</div>}>
      {Array.from({length: n}, (_, i) => {
        const col = i % 25, row = Math.floor(i / 25);
        const x = 960 + (col - 12) * 72 + (row % 2 ? 36 : 0), y = 540 + (row - 6) * 80;
        return <Squid2 key={i} x={x} y={y} w={80} lit={0.8} phase={i} rot={(rand(i) - 0.5) * 20} />;
      })}
    </Shot>
  );
};
export const C18: React.FC = () => (
  <Dive cam={{s: [1.0, 1.12], x: [0, -50]}} diver={null} field={{n: 60, seed: 21, cx: 960, cy: 540, rx: 1000, ry: 560, inner: 0, lit: 0.35, face: 'right', w: [90, 200]}} label={{text: 'SAME PLACE. SAME TIME.', at: 6}} />
);
export const C19: React.FC = () => {
  const {f, at} = useShot();
  const R = 430;
  const prey = {x: R + 40, y: R - 20};
  const groups = [0, 1, 2, 3];
  const close = lerp(f, 6, at('c20') + 20, 1, 0.35);
  return (
    <Shot cam={{s: [1.0, 1.15]}} bg="#010806" over={<><Label text="SONAR: COORDINATED HUNT?" at={8} color={C.red} /><div style={{position: 'absolute', right: 120, top: 80, fontFamily: MONO, fontSize: 24, color: C.grey}}>BASED ON ACOUSTIC STUDIES</div></>}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 2 * R, height: 2 * R, borderRadius: R, border: `2px solid ${C.sonar}`, overflow: 'hidden', background: 'rgba(3,22,14,0.8)'}}>
          <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${(f * 6) % 360}deg, transparent 0deg, rgba(61,255,154,0.3) 45deg, transparent 45deg)`}} />
          {Array.from({length: 40}, (_, i) => {
            const a = rand(i) * Math.PI * 2, r = Math.sqrt(rand(i + 1)) * 60;
            return <div key={i} style={{position: 'absolute', left: prey.x + Math.cos(a + f / 30) * r - 3, top: prey.y + Math.sin(a + f / 30) * r - 3, width: 6, height: 6, borderRadius: 3, background: '#9fe8ff'}} />;
          })}
          {groups.map((g) =>
            Array.from({length: 22}, (_, i) => {
              const ga = (g / 4) * Math.PI * 2 + f / 90;
              const gx = prey.x + Math.cos(ga) * 330 * close, gy = prey.y + Math.sin(ga) * 330 * close;
              const a = rand(i + g * 50) * Math.PI * 2, r = Math.sqrt(rand(i + g * 50 + 1)) * 45;
              return <div key={`${g}-${i}`} style={{position: 'absolute', left: gx + Math.cos(a) * r - 4, top: gy + Math.sin(a) * r - 4, width: 8, height: 8, borderRadius: 4, background: C.red, boxShadow: `0 0 8px ${C.red}`}} />;
            }),
          )}
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* ================= SECTION D ================= */
export const D1: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.1, 1.0]}} bg="#060001">
      <div style={{opacity: 0.3}}><Squid2 x={960} y={540} w={1700} red={flash3(f, 0, 3)} lit={0.15} /></div>
      <Headline text={<>WHY DO THEY TURN <span style={{color: C.red}}>RED?</span></>} at={2} size={130} y={440} />
    </Shot>
  );
};
const CamBox: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const {f} = useShot();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 120 * s, height: 60 * s, background: '#1d2328', border: '3px solid #55636b', borderRadius: 8 * s}}>
      <div style={{position: 'absolute', left: -18 * s, top: 14 * s, width: 30 * s, height: 30 * s, borderRadius: '50%', background: '#0a0f12', border: '3px solid #8aa'}} />
      <div style={{position: 'absolute', right: 10 * s, top: 10 * s, width: 12 * s, height: 12 * s, borderRadius: '50%', background: C.red, opacity: Math.floor(f / 10) % 2 ? 1 : 0.2}} />
    </div>
  );
};
export const D2: React.FC = () => {
  const {f, at, atWord} = useShot();
  const strap = at('d3'), rel = atWord('d3', 'released');
  const cy = lerp(f, strap, strap + 15, -200, 440, Easing.out(Easing.cubic));
  const swim = f > rel ? lerp(f, rel, rel + 60, 0, 1400, Easing.in(Easing.cubic)) : 0;
  return (
    <Shot cam={{s: [1.0, 1.08]}} over={<><Label text="EXPERIMENT: ANIMAL-BORNE VIDEO" at={strap} color={C.amber} />{f > rel && <Label text="RELEASED" at={rel} y={880} />}</>}>
      <Water />
      <Snow n={60} dim={0.15} />
      <div style={{position: 'absolute', left: swim, top: 0, width: 1920, height: 1080}}>
        <Squid2 x={900} y={540} w={1200} lit={0.85} phase={1} flip />
        {f > strap && <CamBox x={860} y={cy} s={1.3} />}
      </div>
      <Headline text={<>SLIGHTLY <span style={{color: C.amber}}>UNHINGED.</span></>} at={atWord('d2', 'slightly')} size={80} y={150} />
    </Shot>
  );
};
export const D4: React.FC = () => {
  const {f, at} = useShot();
  const tc = (fr: number) => `00:${String(Math.floor(fr / 30 / 60)).padStart(2, '0')}:${String(Math.floor(fr / 30) % 60).padStart(2, '0')}`;
  return (
    <Shot cam={{s: [1.02, 1.12], r: [-2, 2]}} bg="#000" vignette={0} over={
      <>
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 300px 120px #000', borderRadius: '42%'}} />
        <div style={{position: 'absolute', left: 120, top: 90, fontFamily: MONO, fontSize: 32, color: C.white}}><span style={{color: C.red, opacity: Math.floor(f / 12) % 2 ? 1 : 0.3}}>● REC</span>  SQUID-CAM 01</div>
        <div style={{position: 'absolute', right: 120, top: 90, fontFamily: MONO, fontSize: 32, color: C.white}}>{tc(f + 1800)}</div>
        <div style={{position: 'absolute', left: 120, bottom: 90, fontFamily: MONO, fontSize: 24, color: C.grey}}>DEPTH 214 m · IR LIGHT</div>
      </>
    }>
      <Water top="#0b1a14" bottom="#020604" />
      <Snow n={140} dim={0.4} />
      <div style={{filter: 'sepia(0.4) hue-rotate(60deg) saturate(0.7)'}}>
        <SquidField n={7} seed={40} cx={960} cy={520} rx={700} ry={300} inner={0.35} lit={0.5} face="right" w={[200, 420]} red={f > at('d5') ? 'flash' : 0} />
      </div>
    </Shot>
  );
};
export const D6: React.FC = () => {
  const {f, atWord} = useShot();
  const red = atWord('d6', 'red');
  return (
    <Shot cam={{s: [1.0, 1.2]}} vignette={0.6} over={<><Label text="COLOUR CELLS (CHROMATOPHORES)" at={10} color={C.amber} />{f > red && <Headline text={<>ONLY ONE COLOUR: <span style={{color: C.red}}>RED</span></>} at={red} size={90} y={820} />}</>}>
      <Skin expand={0.08 + 0.04 * Math.sin(f / 10)} />
    </Shot>
  );
};
export const D7: React.FC = () => {
  const {f, at} = useShot();
  const shut = at('d8'), flash = at('d9');
  let e = lerp(f, 4, 16, 0.08, 1);
  if (f > shut) e = lerp(f, shut, shut + 10, 1, 0.05);
  if (f > flash + 8) e = flash3(f, 0, 3);
  const label = f > flash ? '≈ 3 FLASHES PER SECOND' : f > shut ? 'CONTRACTED → PALE WHITE' : 'EXPANDED → DEEP RED';
  return (
    <Shot cam={{s: [1.2, 1.0]}} vignette={0.6} over={<div style={{position: 'absolute', left: 0, width: 1920, top: 860, textAlign: 'center'}}><span style={{fontFamily: MONO, fontSize: 44, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '14px 30px', letterSpacing: 4}}>{label}</span></div>}>
      <Skin expand={e} />
    </Shot>
  );
};
export const D10: React.FC = () => {
  const {f, at} = useShot();
  const inView = at('d11', 0.3);
  const vis = f > inView;
  const fl = vis ? flash3(f, 0, 3) : 0;
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#000" vignette={0} over={
      <>
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 300px 120px #000', borderRadius: '42%'}} />
        <div style={{position: 'absolute', left: 120, top: 90, fontFamily: MONO, fontSize: 32, color: C.white}}><span style={{color: C.red}}>● REC</span>  SQUID-CAM 01</div>
        <div style={{position: 'absolute', right: 120, top: 90, fontFamily: MONO, fontSize: 30, textAlign: 'right'}}>
          <div style={{color: C.grey}}>OTHER SQUID IN VIEW: <span style={{color: vis ? C.sonar : C.grey}}>{vis ? 'YES' : 'NO'}</span></div>
          <div style={{color: C.grey}}>OWN SKIN: <span style={{color: fl > 0.5 ? C.red : C.white}}>{vis ? (fl > 0.5 ? 'RED' : 'WHITE') : 'STEADY'}</span></div>
        </div>
        <div style={{position: 'absolute', left: 0, bottom: 0, width: 1920, height: 120, background: `linear-gradient(0deg, rgba(232,35,44,${0.8 * fl}), transparent)`}} />
      </>
    }>
      <Water top="#0b1a14" bottom="#020604" />
      <Snow n={140} dim={0.4} />
      {vis && <Squid2 x={lerp(f, inView, inView + 40, 2200, 1150, Easing.out(Easing.cubic))} y={500} w={520} lit={0.55} red={flash3(f, 1.5, 3)} flip />}
    </Shot>
  );
};
export const D12: React.FC = () => {
  const {f, at} = useShot();
  const mod = at('d13');
  const hz = f > mod ? 1.5 + 2.5 * (0.5 + 0.5 * Math.sin((f - mod) / 25)) : 3;
  const amp = f > mod ? 0.4 + 0.6 * (0.5 + 0.5 * Math.cos((f - mod) / 18)) : 1;
  const a = flash3(f, 0, hz) * amp, b = flash3(f, Math.PI, hz) * amp;
  return (
    <Shot cam={{s: [1.05, 1.0]}} over={<><Label text="SIGNAL?" at={6} color={C.red} />{f > mod && (
      <div style={{position: 'absolute', right: 120, top: 120, fontFamily: MONO, fontSize: 28, color: C.white, width: 420}}>
        <div>SPEED</div><div style={{height: 16, background: 'rgba(255,255,255,0.15)', margin: '8px 0 24px'}}><div style={{height: '100%', width: `${(hz / 4) * 100}%`, background: C.red}} /></div>
        <div>STRENGTH</div><div style={{height: 16, background: 'rgba(255,255,255,0.15)', marginTop: 8}}><div style={{height: '100%', width: `${amp * 100}%`, background: C.amber}} /></div>
      </div>
    )}</>}>
      <Water />
      <Squid2 x={560} y={560} w={700} lit={0.5} red={a} flip phase={0} />
      <Squid2 x={1380} y={560} w={700} lit={0.5} red={b} phase={9} />
      {[0, 1, 2].map((k) => {
        const t = ((f + k * 10) % 30) / 30;
        return <div key={k} style={{position: 'absolute', left: 960 - 20 + (t - 0.5) * 300, top: 560 - 60, width: 40, height: 120, borderRadius: '50%', border: `4px solid rgba(255,59,59,${0.8 * (1 - Math.abs(t - 0.5) * 2)})`}} />;
      })}
    </Shot>
  );
};
export const D14: React.FC = () => (
  <Dive cam={{s: [1.15, 1.0]}} diver={{x: 860, y: 560, s: 0.62, beam: 900}} field={{n: 30, seed: 33, cx: 920, cy: 560, rx: 950, ry: 520, inner: 0.35, lit: 0.2, red: 'flash'}} label={{text: 'NOT A WARNING', at: 10, color: C.red}} />
);
export const D15: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#060001">
      <div style={{opacity: 0.5}}>
        <SquidField n={14} seed={50} rx={900} ry={450} inner={0.55} lit={0.2} red="flash" w={[200, 300]} />
      </div>
      <Headline text={<>A <span style={{color: C.red}}>CONVERSATION.</span></>} at={2} size={150} y={420} />
    </Shot>
  );
};
export const D16: React.FC = () => {
  const {f, at} = useShot();
  const worse = at('d17');
  return (
    <Dive cam={{s: [1.0, 1.2]}} diver={{x: 900, y: 600, s: 0.8, beam: 800}} field={{n: 26, seed: 60, cx: 960, cy: 560, rx: 950, ry: 520, inner: 0.45, lit: 0.18, red: 'flash'}} over={
      <>
        {['?', '?', '?'].map((q, i) => <div key={i} style={{position: 'absolute', left: 860 + i * 70, top: 380 - i * 30, fontFamily: HEAD, fontSize: 90 + i * 20, color: C.white, opacity: appear(f, 8 + i * 6)}}>{q}</div>)}
        {f > worse && <Headline text="WHICH IS SOMEHOW WORSE." at={worse} size={70} y={860} />}
      </>
    } />
  );
};
