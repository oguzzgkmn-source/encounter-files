import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {Squid} from '../components/Squid';
import {C, HEAD, MONO} from '../theme';

const Callout: React.FC<{x: number; y: number; tx: number; ty: number; title: string; sub: string; at: number}> = ({x, y, tx, ty, title, sub, at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <circle cx={x} cy={y} r={8} fill="none" stroke={C.amber} strokeWidth={3} opacity={p} />
        <line x1={x} y1={y} x2={x + (tx - x) * p} y2={y + (ty - y) * p} stroke={C.amber} strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: tx - 10, top: ty - (ty < y ? 70 : -10), opacity: p, fontFamily: MONO}}>
        <div style={{color: C.amber, fontSize: 26, fontWeight: 700}}>{title}</div>
        <div style={{color: C.white, fontSize: 22, width: 600}}>{sub}</div>
      </div>
    </>
  );
};

export const Anatomy: React.FC = () => {
  const f = useCurrentFrame();
  const flash = Math.floor(f / 8) % 6 === 0 && f > 160;
  return (
    <Atmosphere>
      <div style={{position: 'absolute', left: 110, top: 90, fontFamily: HEAD, color: C.white, fontSize: 64}}>BUILT TO GRAB</div>
      <div style={{position: 'absolute', left: 300, top: 360}}>
        <Squid width={1300} color={flash ? C.red : '#b9c7cc'} glow={flash ? 30 : 0} />
      </div>
      <Callout x={420} y={500} tx={260} ty={300} title="SUCKERS" sub="Each ringed with tiny, sharp teeth" at={30} />
      <Callout x={600} y={555} tx={520} ty={790} title="BEAK" sub="Hard, hooked — like a parrot's" at={70} />
      <Callout x={1300} y={520} tx={1240} ty={300} title="SKIN" sub="Flashes red and white in a blink" at={110} />
      {/* size note (true-to-scale comparison gets its own scene) */}
      <div style={{position: 'absolute', left: 1240, top: 800, fontFamily: MONO, opacity: interpolate(f, [150, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <div style={{color: C.grey, fontSize: 20, letterSpacing: 3}}>BODY LENGTH</div>
        <div style={{color: C.white, fontSize: 44, fontWeight: 700}}>up to ~1.5 m</div>
      </div>
    </Atmosphere>
  );
};
