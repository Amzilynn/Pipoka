import os
import subprocess
from pathlib import Path

# Texts to generate
missing_words = [
    "امزج الألوان لتجد النتيجة"
]

files = [
    "امزج_الألوان_لتجد_النتيجة.wav"
]

print("Initializing TTS...")
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError as e:
    print(f"TTS module not found: {e}")
    exit(1)

# Generate for girl
print("\nGenerating for GIRL...")
ref_girl = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"
out_dir_girl = Path("/mnt/EDUAPP/public/recordings/ar/girl")

for i, text in enumerate(missing_words):
    out_path = out_dir_girl / files[i]
    print(f"Synthesizing: {files[i]} -> '{text}'")
    model.tts_to_file(text=text, file_path=str(out_path), speaker_wav=ref_girl, language="ar")
    print(f"  -> Saved: {out_path}")

# Generate for boy
print("\nGenerating for BOY...")
ref_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicboy/arabic_boyy_ref.wav"
out_dir_boy = Path("/mnt/EDUAPP/public/recordings/ar/boy")

for i, text in enumerate(missing_words):
    out_path = out_dir_boy / files[i]
    print(f"Synthesizing: {files[i]} -> '{text}'")
    model.tts_to_file(text=text, file_path=str(out_path), speaker_wav=ref_boy, language="ar")
    print(f"  -> Saved: {out_path}")

print("\nDone patching missing files!")
