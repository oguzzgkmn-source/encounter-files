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

## Layout
- `src/opening/` — dynamic opening test (camera, diver, squid, brackets kit)
- `src/scenes/` — first static style test
- `docs/rakip-analizi.md` — competitor (Depth Theory) analysis
- `out/` — rendered tests
