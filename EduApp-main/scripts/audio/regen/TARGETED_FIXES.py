import os
from pathlib import Path
import string

def get_tts_model():
    from TTS.api import TTS
    return TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

def synthesize_batch(model, tasks, out_dir, ref_wav, lang):
    out_dir.mkdir(parents=True, exist_ok=True)
    for key, text in tasks.items():
        file_path = out_dir / f"{key}.wav"
        print(f"[{lang}] Synthesizing {key}: '{text}'")
        try:
            model.tts_to_file(text=text, file_path=str(file_path), speaker_wav=ref_wav, language=lang)
        except Exception as e:
            print(f"Error on {key}: {e}")

# ==========================================
# 1. FRENCH TARGETED
# ==========================================
# Boy needs everything because it failed before
fr_boy_all = {
    "1": "C'est le chiffre un.", "2": "C'est le chiffre deux.", "3": "C'est le chiffre trois.", "4": "C'est le chiffre quatre.", "5": "C'est le chiffre cinq.",
    "6": "C'est le chiffre six.", "7": "C'est le chiffre sept.", "8": "C'est le chiffre huit.", "9": "C'est le chiffre neuf.", "10": "C'est le chiffre dix.",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on va apprendre aujourd'hui ?",
    "la_s_ur": "La sœur.", "triangle": "Triangle.", "violet": "Violet.", "marron": "Marron.", "blanc": "Blanc.", "rouge": "Rouge.", "gris": "Gris.",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",
    "o_est_le_carr_bleu": "Où est le carré bleu ?", "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "fille": "Fille.", "chat": "Chat.", "gar_on": "Un garçon.", "ma_tresse": "La maîtresse.", "cole": "L'école.",
    "le_p_re": "Le père.", "la_m_re": "La mère.", "le_fr_re": "Le frère.", "la_grand_m_re": "La grand-mère.", "le_grand_p_re": "Le grand-père."
}
for c in string.ascii_lowercase:
    if c == 'e': fr_boy_all[c] = "C'est la lettre E."
    elif c == 'w': fr_boy_all[c] = "C'est la lettre double V."
    elif c == 'y': fr_boy_all[c] = "C'est la lettre i grec."
    else: fr_boy_all[c] = f"C'est la lettre {c.upper()}."

# Girl targeted fixes
fr_girl_fixes = {
    "bleu": "La couleur bleue.", "noir": "La couleur noire.", "orange": "La couleur orange.", "marron": "La couleur marron.",
    "rectangle": "Un rectangle.", "triangle_vert": "Un triangle vert.",
    "e": "La lettre E.", "k": "La lettre K.", "m": "La lettre M.", "p": "La lettre P.", "r": "La lettre R.", "u": "La lettre U.", "y": "La lettre i grec.",
    "gar_on": "Un garçon.", "ma_tresse": "La maîtresse.", "cole": "L'école.", "s_ur": "La sœur.",
    "le_p_re": "Le père.", "la_m_re": "La mère.", "le_fr_re": "Le frère.", "la_grand_m_re": "La grand-mère.", "le_grand_p_re": "Le grand-père."
}

# ==========================================
# 2. ARABIC TARGETED
# ==========================================
ar_girl_fixes = {
    "أعد_المحاولة": "أعد المحاولة.", "أين_المربع_الأزرق؟": "أين هو المربع الأزرق؟", "أين_المستطيل_الأخضر؟": "أين هو المستطيل الأخضر؟",
    "أحسنت": "أحسنت!", "أحمر": "أحمر.", "أصفر": "أصفر.", "أخضر": "أخضر.", "وردي": "وردي.", "بني": "بني.", "بنفسجي": "بنفسجي.",
    "مستطيل": "مستطيل.", "مثلث": "مثلث.", "امزج_الألوان_لتجد_النتيجة_الصحيحة": "امزج الألوان لتجد النتيجة الصحيحة."
}
for l in ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"]:
    ar_girl_fixes[l] = f"هذا حرف {l}."

ar_boy_fixes = {
    "الأب": "الأب.", "الجد": "الجد.", "أحسنت": "أحسنت!", "مستطيل": "مستطيل.", "مثلث": "مثلث.",
    "بني": "بني.", "وردي": "وردي.", "بنفسجي": "بنفسجي.", "رمادي": "رمادي.",
    "أين_المربع_الأزرق؟": "أين هو المربع الأزرق؟", "أين_المستطيل_الأخضر؟": "أين هو المستطيل الأخضر؟",
    "الأخ": "الأخ.", "الأخت": "الأخت.", "الأم": "الأم.", "الجدة": "الجدة."
}

# ==========================================
# 3. EXECUTION
# ==========================================
print("Starting TARGETED Fixes...")
model = get_tts_model()

refs = {
    "fr_girl": "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3",
    "fr_boy": "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3",
    "ar_girl": "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav",
    "ar_boy": "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic_boyy_ref.wav"
}

synthesize_batch(model, fr_boy_all, Path("/mnt/EDUAPP/public/recordings/fr/boy"), refs["fr_boy"], "fr")
synthesize_batch(model, fr_girl_fixes, Path("/mnt/EDUAPP/public/recordings/fr/girl"), refs["fr_girl"], "fr")
synthesize_batch(model, ar_girl_fixes, Path("/mnt/EDUAPP/public/recordings/ar/girl"), refs["ar_girl"], "ar")
synthesize_batch(model, ar_boy_fixes, Path("/mnt/EDUAPP/public/recordings/ar/boy"), refs["ar_boy"], "ar")

print("TARGETED FIXES COMPLETE.")
