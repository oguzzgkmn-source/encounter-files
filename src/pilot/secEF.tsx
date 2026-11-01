import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Bracket, Diver2, Snow, Squid2} from '../opening/kit';
import {Boat, Eyes, Human, Icon, Panel, SquidField} from './art';
import {Dive} from './secAB';
import {C, Counter, HEAD, Headline, KineticLine, Label, MONO, MapBase, MapPin, Shot, Stamp, Water, appear, flash3, lerp, pop, project, rand, useShot} from './core';

/* ================= SECTION E ================= */
export const E1: React.FC = () => {
  const {f, atWord} = useShot();
  const it = [
    {w: 'fast', t: 'FAST', c: C.sonar},
    {w: 'grab', t: 'GRAB', c: C.amber},
    {w: 'talk', t: 'TALK', c: C.red},
  ];
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={null}>
      {it.map((x, i) => (
        <div key={x.t} style={{position: 'absolute', left: 160 + i * 540, top: 380, width: 520, whiteSpace: 'nowrap', textAlign: 'center', fontFamily: HEAD, fontSize: 130, color: x.c, opacity: appear(f, atWord('e1', x.w)), transform: `scale(${1.3 - 0.3 * appear(f, atWord('e1', x.w))})`}}>{x.t} ✓</div>
      ))}
    </Shot>
  );
};
export const E2: React.FC = () => {
  const {f} = useShot();
  return (
    <Dive cam={{s: [1.0, 1.15]}} diver={{x: 860, y: 600, s: 0.8, beam: 900}} field={{n: 10, seed: 70, rx: 950, ry: 520, inner: 0.7, lit: 0.12}} over={<Headline text={<>USED AGAINST <span style={{color: C.red}}>PEOPLE?</span></>} at={6} size={110} y={160} />} />
  );
};
/** LEGEND | CONFIRMED evidence board */
export const Board: React.FC<{legendCard?: string; legendStamp?: string; deaths?: string; confirmedHL?: string; hlLegend?: string}> = ({legendCard, legendStamp, deaths, confirmedHL, hlLegend}) => {
  const {f, at} = useShot();
  const col = (x: number, title: string, color: string, hl: boolean) => (
    <div style={{position: 'absolute', left: x, top: 160, width: 760, height: 760, border: `3px solid ${hl ? color : 'rgba(255,255,255,0.15)'}`, background: hl ? `${color}14` : 'rgba(0,0,0,0.3)'}}>
      <div style={{fontFamily: HEAD, fontSize: 80, color, textAlign: 'center', marginTop: 30}}>{title}</div>
    </div>
  );
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b" over={<Label text="SORTING THE STORIES" at={4} color={C.grey} />}>
      {col(160, 'LEGEND', C.amber, !!hlLegend && f > at(hlLegend))}
      {col(1000, 'CONFIRMED', C.sonar, !!confirmedHL && f > at(confirmedHL))}
      {legendCard && f > at(legendCard) && (
        <div style={{position: 'absolute', left: 220, top: 360, width: 640, padding: 30, background: '#0b1820', border: `2px solid ${C.amber}88`, opacity: appear(f, at(legendCard)), transform: `translateY(${(1 - appear(f, at(legendCard))) * 40}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.amber, letterSpacing: 4}}>FISHERMEN'S TALES</div>
          <div style={{fontFamily: MONO, fontSize: 32, color: C.white, marginTop: 14}}>Men lost overboard at night, blamed on "red devils"</div>
        </div>
      )}
      {deaths && f > at(deaths) && <Counter to={0} from={0} at={at(deaths)} len={1} size={170} y={420} cx={1380} label="CONFIRMED DEATHS" color={C.sonar} />}
      {legendStamp && <Stamp text="UNVERIFIED" at={at(legendStamp)} x={540} y={460} color={C.amber} />}
    </Shot>
  );
};
export const E5: React.FC = () => {
  const {f, dur} = useShot();
  const splash = 40;
  return (
    <Shot cam={{s: [1.0, 1.1], x: [30, -30]}} bg="#000" over={<Label text="LEGEND · SEA OF CORTEZ" at={8} color={C.amber} />}>
      <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 560, background: 'linear-gradient(180deg, #02050b, #0a1424)'}} />
      {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: rand(i) * 1920, top: rand(i + 60) * 420, width: 2, height: 2, background: '#fff', opacity: 0.3 + 0.4 * rand(i + 5)}} />)}
      <div style={{position: 'absolute', left: -100, top: 460, width: 2120, height: 800, background: 'linear-gradient(180deg, #06161e, #010407 70%)'}} />
      <Boat x={lerp(f, 0, dur, 1100, 1300, Easing.linear)} y={420} w={460} />
      {f > splash && [0, 1, 2].map((k) => {
        const t = Math.min(1, (f - splash - k * 6) / 30);
        return t > 0 ? <div key={k} style={{position: 'absolute', left: 820 - 120 * t, top: 455 - 10 * t, width: 240 * t, height: 20 * t, borderRadius: '50%', border: '2px solid rgba(200,230,240,0.6)', opacity: 1 - t}} /> : null;
      })}
      <div style={{opacity: lerp(f, splash + 20, splash + 60, 0, 1)}}>
        {Array.from({length: 12}, (_, i) => <Squid2 key={i} x={820 + (rand(i) - 0.5) * 900} y={720 + rand(i + 2) * 300} w={120 + rand(i + 4) * 80} lit={0} red={0.6 + 0.4 * flash3(f, i, 2)} rot={-60 + rand(i) * 120} phase={i * 4} />)}
      </div>
    </Shot>
  );
};
export const E10: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
      <Panel x={160} y={170} w={900} at={4} title="CONFIRMED · FIRST-HAND ACCOUNT" color={C.sonar}>
        <div style={{fontFamily: HEAD, fontSize: 96, color: C.white, lineHeight: 1}}>SCOTT CASSELL</div>
        <div style={{fontFamily: MONO, fontSize: 32, color: C.grey, marginTop: 20}}>DIVER · FILMMAKER</div>
        <div style={{fontFamily: MONO, fontSize: 32, color: C.grey, marginTop: 8}}>YEARS OF DIVES WITH HUMBOLDT SQUID · MEXICO</div>
      </Panel>
      {f > at('e11') && <Stamp text="BY HIS OWN ACCOUNT" at={at('e11')} x={610} y={720} color={C.amber} rot={-4} size={50} />}
      <Diver2 x={1440} y={430} s={0.85} />
      <div style={{position: 'absolute', left: 1180, top: 160, width: 600, height: 560, border: `2px solid ${C.sonar}55`}} />
    </Shot>
  );
};
export const E12: React.FC = () => {
  const {f, atWord} = useShot();
  const drag = atWord('e12', 'dragged'), ear = atWord('e12', 'eardrum');
  const dy = f > drag ? lerp(f, drag, drag + 50, 0, 700, Easing.in(Easing.cubic)) : 0;
  return (
    <Shot cam={{s: [1.0, 1.1], shake: [{at: drag, amp: 0.6, len: 40}]}} over={
      <>
        <div style={{position: 'absolute', left: 110, top: 80, fontFamily: MONO}}>
          <div style={{color: C.grey, fontSize: 22, letterSpacing: 3}}>DEPTH</div>
          <div style={{color: f > drag ? C.red : C.white, fontSize: 56, fontWeight: 700}}>{(12 + dy / 40).toFixed(1)} m</div>
        </div>
        {f > ear && <><Icon name="ear" x={1600} y={300} size={200} /><Label text="EARDRUM: RUPTURED (HIS ACCOUNT)" at={ear} color={C.red} /></>}
      </>
    }>
      <Water />
      <Snow n={90} dim={0.2} />
      <div style={{position: 'absolute', left: 0, top: dy * 0.3, width: 1920, height: 1080}}>
        <Diver2 x={760} y={460} s={0.9} tilt={f > drag ? 60 : 0} />
        <Squid2 x={760 + 120} y={660} w={460} lit={0.6} red={flash3(f, 0, 3)} rot={-90} />
      </div>
      {f > drag && Array.from({length: 20}, (_, i) => <div key={i} style={{position: 'absolute', left: rand(i) * 1920, top: ((rand(i + 3) * 1080 - (f - drag) * 30) % 1080 + 1080) % 1080, width: 3, height: 60, background: 'rgba(200,230,240,0.3)'}} />)}
    </Shot>
  );
};
export const E13: React.FC = () => {
  const {f, at} = useShot();
  const arm = at('e13', 0.4), head = at('e14', 0.5);
  const mark = (x: number, y: number, a: number, text: string, side: 1 | -1) =>
    f > a ? (
      <>
        <div style={{position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: '50%', border: `5px solid ${C.red}`, transform: `scale(${pop(f, a)})`}} />
        <div style={{position: 'absolute', top: y - 22, [side > 0 ? 'left' : 'right']: side > 0 ? x + 60 : 1920 - x + 60, fontFamily: MONO, fontSize: 34, color: C.white, opacity: appear(f, a), whiteSpace: 'nowrap'}}>{text}</div>
      </>
    ) : null;
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b" over={<Label text="INJURIES — AS DESCRIBED BY CASSELL" at={4} color={C.amber} />}>
      <Human x={960} y={940} h={760} color="#2a3a44" />
      {mark(1010, 245, 0, 'EAR — EARDRUM RUPTURED', 1)}
      {mark(1045, 320, arm, 'ARM — PULLED FROM SOCKET', 1)}
      {mark(960, 200, head, 'SCALP — TORN', -1)}
    </Shot>
  );
};
export const E15: React.FC = () => {
  const {f} = useShot();
  return (
    <Dive cam={{s: [1.1, 1.0]}} diver={null} field={{n: 18, seed: 80, cx: 960, cy: 540, rx: 950, ry: 520, inner: 0.5, lit: 0.3, red: 'flash'}} label={{text: 'CUSTOM BODY ARMOUR', at: 10, color: C.amber}}>
      <div style={{filter: 'drop-shadow(0 0 12px rgba(200,220,230,0.5))'}}>
        <Diver2 x={860} y={560} s={1.0} beamLen={700} />
      </div>
      {/* armour plates overlay */}
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 860 - 60 + i * 34, top: 560 - 28 + Math.sin(f / 20) * 6, width: 30, height: 56, background: 'linear-gradient(180deg, #c8d2d8, #6d7a82)', borderRadius: 6, opacity: 0.95}} />)}
      <div style={{position: 'absolute', left: 860 + 70, top: 560 - 40 + Math.sin(f / 20) * 6, width: 56, height: 56, borderRadius: '50%', border: '6px solid #b8c4ca'}} />
    </Dive>
  );
};
export const E17: React.FC = () => {
  const {f, atWord, at} = useShot();
  const sd = project('baja', -117.27, 32.85);
  const go = atWord('e17', 'thousands');
  return (
    <Shot cam={{s: [1.0, 1.35], x: [0, 364], y: [0, 455]}} bg="#020b12" vignette={0.6} over={<><Label text="SUMMER 2009 · SOUTHERN CALIFORNIA" at={6} color={C.amber} /></>}>
      <MapBase view="baja" />
      {Array.from({length: 160}, (_, i) => {
        const a0 = project('baja', -118.5 - rand(i) * 3, 28 + rand(i + 1) * 3);
        const p = lerp(f, go + rand(i + 2) * 30, go + 60 + rand(i + 2) * 40, 0, 1, Easing.inOut(Easing.cubic));
        const x = a0.x + (sd.x - 30 - rand(i + 3) * 120 - a0.x) * p, y = a0.y + (sd.y + (rand(i + 4) - 0.5) * 160 - a0.y) * p;
        return f > go ? <div key={i} style={{position: 'absolute', left: x, top: y, width: 7, height: 7, borderRadius: 4, background: C.red, boxShadow: `0 0 8px ${C.red}`}} /> : null;
      })}
      <MapPin view="baja" lon={-117.27} lat={32.85} at={atWord('e17', 'diego')} label="LA JOLLA" sub="SAN DIEGO, CALIFORNIA" color={C.amber} />
    </Shot>
  );
};
export const E18: React.FC = () => {
  const {f} = useShot();
  const tug = Math.sin(f / 4) * 8;
  return (
    <Shot cam={{s: [1.0, 1.12]}} over={<Label text="REPORTED: MASKS · CAMERAS · GEAR" at={8} color={C.amber} />}>
      <Water />
      <Snow n={80} dim={0.2} />
      {/* big diver head */}
      <div style={{position: 'absolute', left: 1080 + tug * 0.5, top: 260}}>
        <div style={{position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: '#1b2a33'}} />
        <div style={{position: 'absolute', left: 230 + tug, top: 170, width: 300, height: 170, borderRadius: 40, background: 'rgba(127,232,255,0.6)', border: '14px solid #0c1419', transform: `rotate(${tug * 0.6}deg)`}} />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2].map((i) => <path key={i} d={`M -50 ${400 + i * 120} C 400 ${380 + i * 80 + tug}, 900 ${420 + i * 30}, ${1320 + tug} ${430 + i * 40}`} stroke="#d7c6c0" strokeWidth={22 - i * 4} fill="none" strokeLinecap="round" />)}
        {[0, 1, 2].map((i) => Array.from({length: 7}, (_, j) => <circle key={`${i}-${j}`} cx={700 + j * 90} cy={418 + i * 70 + Math.sin(j) * 6} r={7} fill="#f2e8e4" stroke="#6b5550" strokeWidth={2} />))}
      </svg>
    </Shot>
  );
};
export const E19: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.05, 1.0]}} bg="#08121a" over={<Label text="SOME DIVERS: STAYED OUT" at={8} />}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 600, background: 'linear-gradient(180deg, #ffb27a 0%, #e98c6a 30%, #3a5a78 70%)'}} />
      <div style={{position: 'absolute', left: 0, top: 560, width: 1920, height: 220, background: 'linear-gradient(180deg, #2b5d7a, #12324a)'}} />
      {Array.from({length: 18}, (_, i) => <div key={i} style={{position: 'absolute', left: (rand(i) * 1920 + f * 2) % 1920, top: 600 + rand(i + 1) * 150, width: 30, height: 10, borderRadius: '50%', background: `rgba(232,35,44,${0.4 + 0.3 * flash3(f, i, 1.5)})`}} />)}
      <div style={{position: 'absolute', left: 0, top: 760, width: 1920, height: 320, background: '#c9a77a'}} />
      {[700, 820, 950].map((x, i) => <Human key={x} x={x} y={1000} h={240} color="#1a1410" />)}
    </Shot>
  );
};
export const E20: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b">
      <Panel x={260} y={300} w={1400} at={at('e21') - 4} title="BIOLOGIST, 2009 · PARAPHRASED" color={C.sonar}>
        <div style={{fontFamily: HEAD, fontSize: 92, color: C.white, lineHeight: 1.1}}>NOT THE <span style={{color: C.red}}>MAN-EATERS</span> THEY'VE BEEN MADE OUT TO BE.</div>
      </Panel>
      <Headline text="THE SCIENTISTS:" at={2} size={60} y={180} color={C.grey} font={MONO} />
    </Shot>
  );
};
export const E22: React.FC = () => {
  const {f} = useShot();
  const v = lerp(f, 6, 40, 0.5, 0.82, Easing.out(Easing.back(1.5)));
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b">
      <div style={{position: 'absolute', left: 260, top: 520, width: 1400, height: 40, background: `linear-gradient(90deg, ${C.red}, #333 50%, ${C.sonar})`, borderRadius: 20}} />
      <div style={{position: 'absolute', left: 260 + 1400 * v - 20, top: 470, width: 40, height: 140, background: C.white, borderRadius: 10, boxShadow: '0 0 20px #fff'}} />
      <div style={{position: 'absolute', left: 260, top: 620, fontFamily: HEAD, fontSize: 70, color: C.red}}>ATTACK</div>
      <div style={{position: 'absolute', right: 260, top: 620, fontFamily: HEAD, fontSize: 70, color: C.sonar}}>CURIOSITY</div>
      <Headline text="MOSTLY CURIOUS." at={30} size={90} y={260} />
    </Shot>
  );
};
export const E23: React.FC = () => {
  const {f, at} = useShot();
  const marks = at('e24');
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={<>{f > marks && (
      <>
        {[[620, 380], [760, 520], [540, 640], [1200, 420], [1320, 600]].map(([x, y], i) => (
          <div key={i} style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: '50%', border: `8px dotted ${C.red}`, opacity: appear(f, marks + i * 5), transform: `scale(${pop(f, marks + i * 5)})`}} />
        ))}
        <Headline text="CURIOSITY STILL LEAVES MARKS." at={marks + 6} size={84} y={840} />
      </>
    )}</>}>
      <Water />
      <Snow n={80} dim={0.2} />
      <Diver2 x={1100} y={560} s={1.1} beamLen={0} />
      <Squid2 x={520} y={560} w={700} lit={0.6} red={0.3 + 0.3 * flash3(f, 0, 1)} flip phase={3} />
    </Shot>
  );
};

/* ================= SECTION F ================= */
const OPTS = ['SWIM FOR THE SURFACE', 'STAY PERFECTLY STILL', 'TURN OFF YOUR TORCH', 'FIGHT BACK'];
const VERDICT = ['DANGER → DANGER', 'BETTER… BUT', 'BLIND IN THEIR WORLD', 'OUTNUMBERED'];
export const Move: React.FC<{pick: number; verdictAt?: string; struck?: number[]; intro?: boolean}> = ({pick, verdictAt, struck = [], intro}) => {
  const {f, at} = useShot();
  const va = verdictAt ? at(verdictAt) : 99999;
  return (
    <Shot cam={{s: [1.06, 1.0]}} bg="#120203" over={null}>
      <SquidField n={10} seed={90} rx={950} ry={520} inner={0.75} lit={0} red="flash" opacity={0.35} w={[300, 500]} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: HEAD, color: C.white, fontSize: 140, lineHeight: 1, marginBottom: 40}}>YOUR MOVE</div>
        {OPTS.map((o, i) => {
          const inn = intro ? appear(f, 6 + i * 6) : 1;
          const sel = i === pick && !intro;
          const gone = struck.includes(i);
          return (
            <div key={o} style={{position: 'relative', width: 1340, fontFamily: MONO, fontSize: 42, padding: '18px 32px', marginBottom: 16, color: sel ? '#050001' : gone ? C.grey : C.white, background: sel ? C.red : 'rgba(0,0,0,0.6)', border: `2px solid ${sel ? C.red : 'rgba(255,255,255,0.25)'}`, opacity: inn, textDecoration: gone ? 'line-through' : 'none'}}>
              {i + 1}. {o}
              {sel && f > va && <span style={{position: 'absolute', right: 30, color: '#fff', fontWeight: 700, opacity: appear(f, va)}}>{VERDICT[i]}</span>}
            </div>
          );
        })}
      </AbsoluteFill>
    </Shot>
  );
};
export const F5: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.1], y: [0, 60]}} over={<Label text="3–4 km/h  vs  20+ km/h" at={8} color={C.red} />}>
      <Water top="#0b2a3a" bottom="#01050a" rays={0.5} />
      <Snow n={80} dim={0.2} />
      <Diver2 x={960} y={lerp(f, 0, 120, 700, 560)} s={0.8} tilt={-50} kick={2} />
      {Array.from({length: 6}, (_, i) => (
        <Squid2 key={i} x={700 + i * 120 + Math.sin(i) * 60} y={((1200 - f * (14 + i * 2) - i * 90) % 1400 + 1400) % 1400 - 100} w={220} lit={0.4} red={flash3(f, i)} rot={90} phase={i * 6} trail={30} />
      ))}
    </Shot>
  );
};
export const F6: React.FC = () => {
  const {f, at} = useShot();
  const lungs = at('f7');
  const d = Math.max(1.5, 12 - f * 0.045);
  return (
    <Shot cam={{s: [1.0, 1.2], shake: [{at: lungs, amp: 0.5, len: 30}]}} over={
      <>
        <div style={{position: 'absolute', left: 110, top: 80, fontFamily: MONO}}>
          <div style={{color: C.grey, fontSize: 22, letterSpacing: 3}}>DEPTH</div>
          <div style={{color: C.red, fontSize: 56, fontWeight: 700}}>{d.toFixed(1)} m</div>
          <div style={{color: C.red, fontSize: 26, opacity: Math.floor(f / 6) % 2 ? 1 : 0.3}}>▲▲ ASCENT RATE: TOO FAST</div>
        </div>
        {f > lungs && <><Icon name="lungs" x={1580} y={460} size={300} /><Label text="LUNG INJURY RISK" at={lungs} color={C.red} /></>}
      </>
    }>
      <Water top="#1a4a60" bottom="#02080c" rays={1} />
      {Array.from({length: 30}, (_, i) => <div key={i} style={{position: 'absolute', left: 900 + (rand(i) - 0.5) * 300, top: ((rand(i + 1) * 1080 + f * 25) % 1080), width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(220,245,255,0.6)'}} />)}
      <Diver2 x={960} y={560} s={0.9} tilt={-80} kick={2.5} />
    </Shot>
  );
};
export const F11: React.FC = () => {
  const {f, at} = useShot();
  const tg = at('f12');
  const reach = lerp(f, 4, tg + 20, 0, 1);
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={f > tg ? <Bracket x={1080} y={560} w={600} h={300} at={tg} label="INTERESTING OBJECT" color={C.amber} /> : null}>
      <Water />
      <Snow n={80} dim={0.15} />
      <Diver2 x={1080} y={560} s={0.9} kick={0} />
      <Squid2 x={lerp(f, 0, 60, 300, 560)} y={520} w={620} lit={0.5} red={0.2} flip phase={2} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1].map((i) => <path key={i} d={`M 760 ${520 + i * 30} C 860 ${500 + i * 60}, 920 ${540 + Math.sin(f / 6 + i) * 20}, ${780 + 260 * reach} ${540 + i * 20}`} stroke="#cdbab4" strokeWidth={12} fill="none" strokeLinecap="round" />)}
      </svg>
    </Shot>
  );
};
export const F15: React.FC = () => {
  const {f, dur} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.08], x: [40, -40]}} bg="#000" over={<Label text="SQUID FISHING: LIGHTS AT NIGHT" at={8} color={C.amber} />}>
      <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 520, background: 'linear-gradient(180deg, #02050b, #0a1424)'}} />
      <div style={{position: 'absolute', left: -100, top: 420, width: 2120, height: 800, background: 'linear-gradient(180deg, #071820, #010407 70%)'}} />
      {[500, 960, 1420].map((x, i) => <Boat key={x} x={x} y={380} w={360} lamp={1.4} />)}
      {Array.from({length: 30}, (_, i) => {
        const tx = [500, 960, 1420][i % 3];
        const p = lerp(f, i * 2, dur, 0, 0.8);
        const x0 = rand(i) * 1920, y0 = 700 + rand(i + 1) * 380;
        return <Squid2 key={i} x={x0 + (tx - x0) * p} y={y0 + (520 - y0) * p} w={100 + rand(i + 2) * 60} lit={0.4} red={0.4 * flash3(f, i)} rot={-90 + (tx - x0) / 20} phase={i * 3} />;
      })}
    </Shot>
  );
};
export const F17: React.FC = () => {
  const {f, atWord, at} = useShot();
  const off = atWord('f17', 'switch') + 6;
  const see = at('f18');
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#000" vignette={0.6} over={
      <>
        {f > see && <Headline text={<>THEY CAN SEE <span style={{color: C.red}}>YOU.</span></>} at={see} size={90} y={300} />}
        {f > see + 30 && <Headline text="YOU CAN'T SEE THEM." at={see + 30} size={90} y={700} color={C.grey} />}
      </>
    }>
      <div style={{opacity: f < off ? 1 : 0}}>
        <Water />
        <Diver2 x={760} y={560} s={0.8} beamLen={1000} />
      </div>
      {f >= off && <Eyes n={34} seed={7} />}
    </Shot>
  );
};
export const F20: React.FC = () => {
  const {f, atWord} = useShot();
  const it = [
    {w: 'ten', t: '10 ARMS'},
    {w: 'hundreds', t: 'HUNDREDS OF TEETH'},
    {w: 'friends', t: '+ A FEW HUNDRED FRIENDS'},
  ];
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#120203">
      <Headline text="WITH WHAT?" at={2} size={80} y={180} color={C.grey} />
      {it.map((x, i) => <div key={x.t} style={{position: 'absolute', left: 0, width: 1920, top: 380 + i * 150, textAlign: 'center', fontFamily: HEAD, fontSize: 110, color: i === 2 ? C.red : C.white, opacity: appear(f, atWord('f20', x.w))}}>{x.t}</div>)}
    </Shot>
  );
};
export const F21: React.FC = () => {
  const {f, at, atWord} = useShot();
  const items: {w: string; t: string; icon: any}[] = [
    {w: 'protection', t: 'DIVE WITH PROTECTION', icon: 'shield'},
    {w: 'calm', t: 'STAY CALM', icon: 'eye'},
    {w: 'together', t: 'STAY TOGETHER', icon: 'people'},
    {w: 'avoid', t: 'AVOID THE FRENZY', icon: 'warning'},
  ];
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b" over={<Label text="WHAT EXPERIENCED DIVERS DO" at={4} color={C.sonar} />}>
      {f < at('f23') + 4 && (
        <div style={{opacity: 1 - appear(f, at('f23'), 4)}}>
          <Headline text="WHAT DO THEY ACTUALLY DO?" at={4} size={100} y={380} />
          {f > at('f22') && <Headline text={<span style={{color: C.sonar}}>THEY PLAN FOR IT.</span>} at={at('f22')} size={110} y={540} />}
        </div>
      )}
      {items.map((x, i) => {
        const a = atWord('f23', x.w);
        return (
          <div key={x.t} style={{position: 'absolute', left: 360, top: 200 + i * 175, opacity: appear(f, a), transform: `translateX(${(1 - appear(f, a)) * -60}px)`}}>
            <Icon name={x.icon} x={60} y={60} size={110} color={C.sonar} />
            <div style={{position: 'absolute', left: 160, top: 22, fontFamily: HEAD, fontSize: 80, color: C.white, whiteSpace: 'nowrap'}}>{x.t}</div>
            <div style={{position: 'absolute', left: 1100, top: 20, fontFamily: HEAD, fontSize: 80, color: C.sonar}}>✓</div>
          </div>
        );
      })}
    </Shot>
  );
};
export const F24: React.FC = () => (
  <Dive cam={{s: [1.0, 0.85]}} diver={{x: 900, y: 560, s: 0.55, beam: 700}} field={{n: 16, seed: 99, rx: 950, ry: 520, inner: 0.6, lit: 0.08}} over={<Headline text={<>NEVER ALONE. <span style={{color: C.sonar}}>ALWAYS A PLAN.</span></>} at={20} size={90} y={820} />} />
);
