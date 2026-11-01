import React from 'react';
import {AbsoluteFill, Easing, interpolateColors} from 'remotion';
import {Bracket, Diver2, Snow, Squid2} from '../opening/kit';
import {Dog, FieldOpts, Human, Shark, SquidField} from './art';
import {C, Cam, Counter, HEAD, Headline, KineticLine, Label, MONO, MapBase, MapPin, MapTrail, Shot, Stamp, Water, appear, flash3, lerp, pop, project, rand, useShot} from './core';

/* ---------- shared dive shot ---------- */
export const Dive: React.FC<{cam?: Cam; diver?: {x: number; y: number; s: number; beam?: number; beamOn?: number; tilt?: number} | null; field?: FieldOpts; label?: {text: string; at: number; color?: string}; tint?: string; children?: React.ReactNode; over?: React.ReactNode; snow?: number}> = ({cam, diver = {x: 760, y: 560, s: 0.7, beam: 1000}, field, label, tint, children, over, snow = 90}) => {
  const beam = diver && diver.beam ? {ox: diver.x + 205 * diver.s, oy: diver.y + 14 * diver.s, len: diver.beam, half: 0.24} : undefined;
  return (
    <Shot cam={cam} over={<>{over}{label && <Label {...label} />}</>}>
      <Water top={tint ?? '#03101a'} bottom="#000305" />
      <Snow n={snow} dim={0.12} beam={beam} />
      {field && <SquidField {...field} />}
      {children}
      {diver && <Diver2 x={diver.x} y={diver.y} s={diver.s} beamLen={diver.beam ?? 0} beamOn={diver.beamOn ?? 1} tilt={diver.tilt ?? 0} />}
    </Shot>
  );
};

