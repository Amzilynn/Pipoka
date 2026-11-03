import os
from pathlib import Path

# Paths configured for the Docker container (/mnt/EDUAPP)
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
output_dir = Path("/mnt/EDUAPP/final girl backup/Age 5/Alphabet")
output_dir.mkdir(parents=True, exist_ok=True)

# The phrases to regenerate with diacritics
phrases = {
    "dogVF0.wav": "كَلْب",
    "teacherVF0.wav": "مُعَلِّمَة",
    "اختر الفئة التي تريد استكشافهاVF0.wav": "اِخْتَرِ الْفِئَةَ الَّتِي تُرِيدُ اسْتِكْشَافَهَا!"
}

from TTS.api import TTS
print("Loading XTTS-v2 model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("=" * 50)
print("Synthesizing extra alphabet files...")
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
print("Done regenerating extra files!")
print("=" * 50)
