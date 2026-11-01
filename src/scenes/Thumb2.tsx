import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Diver2, Squid2} from '../opening/kit';
import {C, HEAD, rand} from '../theme';

/** Thumbnail B: giant red squid lunging at a tiny diver whose torch lights it up. */
export const Thumb2: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 55%, #2a0507 0%, #050102 70%)', overflow: 'hidden'}}>
    {Array.from({length: 9}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: 0, top: 0, opacity: 0.3}}>
        <Squid2 x={80 + rand(i) * 1100} y={260 + rand(i + 4) * 440} w={140 + rand(i + 2) * 110} red={1} rot={(rand(i + 7) - 0.5) * 50} flip />
      </div>
    ))}
    <div style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 0 40px rgba(255,30,30,0.85))'}}>
      <Squid2 x={560} y={500} w={1080} red={1} rot={-12} flip />
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'scaleX(-1)', transformOrigin: '1160px 0'}}>
      <Diver2 x={1160} y={330} s={0.5} beamLen={360} beamHalf={0.3} />
    </div>
    <div style={{position: 'absolute', left: 50, top: 30, fontFamily: HEAD, fontSize: 150, lineHeight: 0.9, color: '#fff', textShadow: '0 6px 24px #000'}}>
      THE <span style={{color: C.red}}>RED</span> DEVIL
    </div>
  </AbsoluteFill>
);
