"""Build English SRT captions from VO line timings (display text), splitting long lines."""
import json, textwrap, sys
tm = json.load(open(sys.argv[1])); out = sys.argv[2]
def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"
cues = []
for l in tm["lines"]:
    text, s, e = l["text"], l["start"], l["end"]
    rows = textwrap.wrap(text, 42)
    chunks = [rows[i:i + 2] for i in range(0, len(rows), 2)]
    total = sum(len(" ".join(c)) for c in chunks); t = s
    for c in chunks:
        d = (e - s) * len(" ".join(c)) / total
        cues.append((t, t + d, "\n".join(c))); t += d
with open(out, "w") as f:
    for i, (a, b, txt) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")
print(len(cues), "cues")