/* ================= SECTION A ================= */
export const A1: React.FC = () => {
  const {f, at, dur} = useShot();
  return (
    <Shot cam={{s: [1.05, 1.2], x: [60, -60]}} over={<><Label text="WHAT PEOPLE FEAR: SHARKS" at={6} color={C.amber} /><Headline text={<>ONE PREDATOR. <span style={{color: C.red}}>ONE SET OF TEETH.</span></>} at={at('a2')} size={84} y={820} /></>}>
      <Water top="#0b3550" bottom="#03121d" rays={1} />
      <Snow n={60} dim={0.3} />
      <Shark x={lerp(f, 0, dur, 1500, 600, Easing.linear)} y={560} w={900} />
    </Shot>
  );
};
export const A3: React.FC = () => {
  const {f} = useShot();
  const p = lerp(f, 6, 12, 0, 1);
  return (
    <Shot cam={{s: [1.2, 1.28]}} bg="#02080c" over={<Headline text="THIS IS DIFFERENT." at={4} size={130} y={440} />}>
      <div style={{filter: 'grayscale(1) brightness(0.4)'}}>
        <Water top="#0b3550" bottom="#03121d" />
        <Shark x={900} y={560} w={900} />
      </div>
      <div style={{position: 'absolute', left: 300, top: 560, width: 1320 * p, height: 14, background: C.red, transform: 'rotate(-12deg)', transformOrigin: 'left', boxShadow: `0 0 30px ${C.red}`}} />
    </Shot>
  );
};
const PX = 220; // px per metre in comparison shots
export const A4: React.FC = () => {
  const {f, atWord} = useShot();
  const hum = atWord('a4', 'length');
  const sqW = 1.5 * PX * (1020 / 580);
  return (
    <Shot cam={{s: [1.0, 1.08]}} over={<Label text="SIZE CHECK" at={4} />}>
      <Water top="#06192a" bottom="#01050a" />
      <div style={{position: 'absolute', left: 0, top: 860, width: 1920, height: 2, background: 'rgba(255,255,255,0.15)'}} />
      <div style={{position: 'absolute', left: 340, top: 0, opacity: appear(f, 0)}}>
        <div style={{position: 'absolute', left: 0, top: 560, transform: 'rotate(-90deg)', transformOrigin: '0 0'}}>
          <Squid2 x={-300} y={160} w={sqW} lit={0.9} phase={4} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 520, width: 6, height: 1.5 * PX, background: C.amber, opacity: appear(f, 10)}} />
      <div style={{position: 'absolute', left: 845, top: 600, fontFamily: MONO, color: C.amber, fontSize: 30, opacity: appear(f, 10)}}>BODY<br /><b style={{fontSize: 44}}>≈1.5 m</b></div>
      {f > hum && (
        <div style={{opacity: appear(f, hum)}}>
          <Human x={1300} y={860} h={1.75 * PX} />
          <div style={{position: 'absolute', left: 1440, top: 860 - 1.75 * PX, width: 6, height: 1.75 * PX, background: C.grey}} />
          <div style={{position: 'absolute', left: 1465, top: 560, fontFamily: MONO, color: C.white, fontSize: 30}}>ADULT<br /><b style={{fontSize: 44}}>≈1.75 m</b></div>
        </div>
      )}
      <Headline text="NOT A GIANT." at={6} size={80} y={120} />
    </Shot>
  );
};
export const A5: React.FC = () => {
  const {f, dur} = useShot();
  const reveal = lerp(f, 10, dur, 0, 1);
  return (
    <Dive cam={{s: [2.2, 1.0], x: [-700, 0]}} diver={{x: 520, y: 560, s: 0.6, beam: 1100}} field={{n: 34, seed: 5, cx: 1200, rx: 720, ry: 480, inner: 0.25, lit: 0.12 + 0.1 * reveal, face: 'random'}} label={{text: 'ALONE? RARELY.', at: 20}}>
      <Squid2 x={1080} y={540} w={300} lit={0.85} phase={2} />
    </Dive>
  );
};
export const A6: React.FC = () => {
  const {f} = useShot();
  const R = 420;
  const groups = [
    [0.6, -0.4],
    [-0.5, -0.2],
    [0.1, 0.55],
  ];
  return (
    <Shot cam={{s: [1.0, 1.15], r: [0, -8]}} bg="#010806" over={<Label text="GROUP SIZE: HUNDREDS" at={10} color={C.red} />}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 2 * R, height: 2 * R, borderRadius: R, border: `2px solid ${C.sonar}`, overflow: 'hidden', background: 'rgba(3,22,14,0.8)'}}>
          {[0.33, 0.66].map((k) => <div key={k} style={{position: 'absolute', left: R - R * k, top: R - R * k, width: 2 * R * k, height: 2 * R * k, borderRadius: '50%', border: `1px solid ${C.sonarDim}`}} />)}
          <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${(f * 6) % 360}deg, transparent 0deg, rgba(61,255,154,0.35) 45deg, transparent 45deg)`}} />
          {groups.map(([gx, gy], g) =>
            Array.from({length: 60}, (_, i) => {
              const a = rand(i + g * 100) * Math.PI * 2, r = Math.sqrt(rand(i + g * 100 + 1)) * 80;
              const x = R + gx * R + Math.cos(a) * r + Math.sin(f / 20 + g) * 30, y = R + gy * R + Math.sin(a) * r + Math.cos(f / 25 + g) * 20;
              return i < f * 2 ? <div key={`${g}-${i}`} style={{position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8, borderRadius: 4, background: C.red, boxShadow: `0 0 8px ${C.red}`}} /> : null;
            }),
          )}
          <div style={{position: 'absolute', left: R - 10, top: R - 10, width: 20, height: 20, background: C.sonar, transform: 'rotate(45deg)'}} />
        </div>
      </AbsoluteFill>
    </Shot>
  );
};
export const A7: React.FC = () => {
  const {f, atWord} = useShot();
  const on = atWord('a7', 'flashing');
  const fl = f > on ? flash3(f, 0, 3) : 0;
  return (
    <Shot cam={{s: [1.1, 1.25]}} bg="#000305" over={<Label text="SIGNAL: FLASHING" at={on} color={C.red} />}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 55% 50%, rgba(255,40,40,${0.35 * fl}) 0%, transparent 55%)`}} />
      {f > on && [0, 1, 2].map((k) => {
        const t = ((f - on + k * 10) % 30) / 30;
        return <div key={k} style={{position: 'absolute', left: 1050 - 500 * t, top: 540 - 500 * t, width: 1000 * t, height: 1000 * t, borderRadius: '50%', border: `4px solid rgba(255,59,59,${0.6 * (1 - t)})`}} />;
      })}
      <Squid2 x={1050} y={540} w={1100} lit={0.5} red={fl} phase={10} />
    </Shot>
  );
};
export const A8: React.FC = () => {
  const {f} = useShot();
  const g = Math.floor(f / 3) % 7 === 0 ? 8 : 0;
  return (
    <Shot cam={{s: [1.0, 1.12]}} bg="#050001" over={null}>
      <div style={{opacity: 0.35}}><Squid2 x={960} y={560} w={1600} red={flash3(f, 0, 2)} lit={0.2} /></div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 360, textAlign: 'center', fontFamily: HEAD, fontSize: 260, color: C.white, textShadow: `${g}px 0 ${C.red}, ${-g}px 0 #3df`, opacity: appear(f, 2)}}>
        WHY <span style={{color: C.red}}>RED?</span>
      </div>
    </Shot>
  );
};
export const A9: React.FC = () => {
  const {f, atWord} = useShot();
  const open = atWord('a9', 'open');
  const p = lerp(f, open, open + 25, 0, 1);
  return (
    <Shot cam={{s: [1.15, 1.0]}} bg="#02070b">
      <div style={{position: 'absolute', left: 560, top: 300, width: 800, height: 500, background: '#0a1a24', border: `2px solid ${C.amber}88`, transform: `perspective(1200px) rotateX(${(1 - appear(f, 0)) * 50}deg)`}}>
        <div style={{position: 'absolute', left: -2, top: -50, width: 300, height: 50, background: '#0a1a24', border: `2px solid ${C.amber}88`, borderBottom: 'none', fontFamily: MONO, color: C.amber, fontSize: 22, padding: '10px 20px', letterSpacing: 4}}>FILE #001</div>
        <div style={{position: 'absolute', left: 60, top: 80, fontFamily: HEAD, fontSize: 90, color: C.white}}>ENCOUNTER FILE</div>
        <div style={{position: 'absolute', left: 60, top: 200, fontFamily: MONO, fontSize: 28, color: C.grey, letterSpacing: 4}}>SUBJECT: CLASSIFIED UNTIL OPENED</div>
        <div style={{position: 'absolute', left: 60, top: 330, width: 680, height: 18, border: `2px solid ${C.sonar}`}}>
          <div style={{width: `${p * 100}%`, height: '100%', background: C.sonar}} />
        </div>
        <div style={{position: 'absolute', left: 60, top: 370, fontFamily: MONO, fontSize: 24, color: C.sonar, letterSpacing: 4}}>{p < 1 ? `OPENING… ${Math.round(p * 100)}%` : 'ACCESS GRANTED'}</div>
      </div>
    </Shot>
  );
};

