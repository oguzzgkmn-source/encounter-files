import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import timings from './timings.json';
import {Grain, LINES, ShotCtx, addTimings} from '../pilot/core';
import {T1, T2, T3, T4, T5, T6, T7, T8, T9} from './Test';
import {A12, A14, A15, B26, B27, B28, B29, B30, B31, B32, B34, B35, C36, C39, C41, C43, C46, C49, C53, D55, D56, D58, D60, D62, D64, D66, Family} from './shots1';
import {E69, E71, E76, E77, E83, E87, E93, E98, F103, F112, F116, F119, F124, F129, G131, G132, G135, G138, G142, G145, H148, H151, H154, H156, H157, H158, Move2, PeopleCard} from './shots2';

addTimings(timings);
export const F2_FRAMES = Math.round(timings.duration * 30);
/** marker: continue the previous shot from a new camera angle */
export const CUT: React.FC<any> = () => null;

type S = [string, React.FC<any>, any?, number?];
export const SHOTS: S[] = [
  ['w001', T1], ['w002', T2], ['w002', CUT, {cam: {s: [1.5, 1.6], x: [-200, -260], y: [-120, -160]}}, 3], ['w003', T3], ['w005', T4], ['w006', T5, {impactLine: 'w006'}], ['w007', T6],
  ['w008', T7], ['w009', CUT, {cam: {s: [1.5, 1.6], x: [-450, -480], y: [-420, -440]}}], ['w010', T8, {rid: 'w011'}],
  ['w012', A12], ['w013', Family], ['w014', A14], ['w015', A15], ['w017', CUT, {cam: {s: [1.2, 1.3], x: [300, 340]}}], ['w018', CUT, {cam: {s: [2.4, 2.6], x: [1150, 1250]}}], ['w020', T9],
  ['w022', Family, {hl: ['w023', 'w024', 'w025']}], ['w024', CUT, {cam: {s: [1.15, 1.2], x: [60, 80], y: [-40, -60]}}], ['w025', CUT, {cam: {s: [1.3, 1.35], x: [-250, -270], y: [-403, -418]}}],
  ['w026', B26], ['w027', B27], ['w027', CUT, {cam: {s: [1.3, 1.4], x: [300, 330], y: [-400, -440]}}, 4], ['w028', B28], ['w029', B29], ['w030', B30], ['w031', B31], ['w032', B32], ['w033', CUT, {cam: {s: [2.3, 2.5], x: [39, 42], y: [7, 8]}}], ['w034', B34], ['w035', B35],
  ['w036', C36], ['w038', CUT, {cam: {s: [1.0, 1.05]}}], ['w039', C39], ['w041', C41], ['w042', CUT, {cam: {s: [1.35, 1.45], x: [250, 280]}}], ['w043', C43], ['w044', CUT, {cam: {s: [1.3, 1.4]}}], ['w045', CUT, {cam: {s: [1.3, 1.4], y: [100, 120]}}],
  ['w046', C46], ['w049', C49], ['w050', CUT, {cam: {s: [1.1, 1.15], x: [-150, -180]}}], ['w051', CUT, {cam: {s: [2.0, 2.2], x: [-1280, -1400]}}], ['w052', CUT, {cam: {s: [1.2, 1.25], x: [-200, -200]}}], ['w053', C53],
  ['w055', D55], ['w056', D56], ['w057', CUT, {cam: {s: [1.6, 1.7], x: [550, 560], y: [-80, -90]}}], ['w058', D58], ['w059', CUT, {cam: {s: [1.4, 1.5], x: [-250, -300]}}], ['w060', D60], ['w062', D62], ['w063', CUT, {cam: {s: [1.05, 1.1], y: [-40, -60]}}],
  ['w064', D64], ['w066', D66], ['w067', CUT, {cam: {s: [1.2, 1.25]}}], ['w068', CUT, {cam: {s: [1.1, 1.15]}}],
  ['w069', E69], ['w070', CUT, {cam: {s: [1.2, 1.25], x: [-150, -170]}}], ['w071', E71], ['w073', CUT, {cam: {s: [1.3, 1.4], x: [150, 180]}}], ['w075', PeopleCard], ['w076', E76], ['w076', CUT, {cam: {s: [2.0, 2.2], x: [228, 251], y: [-298, -328]}}, 4.5], ['w077', E77], ['w081', CUT, {cam: {s: [1.25, 1.3], x: [-250, -280]}}],
  ['w083', E83], ['w084', CUT, {cam: {s: [1.05, 1.1]}}], ['w085', CUT, {cam: {s: [1.2, 1.25], x: [-200, -220]}}], ['w087', E87], ['w088', CUT, {cam: {s: [1.15, 1.2]}}], ['w089', CUT, {cam: {s: [1.4, 1.5], y: [-260, -280]}}], ['w090', CUT, {cam: {s: [1.1, 1.15]}}], ['w091', CUT, {cam: {s: [1.3, 1.35], y: [-200, -210]}}], ['w093', E93], ['w094', CUT, {cam: {s: [1.0, 1.12], x: [40, -40]}}], ['w095', CUT, {cam: {s: [1.15, 1.3], x: [-200, -260]}}], ['w096', CUT, {cam: {s: [1.15, 1.2], y: [-120, -130]}}], ['w098', E98],
  ['w103', F103], ['w106', CUT, {cam: {s: [1.3, 1.4], x: [300, 330]}}], ['w108', Move2, {pick: -1, intro: true}], ['w109', Move2, {pick: 0}], ['w111', Move2, {pick: 0, verdictAt: 'w111'}], ['w112', F112],
  ['w113', Move2, {pick: 1, struck: [0]}], ['w115', Move2, {pick: 1, verdictAt: 'w115', struck: [0]}], ['w116', F116], ['w117', Move2, {pick: 2, struck: [0, 1]}], ['w119', F119],
  ['w121', Move2, {pick: 3, struck: [0, 1, 2]}], ['w123', Move2, {pick: 3, verdictAt: 'w123', struck: [0, 1, 2]}], ['w124', F124], ['w126', CUT, {cam: {s: [1.1, 1.15], x: [80, 90]}}], ['w128', CUT, {cam: {s: [1.2, 1.25], x: [120, 130], y: [-120, -130]}}], ['w129', F129], ['w130', CUT, {cam: {s: [1.25, 1.3], y: [60, 70]}}],
  ['w131', G131], ['w132', G132], ['w133', CUT, {cam: {s: [1.15, 1.2]}}], ['w135', G135], ['w136', CUT, {cam: {s: [1.3, 1.35], x: [-100, -120], y: [80, 90]}}], ['w137', CUT, {cam: {s: [1.7, 1.8], x: [-200, -220], y: [80, 90]}}], ['w138', G138], ['w140', CUT, {cam: {s: [1.15, 1.2], y: [-80, -90]}}], ['w142', G142], ['w143', CUT, {cam: {s: [1.15, 1.2], x: [-120, -130]}}], ['w145', G145], ['w146', CUT, {cam: {s: [1.3, 1.35], x: [200, 220]}}], ['w147', CUT, {cam: {s: [1.0, 0.95]}}],
  ['w148', H148], ['w150', CUT, {cam: {s: [1.3, 1.4], x: [-200, -220], y: [-200, -220]}}], ['w151', H151], ['w153', CUT, {cam: {s: [1.15, 1.2]}}], ['w154', H154], ['w156', H156], ['w157', H157], ['w157', CUT, {cam: {s: [1.5, 1.6], x: [-450, -480], y: [200, 210]}}, 5], ['w158', H158],
];

