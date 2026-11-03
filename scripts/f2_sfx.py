"""Sound design for Encounter File #002 (full). Music beds per section, cut whooshes, story cues, VO ducking.
Output: public/audio/f2_sfx.wav (stereo 48k). VO: public/audio/f2_vo.wav (user-supplied narration)."""
import json, re
import numpy as np, soundfile as sf

ROOT = "/home/user/encounter-files/"; SR = 48000
tm = json.load(open(ROOT + "src/file002/timings.json")); L = {l["id"]: l for l in tm["lines"]}
DUR = tm["duration"]; N = int(DUR * SR); t = np.arange(N, dtype=np.float32) / SR
rng = np.random.default_rng(21)
music = np.zeros(N, np.float32); sfx = np.zeros(N, np.float32)
S = lambda i, fr=0.0: L[i]["start"] + fr * (L[i]["end"] - L[i]["start"])
shot = lambda i: L[i]["start"] - 4 / 30

# ---------- shots (for cut whooshes) ----------
src = open(ROOT + "src/file002/Episode.tsx").read().split("export const SHOTS: S[] = [")[1]
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
for k, e in enumerate(ents):
    m = re.match(r"\s*'([a-z]\d+)',\s*(\w+)", e); off = re.search(r"\}\s*,\s*([\d.]+)\s*$", e)
    shots.append((m.group(1), m.group(2), 0.0 if k == 0 else shot(m.group(1)) + (float(off.group(1)) if off else 0)))

# ---------- dsp ----------
def band(x, lo, hi):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)
norm = lambda x: x / (np.abs(x).max() + 1e-9)
def put(buf, sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if 0 <= i < N: buf[i:j] += sig[: j - i] * g
ramp = lambda pts: np.interp(t, *zip(*pts)).astype(np.float32)
def noise(n): return rng.standard_normal(n).astype(np.float32)
def ping(f0=1250, length=2.0):
    n = int(length * SR); tt = np.arange(n) / SR; s = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 3)
    for d, g in [(.3, .35), (.65, .15)]:
        k = int(d * SR); s[k:] += s[: n - k] * g
    return s.astype(np.float32)
def whoosh(length, lo, hi):
    n = int(length * SR); return norm(band(noise(n), lo, hi)) * (np.sin(np.linspace(0, np.pi, n)) ** 2).astype(np.float32)
def boom(f0=90, f1=28, length=3.0):
    n = int(length * SR); tt = np.arange(n) / SR; fr = f1 + (f0 - f1) * np.exp(-tt * 6)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 1.5)
    c = norm(band(noise(n), 60, 1200)) * np.exp(-tt * 25)
    return (s + .6 * c).astype(np.float32)
def clank(length=2.5):
    n = int(length * SR); tt = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * fq * tt) * np.exp(-tt * d) * a for fq, d, a in [(310, 2.2, 1), (467, 2.8, .7), (733, 3.5, .5), (1187, 5, .3)]) / 2).astype(np.float32)
def beep(f0, length=.18):
    n = int(length * SR); tt = np.arange(n) / SR; return (np.sign(np.sin(2 * np.pi * f0 * tt)) * .3 * np.minimum(1, (length - tt) * 40)).astype(np.float32)
def tick(f0=2400):
    n = int(.04 * SR); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 120)).astype(np.float32)
def splash(length=1.6):
    n = int(length * SR); tt = np.arange(n) / SR; return (norm(band(noise(n), 300, 6000)) * np.exp(-tt * 3) * np.minimum(1, tt * 60)).astype(np.float32)
def bubble():
    n = int(.08 * SR); tt = np.arange(n) / SR; fq = 500 + 900 * tt / tt[-1]
    return (np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-tt * 40)).astype(np.float32)
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
def pad(chords, t0, t1, seg, amp=1.0, bright=0.4, det=0.004):
    i0, i1 = int(t0 * SR), int(min(t1, DUR) * SR); n = i1 - i0
    if n <= 0: return
    out = np.zeros(n, np.float32); tt = np.arange(n) / SR; s = 0.0; k = 0
    while s < t1 - t0:
        ch = chords[k % len(chords)]; a, b = int(s * SR), min(n, int((s + seg + 1.5) * SR)); st = tt[a:b] - s
        e = np.minimum(1, st / 1.5) * np.minimum(1, np.maximum(0, (seg + 1.5 - st) / 1.5)); v = np.zeros(b - a, np.float32)
        for m in ch:
            fq = NOTE(m)
            for d in (-det, det): v += np.sin(2 * np.pi * fq * (1 + d) * tt[a:b]) + bright * .3 * np.sin(4 * np.pi * fq * tt[a:b])
        out[a:b] += v * e / (len(ch) * 2); s += seg; k += 1
    fade = np.minimum(1, np.minimum(tt / 2, (tt[-1] - tt) / 2)); music[i0:i1] += out * fade * amp
