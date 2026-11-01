import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Diver2, Snow, Squid2} from '../opening/kit';
import {Boat, Plate, SquidField} from './art';
import {Dive} from './secAB';
import {C, Counter, HEAD, Headline, KineticLine, Label, MONO, MapBase, MapPin, MapTrail, Shot, Stamp, Water, appear, flash3, lerp, pop, project, rand, useShot} from './core';

/* ================= SECTION G ================= */
const Line: React.FC<{x: number; y1: number}> = ({x, y1}) => <div style={{position: 'absolute', left: x, top: -50, width: 3, height: y1 + 50, background: 'rgba(220,230,235,0.6)'}} />;
export const G1: React.FC = () => {
  const {f, at} = useShot();
  const y = lerp(f, 0, 60, -100, 420, Easing.out(Easing.cubic));
  return (
    <Shot cam={{s: [1.0, 1.1]}} over={<Headline text={<span style={{color: C.red}}>CANNIBALS.</span>} at={at('g2')} size={170} y={720} />}>
      <Water top="#040c12" bottom="#000" />
      <Snow n={60} dim={0.15} />
      <Line x={960} y1={y} />
      <Squid2 x={960} y={y + 180} w={420} lit={0.6} red={flash3(f, 0, 4)} rot={-90} phase={Math.sin(f / 2) * 5} />
    </Shot>
  );
};
export const G3: React.FC = () => {
  const {f, at, dur} = useShot();
  const menu = at('g4');
  const p = lerp(f, 15, dur - 10, 0, 1, Easing.in(Easing.quad));
  return (
    <Shot cam={{s: [1.0, 1.2], shake: [{at: menu, amp: 0.5, len: 20}]}} over={f > menu ? <Label text="ALSO ON THE MENU: EACH OTHER" at={menu} color={C.red} /> : null}>
      <Water top="#040c12" bottom="#000" />
      <Line x={960} y1={380} />
      <Squid2 x={960} y={520} w={320} lit={0.6} red={flash3(f, 0, 4)} rot={-90} phase={f} />
      {Array.from({length: 14}, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 900 - 640 * p;
        return <Squid2 key={i} x={960 + Math.cos(a) * r} y={540 + Math.sin(a) * r * 0.6} w={240} lit={0.25} red={p > 0.3 ? 0.9 : 0.2} rot={(a * 180) / Math.PI} phase={i * 5} />;
      })}
    </Shot>
  );
};
export const G5: React.FC = () => {
  const {f, at, atWord} = useShot();
  const yr = at('g6'), lucky = atWord('g6', 'two'), all = at('g7');
  const p = lerp(f, yr, atWord('g6', 'year') + 10, 0, 1);
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<Label text="LIFESPAN" at={4} color={C.amber} />}>
      <Headline text="LIVE FAST." at={2} size={110} y={130} />
      <div style={{position: 'absolute', left: 200, top: 560, width: 1000, height: 30, border: `2px solid ${C.grey}`}}>
        <div style={{width: `${p * 100}%`, height: '100%', background: C.red}} />
      </div>
      {f > lucky && <div style={{position: 'absolute', left: 1204, top: 560, width: 500 * appear(f, lucky, 20), height: 30, border: `2px dashed ${C.amber}`, borderLeft: 'none'}} />}
      {['0', '6 MO', '1 YR'].map((t, i) => <div key={t} style={{position: 'absolute', left: 200 + i * 500 - 30, top: 610, fontFamily: MONO, fontSize: 28, color: C.grey}}>{t}</div>)}
      {f > lucky && <div style={{position: 'absolute', left: 1640, top: 610, fontFamily: MONO, fontSize: 28, color: C.amber, opacity: appear(f, lucky)}}>2 YR (LUCKY)</div>}
      <Squid2 x={200 + p * 1000} y={470} w={60 + p * 260} lit={0.85} phase={1} />
      {f > all && ['SPEED', 'HUNTING', 'FLASHING'].map((t, i) => <div key={t} style={{position: 'absolute', left: 300 + i * 480, top: 760, fontFamily: HEAD, fontSize: 70, color: [C.sonar, C.amber, C.red][i], opacity: appear(f, atWord('g7', t.toLowerCase()))}}>{t}</div>)}
    </Shot>
  );
};
const NORTH: [number, number][] = [[-113.5, 28], [-118, 31.5], [-121.5, 35], [-124.5, 40], [-125.5, 45], [-126, 48.5], [-130, 52.5], [-135, 56.5]];
export const G8: React.FC = () => {
  const {at, atWord} = useShot();
  const go = at('g9');
  return (
    <Shot cam={{s: [1.8, 2.2], x: [0, 242], y: [148, 561]}} bg="#020b12" vignette={0.6} over={<Label text="EXPANDING NORTH" at={atWord('g8', 'expanding')} color={C.amber} />}>
      <MapBase view="pacific" />
      <MapTrail view="pacific" pts={[[-107, 21], [-111, 24], [-113.5, 28]]} from={-1} to={0} />
      <MapTrail view="pacific" pts={NORTH} from={go} to={atWord('g9', 'alaska') + 15} color={C.red} width={14} />
      <MapPin view="pacific" lon={-110} lat={24} at={2} label="MEXICO" />
      <MapPin view="pacific" lon={-135.3} lat={57} at={atWord('g9', 'alaska')} label="ALASKA" sub="SIGHTINGS ~2004" color={C.amber} side="left" />
    </Shot>
  );
};
export const G10: React.FC = () => {
  const {f, at, dur} = useShot();
  const win = at('g11');
  const grow = lerp(f, 0, win, 0.4, 1);
  const blobs = [[-120, 25, 1.2], [-110, 12, 1.4], [-95, 5, 1.0], [-85, -8, 1.3], [-78, -18, 0.9], [-125, 35, 0.8]];
  return (
    <Shot cam={{s: [1.3, 1.45], x: [-52, -58], y: [-26, -29]}} bg="#020b12" vignette={0.6} over={<><Label text="LOW-OXYGEN WATER (SCHEMATIC)" at={4} color="#d9a6e8" />{f > win && <Headline text={<>THIS ANIMAL SEEMS TO BE <span style={{color: C.red}}>WINNING.</span></>} at={win} size={74} y={860} />}</>}>
      <MapBase view="pacific" />
      {blobs.map(([lo, la, s], i) => {
        const p = project('pacific', lo, la);
        const r = 110 * s * grow * (1 + 0.05 * Math.sin(f / 20 + i));
        return <div key={i} style={{position: 'absolute', left: p.x - r - 60, top: p.y - r, width: r * 2, height: r * 1.6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,60,170,0.55), rgba(150,60,170,0) 70%)'}} />;
      })}
    </Shot>
  );
};
export const G12: React.FC = () => {
  const {f} = useShot();
  const g = Math.floor(f / 3) % 5 === 0 ? 10 : 0;
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#030303">
      <div style={{position: 'absolute', left: 0, width: 1920, top: 420, textAlign: 'center', fontFamily: HEAD, fontSize: 170, color: C.white, textShadow: `${g}px 0 ${C.red}, ${-g}px 0 #3df`, opacity: appear(f, 2)}}>BUT HERE'S THE TWIST.</div>
    </Shot>
  );
};
export const G13: React.FC = () => {
  const {f, atWord} = useShot();
  const b = atWord('g13', 'overwhelmingly');
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b">
      <div style={{position: 'absolute', left: 260, top: 300, fontFamily: HEAD, fontSize: 60, color: C.red}}>SQUID VS. PEOPLE</div>
      <div style={{position: 'absolute', left: 260, top: 380, height: 70, width: 30 * appear(f, 10), background: C.red}} />
      <div style={{position: 'absolute', left: 310, top: 384, fontFamily: MONO, fontSize: 40, color: C.white, opacity: appear(f, 14)}}>NO CONFIRMED DEATHS</div>
      <div style={{position: 'absolute', left: 260, top: 560, fontFamily: HEAD, fontSize: 60, color: C.sonar, opacity: appear(f, b)}}>PEOPLE VS. SQUID</div>
      <div style={{position: 'absolute', left: 260, top: 640, height: 70, width: 1400 * lerp(f, b, b + 30, 0, 1, Easing.out(Easing.cubic)), background: C.sonar}} />
    </Shot>
  );
};
export const G14: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.15, 1.0]}} bg="#000" over={<Label text="ONE OF THE BIGGEST SQUID FISHERIES" at={8} color={C.amber} />}>
      <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 560, background: 'linear-gradient(180deg, #02050b, #0a1424)'}} />
      <div style={{position: 'absolute', left: -100, top: 460, width: 2120, height: 800, background: 'linear-gradient(180deg, #071820, #010407 70%)'}} />
      {Array.from({length: 22}, (_, i) => {
        const x = 60 + (i % 11) * 180 + (i > 10 ? 90 : 0), y = i > 10 ? 470 : 440;
        const w = i > 10 ? 220 : 160;
        return <Boat key={i} x={x} y={y} w={w} lamp={0.8 + 0.2 * rand(i)} />;
      })}
    </Shot>
  );
};
export const G15: React.FC = () => (
  <Shot cam={{s: [1.0, 1.08]}} bg="#02070b" over={<Label text="SOURCE: IMARPE (PERU)" at={20} color={C.grey} />}>
    <Counter to={556000} at={4} len={50} suffix=" t" label="PERU · 2014 · HUMBOLDT SQUID LANDED" sub="MORE THAN HALF A MILLION TONNES" color={C.white} />
  </Shot>
);
export const G16: React.FC = () => {
  const {f, atWord} = useShot();
  const n = atWord('g16', 'ten');
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
      <div style={{position: 'absolute', left: 0, width: 1920, top: 120, textAlign: 'center', fontFamily: MONO, fontSize: 32, color: C.grey, letterSpacing: 4}}>EVEN IF EVERY SQUID WEIGHED 50 KG…</div>
      {Array.from({length: 600}, (_, i) => {
        const x = 160 + (i % 40) * 40, y = 560 + Math.floor(i / 40) * 26;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 24, height: 8, borderRadius: 4, background: C.red, opacity: f > n + i * 0.05 ? 0.8 : 0.08}} />;
      })}
      {f > n && <Counter to={10000000} at={n} len={45} suffix="+" size={190} y={250} color={C.red} sub="ANIMALS · ONE YEAR · ONE COUNTRY" />}
    </Shot>
  );
};
export const G17: React.FC = () => (
  <Shot cam={{s: [0.9, 1.15], r: [0, 10]}} bg="#2a2420" vignette={0.7} over={<Label text="SQUID STEAK · CALAMARI" at={10} color={C.amber} />}>
    <Plate x={960} y={540} s={1.25} />
  </Shot>
);
export const G18: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#000">
      <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: '#120203'}}>
        <Squid2 x={480} y={600} w={700} red={0.9} lit={0.2} />
      </div>
      <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: '#02060c', overflow: 'hidden'}}>
        <Boat x={480} y={600} w={600} lamp={1.3} />
      </div>
      <div style={{position: 'absolute', left: 956, top: 0, width: 8, height: 1080, background: C.white}} />
      <Headline text={<>WHO'S REALLY THE <span style={{color: C.red}}>DEVIL?</span></>} at={10} size={110} y={130} />
    </Shot>
  );
};

