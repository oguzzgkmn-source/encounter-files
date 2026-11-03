"""Encounter File #002 — 30s test (cold open). tts = phonetic text, text = display."""
import json
L = []
def s(id, text, pause=0.3, tts=None): L.append({"id": id, "text": text, "tts": tts or text, "pause": pause})
s("o1", "July 6, 1967.", .5, "July sixth, nineteen sixty-seven.")
s("o2", "The research submarine Alvin is two thousand feet down, off the coast of Florida.", .5)
s("o3", "Down here, there is no light. No sound.", .35)
s("o4", "Nothing should be moving fast enough to hit you.", .5)
s("o5", "Then something does.", 1.0)
s("o6", "When Alvin finally reaches the surface, the crew finds the problem.", .3)
s("o7", "Stuck in the hull is a swordfish.", .6)
s("o8", "A fish attacked a submarine.", .3)
s("o9", "And the submarine had to retreat.", .8)
s("o10", "Encounter File number two. The sword.", 1.6)
json.dump(L, open("/home/user/encounter-files/scripts/file002_test_lines.json", "w"), indent=1)
print(len(L), sum(len(x["text"].split()) for x in L), "words")
