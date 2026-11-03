import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/boy")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Variants for problematic words
# We already have the current ones as [key].wav.
# We'll create _v1, _v2, _v3 for each.
variants = {
    "la_grand_m_re": [
        "Grand-mère !", 
        "La grand-mère.", 
        "C'est la grand-mère !"
    ],
    "le_grand_p_re": [
        "Grand-père !", 
        "Le grand-père.", 
        "C'est le grand-père !"
    ],
    "bleu": [
        "Bleu !", 
        "La couleur bleue !", 
        "C'est bleu !"
    ],
    "chat": [
        "Chat !", 
        "Un chat.", 
        "Le petit chat !"
    ]
}

# 3. Run Synthesis
print("Initializing XTTS model for Boy Variants Regen...")
try:
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    for key, texts in variants.items():
        for i, text in enumerate(texts, 1):
            file_name = f"{key}_v{i}.wav"
            file_path = output_dir / file_name
            print(f"\n>>> Synthesizing {file_name}: '{text}'")
            try:
                model.tts_to_file(
                    text=text, 
                    file_path=str(file_path), 
                    speaker_wav=str(ref_voice), 
                    language="fr"
                )
                print(f"Success: {file_path}")
            except Exception as e:
                print(f"Error generating {file_name}: {e}")

    print(f"\nVariants Regen complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
