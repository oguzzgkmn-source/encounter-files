import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {Hud} from '../components/Hud';
import {C, HEAD, MONO, rand} from '../theme';

const R = 400;
export const ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = (f * 4) % 360;
  const visible = Math.floor(interpolate(f, [20, 140], [0, 38], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const contacts = Array.from({length: 38}, (_, i) => {
    const ang = rand(i) * 360;
    const r0 = 0.55 + rand(i + 50) * 0.42;
    const r = r0 - interpolate(f, [0, 300], [0, 0.32 * r0]);
    const x = Math.cos((ang * Math.PI) / 180) * r * R;
    const y = Math.sin((ang * Math.PI) / 180) * r * R;
    const d = (sweep - ang + 360) % 360; // degrees since sweep passed
    const bright = interpolate(d, [0, 200], [1, 0.25], {extrapolateRight: 'clamp'});
    return i < visible ? (
      <div key={i} style={{position: 'absolute', left: R + x - 7, top: R + y - 7, width: 14, height: 14, borderRadius: 7, background: C.red, opacity: bright, boxShadow: `0 0 ${14 * bright}px ${C.red}`}} />
    ) : null;
  });
  const textIn = interpolate(f, [150, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Atmosphere>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: R * 2, height: R * 2, borderRadius: R, border: `2px solid ${C.sonar}`, overflow: 'hidden', background: 'rgba(3,20,14,0.55)', marginTop: 40}}>
          {[0.25, 0.5, 0.75].map((k) => (
            <div key={k} style={{position: 'absolute', left: R - R * k, top: R - R * k, width: R * 2 * k, height: R * 2 * k, borderRadius: '50%', border: `1px solid ${C.sonarDim}`}} />
          ))}
          <div style={{position: 'absolute', left: R, top: 0, width: 1, height: R * 2, background: C.sonarDim}} />
          <div style={{position: 'absolute', top: R, left: 0, height: 1, width: R * 2, background: C.sonarDim}} />
          <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${sweep + 90 - 60}deg, transparent 0deg, rgba(61,255,154,0.0) 0deg, rgba(61,255,154,0.35) 60deg, transparent 60deg)`}} />
          {contacts}
          <div style={{position: 'absolute', left: R - 9, top: R - 9, width: 18, height: 18, background: C.sonar, transform: 'rotate(45deg)'}} />
          <div style={{position: 'absolute', left: R + 18, top: R - 12, fontFamily: MONO, color: C.sonar, fontSize: 20, fontWeight: 700}}>YOU</div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 120, top: 380, fontFamily: MONO, textAlign: 'right'}}>
        <div style={{color: C.grey, fontSize: 18, letterSpacing: 3}}>CONTACTS</div>
        <div style={{color: C.red, fontSize: 72, fontWeight: 700}}>{String(visible).padStart(2, '0')}</div>
        <div style={{color: C.grey, fontSize: 18, letterSpacing: 3, marginTop: 20}}>CLOSING</div>
        <div style={{color: C.white, fontSize: 40, fontWeight: 700}}>{interpolate(f, [0, 300], [1.4, 0.9]).toFixed(1)} m/s</div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 400, width: 420, fontFamily: HEAD, fontSize: 84, lineHeight: 1.0, color: C.white, opacity: textIn, transform: `translateY(${(1 - textIn) * 20}px)`}}>
        THEY'RE <span style={{color: C.red}}>ALL</span> AROUND YOU
      </div>
      <Hud depth={interpolate(f, [0, 300], [31.0, 34.6])} o2={64} time="22:41:07" status="MULTIPLE CONTACTS — UNIDENTIFIED" statusColor={C.red} />
    </Atmosphere>
  );
};
