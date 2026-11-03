import os
import json
from pathlib import Path

# Load manifest to get all boy/fr files and keys
manifest_path = "/mnt/EDUAPP/public/recordings/manifest.json"
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

boy_items = manifest['recordings']['fr']['boy']

# Output directory inside container
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/boy")
output_dir.mkdir(parents=True, exist_ok=True)

# Heuristic mapping for special keys
texts = {
    # Letters & Numbers
    "1": "Un", "2": "Deux", "3": "Trois", "4": "Quatre", "5": "Cinq",
    "6": "Six", "7": "Sept", "8": "Huit", "9": "Neuf", "10": "Dix",

    # Family
    "la_m_re": "La mère",
    "le_p_re": "Le père",
    "le_fr_re": "Le frère",
    "la_s_ur": "La sœur",
    "la_grand_m_re": "La grand-mère",
    "le_grand_p_re": "Le grand-père",

    # Shapes
    "carr": "Carré",
    "cercle": "Cercle",
    "triangle": "Triangle",
    "rectangle": "Rectangle",

    # Instructions
    "associe_le_chiffre_la_bonne_quantit": "Associe le chiffre à la bonne quantité !",
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur !",
    "glisse_le_mot_vers_la_bonne_forme": "Glisse le mot vers la bonne forme !",
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "mets_les_lettres_dans_le_bon_ordre_pour_former_le_": "Mets les lettres dans le bon ordre pour former le mot !",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on veut apprendre aujourd'hui ?",
    "r_ponds_aux_questions_suivantes": "Réponds aux questions suivantes",

    # Questions
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_cercle_rouge": "Où est le cercle rouge ?",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "o_est_le_triangle_jaune": "Où est le triangle jaune ?",

    # Feedback
    "tr_s_bien": "Très bien !",
    "tu_es_formidable": "Tu es formidable !",
    "pas_tout_fait": "Pas tout à fait...",
    "r_essaie": "Réessaie !",
    "essaie_encore": "Essaie encore !",
    "bravo": "Bravo !",
    "excellent": "Excellent !",
    "super": "Super !",
    
    # Missing alphabet words
    "ma_tresse": "Maîtresse",
    "cole": "École",
    "gar_on": "Garçon",
    
    # Force the letter E to be pronounced as É
    "e": "É",
}

# Add combinations programmaticly
colors = ["blanc", "bleu", "gris", "jaune", "noir", "orange", "rose", "rouge", "vert", "violet"]
shapes_map = {"carr": "Carré", "cercle": "Cercle", "triangle": "Triangle", "rectangle": "Rectangle"}

for slug, name in shapes_map.items():
    for c in colors:
        texts[f"{slug}_{c}"] = f"{name} {c}"

# Helper to resolve text
def get_text(key):
    if key in texts: return texts[key]
    if len(key) == 1 and key.isalpha(): return key.upper()
    # Replace underscores with spaces and capitalize
    t = key.replace("_", " ").capitalize()
    return t

print("Initializing TTS...")
try:
    from TTS.api import TTS
    import torch
    use_gpu = torch.cuda.is_available()
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

generated = 0
for item in boy_items:
    file_name = item['file']
    key = item['key']
    text_to_say = get_text(key)
    out_path = output_dir / file_name

    # Check if we should re-generate or skip. 
    # User said "make sure they are complete no missing", so we always generate to be safe.
    print(f"Synthesizing [{file_name}] ('{key}'): '{text_to_say}'")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref_voice_path,
            language="fr"
        )
        generated += 1
    except Exception as e:
        print(f"Error on {file_name}: {e}")

print(f"Done! Generated {generated} audio files for boy voice.")
