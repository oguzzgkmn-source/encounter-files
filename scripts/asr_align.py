"""Word-level forced alignment check using a local sherpa-onnx transducer ASR model.

Usage: python3 scripts/asr_align.py <vo.wav 48k mono> <timings.json> <model_dir> <out_words.json> [--write]

1) Splits the narration at real pauses into <=25 s chunks and transcribes each with token timestamps.
2) Aligns ASR words to the script words (difflib) and derives each line's true start/end.
3) Reports how far the existing timings are off; with --write, rewrites the timings file.
"""
import difflib, json, re, subprocess, sys
import numpy as np, soundfile as sf
import sherpa_onnx

wav, tpath, mdir, out_words = sys.argv[1:5]
WRITE = "--write" in sys.argv
audio, sr = sf.read(wav, dtype="float32")
if audio.ndim > 1: audio = audio.mean(1)
a16 = np.interp(np.arange(0, len(audio), sr / 16000), np.arange(len(audio)), audio).astype(np.float32)
SR = 16000

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{mdir}/encoder-epoch-30-avg-1.int8.onnx", decoder=f"{mdir}/decoder-epoch-30-avg-1.onnx",
    joiner=f"{mdir}/joiner-epoch-30-avg-1.int8.onnx", tokens=f"{mdir}/tokens.txt", num_threads=4, decoding_method="greedy_search")

# split points at pauses >= 0.25 s
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", "silencedetect=noise=-36dB:d=0.25", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]; en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
mids = [(a + b) / 2 for a, b in zip(st, en)]
dur = len(a16) / SR
cuts, last = [0.0], 0.0
while dur - last > 20:
    opts = [m for m in mids if last + 6 < m <= last + 20]
    nxt = max(opts) if opts else last + 20
    cuts.append(nxt); last = nxt
cuts.append(dur)

words = []  # (word, start, end)
for c0, c1 in zip(cuts, cuts[1:]):
    s = rec.create_stream(); s.accept_waveform(SR, a16[int(c0 * SR):int(c1 * SR)]); rec.decode_stream(s)
    r = s.result
    toks, ts = list(r.tokens), list(r.timestamps)
    cur, cs = "", None
    for tok, tt in zip(toks, ts):
        if tok.startswith("▁") or tok.startswith(" "):
            if cur: words.append([cur, cs])
            cur, cs = tok[1:], c0 + tt
        else:
            cur += tok
    if cur: words.append([cur, cs])
for i in range(len(words)):
    words[i].append(words[i + 1][1] if i + 1 < len(words) else dur)
json.dump(words, open(out_words, "w"))
print("asr words:", len(words))

# script words
T = json.load(open(tpath)); lines = T["lines"]
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
sw, owner = [], []
for li, l in enumerate(lines):
    for w in l["text"].split():
        n = norm(w)
        if n: sw.append(n); owner.append(li)
aw = [norm(w[0]) for w in words]
sm = difflib.SequenceMatcher(a=sw, b=aw, autojunk=False)
amap = {}
for blk in sm.get_matching_blocks():
    for k in range(blk.size): amap[blk.a + k] = blk.b + k
print("script words:", len(sw), "matched:", len(amap), f"({100 * len(amap) / len(sw):.0f}%)")

# per line: first/last matched word
first, lastw = {}, {}
for si, li in enumerate(owner):
    if si in amap:
        first.setdefault(li, amap[si]); lastw[li] = amap[si]
new = []
for li, l in enumerate(lines):
    if li in first:
        s0 = words[first[li]][1]; e0 = words[lastw[li]][2]
        new.append([s0, e0, True])
    else:
        new.append([None, None, False])
# interpolate missing
for li in range(len(new)):
    if new[li][0] is None:
        p = max([k for k in range(li) if new[k][2]] or [-1]); q = min([k for k in range(li + 1, len(new)) if new[k][2]] or [len(new)])
        ta = new[p][1] if p >= 0 else 0.0; tb = new[q][0] if q < len(new) else dur
        n = q - p - 1; k = li - p
        new[li][0] = ta + (tb - ta) * (k - 1) / n; new[li][1] = ta + (tb - ta) * k / n
# report
diffs = [(l["id"], round(new[i][0] - l["start"], 2), l["text"][:48]) for i, l in enumerate(lines)]
big = [d for d in diffs if abs(d[1]) > 0.3]
print("lines off by >0.3 s:", len(big))
for d in big[:40]: print("  ", d)
print("mean |off|: %.2f s, max %.2f s" % (np.mean([abs(d[1]) for d in diffs]), max(abs(d[1]) for d in diffs)))
if WRITE:
    for i, l in enumerate(lines):
        l["start"] = round(new[i][0] - 0.05, 3); l["end"] = round(min(new[i][1], new[i + 1][0] if i + 1 < len(new) else dur), 3)
    json.dump(T, open(tpath, "w"), indent=1)
    print("timings rewritten")
