# Encounter Files — project brief for Claude Code

Read this first, then `docs/SOHBET-OZETI.md` (full history of the original conversation, in Turkish).

## Who / how to talk
- The owner speaks **Turkish**. Always reply in Turkish, plainly, step by step; they are not a developer.
- Videos are **English**. Channel: faceless, animated, ocean "encounter" documentaries.
- Be honest about limits: Claude cannot hear audio — verify audio by measuring (levels, ASR), and say so.
- Ask before outward actions (uploading, creating repos, publishing). Commit and push work to GitHub
  (`oguzzgkmn-source/encounter-files`, branch `main`) after each big step.

## The format (keep it consistent)
"Encounter File #NNN": one real human–animal encounter story per episode, ~9–10 min, 8 blocks:
1 cold open (real incident, "you" perspective, an open question) · 2 file card (who/what/size) ·
3–4 science + myth-busting (answer the open question mid-video) · 5 real encounters (dates, places,
names; legends clearly marked "unverified") · 6 **YOUR MOVE** (4 options, real expert answer) ·
7 the twist (humans are the bigger threat / surprising truth) · 8 close (callback to cold open,
tease next file, comment CTA).
- Visual identity: dark navy water, sonar/HUD overlays (green #3dff9a, red #ff3b3b, amber #ffb020),
  Oswald Bold headlines, JetBrains Mono labels, flat 2D vector animals, a diver character = "you".
- Pace: a new visual every ~4–5 s (use `CUT` entries = same scene, new camera angle); camera always moves;
  text pops synced to the spoken words. No stock footage so far (all original animation).
- Sensitive real deaths: muted colours, symbolic visuals only, no gore, respectful wording.
- Every fact sourced; sources table at the end of each script doc.

## Topic selection rules (important — owner was burned by copycats)
- Many channels use the same AI tools → obvious animals get flooded within days
  ("Why You'd Never Want To Meet A ___" format is saturated). Do NOT pick topics from "scary sea animal" lists.
- Pick an **event/incident**, not just an animal; prefer under-covered stories with proven demand
  (viral short clips but no long explainer). Check YouTube uploads of the last 7 days before writing AND before upload.
- Avoid copycat title templates. Next planned: **#003 needlefish** (fish that leap at night lights;
  the 2024 Mentawai case where the resort said "needlefish") — teased at the end of #002.

## Status
- #001 Humboldt squid ("Diablo rojo") — done, uploaded to the owner's existing channel
  (a German heavy-machinery channel → audience mismatch; recommended a dedicated channel, owner declined for now).
- #002 Billfish ("THE SWORD") — done. Narration recorded by the owner with **ai33 pro**; final render
  `out/f2-final.mp4` (not in git; owner has it). YouTube package: `docs/youtube-paketi-002.md`, captions `docs/encounter-file-002.en.srt`.
- Owner mentioned an earlier "Italian video" made in another chat — no files here; ask them for it if it comes up.

## Pipeline (Remotion + Python)
```
npm install
pip install kokoro-onnx soundfile numpy sherpa-onnx
# Kokoro TTS model (only if Claude generates the voice; voice = am_michael, speed 0.95):
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx  -> tts/
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin   -> tts/
# ASR model for word-level sync (needed when the owner sends their own narration):
#   https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-gigaspeech-2023-12-12.tar.bz2
```
Episode workflow (see #002 as the reference implementation, `src/file002/`):
1. Script → `docs/fileNNN-senaryo.md` (TR summary + EN VO + visual notes + sources). Get owner approval.
2. Narration text for the owner → `docs/fileNNN-narration.txt` (one sentence per line, numbers spelled out).
3. Owner's audio → `python3 scripts/align_vo.py <mp3> <narration.txt> src/fileNNN/timings.json public/audio/fNNN_vo.wav w`
   then **always** refine with ASR: `python3 scripts/asr_align.py public/audio/fNNN_vo.wav src/fileNNN/timings.json <sherpa_model_dir> words.json --write`
   (silence-only alignment drifted 2–6 s on #002; ASR fixed it). If an impact/sting needs room, insert a short pause in the VO and shift timings.
4. Shots: `src/fileNNN/Episode.tsx` `SHOTS = [[lineId, Component, props?, offsetSec?], ...]`; helpers in `src/pilot/core.tsx`
   (`useShot().at/atWord/end`, `Shot` camera, `Label`, `Headline`, `KineticLine`, `Stamp`, `Counter`, maps).
5. QA stills: `node scripts/qa_stills.mjs <outdir> <frames,...> 0.25 Episode002` → contact sheets; check text overflow, framing, sync.
6. Sound: `python3 scripts/f2_sfx.py` pattern — section beds + cues; music AND sfx ducked under VO;
   target voice ≥ ~20 dB above beds on voiced frames; no beeps/alarms over the voice.
7. Render: `npx remotion render src/index.ts Episode002 out/fNNN-video-only.mp4 --muted --crf=19`
   (in the old cloud box a `--browser-executable` flag was used; locally Remotion downloads its own browser).
8. Master: VO + SFX → loudnorm −14 LUFS (see README), mux, then scan: `ffmpeg ... -vf blackdetect,freezedetect` (fix any static ≥3 s).
9. Deliver: final mp4 + YouTube package (3 titles for A/B, description w/ chapters, sources, tags, ChatGPT thumbnail prompts) + SRT.

## Gotchas
- Large media are git-ignored (`public/audio/pilot_*.wav`, `public/audio/f2_*.wav`, `out/pilot-*`, `out/f2-*`); regenerate.
  #002 narration: `assets/vo/file002_narration_edited.mp3` (with the 0.9 s pause; matches `src/file002/timings.json`).
- Map data: `scripts/make_maps.py` (Natural Earth 50 m) → `src/pilot/maps.json` (views: pacific, baja, indopac, atlantic).
- Synthesized music/SFX are placeholders quality-wise; owner may supply licensed music later.
