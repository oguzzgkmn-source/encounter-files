import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Bracket, Diver2, Snow} from '../opening/kit';
import {C, Counter, HEAD, Headline, KineticLine, Label, MONO, MapBase, MapPin, Shot, Stamp, appear, lerp, pop, rand, useShot} from '../pilot/core';
import {Human, Icon, Panel} from '../pilot/art';
import {Sub, Swordfish} from './art';
import {Billfish, Plank, SailShip, SportBoat} from './art2';

const Sky: React.FC<{dusk?: boolean}> = ({dusk}) => (
  <>
    <AbsoluteFill style={{background: dusk ? 'linear-gradient(180deg, #24324f 0%, #c77d5a 60%, #e8b07a 100%)' : 'linear-gradient(180deg, #6fb2d6 0%, #cfe7f0 60%)'}} />
    <div style={{position: 'absolute', left: 0, top: 620, width: 1920, height: 460, background: dusk ? 'linear-gradient(180deg, #314a66, #0f1d2c)' : 'linear-gradient(180deg, #2b6f8f, #0d3248)'}} />
  </>
);
const Waves: React.FC<{y?: number}> = ({y = 640}) => {
  const {f} = useShot();
  return <>{Array.from({length: 24}, (_, i) => <div key={i} style={{position: 'absolute', left: ((rand(i) * 2000 + f * 1.5) % 2000) - 40, top: y + rand(i + 2) * 400, width: 60 + rand(i + 3) * 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)'}} />)}</>;
};
const Gray: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.85) brightness(0.8)'}}>{children}</div>;

/* ===== SECTION 5: encounters ===== */
export const E69: React.FC = () => {
  const {f, at} = useShot();
  const log = at('w070');
  return (
    <Shot cam={{s: [1.0, 1.08], x: [40, -40]}} over={<>{f > log && <Panel x={1080} y={160} w={700} at={log} title="SHIP'S LOG" color={C.amber}><div style={{fontFamily: HEAD, fontSize: 80, color: C.white}}>1832</div><div style={{fontFamily: MONO, fontSize: 32, color: C.grey}}>FARQUHARSON · ARRIVES WITH SOMETHING IN ITS HULL</div></Panel>}</>}>
      <Sky dusk />
      <Waves />
      <SailShip x={660} y={720} w={820} />
    </Shot>
  );
};
export const E71: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.12]}} bg="#14100c" over={<>
      <Label text="TWO MARLIN BILLS · DRIVEN INTO THE TIMBER" at={6} color={C.amber} />
      {f > at('w072') && <Label text="NATURAL HISTORY MUSEUM · LONDON" at={at('w072')} y={880} />}
      {f > at('w073') && <Headline text={<>THE FISH <span style={{color: C.red}}>LOST.</span></>} at={at('w073')} size={110} y={120} />}
    </>}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2a2118 0%, #0b0806 75%)'}} />
      <Plank x={960} y={540} w={1400} />
      <Bracket x={766} y={452} w={170} h={130} at={14} color={C.amber} />
      <Bracket x={1188} y={419} w={170} h={130} at={20} color={C.amber} />
    </Shot>
  );
};
export const PeopleCard: React.FC = () => (
  <Shot cam={{s: [1.1, 1.0]}} bg="#02070b">
    <Headline text="NOW, PEOPLE." at={2} size={150} y={420} />
  </Shot>
);
export const E76: React.FC = () => {
  const {f, at, atWord} = useShot();
  return (
    <Shot cam={{s: [1.2, 1.5], x: [137, 171], y: [-179, -224]}} bg="#020b12" vignette={0.6} over={<Label text="2012 · CHARTER BOAT · TAG & RELEASE" at={atWord('w076', 'charter')} color={C.amber} />}>
      <MapBase view="indopac" />
      <MapPin view="indopac" lon={145.8} lat={-16.9} at={atWord('w076', 'australia')} label="NORTHERN AUSTRALIA" sub="~270 KG BLACK MARLIN" />
    </Shot>
  );
};
/** marlin jumps into the cockpit (w077–w082) */
export const E77: React.FC = () => {
  const {f, at} = useShot();
  const into = at('w079'), crash = at('w080'), ok = at('w081'), cam = at('w082');
  // jump arc toward boat cockpit (boat at right, cockpit at ~x 760)
  const p = lerp(f, 4, into + 14, 0, 1, Easing.inOut(Easing.quad));
  const mx = 200 + p * 640, my = 640 - Math.sin(p * Math.PI) * 360 + p * 40;
  const inBoat = f > crash;
  const bs = at('w080', 0.72), be = at('w080', 0.95);
  const back = f > bs ? lerp(f, bs, be, 0, 1) : 0;
  return (
    <Shot cam={{s: [1.0, 1.08], shake: [{at: crash, amp: 1.2, len: 30}]}} over={<>
      {f > into && <Headline text={<>INTO <span style={{color: C.red}}>IT.</span></>} at={into} size={120} y={120} />}
      {f > ok && <Label text="SERIOUS INJURIES: NONE" at={ok} color={C.sonar} />}
      {f > cam && <div style={{position: 'absolute', right: 120, top: 90, fontFamily: MONO, fontSize: 32, color: C.red}}>● REC · CAUGHT ON CAMERA</div>}
    </>}>
      <Sky />
      <Waves />
      <SportBoat x={1150} y={700} w={900} roll={inBoat ? Math.sin(f) * 3 * Math.max(0, 1 - (f - crash) / 40) : 0} />
      {!inBoat && <Billfish kind="marlin" x={mx} y={my} w={620} rot={-30 + p * 50} phase={3} />}
      {inBoat && back < 1 && <Billfish kind="marlin" x={lerp(f, crash, crash + 50, 780, 900) - back * 700} y={560 + back * 150} w={560} rot={Math.sin(f / 2) * 14 * (1 - back) - back * 30} phase={3} />}
      {inBoat && <div style={{position: 'absolute', left: 760 + (f - crash) * 9, top: 520 - (f - crash) * 6 + Math.pow(f - crash, 2) * 0.25, width: 40, height: 50, background: '#c8d0d4', transform: `rotate(${(f - crash) * 20}deg)`, opacity: f - crash < 50 ? 1 : 0}} />}
      {f > into && f < crash + 10 && Array.from({length: 18}, (_, i) => <div key={i} style={{position: 'absolute', left: 640 + rand(i) * 260, top: 600 + rand(i + 1) * 80 - (f - into) * 3, width: 10, height: 10, borderRadius: 5, background: 'rgba(230,245,255,0.8)'}} />)}
    </Shot>
  );
};
export const E83: React.FC = () => {
  const {f, at, atWord} = useShot();
  const leg = at('w084'), art = at('w085'), tip = at('w086');
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#020b12" vignette={0.6} over={<>
      {f < leg && <Label text="DECEMBER 2015 · OFF KANEOHE, HAWAII" at={atWord('w083', 'hawaii')} color={C.amber} />}
    </>}>
      {f < leg ? (
        <>
          <MapBase view="indopac" />
          <MapPin view="indopac" lon={-157.8} lat={21.4} at={atWord('w083', 'hawaii')} label="HAWAII" sub="RUSSELL CHING · BLUE MARLIN 200+ KG" side="left" />
        </>
      ) : (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #6fb2d6 0%, #cfe7f0 45%, #e9ecee 45%, #c8d0d4 100%)'}} />
          <div style={{position: 'absolute', left: 0, top: 480, width: 1920, height: 30, background: '#ffffff'}} />
          <Human x={820} y={960} h={620} color="#2a3a44" />
          <Billfish kind="marlin" x={lerp(f, leg, leg + 20, 200, 380)} y={760} w={1000} rot={-4} flip phase={5} />
          {f > leg + 20 && <div style={{position: 'absolute', left: 770, top: 720, width: 130, height: 130, borderRadius: '50%', border: `6px solid ${C.red}`, transform: `scale(${pop(f, leg + 20)})`}} />}
          {f > art && <Panel x={1080} y={330} w={680} at={art} title="INJURY · LEG" color={C.amber}><div style={{fontFamily: MONO, fontSize: 38, color: C.white}}>MAIN ARTERY: <span style={{color: C.sonar}}>MISSED</span></div>{f > tip && <div style={{fontFamily: MONO, fontSize: 32, color: C.grey, marginTop: 16, opacity: appear(f, tip)}}>KEPT THE TIP OF THE BILL</div>}</Panel>}
        </>
      )}
    </Shot>
  );
};
export const E87: React.FC = () => {
  const {f, at, atWord} = useShot();
  const harbor = atWord('w088', 'harbour');
  const hit = at('w089'), end = at('w091'), rule = at('w092');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#0a0d10" over={<>
      {f > harbor && <Label text="MAY 2015 · HONOKŌHAU HARBOR, BIG ISLAND" at={harbor} color={C.grey} />}
      {f > rule && <div style={{position: 'absolute', left: 0, width: 1920, top: 820, textAlign: 'center', fontFamily: MONO, fontSize: 36, color: C.white, letterSpacing: 6, opacity: appear(f, rule)}}>RULED AN ACCIDENT</div>}
    </>}>
      <Gray>
        <Sky dusk />
        <Waves y={660} />
      </Gray>
      {f > hit && [0, 1, 2].map((k) => {
        const t = Math.min(1, ((f - hit) / 30 + k * 0.33) % 1.5);
        return <div key={k} style={{position: 'absolute', left: 960 - 260 * t, top: 760 - 40 * t, width: 520 * t, height: 80 * t, borderRadius: '50%', border: '3px solid rgba(220,230,235,0.5)', opacity: (1 - t) * (f > end ? lerp(f, end, end + 40, 1, 0.2) : 1)}} />;
      })}
      {f < hit && <div style={{position: 'absolute', left: 0, width: 1920, top: 300, textAlign: 'center', fontFamily: HEAD, fontSize: 90, color: '#dfe5e8', opacity: appear(f, 6)}}>NOT EVERY STORY ENDS LIKE THAT.</div>}
    </Shot>
  );
};
export const E93: React.FC = () => {
  const {f, at, atWord} = useShot();
  const off = at('w094'), res = at('w095'), un = at('w096'), fut = at('w097');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#020b12" vignette={0.6} over={<>
      {f > fut && <Label text="FILE #003 · PENDING" at={fut} color={C.amber} />}
    </>}>
      {f < off ? (
        <>
          <MapBase view="indopac" />
          <MapPin view="indopac" lon={99.5} lat={-1.9} at={atWord('w093', 'mentawai')} label="MENTAWAI ISLANDS" sub="OCTOBER 2024 · SURFER STRUCK" />
        </>
      ) : (
        <>
          <AbsoluteFill style={{background: `radial-gradient(circle at ${40 + Math.sin(f / 40) * 20}% ${50 + Math.cos(f / 50) * 15}%, #0b2233 0%, #02070b 65%)`}} />
          <Snow n={70} dim={0.25} />
          <Panel x={220} y={260} w={640} at={off} title="OFFICIALS" color={C.amber}><div style={{fontFamily: HEAD, fontSize: 90, color: C.white}}>SWORDFISH?</div></Panel>
          {f > res && <Panel x={1060} y={260} w={640} at={res} title="THE RESORT" color={'#7fd1ff'}><div style={{fontFamily: HEAD, fontSize: 90, color: C.white}}>NEEDLEFISH?</div></Panel>}
          {f > un && <Stamp text="UNRESOLVED" at={un} x={960} y={720} color={C.red} rot={-5} size={90} />}
        </>
      )}
    </Shot>
  );
};
export const E98: React.FC = () => {
  const {f, at} = useShot();
  const it: [string, string][] = [['w099', 'HOOKED'], ['w100', 'SPEARED'], ['w101', 'AIRBORNE']];
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<>{<Label text="THE PATTERN" at={4} color={C.amber} />}{f > at('w102') && <Headline text={<>NONE CAME LOOKING FOR <span style={{color: C.sonar}}>A PERSON.</span></>} at={at('w102')} size={90} y={760} />}</>}>
      {it.map(([id, t], i) => <div key={t} style={{position: 'absolute', left: 200 + i * 520, top: 380, width: 480, textAlign: 'center', fontFamily: HEAD, fontSize: 110, color: [C.amber, C.red, '#7fd1ff'][i], opacity: appear(f, at(id)), transform: `scale(${0.6 + 0.4 * pop(f, at(id))})`}}>{t}</div>)}
    </Shot>
  );
};

