import json
from pathlib import Path

manifest_path = "/mnt/EDUAPP/public/recordings/manifest.json"
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

boy_items = manifest['recordings']['ar']['boy']

output_dir = Path("/mnt/EDUAPP/public/recordings/ar/boy")
output_dir.mkdir(parents=True, exist_ok=True)

test_items = boy_items[:10]

def get_text(key):
    return key.replace("_", " ")

print("Initializing TTS...")
try:
    from TTS.api import TTS
    import torch
    use_gpu = False
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic boyy.mp4"

generated = 0
for item in test_items:
    file_name = item['file']
    key = item['key']
    text_to_say = get_text(key)
    out_path = output_dir / file_name

    print(f"Synthesizing [{file_name}] ('{key}'): '{text_to_say}'")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref_voice_path,
            language="ar"
        )
        generated += 1
    except Exception as e:
        print(f"Error on {file_name}: {e}")

print(f"Done! Generated {generated} audio files for Arabic boy voice (test).")