export const shotStarts = () => SHOTS.map(([id, , , off], i) => (i === 0 ? 0 : LINES[id].s - 4 + Math.round((off ?? 0) * 30)));

export const Episode002: React.FC<{noAudio?: boolean}> = ({noAudio}) => {
  const starts = shotStarts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map(([id, Comp, props], i) => {
        const from = starts[i];
        const to = i + 1 < SHOTS.length ? starts[i + 1] : F2_FRAMES;
        let base = i;
        if (Comp === CUT) while (SHOTS[base][1] === CUT) base--;
        const BaseComp = SHOTS[base][1];
        const baseProps = SHOTS[base][2] || {};
        const t0 = starts[base];
        let nxt = i + 1;
        while (nxt < SHOTS.length && SHOTS[nxt][1] === CUT) nxt++;
        const baseEnd = nxt < SHOTS.length ? starts[nxt] : F2_FRAMES;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} name={`${id}${Comp === CUT ? ' (cut)' : ''}`}>
            <ShotCtx.Provider value={{t0, dur: baseEnd - t0, camDur: to - from, off: from - t0, cam: Comp === CUT ? (props || {}).cam : undefined}}>
              <BaseComp {...baseProps} />
            </ShotCtx.Provider>
          </Sequence>
        );
      })}
      <Grain />
      {!noAudio && <Audio src={staticFile('audio/f2_vo.wav')} />}
      {!noAudio && <Audio src={staticFile('audio/f2_sfx.wav')} />}
    </AbsoluteFill>
  );
};
