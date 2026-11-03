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
# 1. FRENCH DEFINITIONS
# ==========================================
fr_common = {
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui": "Qu'est ce qu'on va apprendre aujourd'hui ?",
    "bravo": "Bravo !", "super": "Super !", "excellent": "Excellent !", "tu_es_formidable": "Tu es formidable !",
    "tr_s_bien": "Très bien !", "essaie_encore": "Essaie encore.", "pas_tout_fait": "Pas tout à fait.", "r_essaie": "Réessaie.",
    "r_ponds_aux_questions_suivantes": "Réponds aux questions suivantes.",
    "glisse_le_mot_vers_la_bonne_couleur": "Glisse le mot vers la bonne couleur !",
    "glisse_le_mot_vers_la_bonne_forme": "Glisse le mot vers la bonne forme !",
    "glisse_le_mot_vers_le_bon_personnage": "Glisse le mot vers le bon personnage !",
    "m_lange_les_couleurs_pour_trouver_le_r_sultat": "Mélange les couleurs pour trouver le résultat !",
    "associe_le_chiffre_la_bonne_quantit": "Associe le chiffre à la bonne quantité !",
    "mets_les_lettres_dans_le_bon_ordre_pour_former_le_": "Mets les lettres dans le bon ordre pour former le mot !",
    "ma_tresse": "La maîtresse.", "gar_on": "Un garçon.", "cole": "L'école.", "s_ur": "La sœur.",
    "le_p_re": "Le père.", "la_m_re": "La mère.", "le_fr_re": "Le frère.", "la_grand_m_re": "La grand-mère.", "le_grand_p_re": "Le grand-père."
}

fr_colors = {
    "rouge": "La couleur rouge.", "bleu": "La couleur bleue.", "jaune": "La couleur jaune.",
    "noir": "La couleur noire.", "blanc": "La couleur blanche.", "vert": "La couleur verte.",
    "orange": "La couleur orange.", "rose": "La couleur rose.", "violet": "La couleur violette.", "gris": "La couleur grise.",
    "marron": "La couleur marron."
}

fr_shapes = {"cercle": "Cercle.", "rectangle": "Rectangle.", "triangle": "Triangle.", "carr": "Carré."}

# Build FR letters & numbers
fr_alpha_num = {}
for i in range(1, 11): fr_alpha_num[str(i)] = f"C'est le chiffre {i}."
for c in string.ascii_lowercase:
    if c == 'e': fr_alpha_num[c] = "C'est la lettre E."
    elif c == 'w': fr_alpha_num[c] = "C'est la lettre double V."
    elif c == 'y': fr_alpha_num[c] = "C'est la lettre i grec."
    else: fr_alpha_num[c] = f"C'est la lettre {c.upper()}."

fr_questions = {
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_cercle_rouge": "Où est le cercle rouge ?",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    "o_est_le_triangle_jaune": "Où est le triangle jaune ?"
}

tasks_fr_girl = {**fr_common, **fr_colors, **fr_shapes, **fr_alpha_num, **fr_questions}
tasks_fr_boy = {**fr_common, **fr_colors, **fr_shapes, **fr_alpha_num, **fr_questions}

# ==========================================
# 2. ARABIC DEFINITIONS
# ==========================================
ar_common = {
    "ماذا_نريد_أن_نتعلم_اليوم؟": "ماذا نريد أن نتعلم اليوم؟",
    "أحسنت": "أحسنت!", "رائع": "رائع!", "ممتاز": "ممتاز!", "أنت_ممتاز": "أنت ممتاز!",
    "جيد_جدا": "جيد جداً!", "حاول_مرة_أخرى": "حاول مرة أخرى.", "ليس_صحيحا": "ليس صحيحاً.", "أعد_المحاولة": "أعد المحاولة.",
    "أجب_على_الأسئلة_التالية": "أجب على الأسئلة التالية.",
    "اسحب_الكلمة_إلى_اللون_الصحيح": "اسحب الكلمة إلى اللون الصحيح!",
    "اسحب_الكلمة_إلى_الشكل_الصحيح": "اسحب الكلمة إلى الشكل الصحيح!",
    "اسحب_الكلمة_إلى_الشخص_الصحيح": "اسحب الكلمة إلى الشخص الصحيح!",
    "امزج_الألوان_لتجد_النتيجة_الصحيحة": "امزج الألوان لتجد النتيجة الصحيحة.",
    "طابق_الرقم_مع_الكمية_الصحيحة": "طابق الرقم مع الكمية الصحيحة!",
    "رتّب_الحروف_لتكوين_الكلمة": "رتّب الحروف لتكوين الكلمة!",
    "الأم": "الأم.", "الأب": "الأب.", "الأخ": "الأخ.", "الأخت": "الأخت.", "الجدة": "الجدة.", "الجد": "الجد."
}

ar_colors = {
    "أحمر": "أحمر.", "أزرق": "أزرق.", "أصفر": "أصفر.", "أسود": "أسود.", "أبيض": "أبيض.",
    "أخضر": "أخضر.", "برتقالي": "برتقالي.", "وردي": "وردي.", "بنفسجي": "بنفسجي.", "رمادي": "رمادي.", "بني": "بني."
}

ar_shapes = {"دائرة": "دائرة.", "مستطيل": "مستطيل.", "مثلث": "مثلث.", "مربع": "مربع."}

ar_alpha_num = {}
for i in range(1, 11): ar_alpha_num[str(i)] = f"هذا رقم {i}."
ar_lets = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"]
for l in ar_lets: ar_alpha_num[l] = f"هذا حرف {l}."

ar_questions = {
    "أين_الدائرة_الحمراء؟": "أين الدائرة الحمراء؟",
    "أين_المربع_الأزرق؟": "أين المربع الأزرق؟",
    "أين_المثلث_الأصفر؟": "أين المثلث الأصفر؟",
    "أين_المستطيل_الأخضر؟": "أين المستطيل الأخضر؟"
}

tasks_ar_girl = {**ar_common, **ar_colors, **ar_shapes, **ar_alpha_num, **ar_questions}
tasks_ar_boy = {**ar_common, **ar_colors, **ar_shapes, **ar_alpha_num, **ar_questions}

# ==========================================
# 3. EXECUTION
# ==========================================
print("Starting TOTAL PERFECTION Regeneration...")
model = get_tts_model()

refs = {
    "fr_girl": "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3",
    "fr_boy": "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3",
    "ar_girl": "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav",
    "ar_boy": "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic_boyy_ref.wav"
}

synthesize_batch(model, tasks_fr_girl, Path("/mnt/EDUAPP/public/recordings/fr/girl"), refs["fr_girl"], "fr")
synthesize_batch(model, tasks_fr_boy, Path("/mnt/EDUAPP/public/recordings/fr/boy"), refs["fr_boy"], "fr")
synthesize_batch(model, tasks_ar_girl, Path("/mnt/EDUAPP/public/recordings/ar/girl"), refs["ar_girl"], "ar")
synthesize_batch(model, tasks_ar_boy, Path("/mnt/EDUAPP/public/recordings/ar/boy"), refs["ar_boy"], "ar")

print("ALL REGENERATIONS COMPLETE. PERFECTION ACHIEVED.")
