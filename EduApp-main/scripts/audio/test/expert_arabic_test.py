import os
import subprocess
from pathlib import Path

# Fix the reference voices by trimming them to the cleanest 7 seconds
print("Extracting 7-second clean segments from reference voices...")
ref1 = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girl-voice-arabic.mp3"
ref2 = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/arabic girrr.mp3"

ref1_short = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/ref1_short.wav"
ref2_short = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/ref2_short.wav"

# Using ffmpeg to extract 7 seconds starting at 2 seconds in, to skip potential silence
subprocess.run(["ffmpeg", "-y", "-i", ref1, "-ss", "00:00:01", "-t", "00:00:07", "-ac", "1", "-ar", "22050", ref1_short], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
subprocess.run(["ffmpeg", "-y", "-i", ref2, "-ss", "00:00:01", "-t", "00:00:07", "-ac", "1", "-ar", "22050", ref2_short], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

output_dir = Path("/mnt/EDUAPP/public/recordings/test_arabic_optimal")
output_dir.mkdir(parents=True, exist_ok=True)

# Phrases with PERFECT Tashkeel to enforce correct Arabic pronunciation
phrases = [
    ("مَرْحَبَاً، كَيْفَ حَالُكِ الْيَوْم؟", "tashkeel_hello.wav"),
    ("أَنْتِ رَائِعَةٌ جِدَّاً!", "tashkeel_awesome.wav"),
    ("هَيَّا نَتَعَلَّمُ مَعَاً الْأَلْوَان.", "tashkeel_colors.wav")
]

print("Initializing TTS...")
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError:
    print("TTS module not found.")
    exit(1)

# Test with ref2 (arabic girrr) short version, which might be cleaner
for text_to_say, file_name in phrases:
    out_path = output_dir / f"ref2_{file_name}"
    print(f"Synthesizing {file_name} with ref2_short...")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref2_short,
            language="ar"
        )
    except Exception as e:
        print(f"Error: {e}")

# Test with ref1 short version
for text_to_say, file_name in phrases:
    out_path = output_dir / f"ref1_{file_name}"
    print(f"Synthesizing {file_name} with ref1_short...")
    try:
        model.tts_to_file(
            text=text_to_say,
            file_path=str(out_path),
            speaker_wav=ref1_short,
            language="ar"
        )
    except Exception as e:
        print(f"Error: {e}")

print("Completed generation of optimally diacritized Arabic phrases!")
