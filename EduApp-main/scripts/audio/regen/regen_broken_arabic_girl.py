import os
from pathlib import Path
try:
    from TTS.api import TTS
except ImportError:
    print("TTS package not found. This script must be run in the environment where XTTS is installed.")
    exit(1)

# 1. Setup paths
base_dir = Path("c:/Users/Dr.console/Desktop/EDUAPP-Antigravity")
output_dir = base_dir / "public" / "recordings" / "ar" / "girl"
ref_voice = base_dir / "reference_voices" / "XTTSV2" / "Arabicgirl" / "girlarb_ref.wav"

if not ref_voice.exists():
    print(f"Reference voice not found at {ref_voice}")
    exit(1)

# 2. Tasks marked as REGENERATE by user
tasks = {
    "instr_color": "اسحب الكلمة إلى اللون الصحيح!",
    "instr_order": "رتب الحروف لتكوين الكلمة!",
    "instr_questions": "أجب على الأسئلة التالية",
    "selection_cat": "أي فئة تريد استكشافها؟",
    "triangle_white": "مثلث أبيض",
    "triangle_blue": "مثلث أزرق",
    "triangle_orange": "مثلث برتقالي",
    "triangle_purple": "مثلث بنفسجي",
    "triangle_grey": "مثلث رمادي",
    "triangle_pink": "مثلث وردي"
}

# 3. Initialize Model
print("Initializing XTTS model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

# 4. Generate
for key, text in tasks.items():
    print(f"\n>>> Regenerating {key}: '{text}'")
    # Generate 3 variants for each to be safe
    for v in range(1, 4):
        wav_name = f"{key}_v{v}.wav"
        wav_path = output_dir / wav_name
        try:
            model.tts_to_file(
                text=text,
                file_path=str(wav_path),
                speaker_wav=str(ref_voice),
                language="ar"
            )
            print(f"  Generated variant V{v}")
        except Exception as e:
            print(f"  Error: {e}")

print("\nRegeneration complete! Please check the tester to PICK the best one.")