/* ================= SECTION H ================= */
export const H1: React.FC = () => {
  const {at} = useShot();
  return (
    <Dive cam={{s: [1.15, 1.0]}} diver={{x: 860, y: 560, s: 0.62, beam: 900}} field={{n: 30, seed: 33, cx: 920, cy: 560, rx: 950, ry: 520, inner: 0.35, lit: 0.18, red: 'flash', fadeAt: at('h2'), fadeLen: 50}} />
  );
};
export const H3: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.3], y: [0, -200]}} bg="#000" over={<Label text="≈ 300 m BELOW YOU" at={8} />}>
      <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 1400, background: 'linear-gradient(180deg, #06192a 0%, #000 45%)'}} />
      <Diver2 x={920} y={120} s={0.35} beamLen={300} />
      {Array.from({length: 220}, (_, i) => {
        const x = 200 + rand(i) * 1520, y = 700 + rand(i + 1) * 380;
        const fl = flash3(f, rand(i + 2) * 6, 2.5 + rand(i + 3));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, background: fl > 0.5 ? C.red : '#f1e9e4', opacity: 0.25 + 0.6 * fl, boxShadow: fl > 0.5 ? `0 0 10px ${C.red}` : undefined}} />;
      })}
    </Shot>
  );
};
export const H4: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.05, 1.0]}} over={<Label text="TRANSLATION: UNKNOWN" at={8} color={C.grey} />}>
      <Water />
      <Squid2 x={600} y={560} w={600} lit={0.4} red={flash3(f, 0, 2.5)} flip />
      <Squid2 x={1320} y={560} w={600} lit={0.4} red={flash3(f, Math.PI, 2.5)} phase={4} />
      <div style={{position: 'absolute', left: 0, width: 1920, top: 280, textAlign: 'center', fontFamily: HEAD, fontSize: 140, color: C.white, opacity: appear(f, 10)}}>?</div>
    </Shot>
  );
};
export const H5: React.FC = () => {
  const {f, at} = useShot();
  const r = 0.5 + 0.5 * Math.sin(f / 12);
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={f > at('h6') ? <KineticLine line="h6" text="IT PROBABLY ISN'T ABOUT YOU." y={820} size={90} /> : null}>
      <Water />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, transparent 25%, rgba(200,20,25,${0.25 * r}) 60%, transparent 85%)`}} />
      <Snow n={80} dim={0.15} beam={{ox: 900 + 205 * 0.7, oy: 520 + 14 * 0.7, len: 900, half: 0.24}} />
      <Diver2 x={900} y={520} s={0.7} beamLen={900} />
    </Shot>
  );
};
export const H7: React.FC = () => {
  const {f, dur} = useShot();
  const fl = f > dur - 14 && f < dur - 8 ? 1 : 0;
  return (
    <Shot bg="#000" vignette={0}>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 480, textAlign: 'center', fontFamily: MONO, fontSize: 60, color: C.white, letterSpacing: 10, opacity: appear(f, 2)}}>PROBABLY.</div>
      <AbsoluteFill style={{background: `radial-gradient(circle at 70% 70%, rgba(232,35,44,${fl}) 0%, transparent 20%)`}} />
    </Shot>
  );
};
export const H8: React.FC = () => (
  <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
    <div style={{position: 'absolute', left: 560, top: 300, width: 800, height: 480, background: '#0a1a24', border: `2px solid ${C.amber}88`}}>
      <div style={{position: 'absolute', left: 60, top: 60, fontFamily: MONO, fontSize: 28, color: C.amber, letterSpacing: 6}}>ENCOUNTER FILE #001</div>
      <div style={{position: 'absolute', left: 60, top: 110, fontFamily: HEAD, fontSize: 110, color: C.white}}>THE RED DEVIL</div>
      <div style={{position: 'absolute', left: 60, top: 260, fontFamily: MONO, fontSize: 28, color: C.grey}}>Dosidicus gigas · Humboldt squid</div>
    </div>
    <Stamp text="FILE CLOSED" at={14} x={960} y={720} color={C.red} rot={-6} size={70} />
  </Shot>
);
export const H9: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.04]}} bg="#02070b" vignette={0.5}>
      <div style={{position: 'absolute', left: 140, top: 200, fontFamily: MONO, fontSize: 36, color: C.amber, letterSpacing: 10, opacity: appear(f, 2)}}>NEXT ENCOUNTER FILE</div>
      <div style={{position: 'absolute', left: 140, top: 260, fontFamily: HEAD, fontSize: 240, color: C.white, lineHeight: 1, opacity: appear(f, 6)}}>#002: <span style={{color: C.red}}>?</span></div>
      <div style={{position: 'absolute', left: 140, top: 560, fontFamily: MONO, fontSize: 46, color: C.white, opacity: appear(f, 20), width: 760, lineHeight: 1.4}}>Which animal should we open next?<br /><span style={{color: C.sonar}}>Tell me in the comments ↓</span></div>
      <div style={{position: 'absolute', left: 140, top: 800, opacity: 0.5}}><Squid2 x={300} y={60} w={420} lit={0.3} red={flash3(f, 0, 1)} /></div>
      {/* end-screen safe areas (YouTube elements go here) */}
    </Shot>
  );
};
