import os
from pathlib import Path
from TTS.api import TTS

# Setup paths (using the Docker-mapped paths from existing scripts)
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)
ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# Targeted tasks for 'pere'
# We use variations that usually yield better pronunciation for short words
tasks = {
    "le_p_re": "Le père.",
    "le_grand_p_re": "Le grand-père.",
    "papa": "Papa.",
}

print("Initializing XTTS model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

for key, text in tasks.items():
    file_path = output_dir / f"{key}.wav"
    print(f"\n>>> Regenerating {key}: '{text}'")
    try:
        model.tts_to_file(
            text=text, 
            file_path=str(file_path), 
            speaker_wav=ref_voice, 
            language="fr"
        )
        print(f"Success: {file_path}")
    except Exception as e:
        print(f"Error generating {key}: {e}")

print("\nRegeneration of 'père' related audio for French Girl is complete!")
