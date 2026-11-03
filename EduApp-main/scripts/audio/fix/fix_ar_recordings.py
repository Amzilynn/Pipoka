import os
from pathlib import Path

# 1. ARABIC GIRL FIXES
texts_ar_girl = {
    "أعد_المحاولة": "أعد المحاولة.",
    "أين_المربع_الأزرق؟": "أين هو المربع الأزرق؟",
    "أين_المستطيل_الأخضر؟": "أين هو المستطيل الأخضر؟",
    "أحسنت": "أحسنت!",
    "أحمر": "أحمر.",
    "أصفر": "أصفر.",
    "أخضر": "أخضر.",
    "وردي": "وردي.",
    "بني": "بني.",
    "بنفسجي": "بنفسجي.",
    "مستطيل": "مستطيل.",
    "مثلث": "مثلث.",
    "امزج_الألوان_لتجد_النتيجة_الصحيحة": "امزج الألوان لتجد النتيجة الصحيحة."
}

# Arabic Letters for Girl
ar_letters = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي"]
for let in ar_letters:
    texts_ar_girl[let] = f"هذا حرف {let}."

# 2. ARABIC BOY FIXES
texts_ar_boy = {
    "الأب": "الأب.",
    "الجد": "الجد.",
    "أحسنت": "أحسنت!",
    "مستطيل": "مستطيل.",
    "مثلث": "مثلث.",
    "بني": "بني.",
    "وردي": "وردي.",
    "بنفسجي": "بنفسجي.",
    "رمادي": "رمادي.",
    "أين_المربع_الأزرق؟": "أين هو المربع الأزرق؟",
    "أين_المستطيل_الأخضر؟": "أين هو المستطيل الأخضر؟"
}

# Personages for Boy (to fix random noise)
personages_boy = {
    "الأخ": "الأخ.",
    "الأخت": "الأخت.",
    "الأم": "الأم.",
    "الجدة": "الجدة."
}
texts_ar_boy.update(personages_boy)

out_dir_ar_girl = Path("/mnt/EDUAPP/public/recordings/ar/girl")
out_dir_ar_boy = Path("/mnt/EDUAPP/public/recordings/ar/boy")
out_dir_ar_girl.mkdir(parents=True, exist_ok=True)
out_dir_ar_boy.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_ar_girl = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
ref_ar_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic_boyy_ref.wav"

# Process Arabic Girl
for k, v in texts_ar_girl.items():
    print(f"Synthesizing AR GIRL [{k}.wav]: '{v}'")
    try:
        model.tts_to_file(text=v, file_path=str(out_dir_ar_girl / f"{k}.wav"), speaker_wav=ref_ar_girl, language="ar")
    except Exception as e:
        print(f"Error on ar girl {k}: {e}")

# Process Arabic Boy
for k, v in texts_ar_boy.items():
    print(f"Synthesizing AR BOY [{k}.wav]: '{v}'")
    try:
        model.tts_to_file(text=v, file_path=str(out_dir_ar_boy / f"{k}.wav"), speaker_wav=ref_ar_boy, language="ar")
    except Exception as e:
        print(f"Error on ar boy {k}: {e}")

print("Arabic Fix Script Done!")
