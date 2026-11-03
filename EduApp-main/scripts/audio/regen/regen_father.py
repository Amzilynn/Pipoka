import os
from pathlib import Path

# Paths configured for the Docker container (/mnt/EDUAPP)
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
output_dir = Path("/mnt/EDUAPP/final girl backup/Age 3/Family")
output_dir.mkdir(parents=True, exist_ok=True)

# The phrase to regenerate with explicit diacritics to enforce "al abb" pronunciation
text_to_say = "اَلْأَبُّ"
file_name = "الأبّVF0.wav"
out_path = output_dir / file_name

from TTS.api import TTS
print("Loading XTTS-v2 model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("=" * 50)
print(f"Synthesizing [{file_name}]: '{text_to_say}'")
print("=" * 50)

try:
    model.tts_to_file(
        text=text_to_say,
        file_path=str(out_path),
        speaker_wav=ref_voice_path,
        language="ar"
    )
    print(f"  -> Saved successfully to: {out_path}")
except Exception as e:
    print(f"  -> ERROR generating {file_name}: {e}")

print("Done!")
