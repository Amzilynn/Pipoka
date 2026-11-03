import os
from pathlib import Path

output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)

# Phrases to regenerate
phrases = {
    "rose.wav": "Rose",
    "vert.wav": "Vert",
    "violet.wav": "Violet",
    "o_est_le_carr_bleu.wav": "Où est le carré bleu ?",
    "o_est_le_rectangle_vert.wav": "Où est le rectangle vert ?",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui.wav": "Qu'est-ce qu'on veut apprendre aujourd'hui ?"
}

from TTS.api import TTS
use_gpu = False
print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

for file_name, text_to_say in phrases.items():
    out_path = output_dir / file_name
    print(f"Synthesizing [{file_name}]: '{text_to_say}'")
    model.tts_to_file(
        text=text_to_say,
        file_path=str(out_path),
        speaker_wav=ref_voice_path,
        language="fr"
    )

print("Done!")
