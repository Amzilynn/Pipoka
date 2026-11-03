import os
from pathlib import Path

# Mapping of file keys to phonetic/text values
keys_to_update = {
    # Numbers
    "1": "Un", "2": "Deux", "3": "Trois", "4": "Quatre", "5": "Cinq",
    "6": "Six", "7": "Sept", "8": "Huit", "9": "Neuf", "10": "Dix",

    # Letters (with phonetic equivalents for XTTS to sound right)
    "a": "A.", "b": "Bé.", "c": "Cé.", "d": "Dé.", "e": "É.", 
    "f": "Èf.", "g": "Gé.", "h": "Hache.", "i": "I.", "j": "Ji.", 
    "k": "Ka.", "l": "Èl.", "m": "Èm.", "n": "Èn.", "o": "O.", 
    "p": "Pé.", "q": "Cu.", "r": "Èr.", "s": "Èss.", "t": "Té.", 
    "u": "U.", "v": "Vé.", "w": "Double vé.", "x": "Iks.", 
    "y": "I grec.", "z": "Zède.",

    # Specific phrases requested
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "essaie_encore": "Essaie encore !",
    "blanc": "Blanc",
    "glisse_le_mot_vers_la_bonne_forme": "Glisse le mot vers la bonne forme !",
    "rectangle": "Rectangle",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",
    "vert": "Vert",
    "violet": "Violet",
    "rose": "Rose",
    "marron": "Marron"
}

output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    # Note: GPU disabled in Docker container locally usually, 
    # but XTTS tries to use it if available
    use_gpu = False 
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

generated = 0
for key, text_to_say in keys_to_update.items():
    file_name = f"{key}.wav"
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

print(f"Done! Generated {generated} specific audio files for girl voice.")
