import React from 'react';
import {useCurrentFrame} from 'remotion';

// Stylised Humboldt squid facing left. Native box 900x300.
export const Squid: React.FC<{color?: string; width?: number; glow?: number; phase?: number}> = ({color = '#c9d6db', width = 900, glow = 0, phase = 0}) => {
  const f = useCurrentFrame() + phase;
  const arms = Array.from({length: 8}, (_, i) => {
    const y0 = 128 + i * 6;
    const spread = (i - 3.5) * 12;
    const w = Math.sin(f / 9 + i) * 10;
    const endX = 40 + (i % 3) * 18;
    return <path key={i} d={`M 215 ${y0} C 160 ${y0 + spread * 0.4 + w}, 110 ${150 + spread + w}, ${endX} ${150 + spread * 1.6 - w}`} stroke={color} strokeWidth={9 - Math.abs(i - 3.5)} fill="none" strokeLinecap="round" />;
  });
  const t = Math.sin(f / 11) * 14;
  return (
    <svg width={width} height={(width * 300) / 900} viewBox="-120 0 1020 300" style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${glow}px ${color})` : undefined}}>
      {/* tentacles with clubs */}
      <path d={`M 215 140 C 120 ${110 + t}, 20 ${120 - t}, -80 ${125 + t}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={-85} cy={125 + t} rx={22} ry={7} fill={color} />
      <path d={`M 215 160 C 120 ${190 - t}, 20 ${180 + t}, -70 ${178 - t}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={-75} cy={178 - t} rx={22} ry={7} fill={color} />
      {arms}
      {/* mantle */}
      <path d="M 250 105 C 420 72, 640 100, 820 150 C 640 200, 420 228, 250 195 Z" fill={color} />
      {/* fins */}
      <path d="M 640 128 L 745 62 L 830 150 L 745 238 L 640 172 Z" fill={color} />
      {/* head */}
      <ellipse cx={240} cy={150} rx={48} ry={44} fill={color} />
      <circle cx={232} cy={136} r={13} fill="#05090c" />
      <circle cx={228} cy={132} r={4} fill="#ffffff" opacity={0.8} />
    </svg>
  );
};