/* ===== SECTION 6: your move ===== */
export const F103: React.FC = () => {
  const {f, at} = useShot();
  const line = at('w106'), way = at('w107');
  const jump = f > line + 30 ? lerp(f, line + 30, line + 70, 0, 1) : 0;
  return (
    <Shot cam={{s: [1.15, 1.0], x: [0, 60]}} over={<>
      {f > at('w104') && <Label text="SMALL BOAT" at={at('w104')} />}
      {f > at('w105') && <Label text="OPEN OCEAN" at={at('w105')} y={880} />}
      {f > way && <Headline text={<>HEADING <span style={{color: C.red}}>YOUR WAY.</span></>} at={way} size={100} y={120} />}
    </>}>
      <Sky />
      <Waves />
      <SportBoat x={1300} y={700} w={760} rod={f > line ? 0.8 + 0.2 * Math.sin(f / 3) : 0} />
      {f > line && <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}><path d={`M 940 ${430 + Math.sin(f / 3) * 6} Q 600 600 ${300 + jump * 200} 660`} stroke="#e8eef0" strokeWidth={2} fill="none" /></svg>}
      {jump > 0 && jump < 1 && <Billfish kind="marlin" x={300 + jump * 260} y={660 - Math.sin(jump * Math.PI) * 300} w={480} rot={-35 + jump * 60} flip phase={2} />}
    </Shot>
  );
};
const OPTS = ['GRAB THE LINE, PULL IT IN', 'LEAN OVER THE SIDE TO LOOK', 'JUMP IN AND SWIM FOR IT', 'GET LOW, AWAY FROM THE FISH'];
const VERD = ['BAD IDEA', 'THIS ONE HURTS PEOPLE', 'ITS WORLD, NOT YOURS', "THAT'S THE ONE"];
export const Move2: React.FC<{pick: number; verdictAt?: string; struck?: number[]; intro?: boolean}> = ({pick, verdictAt, struck = [], intro}) => {
  const {f, at} = useShot();
  const va = verdictAt ? at(verdictAt) : 1e9;
  return (
    <Shot cam={{s: [1.05, 1.0]}} bg="#0a1420">
      <div style={{opacity: 0.25}}><Billfish kind="marlin" x={960} y={560} w={1800} dark={0.6} phase={1} /></div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: HEAD, color: C.white, fontSize: 140, lineHeight: 1, marginBottom: 40}}>YOUR MOVE</div>
        {OPTS.map((o, i) => {
          const sel = i === pick && !intro;
          const good = sel && i === 3;
          const gone = struck.includes(i);
          const col = good ? C.sonar : C.red;
          return (
            <div key={o} style={{position: 'relative', width: 1340, fontFamily: MONO, fontSize: 40, padding: '18px 32px', marginBottom: 16, color: sel ? '#050001' : gone ? C.grey : C.white, background: sel ? col : 'rgba(0,0,0,0.6)', border: `2px solid ${sel ? col : 'rgba(255,255,255,0.25)'}`, opacity: intro ? appear(f, 6 + i * 6) : 1, textDecoration: gone ? 'line-through' : 'none'}}>
              {i + 1}. {o}
              {sel && f > va && <span style={{position: 'absolute', right: 30, color: '#fff', fontWeight: 700, opacity: appear(f, va)}}>{VERD[i]}</span>}
            </div>
          );
        })}
      </AbsoluteFill>
    </Shot>
  );
};
export const F112: React.FC = () => {
  const {f, dur} = useShot();
  const p = lerp(f, 0, dur, 0, 1, Easing.in(Easing.quad));
  return (
    <Shot cam={{s: [1.0, 1.12]}} over={<Label text="PULL IT CLOSER = BRING THE BILL ABOARD" at={10} color={C.red} />}>
      <Sky />
      <Waves />
      <SportBoat x={1350} y={700} w={760} rod={1} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}><path d={`M 1000 430 Q ${800 - p * 100} 600 ${200 + p * 600} 650`} stroke="#e8eef0" strokeWidth={3} fill="none" /></svg>
      <Billfish kind="marlin" x={200 + p * 600} y={650 - p * 40} w={520} flip phase={4} />
    </Shot>
  );
};
export const F116: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.2, 1.35], x: [100, 160]}} over={<Label text="IMPACT ZONE" at={6} color={C.red} />}>
      <Sky />
      <Waves />
      <SportBoat x={1100} y={700} w={900} />
      <div style={{position: 'absolute', left: 620, top: 420, width: 260, height: 300, background: `repeating-linear-gradient(45deg, rgba(255,59,59,0.35) 0 16px, transparent 16px 32px)`, border: `3px solid ${C.red}`, opacity: 0.6 + 0.4 * Math.sin(f / 4)}} />
    </Shot>
  );
};
export const F119: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={f > at('w120') ? <Label text="THE SITUATION FROM HAWAII, 2015" at={at('w120')} color={C.grey} /> : null}>
      <div style={{position: 'absolute', inset: 0, filter: 'grayscale(0.6)'}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, #2c5c78 0%, #0a1f2e 70%)'}} />
        <Snow n={70} dim={0.25} />
        <Diver2 x={760} y={520} s={0.8} />
        <div style={{opacity: 0.6}}><Billfish kind="marlin" x={1380} y={560} w={760} dark={0.5} phase={6} /></div>
      </div>
    </Shot>
  );
};
export const F124: React.FC = () => {
  const {f, at} = useShot();
  const items: [string, string][] = [['w125', 'CLEAR THE SIDE WITH THE FISH'], ['w126', 'NOTHING BETWEEN BILL AND BOAT'], ['w127', 'CONTROL THE BILL FIRST'], ['w128', 'TAG IT. RELEASE IT.']];
  return (
    <Shot cam={{s: [1.12, 1.0], x: [-40, 40]}} bg="#02070b" over={<Label text="WHAT CREWS ACTUALLY DO" at={4} color={C.sonar} />}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(f / 35) * 25}% 50%, #0b2a20 0%, #02070b 60%)`}} />
      <Snow n={60} dim={0.2} />
      {f < at('w125') + 6 && <div style={{opacity: 1 - appear(f, at('w125'), 6)}}><div style={{opacity: 0.35}}><Billfish kind="marlin" x={lerp(f, 0, at('w125'), 1500, 1100)} y={560} w={1300} phase={2} /></div><Headline text={<>A FEW <span style={{color: C.sonar}}>SIMPLE RULES.</span></>} at={6} size={120} y={420} /></div>}
      {items.map(([id, t], i) => {
        const a = at(id);
        return (
          <div key={t} style={{position: 'absolute', left: 300, top: 220 + i * 170, opacity: appear(f, a), transform: `translateX(${(1 - appear(f, a)) * -60}px)`}}>
            <div style={{fontFamily: HEAD, fontSize: 80, color: C.white, whiteSpace: 'nowrap'}}><span style={{color: C.sonar}}>✓</span> {t}</div>
          </div>
        );
      })}
    </Shot>
  );
};
export const F129: React.FC = () => {
  const {f, at, dur} = useShot();
  const go = at('w129') + 40;
  return (
    <Shot cam={{s: [1.1, 1.0]}} over={<>{f > at('w130') && <Headline text={<>LEAVE THE SWORD <span style={{color: C.sonar}}>IN THE OCEAN.</span></>} at={at('w130')} size={90} y={820} />}</>}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #1c6f95 0%, #062a40 70%)'}} />
      <Snow n={60} dim={0.3} />
      <Billfish kind="marlin" x={f > go ? lerp(f, go, dur, 900, -300, Easing.in(Easing.quad)) : 900} y={460} w={900} phase={2} />
      <div style={{position: 'absolute', left: (f > go ? lerp(f, go, dur, 900, -300, Easing.in(Easing.quad)) : 900) + 80, top: 380, width: 70, height: 18, background: C.amber, borderRadius: 4}} />
      {f < go && <Bracket x={980} y={390} w={160} h={80} at={10} label="TAG" color={C.amber} />}
    </Shot>
  );
};

