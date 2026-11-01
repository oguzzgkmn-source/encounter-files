"""Synthesise ambience, drone and SFX for the opening, timed from the VO timings."""
import json, sys, numpy as np, soundfile as sf
SR = 48000
tm = json.load(open(sys.argv[1])); out = sys.argv[2]
T = {l["id"]: l for l in tm["lines"]}
dur = tm["duration"] + 1.4
N = int(dur * SR); t = np.arange(N) / SR
rng = np.random.default_rng(7)
mix = np.zeros(N)

def band(x, lo, hi):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x))
def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e
def put(sig, at, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[: j - i] * gain
def ramp(points):  # [(time, value)] -> automation curve
    xs, ys = zip(*points); return np.interp(t, xs, ys)

# underwater ambience: filtered brown noise + slow swell
brown = np.cumsum(rng.standard_normal(N)); brown -= np.convolve(brown, np.ones(4800) / 4800, 'same')
amb = band(brown, 30, 300); amb /= np.abs(amb).max()
red_t = T["s7"]["end"] - 0.45
amb_auto = ramp([(0, 0), (1, .35), (red_t, .45), (T["s7"]["end"] + .1, 0), (T["s8"]["start"], .25), (dur, .2)])
mix += amb * amb_auto * 0.5

# drone: A1 + E2 + dissonant Bb rising in, tremolo
dr = (np.sin(2 * np.pi * 55 * t) + .6 * np.sin(2 * np.pi * 82.4 * t) + .35 * np.sin(2 * np.pi * 110.3 * t)) * (0.8 + .2 * np.sin(2 * np.pi * .25 * t))
dis = np.sin(2 * np.pi * 116.5 * t) * .5
dr_auto = ramp([(0, .1), (T["s3"]["start"], .18), (T["s6"]["start"], .28), (red_t, .45), (T["s7"]["end"] + .1, 0), (T["s8"]["start"], .15), (T["s9"]["start"], .2), (dur - 1, .35), (dur, 0)])
dis_auto = ramp([(0, 0), (T["s6"]["start"], 0), (red_t, .5), (T["s7"]["end"], 0), (T["s9"]["start"], .1), (dur, 0)])
mix += (dr * dr_auto + dis * dis_auto) * 0.45

def ping(f0=1250, length=2.2):
    n = int(length * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 3.2)
    for d, g in [(.28, .35), (.6, .18), (.95, .08)]:
        k = int(d * SR); s[k:] += s[: n - k] * g
    return s * env(n, .005, .3)
def whoosh(length=0.7, lo=300, hi=3000):
    n = int(length * SR); x = rng.standard_normal(n)
    x = band(x, lo, hi); x /= np.abs(x).max()
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return x * e
def boom(f0=70, f1=32, length=2.5):
    n = int(length * SR); tt = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-tt * 6); ph = 2 * np.pi * np.cumsum(fr) / SR
    s = np.sin(ph) * np.exp(-tt * 1.8)
    click = band(rng.standard_normal(n), 60, 900) * np.exp(-tt * 30); click /= np.abs(click).max()
    return (s + .5 * click) * env(n, .002, .4)
def riser(length):
    n = int(length * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = n // 12
    for i in range(12):
        lo = 200 + i * 300; out[i * seg:(i + 1) * seg] = band(x[i * seg:(i + 1) * seg], lo, lo * 2.5)
    out /= np.abs(out).max(); return out * np.linspace(0, 1, n) ** 2
def bubble():
    n = int(.08 * SR); tt = np.arange(n) / SR; f = 500 + 900 * tt / tt[-1]
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 40)
def thump(): return boom(55, 40, .6)

fps = 30
put(ping(), .25, .25)
for k in range(14): put(bubble(), .5 + rng.random() * (T["s7"]["start"] - 1), .08)
put(whoosh(.35, 800, 5000), T["s3"]["start"] + 0.40, .25)          # snap zoom
put(whoosh(.6, 250, 2500), T["s3"]["start"] + 24 / fps - .1, .55)   # squid dart
put(thump(), T["s3"]["start"] + 30 / fps, .6)
put(ping(1400), T["s4"]["start"], .4)
put(ping(1100), T["s5"]["start"], .4)
for i, d in enumerate([0, .35, .62, .84, 1.02, 1.17, 1.3, 1.41, 1.5, 1.58, 1.65]):
    put(ping(1250 + 40 * i, 1.0), T["s6"]["start"] + d, .28)
put(riser(red_t - T["s7"]["start"]), T["s7"]["start"], .3)
put(boom(90, 30, 3), red_t, .9)
put(whoosh(1.2, 100, 900), red_t, .4)
put(thump(), T["s7"]["end"] + .45, .5); put(thump(), T["s7"]["end"] + .85, .4)
put(boom(), T["s9"]["start"], .85)
put(boom(80, 28, 3.5), T["s10"]["start"], 1.0)

mix = np.tanh(mix * 1.2) * .7
st = np.stack([mix, mix], 1)
sf.write(out, st.astype(np.float32), SR)
print("ok", dur, np.abs(mix).max())
