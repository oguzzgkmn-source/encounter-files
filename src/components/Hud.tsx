import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';

const Corner: React.FC<{pos: React.CSSProperties; rot: number}> = ({pos, rot}) => (
  <div style={{position: 'absolute', ...pos, width: 60, height: 60, borderTop: `3px solid ${C.sonar}`, borderLeft: `3px solid ${C.sonar}`, transform: `rotate(${rot}deg)`, opacity: 0.8}} />
);

export const Hud: React.FC<{depth: number; o2: number; time: string; status?: string; statusColor?: string}> = ({depth, o2, time, status, statusColor = C.sonar}) => {
  const f = useCurrentFrame();
  const blink = Math.floor(f / 15) % 2 === 0;
  const label: React.CSSProperties = {fontFamily: MONO, color: C.grey, fontSize: 18, letterSpacing: 3};
  const val: React.CSSProperties = {fontFamily: MONO, color: C.white, fontSize: 34, fontWeight: 700};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Corner pos={{left: 40, top: 40}} rot={0} />
      <Corner pos={{right: 40, top: 40}} rot={90} />
      <Corner pos={{right: 40, bottom: 40}} rot={180} />
      <Corner pos={{left: 40, bottom: 40}} rot={270} />
      <div style={{position: 'absolute', top: 70, left: 110, display: 'flex', gap: 70}}>
        <div><div style={label}>DEPTH</div><div style={val}>{depth.toFixed(1)} m</div></div>
        <div>
          <div style={label}>O₂</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 160, height: 14, border: `2px solid ${C.grey}`}}>
              <div style={{width: `${o2}%`, height: '100%', background: o2 < 30 ? C.red : C.sonar}} />
            </div>
            <div style={{...val, fontSize: 26}}>{Math.round(o2)}%</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 70, right: 110, textAlign: 'right'}}>
        <div style={{...label, color: C.red, opacity: blink ? 1 : 0.25}}>● REC</div>
        <div style={{...val, fontSize: 28}}>{time}</div>
      </div>
      {status && (
        <div style={{position: 'absolute', bottom: 80, left: 110, fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: statusColor, opacity: blink ? 1 : 0.55}}>
          ▲ {status}
        </div>
      )}
    </AbsoluteFill>
  );
};
