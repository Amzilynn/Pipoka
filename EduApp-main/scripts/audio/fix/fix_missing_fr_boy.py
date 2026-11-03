import os
from pathlib import Path
from TTS.api import TTS

# Texts to generate for boy/fr
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

# Paths inside docker container
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/boy")
output_dir.mkdir(parents=True, exist_ok=True)

print("Initializing TTS inside Docker...")
try:
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except Exception as e:
    print(f"Failed to load TTS model: {e}")
    exit(1)

generated = 0
for key, text in missing_texts.items():
    file_path = output_dir / f"{key}.wav"
    print(f"Synthesizing [{key}.wav]: '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(file_path),
            speaker_wav=ref_voice_path,
            language="fr"
        )
        generated += 1
    except Exception as e:
        print(f"Error generating {key}: {e}")

print(f"Successfully generated {generated} files.")
