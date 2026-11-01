import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, rand} from '../theme';

// deep water gradient + drifting particles ("marine snow") + vignette + scanlines
export const Atmosphere: React.FC<{tint?: string; children?: React.ReactNode}> = ({tint = C.deep, children}) => {
  const f = useCurrentFrame();
  const particles = Array.from({length: 70}, (_, i) => {
    const x = rand(i) * 1920;
    const y = (rand(i + 100) * 1080 + f * (0.3 + rand(i + 200) * 0.6)) % 1080;
    const s = 1 + rand(i + 300) * 2.5;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: 'rgba(200,230,240,0.35)'}} />;
  });
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${tint} 0%, ${C.bg} 75%)`}}>
      {particles}
      {children}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
