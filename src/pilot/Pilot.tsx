import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Opening} from '../opening/Opening';
import {C, Grain, KineticLine, LINES, Label, Shot, ShotCtx, TOTAL_FRAMES} from './core';
import {A1, A3, A4, A5, A6, A7, A8, A9, B1, B11, B3, B4, B5, B6, B9, Dive} from './secAB';
import {C10, C12, C14, C16, C17, C18, C19, C3, C5, C9, D1, D10, D12, D14, D15, D16, D2, D4, D6, D7, Equip} from './secCD';
import {Board, E1, E10, E12, E13, E15, E17, E18, E19, E2, E20, E22, E23, E5, F11, F15, F17, F20, F21, F24, F5, F6, Move} from './secEF';
import {G1, G10, G12, G13, G14, G15, G16, G17, G18, G3, G5, G8, H1, H3, H4, H5, H7, H8, H9} from './secGH';

const Kin: React.FC<{line: string; accent?: string[]; bg?: string}> = ({line, accent, bg = '#02070b'}) => (
  <Shot cam={{s: [1.0, 1.08]}} bg={bg}>
    <KineticLine line={line} y={440} size={110} accent={accent} />
  </Shot>
);
const F1: React.FC = () => (
  <Dive cam={{s: [1.2, 1.0]}} diver={{x: 860, y: 560, s: 0.62, beam: 900}} field={{n: 30, seed: 33, cx: 920, cy: 560, rx: 950, ry: 520, inner: 0.35, lit: 0.2, red: 'flash'}} label={{text: 'MIDNIGHT · 12 m', at: 6}} />
);
const OpeningPart: React.FC = () => <Opening noAudio />;
/** marker: continue previous shot from a new camera angle */
export const CUT: React.FC<any> = () => null;

