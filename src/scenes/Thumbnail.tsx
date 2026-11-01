import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Diver} from '../components/Diver';
import {Squid} from '../components/Squid';
import {C, HEAD, rand} from '../theme';

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 62% 55%, #0b2a20 0%, #02060a 70%)'}}>
    {[0.3, 0.55, 0.8].map((k) => (
      <div key={k} style={{position: 'absolute', left: 800 - 520 * k, top: 400 - 520 * k, width: 1040 * k, height: 1040 * k, borderRadius: '50%', border: '2px solid rgba(61,255,154,0.35)'}} />
    ))}
    {Array.from({length: 7}, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const r = 230 + rand(i) * 120;
      return (
        <div key={i} style={{position: 'absolute', left: 800 + Math.cos(a) * r - 150, top: 400 + Math.sin(a) * r * 0.8 - 50, transform: `rotate(${(a * 180) / Math.PI}deg)`, opacity: 0.95}}>
          <Squid width={300} color={C.red} glow={18} />
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 735, top: 385}}><Diver width={130} light /></div>
    <div style={{position: 'absolute', left: 50, top: 40, fontFamily: HEAD, fontSize: 118, lineHeight: 0.95, color: '#fff', textShadow: '0 6px 24px #000', width: 520}}>
      THEY'RE <span style={{color: C.red}}>ALL</span> AROUND YOU
    </div>
  </AbsoluteFill>
);
