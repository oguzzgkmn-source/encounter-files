import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Bracket, Diver2, Snow} from '../opening/kit';
import {C, Counter, HEAD, Headline, KineticLine, Label, MONO, MapBase, MapPin, Shot, Stamp, appear, lerp, pop, rand, useShot} from '../pilot/core';
import {Human, Icon} from '../pilot/art';
import {Swordfish} from './art';
import {Billfish, Reel, Sardines} from './art2';

const Deep: React.FC<{k?: number}> = ({k = 1}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 60% 40%, rgba(10,40,70,${0.9 * k}) 0%, #01040a 70%)`}} />
);
const Blue: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(180deg, #0d4a6e 0%, #052338 60%, #020d17 100%)'}} />;

/* ===== SECTION 1 (after the cold open) ===== */
export const A12: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.3], x: [0, 380]}} over={<Label text="BUILT-IN WEAPON" at={20} color={C.red} />}>
      <Deep />
      <Snow n={70} dim={0.2} />
      <Swordfish x={1150} y={540} w={1500} />
      <Bracket x={520} y={555} w={560} h={120} at={30} label="SWORD" color={C.red} />
    </Shot>
  );
};
export const Family: React.FC<{hl?: [string, string, string]}> = ({hl}) => {
  const {f, at} = useShot();
  const on = (i: number) => (hl ? f >= at(hl[i]) : f >= 6 + i * 8);
  const lab = (i: number, name: string, sub: string, y: number) => (
    <div style={{position: 'absolute', left: 1260, top: y - 40, opacity: on(i) ? 1 : 0.25, fontFamily: MONO}}>
      <div style={{fontFamily: HEAD, fontSize: 70, color: on(i) ? C.white : C.grey}}>{name}</div>
      {hl && <div style={{fontSize: 26, color: C.amber, letterSpacing: 3, opacity: on(i) ? 1 : 0}}>{sub}</div>}
    </div>
  );
  return (
    <Shot cam={{s: [1.0, 1.06]}} over={<Label text="FAMILY: BILLFISH" at={4} />}>
      <Blue />
      <div style={{opacity: on(0) ? 1 : 0.25}}><Billfish kind="marlin" x={700} y={230} w={900} phase={1} /></div>
      <div style={{opacity: on(1) ? 1 : 0.25}}><Billfish kind="sail" x={700} y={540} w={900} phase={7} /></div>
      <div style={{opacity: on(2) ? 1 : 0.25}}><Swordfish x={700} y={850} w={900} phase={13} /></div>
      {lab(0, 'MARLIN', 'ROUND, SPEAR-LIKE BILL', 230)}
      {lab(1, 'SAILFISH', 'HUGE "SAIL" ON ITS BACK', 540)}
      {lab(2, 'SWORDFISH', 'FLAT SWORD · UP TO 1/3 OF BODY', 850)}
    </Shot>
  );
};
export const A14: React.FC = () => {
  const {f, atWord} = useShot();
  const it: [string, string][] = [['boats', 'BOATS'], ['ships', 'SHIPS'], ['submarines', 'SUBMARINES'], ['people', 'PEOPLE']];
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<Label text="KNOWN TARGETS" at={4} color={C.red} />}>
      {it.map(([w, t], i) => {
        const a = atWord('w014', w);
        return (
          <div key={t} style={{position: 'absolute', left: 140 + i * 420, top: 420, width: 400, textAlign: 'center', opacity: appear(f, a), transform: `scale(${0.6 + 0.4 * pop(f, a)})`}}>
            <div style={{fontFamily: HEAD, fontSize: 84, color: i === 3 ? C.red : C.white}}>{t}</div>
            <div style={{fontFamily: HEAD, fontSize: 90, color: C.red}}>✕</div>
          </div>
        );
      })}
    </Shot>
  );
};
export const A15: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.6, 2.2], x: [700, 1100]}} over={
      <>
        {f > at('w016') && <Headline text="THAT SWORD?" at={at('w016')} size={110} y={150} />}
        {f > at('w017') && <Headline text={<>NOT BUILT FOR <span style={{color: C.red}}>STABBING?</span></>} at={at('w017')} size={110} y={780} />}
        {f > at('w018') && <Label text="OPEN QUESTION · WE'LL COME BACK TO IT" at={at('w018')} color={C.amber} />}
      </>
    }>
      <Deep k={0.6} />
      <Swordfish x={1150} y={540} w={1500} phase={2} />
    </Shot>
  );
};

