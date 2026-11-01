import sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
text = ("Sea of Cortez. Night dive. Twelve metres down, your torch is the only light in the water. "
        "Then the beam catches something. One shape. Then ten. Then too many to count. "
        "And every single one of them... is turning red.")
for v in sys.argv[1:]:
    samples, sr = k.create(text, voice=v, speed=0.95, lang="en-us" if v[0]=="a" else "en-gb")
    sf.write(f"sample_{v}.wav", samples, sr)
    print(v, round(len(samples)/sr,1), "s")
