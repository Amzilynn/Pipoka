import os
from pathlib import Path

output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)

from TTS.api import TTS
use_gpu = False 
print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"
file_name = "vert.wav"
out_path = output_dir / file_name

# Trying a different phonetic hint to get the masculine 'vert' (/vɛʁ/)
# 'Vèrr' might provide a better open 'e' and distinct 'r'
text_to_say = "Vèrr"

print(f"Synthesizing [{file_name}] with phonetic hint: '{text_to_say}'")
model.tts_to_file(
    text=text_to_say,
    file_path=str(out_path),
    speaker_wav=ref_voice_path,
    language="fr"
)
print("Done!")