/** [line id where the shot starts, component, optional offset in seconds] */
type S = [string, React.FC<any>, any?, number?];
export const SHOTS: S[] = [
  ['s1', OpeningPart],
  ['a1', A1], ['a2', CUT, {cam: {s: [1.7, 1.8], x: [-380, -420], y: [-60, -60]}}], ['a3', A3], ['a4', A4], ['a5', A5], ['a6', A6], ['a7', A7], ['a8', A8], ['a9', A9],
  ['b1', B1], ['b3', B3], ['b4', B4], ['b5', B5], ['b6', B6], ['b7', CUT, {cam: {s: [1.4, 1.5], y: [-374, -400]}}], ['b8', CUT, {cam: {s: [2.0, 2.1], x: [520, 546], y: [-574, -603]}}], ['b9', B9], ['b10', CUT, {cam: {s: [1.5, 1.6], x: [390, 416], y: [135, 144]}}], ['b11', B11],
  ['c1', Equip, {active: 0, hl: 'c2', intro: true}], ['c3', C3], ['c4', CUT, {cam: {s: [1.35, 1.45], x: [-150, -180]}}], ['c5', C5], ['c6', CUT, {cam: {s: [1.15, 1.2], y: [-80, -100]}}], ['c7', CUT, {cam: {s: [1.0, 0.95]}}], ['c8', Equip, {active: 1, hl: 'c8'}], ['c9', C9], ['c10', C10], ['c12', C12],
  ['c13', Equip, {active: 2, hl: 'c13'}], ['c14', C14], ['c15', CUT, {cam: {s: [1.7, 1.9], r: [6, 10]}}], ['c16', C16], ['c17', C17], ['c18', C18], ['c19', C19],
  ['d1', D1], ['d2', D2], ['d3', CUT, {cam: {s: [1.3, 1.2], x: [100, 0]}}], ['d4', D4], ['d6', D6], ['d7', D7], ['d8', CUT, {cam: {s: [1.8, 1.6]}}], ['d9', CUT, {cam: {s: [1.0, 1.1]}}], ['d10', D10], ['d12', D12], ['d13', CUT, {cam: {s: [1.3, 1.35], x: [300, 280]}}], ['d14', D14], ['d15', D15], ['d16', D16],
  ['e1', E1], ['e2', E2], ['e3', Board, {hlLegend: 'e4'}], ['e5', E5], ['e5', CUT, {cam: {s: [1.6, 1.7], x: [224, 200], y: [-336, -360]}}, 4.5], ['e6', Board, {hlLegend: 'e6', legendCard: 'e6', deaths: 'e7', legendStamp: 'e8'}], ['e7', CUT, {cam: {s: [1.3, 1.35], x: [-546, -567], y: [-40, -42]}}], ['e8', CUT, {cam: {s: [1.5, 1.55], x: [630, 650], y: [120, 124]}}],
  ['e9', Board, {confirmedHL: 'e9'}], ['e10', E10], ['e11', CUT, {cam: {s: [1.2, 1.25], x: [312, 325], y: [-24, -25]}}], ['e12', E12], ['e13', E13], ['e15', E15], ['e16', Kin, {line: 'e16', accent: ['one']}],
  ['e17', E17], ['e17', CUT, {cam: {s: [2.2, 2.4], x: [594, 648], y: [741, 809]}}, 5], ['e18', E18], ['e19', E19], ['e20', E20], ['e21', CUT, {cam: {s: [1.15, 1.2]}}], ['e22', E22], ['e23', E23],
  ['f1', F1], ['f3', Move, {pick: -1, intro: true}], ['f4', Move, {pick: 0}], ['f5', F5], ['f6', F6], ['f7', CUT, {cam: {s: [1.4, 1.5]}}], ['f8', Move, {pick: 0, verdictAt: 'f8'}],
  ['f9', Move, {pick: 1, verdictAt: 'f10', struck: [0]}], ['f11', F11], ['f12', CUT, {cam: {s: [1.5, 1.6], x: [-100, -150]}}], ['f13', Move, {pick: 2, verdictAt: 'f14', struck: [0]}], ['f15', F15], ['f16', CUT, {cam: {s: [1.5, 1.6], y: [-250, -270]}}], ['f17', F17], ['f18', CUT, {cam: {s: [1.2, 1.3]}}],
  ['f19', Move, {pick: 3, verdictAt: 'f19', struck: [0, 2]}], ['f20', F20], ['f21', F21], ['f22', CUT, {cam: {s: [1.1, 1.15]}}], ['f23', CUT, {cam: {s: [1.0, 1.05], y: [0, -30]}}], ['f23', CUT, {cam: {s: [1.1, 1.15], y: [-20, -30]}}, 5], ['f24', F24],
  ['g1', G1], ['g3', G3], ['g4', CUT, {cam: {s: [1.6, 1.7]}}], ['g5', G5], ['g6', CUT, {cam: {s: [1.2, 1.25], x: [150, 100]}}], ['g7', CUT, {cam: {s: [1.0, 1.05], y: [-100, -120]}}], ['g8', G8], ['g9', CUT, {cam: {s: [2.6, 3.0], x: [312, 327], y: [663, 765]}}], ['g10', G10], ['g10', CUT, {cam: {s: [1.9, 2.0], x: [114, 120], y: [-140, -150]}}, 5], ['g11', CUT, {cam: {s: [1.2, 1.25], x: [-50, -50]}}], ['g12', G12], ['g13', G13], ['g14', G14], ['g15', G15], ['g16', G16], ['g16', CUT, {cam: {s: [1.15, 1.2], y: [60, 70]}}, 4], ['g17', G17], ['g18', G18],
  ['h1', H1], ['h2', CUT, {cam: {s: [1.5, 1.6]}}], ['h3', H3], ['h4', H4], ['h5', H5], ['h7', H7], ['h8', H8], ['h9', H9],
];

export const shotStarts = () => SHOTS.map(([id, , , off]) => (id === 's1' ? 0 : LINES[id].s - 4 + Math.round((off ?? 0) * 30)));

export const Pilot: React.FC<{noAudio?: boolean}> = ({noAudio}) => {
  const starts = shotStarts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map(([id, Comp, props], i) => {
        const from = starts[i];
        const to = i + 1 < SHOTS.length ? starts[i + 1] : TOTAL_FRAMES;
        let base = i, P = props || {};
        if (Comp === CUT) {
          while (SHOTS[base][1] === CUT) base--;
        }
        const BaseComp = SHOTS[base][1];
        const baseProps = SHOTS[base][2] || {};
        const t0 = starts[base];
        let nxt = i + 1;
        while (nxt < SHOTS.length && SHOTS[nxt][1] === CUT) nxt++;
        const baseEnd = nxt < SHOTS.length ? starts[nxt] : TOTAL_FRAMES;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} name={`${id}${Comp === CUT ? ' (cut)' : ''}`}>
            <ShotCtx.Provider value={{t0, dur: baseEnd - t0, camDur: to - from, off: from - t0, cam: Comp === CUT ? P.cam : undefined}}>
              <BaseComp {...baseProps} />
            </ShotCtx.Provider>
          </Sequence>
        );
      })}
      <Grain />
      {!noAudio && <Audio src={staticFile('audio/pilot_vo.wav')} />}
      {!noAudio && <Audio src={staticFile('audio/pilot_sfx.wav')} />}
    </AbsoluteFill>
  );
};
export const PILOT_FRAMES = TOTAL_FRAMES;
