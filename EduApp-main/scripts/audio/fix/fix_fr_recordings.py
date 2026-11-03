import os
from pathlib import Path
import string

# 1. FIXED BOY REGEN (Using correct reference file)
texts_boy = {}
num_words = {
    "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq",
    "6": "six", "7": "sept", "8": "huit", "9": "neuf", "10": "dix"
}
for k, v in num_words.items():
    texts_boy[k] = f"C'est le chiffre {v}."

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
    "chat": "Chat.",
    "gar_on": "Un garçon.",
    "ma_tresse": "La maîtresse.",
    "cole": "L'école.",
    "le_p_re": "Le père.",
    "la_m_re": "La mère.",
    "le_fr_re": "Le frère.",
    "la_grand_m_re": "La grand-mère.",
    "le_grand_p_re": "Le grand-père."
}
texts_boy.update(extra_boy_words)

for char in string.ascii_lowercase:
    if char == 'e':
        texts_boy[char] = "C'est la lettre E."
    elif char == 'w':
        texts_boy[char] = "C'est la lettre double V."
    elif char == 'y':
        texts_boy[char] = "C'est la lettre i grec."
    else:
        texts_boy[char] = f"C'est la lettre {char.upper()}."

# 2. SPECIFIC GIRL FIXES (Improving quality/missing files)
texts_girl_fixes = {
    "bleu": "La couleur bleue.",
    "noir": "La couleur noire.",
    "orange": "La couleur orange.",
    "marron": "La couleur marron.",
    "rectangle": "Un rectangle.",
    "triangle_vert": "Un triangle vert.",
    "e": "La lettre E.",
    "k": "La lettre K.",
    "m": "La lettre M.",
    "p": "La lettre P.",
    "r": "La lettre R.",
    "u": "La lettre U.",
    "y": "La lettre i grec.",
    "gar_on": "Un garçon.",
    "ma_tresse": "La maîtresse.",
    "cole": "L'école.",
    "le_p_re": "Le père.",
    "la_m_re": "La mère.",
    "le_fr_re": "Le frère.",
    "la_grand_m_re": "La grand-mère.",
    "le_grand_p_re": "Le grand-père."
}

out_dir_girl = Path("/mnt/EDUAPP/public/recordings/fr/girl")
out_dir_boy = Path("/mnt/EDUAPP/public/recordings/fr/boy")
out_dir_girl.mkdir(parents=True, exist_ok=True)
out_dir_boy.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_girl = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"
ref_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"

# Process Boy
for k, v in texts_boy.items():
    print(f"Synthesizing BOY [{k}.wav]: '{v}'")
    try:
        model.tts_to_file(text=v, file_path=str(out_dir_boy / f"{k}.wav"), speaker_wav=ref_boy, language="fr")
    except Exception as e:
        print(f"Error on boy {k}: {e}")

# Process Girl Fixes
for k, v in texts_girl_fixes.items():
    print(f"Synthesizing GIRL FIX [{k}.wav]: '{v}'")
    try:
        model.tts_to_file(text=v, file_path=str(out_dir_girl / f"{k}.wav"), speaker_wav=ref_girl, language="fr")
    except Exception as e:
        print(f"Error on girl {k}: {e}")

print("Master Fix Script Done!")
