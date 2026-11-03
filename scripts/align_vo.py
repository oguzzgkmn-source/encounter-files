"""Align an externally generated narration (one audio file) to the script lines.

Usage: python3 scripts/align_vo.py <audio> <narration.txt> <out_timings.json> <out_wav> [id_prefix]

Method: detect candidate pauses (silencedetect), then dynamic programming that maps the
sentence boundaries onto pauses so that segment durations match the expected duration from
character counts; boundaries without a matching pause are interpolated by characters.
"""
import json, re, subprocess, sys
import numpy as np

audio, txt, out_json, out_wav = sys.argv[1:5]
prefix = sys.argv[5] if len(sys.argv) > 5 else "x"

# ---- script lines (blank line = section break) ----
lines, section, brk = [], 0, set()
for raw in open(txt).read().splitlines():
    if not raw.strip():
        if lines: brk.add(len(lines) - 1)  # boundary after this line is a section break
        continue
    lines.append(raw.strip())
n = len(lines)
chars = np.array([len(re.sub(r"[^A-Za-z0-9]", "", l)) + 4 for l in lines], float)

# ---- decode to 48k mono wav (used by render) ----
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", audio, "-ac", "1", "-ar", "48000", out_wav], check=True)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out_wav], capture_output=True, text=True).stdout)

# ---- candidate pauses ----
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", out_wav, "-af", "silencedetect=noise=-36dB:d=0.09", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
gaps = []
for a, b in zip(st, en):
    if gaps and a - gaps[-1][1] < 0.06: gaps[-1][1] = b  # merge fragments
    else: gaps.append([a, b])
speech_start = gaps[0][1] if gaps and gaps[0][0] < 0.05 else 0.0
speech_end = gaps[-1][0] if gaps and gaps[-1][1] > dur - 0.05 else dur
cand = [(a, b) for a, b in gaps if a > speech_start + 0.2 and b < speech_end - 0.1]
m = len(cand)
cmid = np.array([(a + b) / 2 for a, b in cand]); clen = np.array([b - a for a, b in cand])

# expected speaking rate (seconds per char), excluding pauses at ~0.3 s per boundary
rate = (speech_end - speech_start - 0.3 * (n - 1)) / chars.sum()
cum = np.concatenate([[0], np.cumsum(chars)])  # chars before line k

# DP over boundaries k=0..n-2 (between line k and k+1); state = matched candidate j
INF = 1e18
MAXSKIP, WIN = 4, 14
P_SKIP = 3.0
best = np.full((n - 1, m), INF); back = np.full((n - 1, m, 2), -1, int)
def seg_cost(t0, t1, c0, c1, nb):
    pred = rate * (cum[c1] - cum[c0]) + 0.3 * nb
    sig = 0.25 + 0.12 * pred
    return ((t1 - t0) - pred) ** 2 / sig ** 2
def gap_reward(k, j):
    r = 2.5 * min(clen[j], 0.7)
    if k in brk: r += 2.0 * min(clen[j], 1.0)
    return -r
# initial: from speech_start (line 0 begins) to boundary k
for k in range(min(MAXSKIP, n - 1)):
    for j in range(m):
        c = seg_cost(speech_start, cmid[j], 0, k + 1, k) + P_SKIP * k + gap_reward(k, j)
        if c < best[k, j]: best[k, j] = c; back[k, j] = (-1, -1)
for k in range(n - 1):
    for j in range(m):
        if best[k, j] >= INF: continue
        for k2 in range(k + 1, min(k + 1 + MAXSKIP, n - 1)):
            for j2 in range(j + 1, min(j + 1 + WIN, m)):
                c = best[k, j] + seg_cost(cmid[j], cmid[j2], k + 1, k2 + 1, k2 - k - 1) + P_SKIP * (k2 - k - 1) + gap_reward(k2, j2)
                if c < best[k2, j2]: best[k2, j2] = c; back[k2, j2] = (k, j)
# finish: last matched boundary k must reach end within MAXSKIP
fin = INF; arg = None
for k in range(max(0, n - 1 - MAXSKIP), n - 1):
    for j in range(m):
        if best[k, j] >= INF: continue
        c = best[k, j] + seg_cost(cmid[j], speech_end, k + 1, n, n - 2 - k) + P_SKIP * (n - 2 - k)
        if c < fin: fin = c; arg = (k, j)
match = {}
k, j = arg
while k >= 0:
    match[k] = j
    k, j = back[k, j]
# ---- line start/end times ----
bounds = {}  # boundary k -> (end of line k, start of line k+1)
for k, j in match.items(): bounds[k] = (cand[j][0], cand[j][1])
anchors = [(-1, speech_start)] + sorted((k, (bounds[k][0] + bounds[k][1]) / 2) for k in bounds) + [(n - 1, speech_end)]
for (ka, ta), (kb, tb) in zip(anchors, anchors[1:]):
    for k in range(ka + 1, kb):  # interpolate unmatched boundaries by chars
        t = ta + (tb - ta) * (cum[k + 1] - cum[ka + 1]) / (cum[kb + 1] - cum[ka + 1])
        bounds[k] = (t, t)
starts = [speech_start] + [bounds[k][1] for k in range(n - 1)]
ends = [bounds[k][0] for k in range(n - 1)] + [speech_end]
out = {"duration": round(dur, 3), "lines": [{"id": f"{prefix}{i + 1:03d}", "text": lines[i], "start": round(starts[i], 3), "end": round(ends[i], 3)} for i in range(n)]}
json.dump(out, open(out_json, "w"), indent=1)
# ---- report ----
cps = [chars[i] / max(0.05, ends[i] - starts[i]) for i in range(n)]
print(f"lines {n}, candidates {m}, matched {len(match)}/{n - 1}, rate {1/rate:.1f} chars/s")
print("chars/sec per line: median %.1f, p5 %.1f, p95 %.1f" % (np.median(cps), np.percentile(cps, 5), np.percentile(cps, 95)))
odd = [(i + 1, round(cps[i], 1), lines[i][:50]) for i in range(n) if cps[i] < np.median(cps) * 0.55 or cps[i] > np.median(cps) * 1.6]
print("outliers:", odd[:15])
