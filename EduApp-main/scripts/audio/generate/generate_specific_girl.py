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

# List of specific keys requested by user
specific_keys = [
    "1", "2", "8", "10", "a", "chien", "e", "f", "g", 
    "glisse_le_mot_vers_la_bonne_couleur", 
    "glisse_le_mot_vers_le_bon_personnage", 
    "h", "i", "j", "k", "l", "livre", "m", "maman", 
    "o_est_le_carr_bleu", "o_est_le_cercle_rouge", 
    "o", "p", "q", "qu_est_ce_qu_on_veut_apprendre_aujourd_hui", 
    "rectangle", "bleu", "rose", "t", "triangle", "vert", "u", "violet", "w", "y", "z",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat"
]

# Heuristic mapping for special keys
texts = {
    # Letters & Numbers
    "1": "Un", "2": "Deux", "3": "Trois", "4": "Quatre", "5": "Cinq",
    "6": "Six", "7": "Sept", "8": "Huit", "9": "Neuf", "10": "Dix",

    # Instructions
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur !",
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on veut apprendre aujourd'hui ?",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",

    # Questions
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_cercle_rouge": "Où est le cercle rouge ?",
    
    # Missing/Special alphabet words
    "maman": "Maman",
    "chien": "Chien",
    "livre": "Livre",
    
    # Force the letter E to be pronounced as É
    "e": "É",
}

# Add shapes and colors
colors_list = ["bleu", "rose", "vert", "violet"]
shapes_list = {"rectangle": "Rectangle", "triangle": "Triangle"}

for s_slug, s_name in shapes_list.items():
    texts[s_slug] = s_name
for c_slug in ["bleu", "rose", "vert", "violet"]:
    texts[c_slug] = c_slug.capitalize()

# Helper to resolve text
def get_text(key):
    if key in texts: return texts[key]
    if len(key) == 1 and key.isalpha(): return key.upper()
    return key.replace("_", " ").capitalize()

print("Initializing TTS...")
try:
    from TTS.api import TTS
    import torch
    use_gpu = False 
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

generated = 0
for item in girl_items:
    file_name = item['file']
    key = item['key']
    
    if key not in specific_keys:
        continue

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

print(f"Done! Regenerated {generated} specific audio files for girl voice.")
