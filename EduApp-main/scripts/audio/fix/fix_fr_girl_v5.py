import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_fixed_v5")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. V5: Using Cross-Language Synthesis or Phonetic repeats for stability
# The user wants specific sounds: "em", "uh", "pay", "ee", "ay".
tasks = [
    {"key": "m", "text": "M.", "lang": "fr"},
    {"key": "e", "text": "Euh.", "lang": "fr"},
    {"key": "p", "text": "Pé.", "lang": "fr"},
    {"key": "i", "text": "I.", "lang": "fr"},
    {"key": "i_chapeau", "text": "I.", "lang": "fr"},
    {"key": "e_accent", "text": "É.", "lang": "fr"},
]

# Alternative idea: Use English to get those specific sounds if French is failing
# tasks_en = [
#     {"key": "m", "text": "M", "lang": "en"},
#     {"key": "e", "text": "uh", "lang": "en"},
#     {"key": "p", "text": "pay", "lang": "en"},
#     {"key": "i", "text": "ee", "lang": "en"},
#     {"key": "e_accent", "text": "A", "lang": "en"},
# ]

# 3. Run Synthesis
print("Initializing XTTS model...")
try:
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    for task in tasks:
        key = task["key"]
        text = task["text"]
        lang = task["lang"]
        file_path = output_dir / f"{key}.wav"
        print(f"\n>>> Synthesizing {key}: '{text}' in {lang}")
        try:
            # Adding a tiny bit of punctuation to avoid "not pronounced" issue
            model.tts_to_file(
                text=text, 
                file_path=str(file_path), 
                speaker_wav=str(ref_voice), 
                language=lang
            )
        except Exception as e:
            print(f"Error generating {key}: {e}")

    print(f"\nTargeted fixes V5 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
