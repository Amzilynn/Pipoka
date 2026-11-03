import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths (Docker Mount Paths)
output_dir = Path("/mnt/EDUAPP/recordings_boy_level3")
output_dir.mkdir(parents=True, exist_ok=True)

ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# 2. Level 3 Content (3 Years Old)
tasks = {
    # Family
    "la_m_re": "La mère",
    "le_p_re": "Le père",
    "le_fr_re": "Le frère",
    "la_s_ur": "La sœur",
    "la_grand_m_re": "La grand-mère",
    "le_grand_p_re": "Le grand-père",
    
    # Colors (Basic 5)
    "rouge": "Rouge",
    "bleu": "Bleu",
    "jaune": "Jaune",
    "noir": "Noir",
    "blanc": "Blanc",
    
    # Instructions
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur !",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est-ce qu'on veut apprendre aujourd'hui ?",
    
    # Feedback
    "tr_s_bien": "Très bien !",
    "bravo": "Bravo !",
    "excellent": "Excellent !",
    "super": "Super !",
    "tu_es_formidable": "Tu es formidable !",
    
    # Error
    "essaie_encore": "Essaie encore !",
    "pas_tout_fait": "Pas tout à fait...",
    "r_essaie": "Réessaie !"
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

    print(f"\nBoy Level 3 generation complete! Files are in: {output_dir}")

except Exception as e:
    print(f"Failed to initialize TTS model: {e}")