/* ================= SECTION B ================= */
const Row: React.FC<{k: string; v: string; at: number; color?: string}> = ({k, v, at, color = C.white}) => {
  const {f} = useShot();
  if (f < at) return null;
  const n = Math.floor((f - at) * 1.6);
  return (
    <div style={{display: 'flex', fontFamily: MONO, fontSize: 38, marginBottom: 26}}>
      <div style={{width: 360, color: C.grey}}>{k}</div>
      <div style={{color, fontWeight: 700}}>{v.slice(0, n)}{n < v.length ? '▌' : ''}</div>
    </div>
  );
};
export const B1: React.FC = () => {
  const {at, atWord} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.06], x: [20, -20]}} bg="#02070b">
      <div style={{position: 'absolute', left: 160, top: 150}}>
        <div style={{fontFamily: MONO, color: C.amber, fontSize: 28, letterSpacing: 8}}>ENCOUNTER FILE</div>
        <div style={{fontFamily: HEAD, color: C.white, fontSize: 150, lineHeight: 1}}>#001</div>
        <div style={{height: 4, width: 1100, background: C.amber, margin: '24px 0 44px'}} />
        <Row k="SPECIES" v="Dosidicus gigas" at={atWord('b1', 'dosidicus')} />
        <Row k="COMMON NAME" v="Humboldt squid" at={at('b2')} />
        <Row k="ALSO KNOWN AS" v="Jumbo squid" at={atWord('b2', 'jumbo')} />
        <Row k="NICKNAME" v="Diablo rojo — red devil" at={atWord('b2', 'jumbo') + 25} color={C.red} />
      </div>
      <div style={{position: 'absolute', left: 1320, top: 260, opacity: 0.9}}>
        <div style={{transform: 'rotate(-90deg)'}}><Squid2 x={0} y={0} w={620} lit={0.8} phase={3} /></div>
      </div>
    </Shot>
  );
};
const RANGE: [number, number][] = [[-74, -46], [-75.5, -30], [-77, -18], [-81, -8], [-82, -1], [-86, 7], [-94, 13], [-102, 17], [-107, 21], [-111, 24], [-113.5, 28]];
const NORTH: [number, number][] = [[-113.5, 28], [-118, 31.5], [-121.5, 35], [-124.5, 40], [-125.5, 45], [-126, 48.5], [-130, 52.5], [-135, 56.5]];
export const B3: React.FC = () => {
  const {atWord, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.12], x: [0, 60]}} bg="#020b12" vignette={0.6} over={<Label text="RANGE: EASTERN PACIFIC" at={at('b3') + 4} />}>
      <MapBase view="pacific" />
      <MapTrail view="pacific" pts={RANGE} from={atWord('b3', 'chile')} to={atWord('b3', 'mexico') + 10} />
      <MapTrail view="pacific" pts={NORTH} from={atWord('b3', 'lately')} to={atWord('b3', 'north') + 20} color={C.amber} width={18} />
      <MapPin view="pacific" lon={-71} lat={-33.5} at={atWord('b3', 'chile')} label="CHILE" />
      <MapPin view="pacific" lon={-110} lat={24} at={atWord('b3', 'mexico')} label="MEXICO" />
      <MapPin view="pacific" lon={-135.3} lat={57} at={atWord('b3', 'north') + 10} label="…AND NORTH" color={C.amber} />
    </Shot>
  );
};
export const B4: React.FC = () => {
  const {f, atWord} = useShot();
  const kg = atWord('b4', 'fifty');
  const sqW = 1.5 * 380 * (1020 / 580);
  return (
    <Shot cam={{s: [1.05, 1.0]}} over={<Label text="BIG ADULT" at={4} />}>
      <Water top="#06192a" bottom="#01050a" />
      <Squid2 x={880} y={520} w={sqW} lit={0.9} phase={6} />
      <div style={{position: 'absolute', left: 880 - sqW / 2 + sqW * (370 / 1020), top: 700, width: 1.5 * 380 * appear(f, 6, 20), height: 6, background: C.amber}} />
      <div style={{position: 'absolute', left: 880 - sqW / 2 + sqW * (370 / 1020), top: 720, fontFamily: MONO, fontSize: 44, color: C.amber, fontWeight: 700, opacity: appear(f, 14)}}>BODY ≈ 1.5 m</div>
      {f > kg && <div style={{position: 'absolute', right: 160, top: 180, fontFamily: HEAD, fontSize: 150, color: C.white, opacity: appear(f, kg)}}>≈50<span style={{fontSize: 80, color: C.grey}}> KG</span></div>}
    </Shot>
  );
};
export const B5: React.FC = () => {
  const {f, atWord} = useShot();
  const tor = atWord('b5', 'torpedo');
  return (
    <Shot cam={{s: [1.0, 1.1]}} over={<Label text="≈ SAME WEIGHT" at={4} color={C.amber} />}>
      <Water top="#06192a" bottom="#01050a" />
      <div style={{position: 'absolute', left: 260, top: 760, width: 1400, height: 8, background: C.grey, transform: `rotate(${Math.sin(f / 15) * 1.5}deg)`}} />
      <div style={{position: 'absolute', left: 940, top: 768, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: `90px solid ${C.grey}`, transform: 'translateX(-40px)'}} />
      <Dog x={560} y={760} w={440} />
      <Squid2 x={1360} y={690} w={620} lit={0.9} phase={1} />
      <div style={{position: 'absolute', left: 0, width: 1920, top: 140, textAlign: 'center', fontFamily: HEAD, fontSize: 90, color: C.white}}>
        <span style={{opacity: appear(f, 6)}}>LARGE DOG</span> <span style={{color: C.amber, opacity: appear(f, 12)}}>=</span> <span style={{opacity: appear(f, 18)}}>HUMBOLDT</span>
      </div>
      {f > tor && <Headline text={<span style={{color: C.red}}>TORPEDO OF PURE MUSCLE</span>} at={tor} size={70} y={290} />}
    </Shot>
  );
};

