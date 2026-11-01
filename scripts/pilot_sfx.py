"""Sound design for the full pilot: section music beds, cut whooshes, pings, impacts, VO ducking.

Usage: python3 scripts/pilot_sfx.py  ->  public/audio/pilot_sfx.wav  (music+sfx stem, stereo 48k)
Reuses public/audio/opening_sfx.wav for the opening (identical VO timings).
"""
import json, re
import numpy as np, soundfile as sf

ROOT = "/home/user/encounter-files/"
SR = 48000
tm = json.load(open(ROOT + "src/pilot/timings.json"))
L = {l["id"]: l for l in tm["lines"]}
DUR = tm["duration"]
N = int(DUR * SR)
t = np.arange(N, dtype=np.float32) / SR
rng = np.random.default_rng(11)
music = np.zeros(N, np.float32)
sfx = np.zeros(N, np.float32)

def S(id, frac=0.0):
    l = L[id]; return l["start"] + frac * (l["end"] - l["start"])
def W(id, word):
    l = L[id]; i = l["text"].lower().find(word.lower()); return l["start"] + max(i, 0) / len(l["text"]) * (l["end"] - l["start"])

# ---- shot list (parsed from Pilot.tsx) ----
src = open(ROOT + "src/pilot/Pilot.tsx").read().split("export const SHOTS: S[] = [")[1]
ents, depth, cur = [], 0, ""
for ch in src:
    if ch == "[":
        depth += 1
        if depth == 1: cur = ""; continue
    if ch == "]":
        depth -= 1
        if depth == 0: ents.append(cur); continue
        if depth < 0: break
    if depth >= 1: cur += ch
shots = []
for e in ents:
    m = re.match(r"\s*'([a-z]\d+)',\s*(\w+)", e); off = re.search(r"\}\s*,\s*([\d.]+)\s*$", e)
    shots.append((m.group(1), m.group(2), 0.0 if m.group(1) == "s1" else L[m.group(1)]["start"] - 4 / 30 + (float(off.group(1)) if off else 0)))

# ---- dsp helpers ----
def band(x, lo, hi):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)
def norm(x): m = np.abs(x).max(); return x / m if m > 0 else x
def put(buf, sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if 0 <= i < N: buf[i:j] += sig[: j - i] * g
def env(n, a, r):
    e = np.ones(n, np.float32); ai, ri = int(a * SR), int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e
def ping(f0=1250, length=2.0):
    n = int(length * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 3.2)
    for d, g in [(.28, .35), (.6, .18)]:
        k = int(d * SR); s[k:] += s[: n - k] * g
    return (s * env(n, .004, .3)).astype(np.float32)
def whoosh(length=.5, lo=300, hi=3500):
    n = int(length * SR); x = norm(band(rng.standard_normal(n).astype(np.float32), lo, hi))
    return x * np.sin(np.linspace(0, np.pi, n)) ** 2
def boom(f0=80, f1=30, length=2.4):
    n = int(length * SR); tt = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-tt * 6); s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 1.8)
    c = norm(band(rng.standard_normal(n).astype(np.float32), 60, 900)) * np.exp(-tt * 30)
    return ((s + .5 * c) * env(n, .002, .4)).astype(np.float32)
def tick(f0=2400):
    n = int(.04 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 120)).astype(np.float32)
def thump(): return boom(60, 42, .5)
def bubble():
    n = int(.08 * SR); tt = np.arange(n) / SR; f = 500 + 900 * tt / tt[-1]
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 40)).astype(np.float32)

# ---- music beds per section ----
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
def pad(chords, t0, t1, seg, amp=1.0, bright=0.4, detune=0.004):
    """chords: list of midi-note lists cycled every `seg` s between t0..t1, with crossfades."""
    i0, i1 = int(t0 * SR), int(min(t1, DUR) * SR)
    n = i1 - i0; out = np.zeros(n, np.float32); tt = np.arange(n) / SR
    k = 0; s = 0.0
    while s < (t1 - t0):
        ch = chords[k % len(chords)]
        a, b = int(s * SR), min(n, int((s + seg + 1.5) * SR))
        seg_t = tt[a:b] - s
        e = np.minimum(1, seg_t / 1.5) * np.minimum(1, np.maximum(0, (seg + 1.5 - seg_t) / 1.5))
        v = np.zeros(b - a, np.float32)
        for m in ch:
            fq = NOTE(m)
            for d in (-detune, detune):
                v += np.sin(2 * np.pi * fq * (1 + d) * tt[a:b]) + bright * 0.3 * np.sin(4 * np.pi * fq * tt[a:b])
        out[a:b] += v * e / (len(ch) * 2)
        s += seg; k += 1
    fade = np.minimum(1, np.minimum(tt / 2.0, (tt[-1] - tt) / 2.0))
    music[i0:i1] += out * fade * amp
def pulse(t0, t1, bpm, f0=48, amp=1.0, every=1):
    beat = 60 / bpm; x = t0
    i = 0
    while x < t1:
        if i % every == 0: put(music, thump(), x, amp)
        x += beat; i += 1
def ticks(t0, t1, bpm, amp=1.0):
    beat = 60 / bpm; x = t0
    while x < t1: put(music, tick(), x, amp); x += beat

