"""Generate voice-over line by line with Kokoro, add pauses, write one wav + timings json."""
import json, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

TTS = "/home/user/encounter-files/tts/"
lines = json.load(open(sys.argv[1]))          # [{"id":..,"text":..,"pause":sec}]
out_wav, out_json = sys.argv[2], sys.argv[3]
k = Kokoro(TTS + "kokoro-v1.0.onnx", TTS + "voices-v1.0.bin")
sr, chunks, t, timings = 24000, [], 0.0, []
lead = 0.6
chunks.append(np.zeros(int(lead * sr), dtype=np.float32)); t = lead
for ln in lines:
    s, sr = k.create(ln["text"], voice="am_michael", speed=ln.get("speed", 0.95), lang="en-us")
    # trim leading/trailing near-silence
    idx = np.where(np.abs(s) > 0.01)[0]
    s = s[max(idx[0] - 200, 0): idx[-1] + 1200] if len(idx) else s
    d = len(s) / sr
    timings.append({"id": ln["id"], "text": ln["text"], "start": round(t, 3), "end": round(t + d, 3)})
    chunks += [s.astype(np.float32), np.zeros(int(ln.get("pause", 0.3) * sr), dtype=np.float32)]
    t += d + ln.get("pause", 0.3)
audio = np.concatenate(chunks)
sf.write(out_wav, audio, sr)
json.dump({"duration": round(len(audio) / sr, 3), "lines": timings}, open(out_json, "w"), indent=1)
print(json.dumps(timings, indent=1)); print("total", len(audio) / sr)
