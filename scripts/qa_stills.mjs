// Render one still per shot (mid-point) at reduced scale into a folder, reusing one bundle.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
const [, , outDir, framesArg, scaleArg, compId = 'Pilot'] = process.argv;
const frames = framesArg.split(',').map(Number);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: new URL('../src/index.ts', import.meta.url).pathname});
const composition = await selectComposition({serveUrl, id: compId, browserExecutable: '/opt/pw-browsers/chromium'});
for (const frame of frames) {
  await renderStill({composition, serveUrl, frame, output: `${outDir}/f${String(frame).padStart(5, '0')}.jpg`, imageFormat: 'jpeg', scale: Number(scaleArg || 0.25), browserExecutable: '/opt/pw-browsers/chromium'});
}
console.log('done', frames.length);
