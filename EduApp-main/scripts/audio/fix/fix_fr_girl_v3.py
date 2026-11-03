import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_fixed_v3")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. Refined tasks for failed letters
# Trying "C'est la lettre..." for more stability and better focus on the letter sound.
tasks = {
    "m": "C'est la lettre emme.",
    "e": "C'est la lettre euh.",
    "p": "C'est la lettre pé.",
    "i_chapeau": "C'est la lettre i.", # Focusing on the 'i' sound
    "e_accent": "C'est la lettre é.",   # Focusing on the 'é' sound
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

    print(f"\nTargeted fixes V3 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
