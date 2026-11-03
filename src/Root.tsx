import React from 'react';
import {Composition, Series} from 'remotion';
import {ColdOpen} from './scenes/ColdOpen';
import {FileCard} from './scenes/FileCard';
import {Anatomy} from './scenes/Anatomy';
import {YourMove} from './scenes/YourMove';
import {Thumbnail} from './scenes/Thumbnail';
import {Thumb2} from './scenes/Thumb2';
import {Opening, OPENING_FRAMES} from './opening/Opening';
import {Pilot, PILOT_FRAMES} from './pilot/Pilot';
import {F2Test, F2TEST_FRAMES} from './file002/Test';
import {Episode002, F2_FRAMES} from './file002/Episode';

const StyleReel: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={240}><ColdOpen /></Series.Sequence>
    <Series.Sequence durationInFrames={210}><FileCard /></Series.Sequence>
    <Series.Sequence durationInFrames={230}><Anatomy /></Series.Sequence>
    <Series.Sequence durationInFrames={210}><YourMove /></Series.Sequence>
  </Series>
);

const base = {fps: 30, width: 1920, height: 1080};
export const Root: React.FC = () => (
  <>
    <Composition id="ColdOpen" component={ColdOpen} durationInFrames={300} {...base} />
    <Composition id="FileCard" component={FileCard} durationInFrames={210} {...base} />
    <Composition id="Anatomy" component={Anatomy} durationInFrames={230} {...base} />
    <Composition id="YourMove" component={YourMove} durationInFrames={210} {...base} />
    <Composition id="StyleReel" component={StyleReel} durationInFrames={890} {...base} />
    <Composition id="Opening" component={Opening} durationInFrames={OPENING_FRAMES} {...base} />
    <Composition id="Pilot" component={Pilot} durationInFrames={PILOT_FRAMES} {...base} />
    <Composition id="Thumb2" component={Thumb2} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="F2Test" component={F2Test} durationInFrames={F2TEST_FRAMES} {...base} />
    <Composition id="Episode002" component={Episode002} durationInFrames={F2_FRAMES} {...base} />
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
