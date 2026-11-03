import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)
ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. Define ONLY the "trashy" tasks to be fixed
# (Good ones like 'i', 'rectangle', 'maitresse' and questions have been removed)
tasks = {
    # Family & Words (Adding articles for stability)
    "le_p_re": "C'est le père.",
    "la_m_re": "C'est la mère.",
    "le_fr_re": "C'est le frère.",
    "gar_on": "Un garçon.",
    
    # Instructions (Shortened for better tone)
    "r_ponds_aux_questions_suivantes": "Réponds aux questions.",
    
    # Letters (Using capital letters with periods like 'i' which worked)
    "r": "La lettre R.",
    "m": "La lettre M.",
    "p": "La lettre P.",
    "o": "La lettre O.",
    "e": "La lettre É.",
}

# 3. Special cases for Accents
extra_tasks = {
    "e_accent": "La lettre é.",
    "i_chapeau": "La lettre i.", # Reverting to 'i' sound as it's cleaner
}

# 4. Run Synthesis
print("Initializing XTTS model...")
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

# Combine all tasks
all_tasks = {**tasks, **extra_tasks}

for key, text in all_tasks.items():
    file_path = output_dir / f"{key}.wav"
    print(f"\n>>> Synthesizing {key}: '{text}'")
    try:
        model.tts_to_file(
            text=text, 
            file_path=str(file_path), 
            speaker_wav=ref_voice, 
            language="fr"
        )
    except Exception as e:
        print(f"Error generating {key}: {e}")

print("\nAll targeted fixes for French Girl are complete!")
