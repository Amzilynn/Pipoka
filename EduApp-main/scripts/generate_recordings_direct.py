"""
Direct TTS Recording Generator v2 — Reinitializes engine per batch.
Avoids pyttsx3 COM hang by creating a fresh engine every N files.
"""
import os
import re
import sys
import json
import subprocess
import pyttsx3

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT       = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(ROOT, "public", "recordings")

PHRASES = []

def add(text, lang, category):
    PHRASES.append({"text": text, "lang": lang, "category": category})

# Welcome
add("Qu'est-ce qu'on veut apprendre aujourd'hui ?", "fr", "welcome")
add("ماذا نريد أن نتعلم اليوم؟", "ar", "welcome")

# Instructions
add("Glisse le mot vers le bon personnage !", "fr", "instruction")
add("اسحب الكلمة إلى الشخص الصحيح!", "ar", "instruction")
add("Glisse le mot vers la bonne couleur !", "fr", "instruction")
add("اسحب الكلمة إلى اللون الصحيح!", "ar", "instruction")
add("Glisse le mot vers la bonne forme !", "fr", "instruction")
add("اسحب الكلمة إلى الشكل الصحيح!", "ar", "instruction")
add("Réponds aux questions suivantes", "fr", "instruction")
add("أجب على الأسئلة التالية", "ar", "instruction")
add("Mets les lettres dans le bon ordre pour former le mot !", "fr", "instruction")
add("رتّب الحروف لتكوين الكلمة!", "ar", "instruction")
add("Associe le chiffre à la bonne quantité !", "fr", "instruction")
add("طابق الرقم مع الكمية الصحيحة!", "ar", "instruction")

# Family
for t in ["La mère","Le père","Le frère","La sœur","La grand-mère","Le grand-père"]:
    add(t, "fr", "family")
for t in ["الأم","الأب","الأخ","الأخت","الجدة","الجد"]:
    add(t, "ar", "family")

# Colors
FR_COLORS = ["Rouge","Bleu","Jaune","Noir","Blanc","Vert","Orange","Rose","Violet","Gris"]
AR_COLORS = ["أحمر","أزرق","أصفر","أسود","أبيض","أخضر","برتقالي","وردي","بنفسجي","رمادي"]
for c in FR_COLORS: add(c, "fr", "color")
for c in AR_COLORS: add(c, "ar", "color")

# Shapes
FR_SHAPES = ["Cercle","Carré","Triangle","Rectangle"]
AR_SHAPES = ["دائرة","مربع","مثلث","مستطيل"]
for s in FR_SHAPES: add(s, "fr", "shape")
for s in AR_SHAPES: add(s, "ar", "shape")

# Numbers (1-10)
for n in range(1, 11):
    add(str(n), "fr", "number")
    add(str(n), "ar", "number")

# Combination questions
for t in ["Où est le cercle rouge ?","Où est le carré bleu ?",
          "Où est le triangle jaune ?","Où est le rectangle vert ?"]:
    add(t, "fr", "combination")
for t in ["أين الدائرة الحمراء؟","أين المربع الأزرق؟",
          "أين المثلث الأصفر؟","أين المستطيل الأخضر؟"]:
    add(t, "ar", "combination")

# Alphabet hints
for t in ["Chat","Lune","Soleil","Pomme","Arbre","Avion","Livre","Oiseau","Fleur","Lapin"]:
    add(t, "fr", "alphabet")
for t in ["بيت","قمر","شمس","كتاب","قلم","أسد","بحر","وردة","تفاحة","جمل"]:
    add(t, "ar", "alphabet")

# Feedback
for t in ["Très bien !","Bravo !","Excellent !","Super !","Tu es formidable !"]:
    add(t, "fr", "feedback")
for t in ["أحسنت!","ممتاز!","رائع!","جيد جدا!","أنت ممتاز!"]:
    add(t, "ar", "feedback")

# Errors
for t in ["Essaie encore !","Pas tout à fait...","Réessaie !"]:
    add(t, "fr", "error")
for t in ["حاول مرة أخرى!","ليس صحيحا...","أعد المحاولة!"]:
    add(t, "ar", "error")

# Shape × Color combos
for s in FR_SHAPES:
    for c in FR_COLORS:
        add(f"{s} {c}", "fr", "shape_color")
for s in AR_SHAPES:
    for c in AR_COLORS:
        add(f"{s} {c}", "ar", "shape_color")

# Letters
for letter in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    add(letter, "fr", "letter")

AR_LETTERS = [
    "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي", "ة"
]
for letter in AR_LETTERS:
    add(letter, "ar", "letter")


# ── Helpers ─────────────────────────────────────────────────────────────────
def normalize_key(text):
    key = text.strip().lower()
    key = re.sub(r'[^a-z0-9\u0600-\u06FF]', '_', key)
    key = re.sub(r'_+', '_', key).strip('_')
    return key[:50]


