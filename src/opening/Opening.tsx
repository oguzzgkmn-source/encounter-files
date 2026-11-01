import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timings from '../opening_timings.json';
import {C, HEAD, MONO, rand} from '../theme';
import {Bracket, Camera, Diver2, FPS, Grain, Snow, Squid2, Tag, Vignette, lerp} from './kit';

const T: Record<string, {s: number; e: number}> = {};
timings.lines.forEach((l: any) => (T[l.id] = {s: Math.round(l.start * FPS), e: Math.round(l.end * FPS)}));
export const OPENING_FRAMES = Math.round((timings.duration + 1.4) * FPS);

const Water: React.FC<{top?: string; bottom?: string}> = ({top = '#0a2233', bottom = '#01060a'}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 80%)`}} />
);

/* A — looking up at moonlit surface, diver descends, camera tilts down */
const ShotA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#01060a', overflow: 'hidden'}}>
      <Camera y={lerp(f, 0, 87, 420, 40)} scale={lerp(f, 0, 87, 1.05, 1.15)}>
        <div style={{position: 'absolute', left: -200, top: -600, width: 2320, height: 2000, background: 'linear-gradient(180deg, #2f6f8c 0%, #0c2c40 22%, #031019 55%, #01060a 80%)'}} />
        {Array.from({length: 7}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 300 + i * 230 + Math.sin(f / 25 + i) * 30, top: -600, width: 90 + rand(i) * 80, height: 1500, background: 'linear-gradient(180deg, rgba(190,230,255,0.22), transparent)', transform: `rotate(${-14 + i * 4}deg)`, transformOrigin: 'top', filter: 'blur(14px)', opacity: 0.5 + 0.5 * Math.sin(f / 13 + i * 2)}} />
        ))}
        {Array.from({length: 14}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: (i * 160 + f * 2 * (i % 2 ? 1 : -1)) % 2200 - 150, top: -560 + (i % 3) * 18, width: 260, height: 26, borderRadius: '50%', background: 'rgba(220,245,255,0.35)', filter: 'blur(6px)'}} />
        ))}
        <div style={{position: 'absolute', left: 1180, top: -590, width: 220, height: 70, borderRadius: '50%', background: 'rgba(255,255,240,0.6)', filter: 'blur(18px)'}} />
        <Snow n={70} dim={0.35} />
        <Diver2 x={lerp(f, 0, 87, 760, 930)} y={lerp(f, 0, 87, 120, 430)} s={0.75} silhouette tilt={38} />
      </Camera>
      <Vignette />
      <Tag text="SEA OF CORTEZ // MEXICO" at={8} y={960} />
    </AbsoluteFill>
  );
};

/* B — torch is the only light; push-in, moonlight dies */
const ShotB: React.FC = () => {
  const f = useCurrentFrame();
  const moon = lerp(f, 60, 130, 1, 0);
  const s = 1.1, dx = 640, dy = 560;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Water top="#03101a" bottom="#000305" />
      <Camera scale={lerp(f, 0, 147, 1, 1.2, Easing.linear)} x={lerp(f, 0, 147, 0, -90, Easing.linear)}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,100,130,0.45), transparent 45%)', opacity: moon}} />
        <Snow n={110} dim={0.12 + 0.2 * moon} beam={{ox: dx + 205 * s, oy: dy + 14 * s, len: 1300, half: 0.24}} />
        <Diver2 x={dx} y={dy} s={s} beamLen={1300} beamOn={lerp(f, 0, 10, 0.4, 1)} />
      </Camera>
      <Vignette strength={0.9} />
      <div style={{position: 'absolute', left: 110, top: 70, fontFamily: MONO}}>
        <div style={{color: C.grey, fontSize: 18, letterSpacing: 3}}>DEPTH</div>
        <div style={{color: C.white, fontSize: 40, fontWeight: 700}}>{lerp(f, 0, 70, 9.4, 12.0).toFixed(1)} m</div>
      </div>
      <Tag text="LIGHT SOURCES: 1" at={95} />
    </AbsoluteFill>
  );
};

/* C — snap zoom into the beam, squid darts through */
const ShotC: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.1, dx = 640, dy = 560;
  const z = lerp(f, 12, 22, 0, 1, Easing.out(Easing.cubic));
  const sqX = lerp(f, 24, 40, 2150, 1500, Easing.out(Easing.cubic));
  const sqY = lerp(f, 24, 40, 900, 600, Easing.out(Easing.cubic));
  const moving = f > 24 && f < 38;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Water top="#03101a" bottom="#000305" />
      <Camera scale={1.2 + z * 0.55} x={-90 - z * 560} y={-z * 30} shake={lerp(f, 26, 40, 0.6, 0)}>
        <Snow n={110} dim={0.12} beam={{ox: dx + 205 * s, oy: dy + 14 * s, len: 1300, half: 0.24}} />
        <Diver2 x={dx} y={dy} s={s} beamLen={1300} />
        {f > 24 && <Squid2 x={sqX} y={sqY} w={380} lit={0.85} rot={-22} trail={moving ? 60 : 0} phase={5} />}
      </Camera>
      {f > 38 && <Bracket x={1255} y={615} w={640} h={320} at={38} label="CONTACT" />}
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

/* D — "One shape." close, half-lit */
const ShotD: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000305', overflow: 'hidden'}}>
      <Camera scale={lerp(f, 0, 36, 1.0, 1.08, Easing.linear)}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 0% 50%, rgba(255,246,216,0.35) 0%, transparent 55%)'}} />
        <Snow n={60} dim={0.2} beam={{ox: -200, oy: 540, len: 1500, half: 0.5}} seed={33} />
        <Squid2 x={1150} y={540} w={1000} lit={0.55} phase={12} />
      </Camera>
      <Bracket x={1150} y={540} w={1100} h={380} at={4} label="01" />
      <Vignette strength={0.95} />
    </AbsoluteFill>
  );
};

/* E — "Then ten." wider, ten at the edge of the light */
const TEN = [[1250, 330], [1500, 420], [1700, 300], [1380, 760], [1640, 690], [1850, 560], [1120, 880], [1900, 850], [1050, 200], [1560, 160]];
const ShotE: React.FC = () => {
  const f = useCurrentFrame();
  const s = 0.62, dx = 330, dy = 560;
  return (
    <AbsoluteFill style={{background: '#000305', overflow: 'hidden'}}>
      <Camera scale={lerp(f, 0, 36, 1.12, 1.0)}>
        <Snow n={90} dim={0.1} beam={{ox: dx + 205 * s, oy: dy + 14 * s, len: 1500, half: 0.24}} seed={70} />
        <Diver2 x={dx} y={dy} s={s} beamLen={1500} />
        {TEN.map(([x, y], i) => (
          <Squid2 key={i} x={x + Math.sin(f / 10 + i) * 12} y={y} w={210 + (i % 3) * 40} lit={0.18 + 0.12 * (i % 3)} rot={(i % 2 ? 1 : -1) * 12} flip={i % 4 === 0} phase={i * 9} />
        ))}
      </Camera>
      {TEN.map(([x, y], i) => <Bracket key={i} x={x} y={y} w={240} h={110} at={2 + i * 2} />)}
      <div style={{position: 'absolute', right: 110, top: 70, fontFamily: MONO, textAlign: 'right'}}>
        <div style={{color: C.grey, fontSize: 18, letterSpacing: 3}}>CONTACTS</div>
        <div style={{color: C.red, fontSize: 64, fontWeight: 700}}>{String(Math.min(10, Math.floor(f / 2))).padStart(2, '0')}</div>
      </div>
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

/* F — sonar floods with contacts */
const ShotF: React.FC = () => {
  const f = useCurrentFrame();
  const R = 430;
  const sweep = (f * 9) % 360;
  const n = Math.floor(10 * Math.pow(1.075, f));
  const open = lerp(f, 0, 8, 0, 100, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#010806', overflow: 'hidden', clipPath: `circle(${open * 1.2}% at 50% 50%)`}}>
      <Camera scale={lerp(f, 0, 60, 1.0, 1.18, Easing.linear)} rot={lerp(f, 0, 60, 0, 12, Easing.linear)}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: 2 * R, height: 2 * R, borderRadius: R, border: `2px solid ${C.sonar}`, overflow: 'hidden', background: 'rgba(3,22,14,0.8)'}}>
            {[0.25, 0.5, 0.75].map((k) => <div key={k} style={{position: 'absolute', left: R - R * k, top: R - R * k, width: 2 * R * k, height: 2 * R * k, borderRadius: '50%', border: `1px solid ${C.sonarDim}`}} />)}
            <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${sweep}deg, transparent 0deg, rgba(61,255,154,0.4) 50deg, transparent 50deg)`}} />
            {Array.from({length: Math.min(n, 400)}, (_, i) => {
              const a = rand(i * 3) * Math.PI * 2, r = (0.15 + 0.82 * Math.sqrt(rand(i * 3 + 1))) * R;
              return <div key={i} style={{position: 'absolute', left: R + Math.cos(a) * r - 5, top: R + Math.sin(a) * r - 5, width: 10, height: 10, borderRadius: 5, background: C.red, boxShadow: `0 0 10px ${C.red}`}} />;
            })}
            <div style={{position: 'absolute', left: R - 10, top: R - 10, width: 20, height: 20, background: C.sonar, transform: 'rotate(45deg)'}} />
          </div>
        </AbsoluteFill>
      </Camera>
      <div style={{position: 'absolute', right: 110, top: 70, fontFamily: MONO, textAlign: 'right'}}>
        <div style={{color: C.grey, fontSize: 18, letterSpacing: 3}}>CONTACTS</div>
        <div style={{color: C.red, fontSize: 64, fontWeight: 700}}>{f < 40 ? String(n).padStart(2, '0') : f % 4 < 2 ? 'ERR' : '???'}</div>
      </div>
      <Tag text="SONAR SATURATED" at={30} color={C.red} />
    </AbsoluteFill>
  );
};

