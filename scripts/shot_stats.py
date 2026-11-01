"""Parse SHOTS from Pilot.tsx and print shot timing stats."""
import json, re, sys
base = "/home/user/encounter-files/src/pilot/"
T = {l["id"]: l for l in json.load(open(base + "timings.json"))["lines"]}
total = json.load(open(base + "timings.json"))["duration"]
src = open(base + "Pilot.tsx").read().split("export const SHOTS: S[] = [")[1]
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
rows = []
for e in ents:
    m = re.match(r"\s*'([a-z]\d+)',\s*(\w+)", e)
    off = re.search(r"\}\s*,\s*([\d.]+)\s*$", e)
    rows.append((m.group(1), m.group(2), float(off.group(1)) if off else 0))
starts = [0 if i == "s1" else T[i]["start"] + o for i, _, o in rows]
durs = [(rows[k][0], rows[k][1], round((starts[k + 1] if k + 1 < len(rows) else total) - starts[k], 1)) for k in range(len(rows))]
print(len(rows), "shots, avg", round(total / len(rows), 2), "s")
print("long>7:", [d for d in durs[1:] if d[2] > 7])
print("short<1.5:", [d for d in durs if d[2] < 1.5])
