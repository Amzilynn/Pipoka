import os
import json
from pathlib import Path
import sys

output_dir = Path("/mnt/EDUAPP/public/recordings/fr/boy")
output_dir.mkdir(parents=True, exist_ok=True)

texts = {
    "marron": "Marron.",
    "violet": "Violet.",
}

print("Initializing TTS...")
from TTS.api import TTS
use_gpu = False
print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

for key, text in texts.items():
    for version in range(1, 4):
        file_name = f"{key}_v{version}.wav"
        out_path = output_dir / file_name

        print(f"Synthesizing [{file_name}] ('{key}'): '{text}'")
        try:
            model.tts_to_file(
                text=text,
                file_path=str(out_path),
                speaker_wav=ref_voice_path,
                language="fr"
            )
            print(f"Success: {out_path}")
        except Exception as e:
            print(f"Error on {file_name}: {e}")

print("Done generating multiple versions of marron and violet for boy fr!")