/* ===== SECTION 2: the file ===== */
export const B26: React.FC = () => {
  const {f} = useShot();
  const PX = 160;
  return (
    <Shot cam={{s: [1.05, 1.0]}} over={<Label text="SIZE CHECK" at={6} />}>
      <Blue />
      <div style={{position: 'absolute', left: 0, top: 900, width: 1920, height: 2, background: 'rgba(255,255,255,0.2)'}} />
      <Swordfish x={900} y={760} w={4.4 * PX * 1.0} phase={3} />
      <Human x={1550} y={900} h={1.75 * PX} />
      <div style={{position: 'absolute', left: 900 - 2.2 * PX, top: 930, width: 4.4 * PX * appear(f, 10, 20), height: 6, background: C.amber}} />
      <div style={{position: 'absolute', left: 900 - 2.2 * PX, top: 950, fontFamily: MONO, fontSize: 34, color: C.amber, opacity: appear(f, 20)}}>UP TO ~4.5 m</div>
      <Headline text="NOT SMALL." at={8} size={110} y={200} />
    </Shot>
  );
};
export const B27: React.FC = () => {
  const {f, atWord} = useShot();
  const kg = atWord('w027', 'weighed');
  return (
    <Shot cam={{s: [1.0, 1.12], x: [0, -60]}} bg="#020b12" vignette={0.6} over={f > kg ? <Counter to={536} at={kg} len={30} suffix=" KG" size={170} y={600} label="RECORD SWORDFISH · ROD & REEL" color={C.white} /> : null}>
      <MapBase view="pacific" />
      <MapPin view="pacific" lon={-70.15} lat={-20.2} at={atWord('w027', 'chile')} label="IQUIQUE, CHILE" sub="1953" color={C.amber} />
    </Shot>
  );
};
export const B28: React.FC = () => (
  <Shot cam={{s: [1.15, 1.0]}} over={<Counter to={500} at={6} len={30} prefix="" suffix="+ KG" size={190} y={720} color={C.white} label="BIG MARLIN" />}>
    <Blue />
    <Billfish kind="marlin" x={960} y={420} w={1500} phase={4} />
  </Shot>
);
export const B29: React.FC = () => (
  <Shot cam={{s: [1.0, 1.2]}} over={<Headline text={<>ONE MORE <span style={{color: C.amber}}>TRICK.</span></>} at={6} size={120} y={800} />}>
    <Deep k={0.5} />
    <Snow n={70} dim={0.18} />
    <Swordfish x={960} y={460} w={1200} dark={0.55} phase={6} />
  </Shot>
);
export const B30: React.FC = () => {
  const {f, dur} = useShot();
  const d = lerp(f, 0, dur, 0, 500, Easing.inOut(Easing.cubic));
  const k = 1 - d / 600;
  return (
    <Shot cam={{s: [1.0, 1.1]}} over={
      <div style={{position: 'absolute', left: 110, top: 80, fontFamily: MONO}}>
        <div style={{color: C.grey, fontSize: 22, letterSpacing: 4}}>DEPTH</div>
        <div style={{color: C.white, fontSize: 56, fontWeight: 700}}>{Math.round(d)} m</div>
        <div style={{color: '#7fd1ff', fontSize: 30, marginTop: 10}}>WATER {Math.round(24 - d * 0.032)}°C</div>
      </div>
    }>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(20,90,130,${k}) 0%, #01040a 100%)`, backgroundColor: '#01040a'}} />
      <Snow n={80} dim={0.2} />
      <Swordfish x={1000} y={lerp(f, 0, dur, 380, 640)} w={900} rot={-18} dark={1 - k} phase={8} />
    </Shot>
  );
};
export const B31: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b" over={<Headline text={<>COLD EYES ARE <span style={{color: '#7fd1ff'}}>SLOW</span> EYES.</>} at={4} size={100} y={830} />}>
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', left: 340 + i * 760, top: 120, width: 480, height: 480}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: i === 0 ? 'radial-gradient(circle, #0d2c40 0%, #071823 70%)' : 'radial-gradient(circle, #4a2410 0%, #1d0d06 70%)', border: `4px solid ${i === 0 ? '#7fd1ff' : C.amber}`}} />
          <div style={{position: 'absolute', left: 150, top: 150, width: 180, height: 180, borderRadius: '50%', background: '#05080b'}} />
          <div style={{position: 'absolute', width: '100%', top: 500, textAlign: 'center', fontFamily: MONO, fontSize: 34, color: i === 0 ? '#7fd1ff' : C.amber}}>{i === 0 ? 'COLD' : 'WARM'}</div>
        </div>
      ))}
    </Shot>
  );
};
export const B32: React.FC = () => {
  const {f, at} = useShot();
  const org = at('w033');
  const heat = f > org ? 0.5 + 0.5 * Math.sin(f / 6) : 0;
  return (
    <Shot cam={{s: [1.4, 1.6], x: [24, 27]}} over={<>{f > org && <Label text="HEATER ORGAN · MODIFIED EYE MUSCLE" at={org} color={C.amber} />}{f > org + 40 && <Label text="EYES & BRAIN: 10–15 °C ABOVE THE WATER" at={org + 40} y={880} color={C.red} />}</>}>
      <Deep k={0.5} />
      <Swordfish x={1150} y={540} w={1500} phase={9} />
      {f > org && [0, 1, 2].map((k) => {
        const t = ((f - org + k * 12) % 36) / 36;
        return <div key={k} style={{position: 'absolute', left: 985 - 70 * t, top: 530 - 70 * t, width: 140 * t, height: 140 * t, borderRadius: '50%', border: `4px solid rgba(255,150,40,${0.8 * (1 - t)})`}} />;
      })}
      <div style={{position: 'absolute', left: 950, top: 505, width: 70, height: 50, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,160,40,${0.4 + 0.6 * heat}), rgba(255,80,20,0))`}} />
    </Shot>
  );
};
export const B34: React.FC = () => {
  const {f} = useShot();
  const dot = (i: number) => {
    const x = 120 + ((f * 9) % 360);
    const trail = i === 0 ? 6 : 0;
    return (
      <div style={{position: 'absolute', left: 260 + i * 760, top: 300, width: 600, height: 420, border: `3px solid ${i === 0 ? '#7fd1ff' : C.amber}`, background: '#03090e', overflow: 'hidden'}}>
        {Array.from({length: trail + 1}, (_, k) => <div key={k} style={{position: 'absolute', left: x - k * 22, top: 190, width: 40, height: 40, borderRadius: 20, background: '#fff', opacity: i === 0 ? 0.5 - k * 0.07 : 1, filter: i === 0 ? 'blur(6px)' : undefined}} />)}
        <div style={{position: 'absolute', left: 20, top: 16, fontFamily: MONO, fontSize: 28, color: i === 0 ? '#7fd1ff' : C.amber}}>{i === 0 ? 'COLD EYE' : 'WARM EYE'}</div>
      </div>
    );
  };
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={<Label text="TRACKS FAST MOTION MANY TIMES BETTER" at={20} color={C.amber} />}>
      {dot(0)}
      {dot(1)}
    </Shot>
  );
};
export const B35: React.FC = () => {
  const {f} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={<Bracket x={1240} y={560} w={420} h={200} at={20} label="MOVEMENT DETECTED" color={C.amber} />}>
      <Deep k={0.3} />
      <Snow n={60} dim={0.12} />
      <Diver2 x={1240} y={560} s={0.8} beamLen={500} />
      <div style={{position: 'absolute', left: 180, top: 440, width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, #ffd27a 0%, #ff8a2a 40%, rgba(255,90,20,0) 70%)', opacity: 0.6 + 0.4 * Math.sin(f / 5), boxShadow: '0 0 40px rgba(255,140,40,0.6)'}} />
      <div style={{opacity: 0.35}}><Swordfish x={420} y={470} w={700} dark={0.8} flip phase={11} /></div>
    </Shot>
  );
};

/* ===== SECTION 3: the speed myth ===== */
export const C36: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.1]}} over={<>{f > at('w037') && <Label text="SAILFISH · 'FASTEST FISH IN THE OCEAN'" at={at('w037')} color={C.amber} />}{f > at('w038') && <Counter to={110} at={at('w038')} len={24} suffix=" KM/H" size={230} y={360} color={C.white} />}</>}>
      <Blue />
      {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: ((rand(i) * 2200 - f * 40) % 2200 + 2200) % 2200 - 140, top: 100 + rand(i + 5) * 880, width: 140 + rand(i + 2) * 200, height: 3, background: 'rgba(200,235,255,0.35)'}} />)}
      <Billfish kind="sail" x={lerp(f, 0, 90, 1500, 900)} y={800} w={900} phase={5} />
    </Shot>
  );
};
export const C39: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.05, 1.0]}} bg="#02070b">
      <div style={{position: 'absolute', left: 0, width: 1920, top: 330, textAlign: 'center', fontFamily: HEAD, fontSize: 260, color: C.white}}>110 KM/H</div>
      <Headline text="A GREAT NUMBER." at={2} size={70} y={180} color={C.grey} />
      {f > at('w040') && <Stamp text="ALMOST CERTAINLY WRONG" at={at('w040') + 8} x={960} y={720} color={C.red} rot={-6} size={84} />}
    </Shot>
  );
};
export const C41: React.FC = () => {
  const {f, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.12]}} over={<>{f > at('w042') && <Headline text={<>MEASURES THE <span style={{color: C.amber}}>LINE</span>, NOT THE FISH.</>} at={at('w042')} size={90} y={860} />}</>}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a1a24, #02070b)'}} />
      <Reel x={700} y={480} r={260} spin={0.9} />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M 760 380 C 1100 330, 1500 360, 1980 300" stroke="#dfe7ea" strokeWidth={4} fill="none" strokeDasharray="30 20" strokeDashoffset={-f * 30} />
      </svg>
      <div style={{position: 'absolute', left: 1240, top: 470, fontFamily: MONO, fontSize: 64, color: C.red, fontWeight: 700}}>{(f / 30).toFixed(2)} s</div>
      <div style={{position: 'absolute', left: 1240, top: 430, fontFamily: MONO, fontSize: 24, color: C.grey, letterSpacing: 4}}>STOPWATCH</div>
    </Shot>
  );
};
export const C43: React.FC = () => {
  const {f, at} = useShot();
  const twitch = 0.5 + 0.5 * Math.sin(f / 2.2);
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b" over={<>{<Label text="2016 STUDY · MUSCLE CONTRACTION TIME" at={6} color={C.amber} />}{f > at('w045') && <Headline text="TAIL SPEED ≤ MUSCLE SPEED" at={at('w045')} size={80} y={860} />}</>}>
      {Array.from({length: 9}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 360 + i * 140, top: 300 + (i % 2) * 20, width: 90, height: 420 * (0.75 + 0.25 * (i % 2 ? twitch : 1 - twitch)), borderRadius: 45, background: 'linear-gradient(180deg, #c4434d, #7a1f27)', boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.3)'}} />
      ))}
    </Shot>
  );
};
export const C46: React.FC = () => {
  const {f, at} = useShot();
  const a = at('w047'), b = at('w048');
  const bar = (v: number, start: number) => (v / 110) * 1300 * lerp(f, start, start + 24, 0, 1, Easing.out(Easing.cubic));
  return (
    <Shot cam={{s: [1.0, 1.05]}} bg="#02070b">
      <Headline text="THEIR ANSWER?" at={2} size={80} y={120} color={C.grey} />
      {f > a && <div style={{position: 'absolute', left: 0, width: 1920, top: 260, textAlign: 'center', fontFamily: HEAD, fontSize: 150, color: C.white, opacity: appear(f, a)}}>≈ 8 m/s</div>}
      <div style={{position: 'absolute', left: 260, top: 560, fontFamily: HEAD, fontSize: 48, color: C.grey}}>THE LEGEND</div>
      <div style={{position: 'absolute', left: 260, top: 620, height: 50, width: bar(110, 6), background: '#4a5560'}} />
      <div style={{position: 'absolute', left: 280 + bar(110, 6), top: 620, fontFamily: HEAD, fontSize: 48, color: C.grey}}>110</div>
      {f > b && <>
        <div style={{position: 'absolute', left: 260, top: 720, fontFamily: HEAD, fontSize: 48, color: C.sonar}}>THE MEASUREMENT</div>
        <div style={{position: 'absolute', left: 260, top: 780, height: 50, width: bar(30, b), background: C.sonar}} />
        <div style={{position: 'absolute', left: 280 + bar(30, b), top: 780, fontFamily: HEAD, fontSize: 48, color: C.white}}>≈30 KM/H</div>
      </>}
    </Shot>
  );
};
export const C49: React.FC = () => {
  const {f, at} = useShot();
  const push = at('w050'), tear = at('w051'), lim = at('w052');
  const spd = f < push ? 8 : lerp(f, push, push + 60, 8, 16);
  const bub = spd > 11;
  const fray = f > tear ? lerp(f, tear, tear + 50, 0, 1) : 0;
  return (
    <Shot cam={{s: [1.3, 1.5], x: [-300, -360]}} over={
      <>
        <div style={{position: 'absolute', right: 120, top: 80, fontFamily: MONO, textAlign: 'right'}}>
          <div style={{color: C.grey, fontSize: 22, letterSpacing: 4}}>SPEED</div>
          <div style={{color: bub ? C.red : C.white, fontSize: 60, fontWeight: 700}}>{spd.toFixed(1)} m/s</div>
          {bub && <div style={{color: C.red, fontSize: 26, opacity: Math.floor(f / 5) % 2 ? 1 : 0.3}}>▲ CAVITATION</div>}
        </div>
        {f > lim && <Headline text={<>THE OCEAN HAS A <span style={{color: C.red}}>SPEED LIMIT.</span></>} at={lim} size={90} y={860} />}
      </>
    }>
      <Blue />
      <Billfish kind="sail" x={1100} y={520} w={1500} phase={3} />
      {bub && Array.from({length: 40}, (_, i) => {
        const t = ((f * 0.04 + rand(i)) % 1);
        return <div key={i} style={{position: 'absolute', left: 1500 + rand(i + 2) * 260 + t * 120, top: 470 + rand(i + 3) * 220, width: 10 + rand(i) * 14, height: 10 + rand(i) * 14, borderRadius: '50%', border: '2px solid rgba(230,250,255,0.8)', opacity: 1 - t}} />;
      })}
      {fray > 0 && <div style={{position: 'absolute', left: 1640, top: 450, width: 220, height: 300, background: `radial-gradient(ellipse, rgba(255,60,60,${0.5 * fray}), transparent 70%)`}} />}
    </Shot>
  );
};
export const C53: React.FC = () => {
  const {f, at} = useShot();
  const front = at('w054');
  return (
    <Shot cam={{s: [1.0, 1.0]}} over={f > front ? <Bracket x={480} y={540} w={420} h={160} at={front} label="THE FRONT" color={C.red} /> : null}>
      <Blue />
      <Snow n={80} dim={0.2} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${lerp(f, 0, front, 0.7, 1.0)})`}}>
        <Swordfish x={lerp(f, 0, front + 20, 1700, 1100)} y={540} w={1500} phase={1} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 80, fontFamily: MONO, fontSize: 56, color: C.white, fontWeight: 700}}>~30 KM/H</div>
    </Shot>
  );
};

