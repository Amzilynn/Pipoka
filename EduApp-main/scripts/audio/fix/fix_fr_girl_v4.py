import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_fixed_v4")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. Re-targeted tasks based on specific pronunciation instructions
# Using phonetic strings that align with the user's "Sound like" descriptions
tasks = {
    "m": "Emme.",       # Pronounced "em"
    "e": "Euh.",        # Pronounced "uh" (soft)
    "p": "Pé.",         # Pronounced "pay"
    "i": "i.",          # Pronounced "ee"
    "i_chapeau": "i.",  # Pronounced "ee"
    "e_accent": "É.",   # Pronounced "ay"
}

# 3. Run Synthesis
print("Initializing XTTS model...")
try:
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    for key, text in tasks.items():
        file_path = output_dir / f"{key}.wav"
        print(f"\n>>> Synthesizing {key}: '{text}'")
        try:
            # We add some padding/silence or punctuation to help XTTS with short sounds
            # Sometimes a space and a period helps
            model.tts_to_file(
                text=text, 
                file_path=str(file_path), 
                speaker_wav=str(ref_voice), 
                language="fr"
            )
        except Exception as e:
            print(f"Error generating {key}: {e}")

    print(f"\nTargeted fixes V4 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
