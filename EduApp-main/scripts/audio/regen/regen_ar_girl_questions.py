import os
from pathlib import Path

# Paths configured for the Docker container (/mnt/EDUAPP)
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
output_dir = Path("/mnt/EDUAPP/public/recordings/ar/girl")
output_dir.mkdir(parents=True, exist_ok=True)

# Phrases to regenerate (using diacritics for better XTTS pronunciation)
phrases = {
    # Instructions
    "instr_order.wav": "رَتِّبِ الْحُرُوفَ لِتَكْوِينِ الْكَلِمَةِ!",
    "instr_questions.wav": "أَجِبْ عَلَى الْأَسْئِلَةِ التَّالِيَةِ",
    
    # Missing/Original Alphabet Words
    "bag.wav": "مِحْفَظَة",
    "teacher.wav": "مُعَلِّمَة",
    "school.wav": "مَدْرَسَة",
    "friend.wav": "صَدِيقِي",
    "cat.wav": "قِطَّة",
    "dog.wav": "كَلْب",
    "sheep.wav": "خَرُوف",

    # Current Alphabet Words
    "qalam.wav": "قَلَم",
    "kitab.wav": "كِتَاب",
    "bayt.wav": "بَيْت",
    "qamar.wav": "قَمَر",
    "shams.wav": "شَمْس",
    "mother.wav": "أُمِّي",
    "father.wav": "أَبِي",
    "sister.wav": "أُخْتِي",
    "brother.wav": "أَخِي",
    "asad.wav": "أَسَد",
    "jamal.wav": "جَمَل",
    "bahr.wav": "بَحْر",
    "warda.wav": "وَرْدَة",
    "samaka.wav": "سَمَكَة",
    "ba9ara.wav": "بَقَرَة",
}

from TTS.api import TTS
print("Loading XTTS-v2 model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

print("=" * 50)
print("Starting generation for Arabic girl alphabet words & instructions...")
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
        print(f"  -> Saved: {file_name}")
    except Exception as e:
        print(f"  -> ERROR generating {file_name}: {e}")

print("\n" + "=" * 50)
print("All requested files have been generated!")
print("=" * 50)
