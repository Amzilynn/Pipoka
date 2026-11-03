import os
from pathlib import Path
try:
    from TTS.api import TTS
except ImportError:
    print("TTS package not found. This script must be run in the environment where XTTS is installed.")
    exit(1)

# 1. Setup paths
base_dir = Path("c:/Users/Dr.console/Desktop/EDUAPP-Antigravity")
girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"
boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"
ref_dir = base_dir / "reference_voices" / "XTTSV2"
girl_ref = ref_dir / "Arabicgirl" / "girlarb_ref.wav"
boy_ref = ref_dir / "Arabicboy" / "arabic_boyy_ref.wav"

# 2. Tasks
tasks_girl = {
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

tasks_boy = {
    "instr_questions": "أجب على الأسئلة التالية",
    "sister": "الأخت"
}

# 3. Initialize Model
print("Initializing XTTS model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

def generate_variants(tasks, output_dir, ref_voice):
    for key, text in tasks.items():
        print(f"\n>>> Regenerating {key}: '{text}'")
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
                print(f"  Generated {wav_name}")
            except Exception as e:
                print(f"  Error: {e}")

print("\n--- Generating Girl Regens ---")
generate_variants(tasks_girl, girl_dir, girl_ref)

print("\n--- Generating Boy Regens ---")
generate_variants(tasks_boy, boy_dir, boy_ref)

print("\nAll regenerations complete!")
