import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_boy_hpq_variants")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Variants for H, P, Q
tasks = {
    "h_v1": "C'est la lettre Hache.",
    "h_v2": "Hache !",
    "h_v3": "La lettre h.",
    "p_v1": "C'est la lettre pé.",
    "p_v2": "Pé !",
    "p_v3": "Pay.",
    "q_v1": "C'est la lettre qu.",
    "q_v2": "Qu !",
    "q_v3": "Ku."
}

# 3. Run Synthesis
print("Initializing XTTS model for Boy HPQ Variants...")
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

    print(f"\nBoy HPQ Variants complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
