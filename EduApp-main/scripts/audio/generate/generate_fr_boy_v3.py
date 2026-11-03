import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_boy_v3")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Boy V3 Targeted Refinements
tasks = {
    "la_grand_m_re": "La grand-mère.",
    "rouge": "Rouge.",
    "bravo": "Bravo !",
    "gris": "Gris.",
    "i_chapeau": "i.",
    "e_accent": "é.",
    "fille": "Une fille.",
    "poule": "Une poule.",
    "chien": "Un chien.",
    "chat": "Un chat."
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

    print(f"\nBoy V3 complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
