import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/boy")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Requested Regeneration Tasks
tasks = {
    "la_grand_m_re": "La grand-mère.",
    "le_grand_p_re": "Le grand-père.",
    "bleu": "La couleur bleue.",
    "gris": "La couleur grise.",
    "poule": "Une poule.",
    "chat": "Un chat."
}

# 3. Run Synthesis
print("Initializing XTTS model for Docker Boy Regen...")
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
            print(f"Success: {file_path}")
        except Exception as e:
            print(f"Error generating {key}: {e}")

    print(f"\nRegeneration complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
