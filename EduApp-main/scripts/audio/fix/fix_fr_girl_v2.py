import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_fixed_v2")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. Define the tasks based on user feedback
# We use phonetic hints or added context (articles) to improve pronunciation
tasks = {
    "le_p_re": "Le père.", 
    "r_ponds_aux_questions_suivantes": "Réponds aux questions suivantes.",
    
    # Letters - using phonetic hints for better clarity
    "r": "La lettre Air.",    # R sounds like "air"
    "m": "La lettre Emme.",   # M sounds like "emme"
    "e": "La lettre Euh.",    # E (French) sounds like "euh"
    "p": "La lettre Pé.",     # P sounds like "pé"
    
    # Special cases
    "i_chapeau": "La lettre i.", # î sounds exactly like i
    "ma_tresse": "La maîtresse.", # Adding article for better intonation
    "e_accent": "La lettre é.",   # Targeted fix for é
    "gar_on": "Un gar-sson.",     # Phonetic fix for 'ç' if it was silent
}

# 3. Run Synthesis
print("Initializing XTTS model...")
try:
    # gpu=False as we are likely on a CPU-only environment or want to be safe
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

    print(f"\nTargeted fixes complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
