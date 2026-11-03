import os
import subprocess
from pathlib import Path

# ─── 1. Prepare reference voice ───────────────────────────────────────────────
REF_SOURCE = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb.mp4"
REF_WAV    = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"

print("=" * 60)
print("Step 1: Extracting & normalizing girlarb.mp4 → girlarb_ref.wav")
print("=" * 60)

result = subprocess.run(
    [
        "ffmpeg", "-y",
        "-i", REF_SOURCE,
        "-vn",                                    # strip video
        "-ac", "1",                               # mono
        "-ar", "22050",                           # XTTS required sample rate
        "-af", "loudnorm=I=-16:TP=-3:LRA=11",    # EBU R128 loudness normalize
        REF_WAV
    ],
    capture_output=True, text=True
)
if result.returncode != 0:
    print(f"ERROR: ffmpeg failed:\n{result.stderr}")
    exit(1)
print(f"  -> Reference WAV ready: {REF_WAV}\n")

# ─── 3. Load XTTS model ───────────────────────────────────────────────────────
print("=" * 60)
print("Step 2: Loading XTTS-v2 model...")
print("=" * 60)
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError as e:
    print(f"ERROR: TTS module not found: {e}")
    exit(1)
print("  -> Model loaded.\n")

# ─── 4. Generate recordings ───────────────────────────────────────────────────
OUTPUT_DIR = Path("/mnt/EDUAPP/public/recordings/ar_girl_custom")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# We use Tashkeel (diacritics) and Sukoun at the end of isolated words 
# to prevent the model from pronouncing the final vowel, making it sound more natural.
phrases = {
    "repeat_again": "أَعِدْ مَرَّةً أُخْرَى",
    "where_is_blue_square": "أَيْنَ الْمُرَبَّعُ الْأَزْرَقْ",
    "where_is_green_rectangle": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرْ",
    "bravo": "مُمْتَازْ", # using mumtaz
    "bravo_alt": "أَحْسَنْتْ", # using ahsant
    "rouge": "أَحْمَرْ",
    "jaune": "أَصْفَرْ",
    "green": "أَخْضَرْ",
    "pink": "وَرْدِي",
    "marron": "بُنِّي",
    "purple": "بَنَفْسَجِي",
    "rectangle": "مُسْتَطِيلْ",
    "triangle": "مُثَلَّثْ",
    "mix_colors": "اِخْلِطِ الْأَلْوَانَ، لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةْ"
}

total = len(phrases)
generated = 0
errors = 0

print("=" * 60)
print(f"Step 3: Synthesizing {total} custom recordings → {OUTPUT_DIR}")
print("=" * 60)

for file_key, text in phrases.items():
    file_name = f"{file_key}.wav"
    out_path = OUTPUT_DIR / file_name

    print(f"Synthesizing: {file_name}  →  '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(out_path),
            speaker_wav=REF_WAV,
            language="ar"
        )
        generated += 1
        print(f"         ✓ Saved: {out_path}")
    except Exception as e:
        errors += 1
        print(f"         ✗ ERROR: {e}")

print()
print("=" * 60)
print(f"DONE — Custom Arabic girl voice generation complete!")
print(f"  Generated : {generated}")
print(f"  Errors    : {errors}")
print(f"  Output    : {OUTPUT_DIR}")
print("=" * 60)
