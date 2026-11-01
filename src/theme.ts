import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/oswald/700.css';

export const C = {
  bg: '#03080d',
  deep: '#06141f',
  sonar: '#3dff9a',
  sonarDim: 'rgba(61,255,154,0.18)',
  amber: '#ffb020',
  red: '#ff3b3b',
  white: '#e8f1f2',
  grey: '#6f8792',
};
export const MONO = "'JetBrains Mono', monospace";
export const HEAD = "'Oswald', sans-serif";

// deterministic pseudo-random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
