"""
Generate ALL Arabic boy voice recordings from manifest.json
Reference voice: arabic boyy.mp4  (extracted → 22050Hz mono WAV, normalized)
Output:          public/recordings/ar/boy/<file>   (WAV, matching manifest)

Skips files that already exist — re-run safely after interruption.
Run inside Docker:
  docker run --rm --dns 8.8.8.8 \
    -v "C:\\...\\EDUAPP-Antigravity:/mnt/EDUAPP" \
    -w /mnt/EDUAPP xtts-tester python generate_all_boy_ar.py
"""

import os
import json
import subprocess
from pathlib import Path

# ─── 1. Prepare reference voice ───────────────────────────────────────────────
REF_SOURCE = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic boyy.mp4"
REF_WAV    = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic_boyy_ref.wav"

print("=" * 60)
print("Step 1: Extracting & normalizing arabic boyy.mp4 → arabic_boyy_ref.wav")
print("=" * 60)

result = subprocess.run(
    [
        "ffmpeg", "-y",
        "-i", REF_SOURCE,
        "-vn",                                    # strip video
        "-ac", "1",                               # mono
        "-ar", "22050",                           # XTTS required sample rate
        "-af", "loudnorm=I=-16:TP=-3:LRA=11",    # EBU R128 loudness normalize
        REF_WAV
    ],
    capture_output=True, text=True
)
if result.returncode != 0:
    print(f"ERROR: ffmpeg failed:\n{result.stderr}")
    exit(1)
print(f"  -> Reference WAV ready: {REF_WAV}\n")

# ─── 2. Load manifest ─────────────────────────────────────────────────────────
MANIFEST_PATH = "/mnt/EDUAPP/public/recordings/manifest.json"
with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

boy_items = manifest["recordings"]["ar"]["boy"]
print(f"Step 2: Loaded manifest — {len(boy_items)} Arabic boy entries to generate\n")

# ─── 3. Load XTTS model ───────────────────────────────────────────────────────
print("=" * 60)
print("Step 3: Loading XTTS-v2 model...")
print("=" * 60)
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError as e:
    print(f"ERROR: TTS module not found: {e}")
    exit(1)
print("  -> Model loaded.\n")

# ─── 4. Generate recordings ───────────────────────────────────────────────────
OUTPUT_DIR = Path("/mnt/EDUAPP/public/recordings/ar/boy")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

total     = len(boy_items)
generated = 0
skipped   = 0
errors    = 0

print("=" * 60)
print(f"Step 4: Synthesizing {total} recordings → {OUTPUT_DIR}")
print("=" * 60)

for i, item in enumerate(boy_items, 1):
    file_name = item["file"]          # e.g. "أحمر.wav"
    key       = item["key"]           # e.g. "أحمر"
    text      = key.replace("_", " ") # underscores → spaces for sentences

    out_path = OUTPUT_DIR / file_name

    # Skip already-done files
    if out_path.exists() and out_path.stat().st_size > 1000:
        print(f"[{i:3}/{total}] SKIP (exists): {file_name}")
        skipped += 1
        continue

    print(f"[{i:3}/{total}] Synthesizing: {file_name}  →  '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(out_path),
            speaker_wav=REF_WAV,
            language="ar"
        )
        generated += 1
        print(f"         ✓ Saved: {out_path}")
    except Exception as e:
        errors += 1
        print(f"         ✗ ERROR: {e}")

# ─── 5. Summary ───────────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"DONE — Arabic boy voice generation complete!")
print(f"  Generated : {generated}")
print(f"  Skipped   : {skipped}  (already existed)")
print(f"  Errors    : {errors}")
print(f"  Output    : {OUTPUT_DIR}")
print("=" * 60)
