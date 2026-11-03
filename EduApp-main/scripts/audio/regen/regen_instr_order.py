import os
import time
from pathlib import Path

# Paths configured for the Docker container (/mnt/EDUAPP)
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
output_dir = Path("/mnt/EDUAPP/public/recordings/ar/girl")
output_dir.mkdir(parents=True, exist_ok=True)

# The phrase to regenerate with variants
text_to_say = "رَتِّبِ الْحُرُوفَ لِتَكْوِينِ الْكَلِمَةِ!"
base_filename = "instr_order"

from TTS.api import TTS
print("Loading XTTS-v2 model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("=" * 50)
print(f"Generating 3 variants for: {base_filename}")
print(f"Text: {text_to_say}")
print("=" * 50)

for v in range(1, 4):
    file_name = f"{base_filename}_v{v}.wav"
    out_path = output_dir / file_name
    print(f"\nSynthesizing [{file_name}]...")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref_voice_path,
            language="ar"
        )
        print(f"  -> Saved: {file_name}")
        time.sleep(0.5)  # slight pause between generations
    except Exception as e:
        print(f"  -> ERROR generating {file_name}: {e}")

print("\n" + "=" * 50)
print("All 3 variants have been generated!")
print("=" * 50)