def pulse(t0, t1, bpm, amp, every=1):
    x = t0; i = 0
    while x < t1:
        if i % every == 0: put(music, boom(60, 42, .5), x, amp)
        x += 60 / bpm; i += 1
def ticks(t0, t1, bpm, amp):
    x = t0
    while x < t1: put(music, tick(), x, amp); x += 60 / bpm

# ---------- cold open (w001–w011), same design as the approved test ----------
IMPACT = shot("w006") + 24 / 30
drone = (np.sin(2 * np.pi * 41.2 * t) + .6 * np.sin(2 * np.pi * 61.7 * t) + .3 * np.sin(2 * np.pi * 82.4 * t * 1.003)).astype(np.float32)
music += drone * ramp([(0, 0), (1.5, .16), (IMPACT - .2, .22), (IMPACT, .3), (shot("w007"), 0), (DUR, 0)])
music += np.sin(2 * np.pi * 43.65 * t).astype(np.float32) * ramp([(0, 0), (shot("w005"), 0), (IMPACT, .18), (shot("w007"), 0), (DUR, 0)])
hum = norm(band(noise(N), 50, 180))
sfx += hum * ramp([(0, 0), (shot("w002"), 0), (shot("w002") + 1, .12), (shot("w007"), .1), (shot("w007") + .3, 0), (DUR, 0)])
for k in range(5): put(sfx, clank(1.2) * .25, shot("w002") + 1 + k * 1.7 + rng.random(), .25)
for k in range(16): put(sfx, bubble(), shot("w002") + rng.random() * 5, .06)
put(sfx, ping(1150, 2.5), shot("w003") + .4, .2)
for i, d in enumerate([0, .7, 1.25, 1.7, 2.05, 2.35, 2.6, 2.8]): put(sfx, ping(1250 + 25 * i, 1.0), shot("w005") + .2 + d, .22)
put(sfx, whoosh(.7, 200, 3000), IMPACT - .55, .6); put(sfx, boom(), IMPACT, 1.0); put(sfx, clank(), IMPACT, .7)
for k in range(10): put(sfx, beep(880 if k % 2 == 0 else 660), IMPACT + .5 + k * .32, .18)
waves = norm(band(noise(N), 150, 1500)) * (0.6 + 0.4 * np.sin(2 * np.pi * .15 * t)).astype(np.float32)
put(sfx, whoosh(.4, 600, 5000), shot("w007") - .15, .3)
put(sfx, boom(70, 35, 1.2), S("w010"), .35); put(sfx, boom(80, 30, 1.2), S("w011") - .05, .35)

# ---------- section beds ----------
pad([[45, 52, 57], [45, 52, 58], [41, 48, 57], [45, 52, 57]], shot("w010"), shot("w020"), 5, .2)                  # 1: tense
put(sfx, boom(100, 28, 3.5), shot("w020") + 4 / 30, 1.0); put(sfx, clank(3) * .6, shot("w020") + 4 / 30, .5)          # title
pad([[50, 57, 62, 65], [46, 53, 62, 65], [48, 55, 60, 64], [45, 52, 61, 64]], shot("w022"), shot("w036"), 6, .16, .6)  # 2: file
pad([[40, 47, 52], [40, 47, 53], [43, 50, 55], [38, 45, 50]], shot("w036"), shot("w055"), 4, .16)                      # 3: speed
pulse(shot("w036") + .5, shot("w055") - .5, 100, .2, every=2)
pad([[57, 64, 69, 76], [53, 60, 69, 72], [55, 62, 67, 74], [52, 59, 67, 71]], shot("w055"), shot("w069"), 5, .13, .9)  # 4: curious
pad([[33, 40, 45], [33, 40, 46], [31, 38, 43], [34, 41, 46]], shot("w069"), shot("w087"), 6, .22, .2)                  # 5: encounters
pad([[45, 52], [45, 52]], shot("w087"), shot("w098"), 8, .12, .1)                                                       # 5b: somber, sparse
pad([[33, 40, 45], [31, 38, 43]], shot("w098"), shot("w103"), 5, .18, .2)
pad([[45, 52, 57], [44, 51, 57], [45, 52, 57], [41, 48, 53]], shot("w103"), shot("w131"), 4, .17)                      # 6: your move
ticks(shot("w108"), shot("w124"), 120, .09)
pad([[38, 45, 50, 57], [41, 48, 53, 60], [43, 50, 55, 62], [45, 52, 57, 64]], shot("w131"), shot("w142"), 6, .16, .5)  # 7: twist
pad([[48, 55, 60, 64], [53, 60, 65, 69], [55, 62, 67, 71], [48, 55, 60, 67]], shot("w142"), shot("w148"), 5, .2, .6)   #    comeback (major)
pad([[45, 52, 57, 64], [41, 48, 57, 60], [43, 50, 55, 62], [45, 52, 57, 64]], shot("w148"), DUR, 6, .17, .6)           # 8: resolve