/* ===== SECTION 4: what the sword is for ===== */
export const D55: React.FC = () => (
  <Shot cam={{s: [1.1, 1.0]}} bg="#05070d">
    <div style={{opacity: 0.3}}><Swordfish x={960} y={560} w={1700} dark={0.4} /></div>
    <Headline text={<>WHAT IS THE SWORD <span style={{color: C.amber}}>FOR?</span></>} at={2} size={130} y={440} />
  </Shot>
);
export const D56: React.FC = () => {
  const {f, atWord, at} = useShot();
  return (
    <Shot cam={{s: [1.0, 1.15], x: [0, -120], y: [0, 60]}} bg="#020b12" vignette={0.6} over={<>{f > atWord('w056', 'high') && <Label text="HIGH-SPEED CAMERAS · 2014" at={atWord('w056', 'high')} color={C.red} />}{f > at('w057') && <Headline text="WHAT THEY SAW SURPRISED THEM." at={at('w057')} size={70} y={860} />}</>}>
      <MapBase view="atlantic" />
      <MapPin view="atlantic" lon={-86.85} lat={21.16} at={atWord('w056', 'canc')} label="CANCÚN" sub="SAILFISH vs SARDINES" color={C.amber} />
    </Shot>
  );
};
export const D58: React.FC = () => {
  const {f, at} = useShot();
  const slide = at('w059');
  const bx = f < slide ? 300 : lerp(f, slide, slide + 120, 300, 640, Easing.inOut(Easing.sin));
  return (
    <Shot cam={{s: [1.0, 1.15]}} over={<>{<Label text="NO CHARGE. NO STAB." at={8} />}{f > slide + 20 && <Label text="SCHOOL: CALM" at={slide + 20} y={880} color={C.sonar} />}</>}>
      <Blue />
      <Sardines cx={1250} cy={540} n={240} rx={420} ry={240} />
      <Billfish kind="sail" x={bx} y={560} w={1000} flip phase={2} />
    </Shot>
  );
};
export const D60: React.FC = () => {
  const {f, at} = useShot();
  const slash = 8;
  const swing = f > slash ? Math.sin(Math.min(1, (f - slash) / 10) * Math.PI) * 24 : 0;
  return (
    <Shot cam={{s: [1.15, 1.25], shake: [{at: slash + 4, amp: 0.5, len: 12}]}} over={<>{f > at('w061') && <Label text="SIDEWAYS SLASH · OR A QUICK TAP" at={at('w061')} color={C.red} />}</>}>
      <Blue />
      <Sardines cx={1250} cy={540} n={240} rx={420} ry={240} scatter={f > slash ? lerp(f, slash, slash + 30, 0, 0.6) : 0} hit={f > slash ? 0.12 : 0} />
      <Billfish kind="sail" x={640} y={560} w={1000} flip rot={-swing} phase={2} />
    </Shot>
  );
};
export const D62: React.FC = () => {
  const {f, at} = useShot();
  const rest = at('w063');
  return (
    <Shot cam={{s: [1.0, 1.08]}} bg="#02070b" over={f > rest ? <Label text="INJURED → THE SCHOOL FALLS APART" at={rest} color={C.amber} /> : null}>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 140, textAlign: 'center', fontFamily: HEAD, fontSize: 150, color: C.white}}>1 IN 10</div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 320, textAlign: 'center', fontFamily: MONO, fontSize: 30, color: C.grey, letterSpacing: 4}}>SLASHES THAT CAUGHT A FISH OUTRIGHT</div>
      {Array.from({length: 10}, (_, i) => <div key={i} style={{position: 'absolute', left: 360 + i * 125, top: 480, width: 90, height: 30, borderRadius: '50% 40% 40% 50%', background: i === 0 ? C.sonar : f > rest ? '#ff6a5a' : '#4a5560', opacity: appear(f, 4 + i * 2), boxShadow: i === 0 ? `0 0 16px ${C.sonar}` : undefined}} />)}
      {f > rest && <Sardines cx={960} cy={800} n={120} rx={600} ry={120} scatter={lerp(f, rest, rest + 90, 0, 0.9)} hit={0.4} />}
    </Shot>
  );
};
export const D64: React.FC = () => {
  const {f, at} = useShot();
  const sw = at('w065');
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b" over={f > sw ? <Label text="SWORDFISH: SCIENTISTS THINK SIMILAR" at={sw} color={C.amber} /> : null}>
      <div style={{position: 'absolute', left: 240, top: 300, width: 640, height: 420, border: '3px solid #4a5560', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontSize: 100, color: C.grey, marginTop: 60}}>SPEAR</div>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.red, opacity: appear(f, 10)}}>✕</div>
      </div>
      <div style={{position: 'absolute', left: 1040, top: 300, width: 640, height: 420, border: `3px solid ${C.sonar}`, textAlign: 'center', background: 'rgba(61,255,154,0.06)'}}>
        <div style={{fontFamily: HEAD, fontSize: 100, color: C.white, marginTop: 60}}>SWORD</div>
        <div style={{fontFamily: HEAD, fontSize: 150, color: C.sonar, opacity: appear(f, 18)}}>✓</div>
      </div>
    </Shot>
  );
};
export const D66: React.FC = () => {
  const {f, at, atWord} = useShot();
  const three = at('w068');
  const it: [string, string][] = [['hooked', 'HOOKED'], ['speared', 'SPEARED'], ['flying', 'AIRBORNE']];
  return (
    <Shot cam={{s: [1.0, 1.06]}} bg="#02070b">
      {f < three && <Headline text={<>USUALLY <span style={{color: C.sonar}}>NOT HUNTING.</span></>} at={4} size={120} y={420} />}
      {f >= three && it.map(([w, t], i) => {
        const a = atWord('w068', w);
        return <div key={t} style={{position: 'absolute', left: 200 + i * 520, top: 440, width: 480, textAlign: 'center', fontFamily: HEAD, fontSize: 110, color: [C.amber, C.red, '#7fd1ff'][i], opacity: appear(f, a), transform: `scale(${0.6 + 0.4 * pop(f, a)})`}}>{t}</div>;
      })}
    </Shot>
  );
};