/* ===== SECTION 7: the twist ===== */
export const G131: React.FC = () => {
  const {f} = useShot();
  const g = Math.floor(f / 3) % 5 === 0 ? 10 : 0;
  return (
    <Shot cam={{s: [1.0, 1.1]}} bg="#030303">
      <div style={{position: 'absolute', left: 0, width: 1920, top: 420, textAlign: 'center', fontFamily: HEAD, fontSize: 190, color: C.white, textShadow: `${g}px 0 ${C.red}, ${-g}px 0 #3df`, opacity: appear(f, 2)}}>THE TWIST.</div>
    </Shot>
  );
};
export const G132: React.FC = () => {
  const {f, at} = useShot();
  const dec = at('w133'), news = at('w134');
  const years = [1832, 1967, 2012, 2015, 2015, 2024];
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<>{<Label text="EVERY STORY: REAL" at={4} color={C.sonar} />}{f > news && <Label text="EACH ONE MADE WORLD NEWS" at={news} y={880} color={C.amber} />}</>}>
      <div style={{position: 'absolute', left: 160, top: 560, width: 1600, height: 4, background: C.grey, opacity: appear(f, dec)}} />
      {f > dec && years.map((y, i) => {
        const x = 160 + ((y - 1820) / (2030 - 1820)) * 1600;
        return <div key={i} style={{position: 'absolute', left: x - 12, top: 548 - (i === 4 ? 40 : 0), width: 24, height: 24, borderRadius: 12, background: C.red, opacity: appear(f, dec + i * 6), boxShadow: `0 0 12px ${C.red}`}} />;
      })}
      {f > dec && [1850, 1900, 1950, 2000].map((y) => <div key={y} style={{position: 'absolute', left: 160 + ((y - 1820) / 210) * 1600 - 40, top: 600, width: 80, textAlign: 'center', fontFamily: MONO, fontSize: 24, color: C.grey}}>{y}</div>)}
      <Headline text="A HANDFUL OF ACCIDENTS." at={dec + 20} size={90} y={260} />
    </Shot>
  );
};
export const G135: React.FC = () => {
  const {f, at} = useShot();
  const atl = at('w136'), young = at('w137');
  const n = f > atl ? Math.max(4, Math.round(lerp(f, atl, young + 60, 40, 8))) : 40;
  return (
    <Shot cam={{s: [1.0, 1.1], x: [0, 80]}} bg="#020b12" vignette={0.6} over={<>{f > atl && <Label text="NORTH ATLANTIC · 1990s · OVERFISHED" at={atl} color={C.red} />}{f > young && <Label text="MORE AND MORE YOUNG FISH IN THE CATCH" at={young} y={880} color={C.amber} />}{f < atl && <Headline text="THE OTHER SIDE OF THE LEDGER." at={4} size={90} y={140} />}</>}>
      <MapBase view="atlantic" />
      {Array.from({length: 40}, (_, i) => {
        const x = 700 + rand(i) * 700, y = 260 + rand(i + 4) * 420;
        const small = f > young && rand(i + 9) < 0.6;
        return <div key={i} style={{position: 'absolute', left: x, top: y, opacity: i < n ? 1 : 0.05, filter: 'brightness(1.6)'}}><Swordfish x={0} y={0} w={small ? 95 : 160} phase={i} /></div>;
      })}
    </Shot>
  );
};
export const G138: React.FC = () => {
  const {f, at} = useShot();
  const cards: [string, string][] = [['w140', 'MINIMUM SIZES'], ['w141', 'CATCH LIMITS'], ['w141', 'REBUILDING PLAN']];
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b">
      <Headline text={<>COUNTRIES <span style={{color: C.sonar}}>AGREED.</span></>} at={at('w139')} size={120} y={160} />
      {cards.map(([id, t], i) => <div key={t} style={{position: 'absolute', left: 240 + i * 500, top: 520, width: 440, height: 220, border: `3px solid ${C.sonar}`, background: 'rgba(61,255,154,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 60, color: C.white, textAlign: 'center', opacity: appear(f, at(id) + i * 10), transform: `translateY(${(1 - appear(f, at(id) + i * 10)) * 40}px)`}}>{t}</div>)}
    </Shot>
  );
};
export const G142: React.FC = () => {
  const {f, at} = useShot();
  const reb = at('w143'), early = at('w144');
  const p = lerp(f, 4, reb + 40, 0, 1, Easing.inOut(Easing.cubic));
  const pts = Array.from({length: 41}, (_, i) => {
    const t = i / 40;
    const v = t < 0.45 ? 0.75 - t * 1.1 : 0.255 + (t - 0.45) * 1.15;
    return [260 + t * 1400, 860 - v * 600];
  });
  const k = Math.max(2, Math.round(p * 41));
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<>{f > reb && <Stamp text="REBUILT · 2009" at={reb + 20} x={1320} y={260} color={C.sonar} rot={-5} size={80} />}{f > early && <Label text="A YEAR AHEAD OF SCHEDULE" at={early} color={C.sonar} />}</>}>
      <Headline text="AND IT WORKED." at={2} size={90} y={100} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={260} y1={860} x2={1660} y2={860} stroke={C.grey} strokeWidth={2} />
        <polyline points={pts.slice(0, k).map((q) => q.join(',')).join(' ')} fill="none" stroke={C.sonar} strokeWidth={8} strokeLinejoin="round" />
      </svg>
      {['1980s', '1990s', '2009'].map((t, i) => <div key={t} style={{position: 'absolute', left: [240, 820, 1580][i], top: 880, fontFamily: MONO, fontSize: 28, color: C.grey}}>{t}</div>)}
    </Shot>
  );
};
export const G145: React.FC = () => {
  const {f, at, dur} = useShot();
  const down = at('w147');
  return (
    <Shot cam={{s: [1.15, 1.0]}} over={<>{f > at('w146') && <Headline text="NOT BECAUSE IT FOUGHT BACK." at={at('w146')} size={80} y={140} color={C.grey} />}{f > down && <Headline text={<>BECAUSE <span style={{color: C.sonar}}>WE PUT OURS DOWN.</span></>} at={down} size={100} y={820} />}</>}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #1c6f95 0%, #062a40 75%)'}} />
      <Snow n={70} dim={0.3} />
      <Swordfish x={lerp(f, 0, dur, 1400, 600, Easing.linear)} y={540} w={1100} phase={3} />
    </Shot>
  );
};

/* ===== SECTION 8: close ===== */
export const H148: React.FC = () => {
  const {f, at} = useShot();
  const two = at('w150');
  return (
    <Shot cam={{s: [1.05, 1.15]}} bg="#8cc4dd" over={<>{<Label text="1967 · BACK ON DECK" at={4} color={C.amber} />}{f > two && <div style={{position: 'absolute', right: 120, top: 90, fontFamily: MONO, fontSize: 64, color: '#0b141b', fontWeight: 700}}>{lerp(f, two, two + 60, 0, 2).toFixed(1)} HRS</div>}</>}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #8cc4dd 0%, #d6eaf2 70%, #9aa5ab 70%, #6d7a82 100%)'}} />
      <Swordfish x={1180} y={760} w={760} rot={60} phase={4} />
      <Sub x={900} y={420} w={1200} lights={0} />
    </Shot>
  );
};
export const H151: React.FC = () => {
  const {f, at} = useShot();
  const cook = at('w152'), kg = at('w153');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#1d150f" over={f > kg ? <Counter to={54} at={kg} len={24} suffix="+ KG" size={170} y={680} label="SERVED FOR DINNER" color={C.amber} /> : null}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3a2a1c 0%, #120c08 75%)'}} />
      {f > cook && <Headline text={<>THEY <span style={{color: C.amber}}>COOKED</span> IT.</>} at={cook} size={130} y={180} />}
      <svg width={700} height={260} viewBox="0 0 700 260" style={{position: 'absolute', left: 610, top: 360}}>
        <ellipse cx={330} cy={130} rx={300} ry={90} fill="#2b2f33" />
        <ellipse cx={330} cy={115} rx={270} ry={70} fill="#3b4045" />
        <rect x={600} y={100} width={100} height={26} rx={10} fill="#1d2023" />
        <path d="M 160 110 C 240 60, 420 60, 500 110 C 420 150, 240 150, 160 110 Z" fill="#e7d3bf" />
      </svg>
      {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 760 + i * 70, top: ((340 - (f * 2 + i * 40) % 160)), width: 30, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(6px)'}} />)}
    </Shot>
  );
};
export const H154: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
      <div style={{position: 'absolute', left: 360, top: 300, width: 1200, height: 300, border: `3px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontFamily: HEAD, fontSize: 110, color: C.white}}>
        <span>SUB <span style={{color: C.sonar}}>{f > 10 ? 1 : 0}</span></span>
        <span style={{color: C.grey}}>·</span>
        <span>SWORDFISH <span style={{color: C.red}}>0</span></span>
      </div>
      {f > at('w155') && <Headline text="AND THEN IT ATE THE EVIDENCE." at={at('w155')} size={84} y={720} />}
    </Shot>
  );
};
export const H156: React.FC = () => (
  <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
    <div style={{position: 'absolute', left: 560, top: 300, width: 800, height: 480, background: '#0a1a24', border: `2px solid ${C.amber}88`}}>
      <div style={{position: 'absolute', left: 60, top: 60, fontFamily: MONO, fontSize: 28, color: C.amber, letterSpacing: 6}}>ENCOUNTER FILE #002</div>
      <div style={{position: 'absolute', left: 60, top: 110, fontFamily: HEAD, fontSize: 130, color: C.white}}>THE SWORD</div>
      <div style={{position: 'absolute', left: 60, top: 290, fontFamily: MONO, fontSize: 28, color: C.grey}}>Swordfish · marlin · sailfish</div>
    </div>
    <Stamp text="FILE CLOSED" at={14} x={960} y={720} color={C.red} rot={-6} size={70} />
  </Shot>
);
export const H157: React.FC = () => {
  const {f, at} = useShot();
  const dart = 50;
  return (
    <Shot cam={{s: [1.0, 1.12]}} bg="#000" over={<>{f > at('w158') && <Label text="FILE #003 · OPENING…" at={at('w158')} color={C.amber} />}</>}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 40%, rgba(255,220,140,0.35) 0%, transparent 25%), #01040a'}} />
      <div style={{position: 'absolute', left: 1290, top: 360, width: 40, height: 40, borderRadius: 20, background: '#ffe6a8', boxShadow: '0 0 80px 30px rgba(255,220,140,0.5)'}} />
      <Snow n={60} dim={0.15} />
      {f > dart && f < dart + 14 && <div style={{position: 'absolute', left: lerp(f, dart, dart + 12, 300, 1240), top: lerp(f, dart, dart + 12, 800, 400), width: 260, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, transparent, #cfe3ec)', transform: 'rotate(-24deg)'}} />}
      {f >= dart + 12 && <AbsoluteFill style={{background: '#fff', opacity: lerp(f, dart + 12, dart + 18, 0.5, 0)}} />}
    </Shot>
  );
};
export const H158: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.04]}} bg="#02070b" vignette={0.5}>
      <div style={{position: 'absolute', left: 140, top: 200, fontFamily: MONO, fontSize: 36, color: C.amber, letterSpacing: 10, opacity: appear(f, 2)}}>NEXT ENCOUNTER FILE</div>
      <div style={{position: 'absolute', left: 140, top: 260, fontFamily: HEAD, fontSize: 240, color: C.white, lineHeight: 1, opacity: appear(f, 6)}}>#003: <span style={{color: C.red}}>?</span></div>
      <div style={{position: 'absolute', left: 140, top: 560, fontFamily: MONO, fontSize: 46, color: C.white, opacity: appear(f, 16), width: 760, lineHeight: 1.4}}>What do you want after that?<br /><span style={{color: C.sonar}}>Tell me in the comments ↓</span></div>
    </Shot>
  );
};