/* depth cross-section: y = 230 surface, scale 0..800 m -> 230..1000 px */
const dY = (m: number) => 230 + (m / 800) * 770;
const DepthBase: React.FC<{night: number; omz?: number; fish?: number}> = ({night, omz = 0, fish = 1}) => {
  const {f} = useShot();
  const sky = interpolateColors(night, [0, 1], ['#6bb6d6', '#03070f']);
  const sea = interpolateColors(night, [0, 1], ['#0f4a66', '#041420']);
  return (
    <>
      <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 330, background: `linear-gradient(180deg, ${sky}, ${interpolateColors(night, [0, 1], ['#a9d8e6', '#0a1626'])})`}} />
      <div style={{position: 'absolute', left: 1500, top: 40 + night * 260, width: 110, height: 110, borderRadius: '50%', background: '#ffe9a8', boxShadow: '0 0 60px #ffd36a', opacity: 1 - night}} />
      <div style={{position: 'absolute', left: 300, top: 60, width: 70, height: 70, borderRadius: '50%', background: '#e8eef2', boxShadow: '0 0 40px #cfe', opacity: night}} />
      <div style={{position: 'absolute', left: -100, top: 230, width: 2120, height: 900, background: `linear-gradient(180deg, ${sea}, #010407 75%)`}} />
      <div style={{position: 'absolute', left: -100, top: 228, width: 2120, height: 3, background: 'rgba(200,235,250,0.5)'}} />
      {omz > 0 && (
        <div style={{position: 'absolute', left: -100, top: dY(420), width: 2120, height: dY(800) - dY(420), background: 'linear-gradient(180deg, transparent, rgba(110,40,120,0.35) 25%, rgba(110,40,120,0.35))', opacity: omz}}>
          <div style={{position: 'absolute', left: 820, top: 40, fontFamily: MONO, fontSize: 28, color: '#d9a6e8', letterSpacing: 6}}>LOW-OXYGEN ZONE</div>
        </div>
      )}
      {Array.from({length: 14}, (_, i) => {
        const y = dY(380 + rand(i) * 380), x = (rand(i + 5) * 1900 + f * (1 + rand(i) * 2)) % 1900;
        const gone = fish;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 26, height: 10, borderRadius: '50% 30% 30% 50%', background: '#7fa7b5', opacity: 0.6 * gone}} />;
      })}
      {[0, 200, 400, 600, 800].map((m) => (
        <div key={m} style={{position: 'absolute', left: 1760, top: dY(m) - 14, fontFamily: MONO, fontSize: 24, color: C.grey}}>— {m} m</div>
      ))}
    </>
  );
};
const Swarm: React.FC<{y: number; red?: number; n?: number; spread?: number}> = ({y, red = 0, n = 40, spread = 1}) => {
  const {f} = useShot();
  return (
    <>
      {Array.from({length: n}, (_, i) => (
        <Squid2 key={i} x={700 + (rand(i) - 0.5) * 700 * spread + Math.sin(f / 20 + i) * 10} y={y + (rand(i + 9) - 0.5) * 140 * spread} w={70 + rand(i + 3) * 40} lit={0.6} red={red * flash3(f, i)} rot={-80 + rand(i + 4) * 20} phase={i * 5} />
      ))}
    </>
  );
};
export const B6: React.FC = () => {
  const {f, at, atWord} = useShot();
  const slow = at('b8');
  return (
    <Shot cam={{s: [1.0, 1.08], y: [0, -40]}} vignette={0.5} over={<><Label text="DAYTIME" at={4} color={C.amber} /></>}>
      <DepthBase night={0} omz={appear(f, atWord('b7', 'oxygen'), 20)} fish={lerp(f, atWord('b7', 'fish'), atWord('b7', 'fish') + 40, 1, 0.1)} />
      <Swarm y={dY(620) + Math.sin(f / (f > slow ? 40 : 15)) * 10} />
      <Diver2 x={1150} y={dY(10)} s={0.35} />
      {f > slow && <div style={{position: 'absolute', left: 430, top: dY(620) + 100, fontFamily: MONO, fontSize: 30, color: C.white, opacity: appear(f, slow)}}>METABOLISM: <span style={{color: C.sonar}}>LOW</span> · WAITING</div>}
    </Shot>
  );
};
export const B9: React.FC = () => {
  const {f, at, atWord} = useShot();
  const set = at('b9'), rise = atWord('b9', 'rises');
  const night = lerp(f, set, set + 40, 0, 1);
  const y = lerp(f, rise, at('b10', 0.9), dY(620), dY(30), Easing.inOut(Easing.cubic));
  return (
    <Shot cam={{s: [1.0, 1.12], y: [-40, 40]}} vignette={0.5} over={<Label text="NIGHT: VERTICAL MIGRATION" at={rise} color={C.sonar} />}>
      <DepthBase night={night} omz={1} fish={0.1} />
      <Swarm y={y} n={46} />
      <Diver2 x={1150} y={dY(12)} s={0.35} beamLen={night > 0.8 ? 300 : 0} />
      <div style={{position: 'absolute', left: 120, top: y - 20, fontFamily: MONO, fontSize: 34, color: C.white, fontWeight: 700}}>▲ {Math.round(((y - 230) / 770) * 800)} m</div>
    </Shot>
  );
};
export const B11: React.FC = () => {
  const {f} = useShot();
  return (
    <Dive cam={{s: [1.0, 1.15]}} diver={{x: 760, y: 420, s: 0.75, beam: 1000}} field={{n: 22, seed: 12, cx: 960, cy: 1100 - f * 3, rx: 900, ry: 300, inner: 0.1, lit: 0.18, face: 'random'}}>
      <Bracket x={760 + 30} y={420} w={420} h={200} at={18} label="YOU" color={C.sonar} />
    </Dive>
  );
};
