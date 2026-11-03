import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_boy_alphabet_v1")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Boy Alphabet Targeted Tasks
tasks = {
    # Specifically requested
    "m": "C'est la lettre aime.",
    "p": "C'est la lettre pé.",
    "q": "C'est la lettre qu.",
    "y": "C'est la lettre i grec.",
    
    # Accented letters (Special mapping in manifest)
    "e_accent": "C'est la lettre é.",
    "i_chapeau": "C'est la lettre i.",
    "c_cedille": "C'est la lettre C cédille."
}

# 3. Run Synthesis
print("Initializing XTTS model for French Boy...")
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

    print(f"\nBoy Alphabet V1 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
