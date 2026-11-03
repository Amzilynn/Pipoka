import os
from pathlib import Path
import json
import string

texts_girl = {}

# 1. Colors
colors = {
    "rouge": "La couleur rouge.",
    "bleu": "La couleur bleue.",
    "jaune": "La couleur jaune.",
    "noir": "La couleur noire.",
    "blanc": "La couleur blanche.",
    "vert": "La couleur verte.",
    "orange": "La couleur orange.",
    "rose": "La couleur rose.",
    "violet": "La couleur violette.",
    "gris": "La couleur grise."
}
texts_girl.update(colors)

# 2. Questions
questions_girl = {
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_cercle_rouge": "Où est le cercle rouge ?",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "o_est_le_triangle_jaune": "Où est le triangle jaune ?"
}
texts_girl.update(questions_girl)

# 3. Numbers 1-10
num_words = {
    "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq",
    "6": "six", "7": "sept", "8": "huit", "9": "neuf", "10": "dix"
}
for k, v in num_words.items():
    texts_girl[k] = f"C'est le chiffre {v}."

# 4. Letters A-Z
for char in string.ascii_lowercase:
    if char == 'e':
        texts_girl[char] = "C'est la lettre E."
    elif char == 'w':
        texts_girl[char] = "C'est la lettre double V."
    elif char == 'y':
        texts_girl[char] = "C'est la lettre i grec."
    else:
        texts_girl[char] = f"C'est la lettre {char.upper()}."

out_dir_girl = Path("/mnt/EDUAPP/public/recordings/fr/girl")
out_dir_girl.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False 
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_girl = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

for k, v in texts_girl.items():
    file_name = f"{k}.wav"
    out_path_g = out_dir_girl / file_name
    print(f"Synthesizing GIRL [{file_name}]: '{v}'")
    try:
        model.tts_to_file(
            text=v,
            file_path=str(out_path_g),
            speaker_wav=ref_girl,
            language="fr"
        )
    except Exception as e:
        print(f"Error on girl {file_name}: {e}")

print("Done generating all files for girl!")
