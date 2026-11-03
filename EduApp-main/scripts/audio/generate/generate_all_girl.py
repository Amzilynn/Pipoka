import os
import json
from pathlib import Path

# Load manifest to get all girl/fr files and keys
manifest_path = "/mnt/EDUAPP/public/recordings/manifest.json"
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

girl_items = manifest['recordings']['fr']['girl']

# Output directory inside container
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
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
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",

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
    
    # Missing/Special alphabet words
    "ma_tresse": "Maîtresse",
    "cole": "École",
    "gar_on": "Garçon",
    "stylo": "Stylo",
    "livre": "Livre",
    "cartable": "Cartable",
    "maman": "Maman",
    "papa": "Papa",
    "fille": "Fille",
    "ami": "Ami",
    "mouton": "Mouton",
    "vache": "Vache",
    "poule": "Poule",
    "chat": "Chat",
    "chien": "Chien",
    "poisson": "Poisson",
    
    # Force the letter E to be pronounced as É
    "e": "É",
}

# Add combinations programmaticly
colors = {
    "blanc": "Blanc", "bleu": "Bleu", "gris": "Gris", "jaune": "Jaune", 
    "noir": "Noir", "orange": "Orange", "rose": "Rose", "rouge": "Rouge", 
    "vert": "Vert", "violet": "Violet"
}
shapes_map = {"carr": "Carré", "cercle": "Cercle", "triangle": "Triangle", "rectangle": "Rectangle"}

for slug, name in shapes_map.items():
    for c_slug, c_name in colors.items():
        texts[f"{slug}_{c_slug}"] = f"{name} {c_slug}"

# Helper to resolve text
def get_text(key):
    if key in texts: return texts[key]
    if len(key) == 1 and key.isalpha(): return key.upper()
    return key.replace("_", " ").capitalize()

print("Initializing TTS...")
try:
    from TTS.api import TTS
    import torch
    # Note: GPU disabled in Docker container currently
    use_gpu = False 
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# List of specific words to regenerate if requested (we'll just run all 139 to be sure)
# but we ensure they ARE regenerated.
generated = 0
for item in girl_items:
    file_name = item['file']
    key = item['key']
    text_to_say = get_text(key)
    out_path = output_dir / file_name

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

print(f"Done! Generated {generated} audio files for girl voice.")
