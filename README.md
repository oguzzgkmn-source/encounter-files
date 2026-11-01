# Encounter Files

Faceless ocean-encounter YouTube channel: real human–animal encounters, sonar/HUD visual style, built in code with Remotion.

## Setup
```bash
npm install
pip install kokoro-onnx soundfile
# Kokoro voice model (not in git, ~350 MB):
curl -L -o tts/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -o tts/voices-v1.0.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

## Pipeline
1. Script lines → `scripts/*_lines.json`
2. Voice-over (Kokoro, voice `am_michael`): `python3 scripts/vo.py scripts/opening_lines.json public/audio/opening_vo.wav src/opening_timings.json`
3. SFX (synthesised, temporary): `python3 scripts/sfx.py src/opening_timings.json public/audio/opening_sfx.wav`
4. Render: `npx remotion render src/index.ts Opening out/opening-test.mp4`
   (in the cloud container add `--browser-executable=/opt/pw-browsers/chromium`)

## Pilot (Encounter File #001, ~9:27)
```bash
python3 scripts/pilot_lines.py                                   # script -> scripts/pilot_lines.json
python3 scripts/vo.py scripts/pilot_lines.json public/audio/pilot_vo.wav src/pilot/timings.json
python3 scripts/pilot_sfx.py                                     # music beds + sfx + ducking -> public/audio/pilot_sfx.wav
npx remotion render src/index.ts Pilot out/pilot-video-only.mp4 --muted
ffmpeg -i public/audio/pilot_vo.wav -i public/audio/pilot_sfx.wav -filter_complex "[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120[v];[v][1:a]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11" out/pilot-master.wav
ffmpeg -i out/pilot-video-only.mp4 -i out/pilot-master.wav -c:v copy -c:a aac -b:a 320k out/pilot-final.mp4
```
- Shot list: `src/pilot/Pilot.tsx` (`SHOTS`: line id → scene; `CUT` = same scene, new camera angle)
- QA: `node scripts/qa_stills.mjs /tmp/qa <frames,...> 0.25`, `python3 scripts/shot_stats.py`
- Map data: `scripts/make_maps.py` (Natural Earth 50m land)

## Layout
- `src/opening/` — dynamic opening test (camera, diver, squid, brackets kit)
- `src/scenes/` — first static style test
- `src/pilot/` — full pilot (core helpers, art, sections A–H)
- `docs/rakip-analizi.md` — competitor analysis
- `docs/pilot-senaryo.md` — approved script + sources
- `docs/youtube-paketi.md` — titles, description, chapters, tags
- `out/` — rendered tests
