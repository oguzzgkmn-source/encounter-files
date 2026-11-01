import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {Squid} from '../components/Squid';
import {C, HEAD, MONO} from '../theme';

const options = ['SWIM FOR THE SURFACE', 'STAY PERFECTLY STILL', 'TURN OFF YOUR LIGHT', 'FIGHT BACK'];

export const YourMove: React.FC = () => {
  const f = useCurrentFrame();
  const pick = f > 150 ? 2 : -1;
  const count = Math.max(0, 3 - Math.floor(f / 40));
  return (
    <Atmosphere tint="#1a0608">
      {[[-200, 120, 0.9, 0], [1300, 80, 0.7, 20], [-150, 760, 0.8, 40], [1350, 720, 1, 60]].map(([x, y, s, ph], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, opacity: 0.35, transform: `scaleX(${i % 2 ? 1 : -1})`}}>
          <Squid width={800 * s} color={C.red} glow={25} phase={ph} />
        </div>
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: MONO, color: C.red, fontSize: 24, letterSpacing: 8}}>DECIDE IN {count}</div>
        <div style={{fontFamily: HEAD, color: C.white, fontSize: 130, lineHeight: 1.05, marginBottom: 40}}>YOUR MOVE</div>
        {options.map((o, i) => {
          const inn = interpolate(f, [10 + i * 8, 25 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const sel = i === pick;
          return (
            <div key={o} style={{width: 760, fontFamily: MONO, fontSize: 36, padding: '16px 28px', marginBottom: 14, color: sel ? C.bg : C.white, background: sel ? C.red : 'rgba(0,0,0,0.55)', border: `2px solid ${sel ? C.red : 'rgba(255,255,255,0.25)'}`, opacity: inn, transform: `translateX(${(1 - inn) * -40}px)`}}>
              {i + 1}. {o}
            </div>
          );
        })}
      </AbsoluteFill>
    </Atmosphere>
  );
};
