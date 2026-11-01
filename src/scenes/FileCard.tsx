import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {C, HEAD, MONO} from '../theme';

const rows: [string, string][] = [
  ['SUBJECT', 'Dosidicus gigas'],
  ['COMMON NAME', 'Humboldt squid'],
  ['LOCAL NAME', '"Diablo rojo" — red devil'],
  ['GROUP SIZE', 'Hundreds. Sometimes more.'],
  ['DAYTIME DEPTH', 'Hundreds of metres down'],
  ['NIGHT', 'Rises to the surface'],
];

export const FileCard: React.FC = () => {
  const f = useCurrentFrame();
  const chars = Math.floor(f * 2.2);
  let budget = chars;
  const pulse = 1 + Math.sin(f / 6) * 0.15;
  return (
    <Atmosphere>
      {/* map panel */}
      <div style={{position: 'absolute', left: 110, top: 150, width: 760, height: 780, border: `2px solid ${C.sonarDim}`, backgroundImage: `linear-gradient(${C.sonarDim} 1px, transparent 1px), linear-gradient(90deg, ${C.sonarDim} 1px, transparent 1px)`, backgroundSize: '76px 78px'}}>
        <div style={{position: 'absolute', left: 380 - 60 * pulse, top: 390 - 60 * pulse, width: 120 * pulse, height: 120 * pulse, borderRadius: '50%', border: `2px solid ${C.red}`, opacity: 2 - pulse * 1.3}} />
        <div style={{position: 'absolute', left: 370, top: 380, width: 20, height: 20, borderRadius: 10, background: C.red, boxShadow: `0 0 20px ${C.red}`}} />
        <div style={{position: 'absolute', left: 0, top: 389, width: 760, height: 1, background: 'rgba(255,59,59,0.4)'}} />
        <div style={{position: 'absolute', top: 0, left: 379, height: 780, width: 1, background: 'rgba(255,59,59,0.4)'}} />
        <div style={{position: 'absolute', left: 405, top: 410, fontFamily: MONO, color: C.white, fontSize: 22}}>27.34°N 112.27°W</div>
        <div style={{position: 'absolute', left: 405, top: 442, fontFamily: MONO, color: C.grey, fontSize: 18}}>GULF OF CALIFORNIA</div>
        <div style={{position: 'absolute', left: 20, bottom: 16, fontFamily: MONO, color: C.grey, fontSize: 16, letterSpacing: 3}}>FIELD MAP // NIGHT DIVE ZONE</div>
      </div>
      {/* file panel */}
      <div style={{position: 'absolute', left: 940, top: 150, width: 870}}>
        <div style={{fontFamily: MONO, color: C.amber, fontSize: 22, letterSpacing: 6}}>ENCOUNTER FILE</div>
        <div style={{fontFamily: HEAD, color: C.white, fontSize: 120, lineHeight: 1}}>#001</div>
        <div style={{height: 3, width: 870, background: C.amber, margin: '20px 0 30px'}} />
        {rows.map(([k, v]) => {
          const shown = v.slice(0, Math.max(0, budget));
          budget -= v.length + 6;
          return (
            <div key={k} style={{display: 'flex', fontFamily: MONO, fontSize: 30, marginBottom: 22}}>
              <div style={{width: 300, color: C.grey}}>{k}</div>
              <div style={{color: C.white, fontWeight: 700}}>{shown}{shown.length < v.length && shown.length > 0 ? '▌' : ''}</div>
            </div>
          );
        })}
        <div style={{marginTop: 40, fontFamily: MONO, color: C.grey, fontSize: 20, letterSpacing: 3}}>THREAT LEVEL</div>
        <div style={{display: 'flex', gap: 8, marginTop: 10}}>
          {Array.from({length: 10}, (_, i) => (
            <div key={i} style={{width: 70, height: 26, background: i < interpolate(f, [120, 170], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) ? (i > 5 ? C.red : C.amber) : 'rgba(255,255,255,0.08)'}} />
          ))}
        </div>
      </div>
    </Atmosphere>
  );
};
