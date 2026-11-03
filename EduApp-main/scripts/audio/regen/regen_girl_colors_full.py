import os
import json
from pathlib import Path

# Mapping of color keys to their feminine spoken form in French
colors = {
    "rouge": "La couleur rouge.",
    "bleu": "La couleur bleue.",
    "jaune": "La couleur jaune.",
    "noir": "La couleur noire.",
    "blanc": "La couleur blanche.",
    "vert": "La couleur verte.",
    "orange": "La couleur orange.",
    "rose": "La couleur rose.",
    "violet": "La couleur violette.",
    "gris": "La couleur grise."
}

output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False 
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

for color_key, text_to_say in colors.items():
    file_name = f"{color_key}.wav"
    out_path = output_dir / file_name

    print(f"Synthesizing [{file_name}] ('{color_key}'): '{text_to_say}'")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref_voice_path,
            language="fr"
        )
    except Exception as e:
        print(f"Error on {file_name}: {e}")

print(f"Done! Regenerated {len(colors)} color audio files for girl voice.")
