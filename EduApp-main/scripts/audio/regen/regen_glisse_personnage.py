import os
import json
from pathlib import Path
import sys

manifest_path = "/mnt/EDUAPP/public/recordings/manifest.json"
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

girl_items = manifest['recordings']['fr']['girl']
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)

key_to_regenerate = "glisse_le_mot_vers_le_bon_personnage"

texts = {
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
}

print("Initializing TTS...")
from TTS.api import TTS
use_gpu = False 
print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

for item in girl_items:
    file_name = item['file']
    key = item['key']
    
    if key != key_to_regenerate:
        continue

    text_to_say = texts.get(key, key.replace("_", " ").capitalize())
    out_path = output_dir / file_name

    print(f"Synthesizing [{file_name}] ('{key}'): '{text_to_say}'")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref_voice_path,
            language="fr"
        )
        print(f"Success: {out_path}")
    except Exception as e:
        print(f"Error on {file_name}: {e}")

print("Done!")