secs = {k: S(k) for k in ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "g12", "h1"]}
END = DUR
# A (after opening): tense, A minor with b2
pad([[45, 52, 57], [45, 52, 58], [41, 48, 57], [45, 52, 57]], secs["a1"] - 0.5, secs["b1"], 5, .22)
# B: file / exploration — D minor colours, gentle
pad([[50, 57, 62, 65], [46, 53, 62, 65], [48, 55, 60, 64], [45, 52, 61, 64]], secs["b1"], secs["c1"], 6, .17, .6)
# C: equipment — driving pulse
pad([[40, 47, 52], [40, 47, 53], [43, 50, 55], [38, 45, 50]], secs["c1"], secs["d1"], 4, .17)
pulse(secs["c1"] + 1, secs["d1"] - 1, 96, amp=.22, every=2)
# D: why red — curious shimmer
pad([[57, 64, 69, 76], [53, 60, 69, 72], [55, 62, 67, 74], [52, 59, 67, 71]], secs["d1"], secs["e1"], 5, .13, .9)
# E: encounters — dark, serious
pad([[33, 40, 45], [33, 40, 46], [31, 38, 43], [34, 41, 46]], secs["e1"], secs["f1"], 6, .24, .2)
# F: your move — clock
pad([[45, 52, 57], [44, 51, 57], [45, 52, 57], [41, 48, 53]], secs["f1"], secs["g1"], 4, .18)
ticks(S("f3"), secs["g1"] - 1, 120, .10)
# G: twist — rising
pad([[38, 45, 50, 57], [41, 48, 53, 60], [43, 50, 55, 62], [45, 52, 57, 64]], secs["g1"], secs["g12"], 6, .17, .5)
pad([[33, 40, 45, 52], [34, 41, 46, 53], [36, 43, 48, 55], [33, 40, 45, 52]], secs["g12"], secs["h1"], 5, .2, .4)
pulse(secs["g12"] + .5, S("g18"), 80, amp=.2, every=2)
# H: resolve & fade
pad([[45, 52, 57, 64], [41, 48, 57, 60], [43, 50, 55, 62], [45, 52, 57, 64]], secs["h1"], END, 6, .18, .6)

# ---- sfx cues ----
import itertools
for (id, comp, st), nxt in itertools.zip_longest(shots, shots[1:]):
    if id == "s1": continue
    if comp == "CUT": put(sfx, whoosh(.25, 1500, 6000), st - .05, .05)
    else: put(sfx, whoosh(.45, 300, 3500), st - .2, .10)
for id, comp, st in shots:
    if comp in ("A6", "C19"):
        for k in range(5): put(sfx, ping(1250 + 30 * k, 1.6), st + .3 + k * 1.4, .18)
    if comp in ("A8", "D1", "G12", "A3"): put(sfx, boom(90, 30, 2.5), st + .1, .55)
    if comp in ("G15", "G16"):
        for k in range(30): put(sfx, tick(1800 + k * 40), st + .2 + k * 0.05 + (0.0 if comp == "G15" else 1.0), .12)
    if comp == "H8": put(sfx, boom(110, 50, 1.2), st + 14 / 30, .5)
    if comp in ("Dive", "F1", "H1", "D14", "D16", "E2", "F24"):
        for k in range(5): put(sfx, bubble(), st + rng.random() * 3, .06)
# specific word hits
put(sfx, boom(), W("g2", "cannibals") - .05, .6)
put(sfx, boom(100, 40, 1.4), S("e8", .6), .5)            # UNVERIFIED stamp
put(sfx, boom(70, 35, 1.2), W("c12", "dig"), .55)        # teeth dig in
put(sfx, whoosh(1.0, 120, 900), W("e12", "dragged"), .45)
put(sfx, boom(90, 30, 2), W("e12", "eardrum"), .35)
put(sfx, whoosh(.6, 250, 2500), W("c4", "blasts"), .4)   # jet
put(sfx, boom(), S("f3"), .5)                           # YOUR MOVE
for id in ["f4", "f9", "f13", "f19"]: put(sfx, tick(1600), S(id), .5)
put(sfx, whoosh(.3, 2000, 8000), W("f17", "switch") + .2, .4)  # torch click
put(sfx, tick(900), W("f17", "switch") + .2, .6)
put(sfx, boom(80, 30, 3), S("g18"), .55)
put(sfx, boom(60, 30, 3.5), S("h7"), .25)

# ---- opening: reuse designed opening track ----
op, osr = sf.read(ROOT + "public/audio/opening_sfx.wav", dtype="float32")
op = op.mean(1) if op.ndim > 1 else op
cut = int((L["a1"]["start"] + .2) * SR)
op = op[:cut].copy(); op[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
sfx[: len(op)] += op * 0.6

# ---- ambience (very low) ----
brown = np.cumsum(rng.standard_normal(N).astype(np.float32)); brown -= np.convolve(brown, np.ones(4800, np.float32) / 4800, "same")
amb = norm(band(brown, 30, 250)) * .05
amb[: len(op)] = 0

# ---- ducking under VO ----
vo, vsr = sf.read(ROOT + "public/audio/pilot_vo.wav", dtype="float32")
vo = vo.mean(1) if vo.ndim > 1 else vo
hop = vsr // 50
venv = np.array([np.abs(vo[i:i + hop]).mean() for i in range(0, len(vo), hop)])
active = (venv > 0.01).astype(np.float32)
k = np.ones(25) / 25; active = np.clip(np.convolve(active, k, "same") * 2, 0, 1)
duck = 1 - 0.45 * np.interp(t, np.arange(len(active)) * hop / vsr, active).astype(np.float32)
duck[: len(op)] = 1

mix = music * 0.4 * duck + sfx + amb * 0.6 * duck
mix = np.tanh(mix * 1.3).astype(np.float32) * .8
sf.write(ROOT + "public/audio/pilot_sfx.wav", np.stack([mix, mix], 1), SR)
print("ok", round(DUR, 1), "s, peak", float(np.abs(mix).max()), "shots", len(shots))