# ---------- story cues ----------
for id, comp, st in shots[1:]:
    if comp == "CUT": put(sfx, whoosh(.25, 1500, 6000), st - .05, .04)
    elif st > shot("w011"): put(sfx, whoosh(.45, 300, 3500), st - .2, .08)
put(sfx, boom(100, 40, 1.4), S("w040") + 8 / 30, .5)                                   # ALMOST CERTAINLY WRONG
reel = norm(band(noise(int(3.2 * SR)), 1800, 5200)) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * np.arange(int(3.2 * SR)) / SR))).astype(np.float32)
put(sfx, reel * np.linspace(1, .6, len(reel)).astype(np.float32), shot("w041") + .1, .22)   # reel screaming
for k in range(60): put(sfx, bubble(), S("w050", .4) + k * .07, .05)                   # cavitation
put(sfx, whoosh(.35, 500, 4000), shot("w060") + 8 / 30, .45)                           # slash
put(sfx, whoosh(.6, 200, 2500), shot("w077") + .2, .4); put(sfx, splash(), S("w079"), .45)   # marlin jumps
put(sfx, boom(85, 35, 1.8), S("w080"), .9); put(sfx, clank(1.4), S("w080") + .1, .4); put(sfx, splash(2), S("w080", .8), .5)
put(sfx, boom(100, 40, 1.4), S("w096"), .5)                                             # UNRESOLVED
put(sfx, boom(), S("w108"), .5)                                                         # YOUR MOVE
for i in ["w109", "w113", "w117", "w121"]: put(sfx, tick(1600), S(i), .5)
put(sfx, splash(1.2), S("w118"), .3)
put(sfx, boom(110, 50, 1.2), S("w143") + 20 / 30, .45)                                  # REBUILT stamp
put(sfx, boom(110, 50, 1.2), shot("w156") + 14 / 30, .5)                                # FILE CLOSED
sizzle = norm(band(noise(int(3 * SR)), 2500, 9000)) * np.linspace(0, 1, int(3 * SR)).astype(np.float32) ** .3
put(sfx, sizzle, S("w152"), .12)
put(sfx, whoosh(.4, 1500, 7000), shot("w157") + 50 / 30, .5)                            # needle dart
# surface waves under boat / sea scenes
sea = ramp([(0, 0), (shot("w007") - .1, 0), (shot("w007") + .3, .14), (shot("w010"), .1), (shot("w010") + .4, 0),
            (shot("w069"), 0), (shot("w069") + .5, .1), (shot("w071"), 0),
            (shot("w077"), 0), (shot("w077") + .3, .14), (shot("w083"), 0),
            (shot("w087"), 0), (shot("w087") + .5, .08), (shot("w093"), 0),
            (shot("w103"), 0), (shot("w103") + .4, .12), (shot("w108"), 0), (shot("w112"), 0), (shot("w112") + .3, .1), (shot("w113"), 0),
            (shot("w116"), 0), (shot("w116") + .3, .1), (shot("w117"), 0), (DUR, 0)])
sfx += waves * sea

# ---------- duck music under VO, mix ----------
vo, vsr = sf.read(ROOT + "public/audio/f2_vo.wav", dtype="float32")
vo = vo.mean(1) if vo.ndim > 1 else vo
hop = vsr // 50
venv = np.array([np.abs(vo[i:i + hop]).mean() for i in range(0, len(vo), hop)])
active = np.clip(np.convolve((venv > 0.01).astype(np.float32), np.ones(25) / 25, "same") * 2, 0, 1)
duck = 1 - 0.45 * np.interp(t, np.arange(len(active)) * hop / vsr, active).astype(np.float32)
mix = music * 0.42 * duck + sfx
mix = np.tanh(mix * 1.25).astype(np.float32) * .8
sf.write(ROOT + "public/audio/f2_sfx.wav", np.stack([mix, mix], 1), SR)
print("ok", round(DUR, 1), "s, shots", len(shots), "impact", round(IMPACT, 2))
