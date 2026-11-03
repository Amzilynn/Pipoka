import os
from pathlib import Path
import json
import string

texts = {}

# Numbers 1-10
num_words = {
    "1": "un",
    "2": "deux",
    "3": "trois",
    "4": "quatre",
    "5": "cinq",
    "6": "six",
    "7": "sept",
    "8": "huit",
    "9": "neuf",
    "10": "dix"
}

for k, v in num_words.items():
    texts[k] = f"C'est le chiffre {v}."

# Letters A-Z
for char in string.ascii_lowercase:
    if char == 'e':
        # E might need special hint for TTS. But let's try just E.
        texts[char] = f"C'est la lettre E."
    elif char == 'w':
        texts[char] = f"C'est la lettre double V." # To be safe with French W
    elif char == 'y':
        texts[char] = f"C'est la lettre i grec."
    else:
        texts[char] = f"C'est la lettre {char.upper()}."

# Paths
out_dir_girl = Path("/mnt/EDUAPP/public/recordings/fr/girl")
out_dir_boy = Path("/mnt/EDUAPP/public/recordings/fr/boy")

out_dir_girl.mkdir(parents=True, exist_ok=True)
out_dir_boy.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False 
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_girl = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"
ref_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/french-boy-voice.mp3"

def synthesize(key, text):
    file_name = f"{key}.wav"
    
    # Girl
    out_path_g = out_dir_girl / file_name
    print(f"Synthesizing GIRL [{file_name}]: '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(out_path_g),
            speaker_wav=ref_girl,
            language="fr"
        )
    except Exception as e:
        print(f"Error on girl {file_name}: {e}")

    # Boy
    out_path_b = out_dir_boy / file_name
    print(f"Synthesizing BOY [{file_name}]: '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(out_path_b),
            speaker_wav=ref_boy,
            language="fr"
        )
    except Exception as e:
        print(f"Error on boy {file_name}: {e}")

for k, v in texts.items():
    synthesize(k, v)

# Specific questions for the girl voice
questions_girl = {
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_cercle_rouge": "Où est le cercle rouge ?",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "o_est_le_triangle_jaune": "Où est le triangle jaune ?"
}

for k, v in questions_girl.items():
    file_name = f"{k}.wav"
    out_path_g = out_dir_girl / file_name
    print(f"Synthesizing GIRL QUESTION [{file_name}]: '{v}'")
    try:
        model.tts_to_file(
            text=v,
            file_path=str(out_path_g),
            speaker_wav=ref_girl,
            language="fr"
        )
    except Exception as e:
        print(f"Error on girl {file_name}: {e}")

print("Done generating all letters and numbers for both girl and boy!")
