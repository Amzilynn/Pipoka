import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_boy_total_regen")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Total Regen Tasks for Boy Level 3 + Refinements
# Using stable phrasing and punctuation to prevent hallucinations/noise
tasks = {
    # Family
    "la_m_re": "C'est la mère.",
    "le_p_re": "C'est le père.",
    "le_fr_re": "C'est le frère.",
    "la_s_ur": "C'est la sœur.",
    "la_grand_m_re": "C'est la grand-mère.",
    "le_grand_p_re": "C'est le grand-père.",
    
    # Colors
    "rouge": "C'est la couleur rouge.",
    "bleu": "C'est la couleur bleue.",
    "jaune": "C'est la couleur jaune.",
    "noir": "C'est la couleur noire.",
    "blanc": "C'est la couleur blanche.",
    
    # Animals / People (Keeping the 'Une/Un' prefix that worked)
    "fille": "Une fille.",
    "poule": "Une poule.",
    "chien": "Un chien.",
    "chat": "Un chat.",
    
    # Alphabet
    "m": "C'est la lettre aime.",
    "p": "C'est la lettre pé.",
    "q": "C'est la lettre qu.",
    "y": "C'est la lettre i grec.",
    "i_chapeau": "C'est la lettre i.",
    "e_accent": "C'est la lettre é.",
    "c_cedille": "C'est la lettre C cédille.",
    
    # Instructions
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage.",
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur.",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est-ce qu'on veut apprendre aujourd'hui ?",
    
    # Feedback
    "tr_s_bien": "Très bien !",
    "bravo": "Bravo !",
    "excellent": "Excellent !",
    "super": "Super !",
    "tu_es_formidable": "Tu es formidable !",
    
    # Error
    "essaie_encore": "Essaie encore.",
    "pas_tout_fait": "Pas tout à fait.",
    "r_essaie": "Réessaie."
}

# 3. Run Synthesis
print("Initializing XTTS model for Total Boy Regen...")
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

    print(f"\nTotal Boy Regen complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
