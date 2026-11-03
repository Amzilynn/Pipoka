import os
import requests
import json
from pathlib import Path
import sys

# Paths below are project-root relative, so resolve them from this file's location.
ROOT = Path(__file__).resolve().parents[3]

# Mapping of keys to actual text for boy/fr
missing_texts = {
    "carr_vert": "Carré vert.",
    "carr_violet": "Carré violet.",
    "cercle_vert": "Cercle vert.",
    "cercle_violet": "Cercle violet.",
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur !",
    "glisse_le_mot_vers_la_bonne_forme": "Glisse le mot vers la bonne forme !",
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on veut apprendre aujourd'hui ?",
    "rectangle_vert": "Rectangle vert.",
    "rectangle_violet": "Rectangle violet.",
    "triangle_vert": "Triangle vert.",
    "triangle_violet": "Triangle violet."
}

backend_url = "https://amzilynn-eduapp.hf.space/synthesize"
output_dir = ROOT / "public/recordings/fr/boy"
output_dir.mkdir(parents=True, exist_ok=True)

print(f"Starting download of {len(missing_texts)} missing files...")

for key, text in missing_texts.items():
    file_path = output_dir / f"{key}.wav"
    
    # Skip if already exists and not empty
    if file_path.exists() and file_path.stat().st_size > 0:
        print(f"SKIP: {key}.wav already exists.")
        continue

    print(f"Requesting [{key}.wav]: '{text}'")
    
    payload = {
        "text": text,
        "language": "fr",
        "voice": "boy"
    }
    
    try:
        # Increase timeout to 120 seconds as XTTS can be slow
        response = requests.post(backend_url, json=payload, timeout=120)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"SUCCESS: Saved {file_path}")
        else:
            print(f"FAILED to generate {key}: {response.status_code}")
    except Exception as e:
        print(f"ERROR downloading {key}: {str(e)}")

print("Finished!")
