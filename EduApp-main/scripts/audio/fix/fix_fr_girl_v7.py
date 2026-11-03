import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_fixed_v7")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. V7: Phonetic fine-tuning for remaining letters
# Using "C'est la lettre" prefix but with optimized phonetic targets
tasks = {
    "m": "C'est la lettre emme.",   # em sound
    "i": "C'est la lettre i.",      # ee sound
    "i_chapeau": "C'est la lettre i.", # ee sound
    "e_accent": "C'est la lettre é.",   # ay sound
}

# 3. Run Synthesis
print("Initializing XTTS model...")
try:
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    for key, text in tasks.items():
        file_path = output_dir / f"{key}.wav"
        print(f"\n>>> Synthesizing {key}: '{text}'")
        try:
            model.tts_to_file(
                text=text, 
                file_path=str(file_path), 
                speaker_wav=str(ref_voice), 
                language="fr"
            )
        except Exception as e:
            print(f"Error generating {key}: {e}")

    print(f"\nTargeted fixes V7 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
