"""Sound design for the #002 30s test: deep drone, sub hum, sonar, impact + metal clank, alarm, surface waves, title hit."""
import json, numpy as np, soundfile as sf
ROOT = "/home/user/encounter-files/"; SR = 48000
tm = json.load(open(ROOT + "src/file002/test_timings.json")); L = {l["id"]: l for l in tm["lines"]}
DUR = tm["duration"]; N = int(DUR * SR); t = np.arange(N, dtype=np.float32) / SR
rng = np.random.default_rng(5); out = np.zeros(N, np.float32)
S = lambda i: L[i]["start"]; shot = lambda i: L[i]["start"] - 4 / 30
IMPACT = shot("o5") + 24 / 30
def band(x, lo, hi):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)
norm = lambda x: x / (np.abs(x).max() + 1e-9)
def put(sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if 0 <= i < N: out[i:j] += sig[: j - i] * g
ramp = lambda pts: np.interp(t, *zip(*pts)).astype(np.float32)
def ping(f0=1250, length=2.0):
    n = int(length * SR); tt = np.arange(n) / SR; s = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 3)
    for d, g in [(.3, .35), (.65, .15)]:
        k = int(d * SR); s[k:] += s[: n - k] * g
    return s.astype(np.float32)
def whoosh(length, lo, hi):
    n = int(length * SR); return norm(band(rng.standard_normal(n).astype(np.float32), lo, hi)) * np.sin(np.linspace(0, np.pi, n)) ** 2
def boom(f0=90, f1=28, length=3.0):
    n = int(length * SR); tt = np.arange(n) / SR; fr = f1 + (f0 - f1) * np.exp(-tt * 6)
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 1.5)
    c = norm(band(rng.standard_normal(n).astype(np.float32), 60, 1200)) * np.exp(-tt * 25)
    return (s + .6 * c).astype(np.float32)
def clank(length=2.5):
    n = int(length * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * fq * tt) * np.exp(-tt * d) * a for fq, d, a in [(310, 2.2, 1), (467, 2.8, .7), (733, 3.5, .5), (1187, 5, .3)])
    return (s / 2).astype(np.float32)
def beep(f0, length=.18):
    n = int(length * SR); tt = np.arange(n) / SR; return (np.sign(np.sin(2 * np.pi * f0 * tt)) * .3 * np.minimum(1, (length - tt) * 40)).astype(np.float32)

# deep drone (until surface), dissonance rises toward impact
drone = (np.sin(2 * np.pi * 41.2 * t) + .6 * np.sin(2 * np.pi * 61.7 * t) + .3 * np.sin(2 * np.pi * 82.4 * t * 1.003)).astype(np.float32)
out += drone * ramp([(0, 0), (1.5, .16), (IMPACT - .2, .22), (IMPACT, .3), (shot("o6"), .0), (DUR, 0)])
dis = np.sin(2 * np.pi * 43.65 * t).astype(np.float32)
out += dis * ramp([(0, 0), (shot("o4"), 0), (IMPACT, .18), (shot("o6"), 0), (DUR, 0)])
# sub hum + pressure creaks during descent
hum = norm(band(rng.standard_normal(N).astype(np.float32), 50, 180))
out += hum * ramp([(0, 0), (shot("o2"), .0), (shot("o2") + 1, .12), (shot("o6"), .1), (shot("o6") + .3, 0), (DUR, 0)])
for k in range(5): put(clank(1.2) * .25, shot("o2") + 1 + k * 1.7 + rng.random(), .25)
# bubbles
for k in range(16):
    n = int(.08 * SR); tt = np.arange(n) / SR; fq = 500 + 900 * tt / tt[-1]
    put((np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-tt * 40)).astype(np.float32), shot("o2") + rng.random() * 5, .06)
# sonar: lonely ping in the dark, then accelerating pings for the contact
put(ping(1150, 2.5), shot("o3") + .4, .2)
for i, d in enumerate([0, .7, 1.25, 1.7, 2.05, 2.35, 2.6, 2.8]): put(ping(1250 + 25 * i, 1.0), shot("o4") + .2 + d, .22)
# dart + impact
put(whoosh(.7, 200, 3000), IMPACT - .55, .6)
put(boom(), IMPACT, 1.0); put(clank(), IMPACT, .7)
for k in range(10): put(beep(880 if k % 2 == 0 else 660), IMPACT + .5 + k * .32, .18)
# surface: waves + wind
waves = norm(band(rng.standard_normal(N).astype(np.float32), 150, 1500)) * (0.6 + 0.4 * np.sin(2 * np.pi * .15 * t)).astype(np.float32)
out += waves * ramp([(0, 0), (shot("o6") - .1, 0), (shot("o6") + .3, .14), (shot("o8"), .1), (shot("o8") + .4, 0), (DUR, 0)])
put(whoosh(.4, 600, 5000), shot("o6") - .15, .3)
# statement + title
put(boom(70, 35, 1.2), S("o8"), .35); put(boom(80, 30, 1.2), S("o9") - .05, .35)
pad = sum(np.sin(2 * np.pi * fq * t) for fq in (55, 82.4, 110, 164.8)).astype(np.float32) / 4
out += pad * ramp([(0, 0), (shot("o8"), 0), (shot("o8") + 1, .12), (shot("o10"), .14), (DUR - 1, .2), (DUR, 0)])
put(boom(100, 28, 3.5), shot("o10") + 4 / 30, 1.0); put(clank(3) * .6, shot("o10") + 4 / 30, .5)
mix = np.tanh(out * 1.2) * .75
sf.write(ROOT + "public/audio/f2test_sfx.wav", np.stack([mix, mix], 1).astype(np.float32), SR)
print("ok", round(DUR, 2), "impact at", round(IMPACT, 2))
