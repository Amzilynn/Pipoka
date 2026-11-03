import os
import json
from pathlib import Path

# Paths below are project-root relative, so resolve them from this file's location.
ROOT = Path(__file__).resolve().parents[3]

def get_recording_path_slug(text):
    import re
    # Replicate the logic from validate_tts_paths.mjs
    normalized = text.lower()
    normalized = re.sub(r'[^a-z0-9\u0600-\u06FF]', '_', normalized)
    normalized = re.sub(r'_+', '_', normalized)
    normalized = normalized.strip('_')
    return normalized[:50]

# Load manifest keys
manifest_keys_path = ROOT / "scripts" / "data" / "full_manifest_keys.json"
with open(manifest_keys_path, 'r', encoding='utf-8') as f:
    full_manifest = json.load(f)

boy_keys = full_manifest['fr']['boy']
recordings_dir = ROOT / "public/recordings/fr/boy"

missing_keys = []
for key in boy_keys:
    # The key itself is the slug used in the filename
    filename = f"{key}.wav"
    file_path = recordings_dir / filename
    if not file_path.exists():
        missing_keys.append(key)

print(f"Total keys in manifest for boy/fr: {len(boy_keys)}")
print(f"Missing files: {len(missing_keys)}")
for key in missing_keys:
    print(f"MISSING: {key}")