/* G — surrounded; the red wave */
const RING = Array.from({length: 26}, (_, i) => {
  const a = (i / 26) * Math.PI * 2 + rand(i) * 0.3;
  const r = 380 + rand(i + 9) * 420;
  return {a, r, w: 150 + rand(i + 3) * 120};
});
const ShotG: React.FC = () => {
  const f = useCurrentFrame();
  const RED = T.s7.e - T.s7.s - 14; // just before "red"
  const cx = 860, cy = 560, s = 0.62;
  const glow = lerp(f, RED, RED + 12, 0, 1);
  return (
    <AbsoluteFill style={{background: '#000305', overflow: 'hidden'}}>
      <Camera scale={lerp(f, 0, 90, 0.95, 1.12, Easing.linear)} shake={f > RED ? lerp(f, RED, RED + 25, 0.9, 0.15) : 0}>
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, rgba(160,10,15,${0.55 * glow}) 0%, rgba(40,0,0,${0.6 * glow}) 45%, transparent 75%)`}} />
        <Snow n={90} dim={0.1} beam={{ox: cx + 205 * s, oy: cy + 14 * s, len: 900, half: 0.24}} seed={90} />
        {RING.map(({a, r, w}, i) => {
          const rr = r - f * 1.6;
          const x = cx + 60 + Math.cos(a) * rr * 1.3, y = cy + Math.sin(a) * rr * 0.75;
          const inBeam = Math.cos(a) > 0.85 && Math.abs(Math.sin(a)) < 0.3;
          const delay = RED + (r - 380) / 70;
          const red = lerp(f, delay, delay + 5, 0, 1) * (0.85 + 0.15 * Math.sin(f * 1.4 + i));
          return <Squid2 key={i} x={x} y={y} w={w} lit={inBeam ? 0.6 : 0.14} red={red} rot={(a * 180) / Math.PI} phase={i * 7} />;
        })}
        <Diver2 x={cx} y={cy} s={s} beamLen={900} />
      </Camera>
      <Vignette strength={0.85} />
      <Tag text="WARNING // CHROMATIC SHIFT" at={RED + 4} color={C.red} />
    </AbsoluteFill>
  );
};

/* H — fishermen above, red devils below */
const ShotH: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Camera scale={lerp(f, 0, 80, 1.08, 1.0, Easing.linear)} x={lerp(f, 0, 80, 40, -40, Easing.linear)}>
        <div style={{position: 'absolute', left: -100, top: -100, width: 2120, height: 520, background: 'linear-gradient(180deg, #02050b, #0a1424)'}} />
        {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: rand(i) * 1920, top: rand(i + 60) * 380, width: 2, height: 2, background: '#fff', opacity: 0.3 + 0.5 * rand(i + 5) * (0.6 + 0.4 * Math.sin(f / 6 + i))}} />)}
        <div style={{position: 'absolute', left: -100, top: 420, width: 2120, height: 800, background: 'linear-gradient(180deg, #071820, #010407 70%)'}} />
        <div style={{position: 'absolute', left: -100, top: 416, width: 2120, height: 4, background: 'rgba(160,200,220,0.35)'}} />
        <svg style={{position: 'absolute', left: 820, top: 330 + Math.sin(f / 12) * 4}} width={420} height={110} viewBox="0 0 420 110">
          <path d="M 10 80 L 410 80 L 370 104 L 40 104 Z" fill="#05080c" />
          <rect x={250} y={30} width={50} height={50} fill="#05080c" />
          <line x1={150} y1={80} x2={150} y2={10} stroke="#05080c" strokeWidth={5} />
          <circle cx={150} cy={12} r={9} fill="#ffd27a" />
        </svg>
        <div style={{position: 'absolute', left: 860, top: 230, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,110,0.45), transparent 70%)'}} />
        <div style={{position: 'absolute', left: 900, top: 430, width: 120, height: 300, background: 'linear-gradient(180deg, rgba(255,200,110,0.25), transparent)', filter: 'blur(10px)'}} />
        {Array.from({length: 16}, (_, i) => (
          <Squid2 key={i} x={(rand(i) * 2000 + f * (2 + rand(i + 4) * 3)) % 2100 - 80} y={560 + rand(i + 2) * 460} w={110 + rand(i + 8) * 90} red={0.75 + 0.25 * Math.sin(f / 4 + i)} lit={0} flip phase={i * 5} />
        ))}
      </Camera>
      <Vignette strength={0.8} />
      <Tag text="GULF OF CALIFORNIA // SQUID FLEET" at={10} color={C.amber} />
    </AbsoluteFill>
  );
};

/* I — title slam */
const ShotI: React.FC = () => {
  const f = useCurrentFrame();
  const two = T.s10.s - T.s9.s;
  const slam = (at: number) => lerp(f, at, at + 7, 1.6, 1, Easing.out(Easing.cubic));
  const flash = Math.max(lerp(f, 0, 6, 0.8, 0), f >= two ? lerp(f, two, two + 6, 0.9, 0) : 0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #2a0406 0%, #050001 70%)', overflow: 'hidden'}}>
      <Camera scale={lerp(f, 0, 170, 1.0, 1.1, Easing.linear)} shake={f >= two ? lerp(f, two, two + 18, 0.8, 0) : lerp(f, 0, 14, 0.6, 0)}>
        <div style={{position: 'absolute', left: 0, top: 0, opacity: 0.25}}>
          <Squid2 x={lerp(f, 0, 170, 1250, 1100, Easing.linear)} y={560} w={1500} red={1} phase={3} />
        </div>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{fontFamily: HEAD, fontSize: 190, color: C.red, letterSpacing: 6, transform: `scale(${slam(0)})`, textShadow: '0 0 40px rgba(255,30,30,0.6)', lineHeight: 1}}>DIABLO ROJO</div>
          <div style={{fontFamily: HEAD, fontSize: 92, color: C.white, letterSpacing: 18, marginTop: 10, opacity: f >= two ? 1 : 0, transform: `scale(${slam(two)})`}}>THE RED DEVIL</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.amber, letterSpacing: 8, marginTop: 50, opacity: lerp(f, two + 30, two + 40, 0, 1)}}>ENCOUNTER FILE #001</div>
        </AbsoluteFill>
      </Camera>
      <AbsoluteFill style={{background: '#ff2a2a', opacity: flash, mixBlendMode: 'screen'}} />
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

const HudOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const corner = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 54, height: 54, borderColor: 'rgba(61,255,154,0.6)', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {corner({left: 40, top: 40, borderTopWidth: 3, borderLeftWidth: 3})}
      {corner({right: 40, top: 40, borderTopWidth: 3, borderRightWidth: 3})}
      {corner({left: 40, bottom: 40, borderBottomWidth: 3, borderLeftWidth: 3})}
      {corner({right: 40, bottom: 40, borderBottomWidth: 3, borderRightWidth: 3})}
      <div style={{position: 'absolute', right: 110, bottom: 80, fontFamily: MONO, fontSize: 22, color: C.white, opacity: 0.8}}>
        <span style={{color: C.red, opacity: Math.floor(f / 15) % 2 ? 1 : 0.3}}>● </span>00:{String(Math.floor(f / 30)).padStart(2, '0')}:{String(Math.floor(((f % 30) / 30) * 100)).padStart(2, '0')}
      </div>
    </AbsoluteFill>
  );
};

export const Opening: React.FC = () => {
  const cuts = [0, T.s2.s, T.s3.s, T.s4.s, T.s5.s, T.s6.s, T.s7.s, T.s7.e + 4, T.s8.s, T.s9.s, OPENING_FRAMES];
  const shots = [ShotA, ShotB, ShotC, ShotD, ShotE, ShotF, ShotG, null, ShotH, ShotI];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((S, i) => (
        <Sequence key={i} from={cuts[i]} durationInFrames={cuts[i + 1] - cuts[i]}>
          {S ? <S /> : <AbsoluteFill style={{background: '#000'}} />}
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={T.s7.e + 4}><HudOverlay /></Sequence>
      <Grain />
      <Audio src={staticFile('audio/opening_vo.wav')} />
      <Audio src={staticFile('audio/opening_sfx.wav')} />
    </AbsoluteFill>
  );
};
