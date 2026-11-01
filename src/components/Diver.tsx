import React from 'react';
// side-view diver silhouette swimming right. native 220x80
export const Diver: React.FC<{color?: string; width?: number; light?: boolean}> = ({color = '#e8f1f2', width = 220, light}) => (
  <svg width={width} height={(width * 80) / 220} viewBox="0 0 220 80" style={{overflow: 'visible'}}>
    {light && <path d="M 200 40 L 520 -40 L 520 120 Z" fill="url(#beam)" />}
    <defs>
      <linearGradient id="beam" x1="0" x2="1">
        <stop offset="0" stopColor="#fffbe0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fffbe0" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M 10 30 L 40 38 L 40 44 L 10 52 Z" fill={color} />
    <rect x={38} y={34} width={40} height={10} rx={5} fill={color} />
    <rect x={70} y={28} width={90} height={24} rx={12} fill={color} />
    <rect x={85} y={14} width={60} height={14} rx={7} fill="#8fa3ad" />
    <circle cx={175} cy={38} r={15} fill={color} />
    <rect x={180} y={30} width={14} height={10} rx={3} fill="#3dff9a" opacity={0.8} />
    <rect x={150} y={44} width={45} height={7} rx={3.5} fill={color} />
  </svg>
);
