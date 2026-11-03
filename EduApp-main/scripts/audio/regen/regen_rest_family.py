import os
from pathlib import Path

# Paths configured for the Docker container (/mnt/EDUAPP)
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
output_dir = Path("/mnt/EDUAPP/final girl backup/Age 3/Family")
output_dir.mkdir(parents=True, exist_ok=True)

# The rest of the family members to regenerate with explicit diacritics
# This forces the pronunciation of "al akh", "al okht", "al jadd", "al jaddah"
phrases = {
    "الأخVF0.wav": "اَلْأَخُ",
    "الأختVF0.wav": "اَلْأُخْتُ",
    "الجدVF0.wav": "اَلْجَدُّ",
    "الجدةVF0.wav": "اَلْجَدَّةُ"
}

from TTS.api import TTS
print("Loading XTTS-v2 model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("=" * 50)
print("Synthesizing the rest of the Family members...")
print("=" * 50)

for file_name, text_to_say in phrases.items():
    out_path = output_dir / file_name
    print(f"\nSynthesizing [{file_name}]: '{text_to_say}'")
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

print("\n" + "=" * 50)
print("Done regenerating family members!")
print("=" * 50)
