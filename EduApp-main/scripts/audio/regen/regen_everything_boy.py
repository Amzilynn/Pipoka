import os
from pathlib import Path
import json
import string

texts_boy = {}

# 1. Numbers 1-10
num_words = {
    "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq",
    "6": "six", "7": "sept", "8": "huit", "9": "neuf", "10": "dix"
}
for k, v in num_words.items():
    texts_boy[k] = f"C'est le chiffre {v}."

# Specific words requested
extra_boy_words = {
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on va apprendre aujourd'hui ?",
    "la_s_ur": "La sœur.",
    "triangle": "Triangle.",
    "violet": "Violet.",
    "marron": "Marron.",
    "blanc": "Blanc.",
    "rouge": "Rouge.",
    "gris": "Gris.",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "fille": "Fille.",
    "chat": "Chat."
}
texts_boy.update(extra_boy_words)

# 2. Letters A-Z
for char in string.ascii_lowercase:
    if char == 'e':
        texts_boy[char] = "C'est la lettre E."
    elif char == 'w':
        texts_boy[char] = "C'est la lettre double V."
    elif char == 'y':
        texts_boy[char] = "C'est la lettre i grec."
    else:
        texts_boy[char] = f"C'est la lettre {char.upper()}."

out_dir_boy = Path("/mnt/EDUAPP/public/recordings/fr/boy")
out_dir_boy.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False 
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/french-boy-voice.mp3"

for k, v in texts_boy.items():
    file_name = f"{k}.wav"
    out_path_b = out_dir_boy / file_name
    print(f"Synthesizing BOY [{file_name}]: '{v}'")
    try:
        model.tts_to_file(
            text=v,
            file_path=str(out_path_b),
            speaker_wav=ref_boy,
            language="fr"
        )
    except Exception as e:
        print(f"Error on boy {file_name}: {e}")

print("Done generating all files for boy!")