def ensure_dirs():
    for lang in ["fr", "ar"]:
        for voice in ["girl", "boy"]:
            os.makedirs(os.path.join(OUTPUT_DIR, lang, voice), exist_ok=True)


# ── Synthesize ONE file using a fresh subprocess call ───────────────────────
SYNTH_WORKER = r"""
import sys, pyttsx3, os
text = sys.argv[1]
lang = sys.argv[2]
out  = sys.argv[3]

engine = pyttsx3.init()
engine.setProperty('rate', 155)
engine.setProperty('volume', 1.0)
voices = engine.getProperty('voices')

# Pick voice
selected = None
if lang == 'fr':
    for v in voices:
        if 'hortense' in v.name.lower() or 'french' in v.name.lower() or '-fr' in v.id.lower():
            selected = v.id; break
if not selected:
    for v in voices:
        if 'female' in v.name.lower() or 'zira' in v.name.lower():
            selected = v.id; break
if not selected and voices:
    selected = voices[0].id
if selected:
    engine.setProperty('voice', selected)

engine.save_to_file(text, out)
engine.runAndWait()
"""

def synthesize_file(text, lang, out_path):
    """Run synthesis in a fresh Python subprocess to avoid COM hangs."""
    result = subprocess.run(
        [sys.executable, "-c", SYNTH_WORKER, text, lang, out_path],
        timeout=30,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        raise Exception(result.stderr.strip() or "Subprocess failed")
    if not os.path.exists(out_path) or os.path.getsize(out_path) == 0:
        raise Exception("Output file empty or not created")


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    ensure_dirs()

    # De-duplicate
    seen, unique = set(), []
    for p in PHRASES:
        k = f"{p['lang']}:{p['text'].strip()}"
        if k not in seen:
            seen.add(k)
            unique.append(p)

    voices_list = ["girl", "boy"]
    total = len(unique) * len(voices_list)
    print(f"\n🎙️  Direct TTS Generator v2  (subprocess mode)")
    print(f"   Phrases : {len(unique)} unique")
    print(f"   Target  : {total} files")
    print(f"   Output  : {OUTPUT_DIR}\n")

    generated, skipped, errors = 0, 0, []

    for idx, phrase in enumerate(unique):
        lang = phrase["lang"]
        text = phrase["text"].strip()
        key  = normalize_key(text)

        for voice_label in voices_list:
            out_path = os.path.join(OUTPUT_DIR, lang, voice_label, f"{key}.wav")

            if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
                skipped += 1
                continue

            try:
                synthesize_file(text, lang, out_path)
                generated += 1
                pct = round(((idx + 1) / len(unique)) * 100)
                total_so_far = generated + skipped
                print(f"  [{idx+1:>3}/{len(unique)}] ({pct:>3}%) ✓  [{lang}/{voice_label}]  {text[:45]}")
                sys.stdout.flush()
            except Exception as e:
                errors.append({"text": text, "lang": lang, "voice": voice_label, "error": str(e)})
                print(f"  [{idx+1:>3}/{len(unique)}] ✗  [{lang}/{voice_label}]  {text[:45]}  ERROR: {e}")
                sys.stdout.flush()

    # ── Count all WAV files ───────────────────────────────────────────────
    total_files = sum(
        len([f for f in os.listdir(os.path.join(OUTPUT_DIR, l, v)) if f.endswith('.wav')])
        for l in ["fr","ar"] for v in ["girl","boy"]
        if os.path.exists(os.path.join(OUTPUT_DIR, l, v))
    )

    print("\n" + "═" * 52)
    print("  DONE")
    print(f"  Generated  : {generated}")
    print(f"  Skipped    : {skipped}  (already existed)")
    print(f"  Errors     : {len(errors)}")
    print(f"  Total WAVs : {total_files} / {total}")
    print("═" * 52)

    if errors:
        print("\n  Failed items:")
        for e in errors:
            print(f"    [{e['lang']}/{e['voice']}] \"{e['text'][:40]}\" — {e['error']}")

    # Update manifest.json
    manifest = {"recordings": {}}
    for lang in ["fr","ar"]:
        manifest["recordings"][lang] = {}
        for v in ["girl","boy"]:
            d = os.path.join(OUTPUT_DIR, lang, v)
            files = sorted(f for f in os.listdir(d) if f.endswith('.wav')) if os.path.exists(d) else []
            manifest["recordings"][lang][v] = [{"file": f, "key": f[:-4]} for f in files]

    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, ensure_ascii=False, indent=2)
    print(f"\n  manifest.json updated → {manifest_path}\n")


if __name__ == "__main__":
    main()
