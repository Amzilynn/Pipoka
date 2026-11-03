import os
import subprocess
import requests
from pathlib import Path

# Paths below are project-root relative, so resolve them from this file's location.
ROOT = Path(__file__).resolve().parents[3]

output_dir = ROOT / "public/recordings/test_arabic_5_phrases"
output_dir.mkdir(parents=True, exist_ok=True)

phrases = [
    ("مرحباً، كيف حالك اليوم؟", "phrase_1"),
    ("هيا نتعلم معاً.", "phrase_2"),
    ("أنت رائع جداً!", "phrase_3"),
    ("انقر على الزر الصحيح.", "phrase_4"),
    ("اللون الأحمر جميل.", "phrase_5")
]

API_URL = "http://localhost:7860/synthesize"

print("Checking XTTS API health...")
try:
    health = requests.get("http://localhost:7860/health", timeout=5).json()
    print(f"API Status: {health}")
except Exception as e:
    print(f"Warning: Could not reach API: {e}")

for text_to_say, file_name in phrases:
    wav_path = output_dir / f"{file_name}.wav"
    mp3_path = output_dir / f"{file_name}.mp3"
    print(f"Synthesizing: {file_name} -> '{text_to_say}'")
    try:
        response = requests.post(
            API_URL,
            json={"text": text_to_say, "language": "ar", "voice": "girl"},
            timeout=120
        )
        if response.status_code == 200:
            with open(wav_path, "wb") as f:
                f.write(response.content)
            print(f"  Converting to MP3...")
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(wav_path), "-ac", "1", "-ar", "22050", str(mp3_path)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            wav_path.unlink()
            print(f"  Done: {mp3_path}")
        else:
            print(f"  Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error on {file_name}: {e}")

print("Generation complete!")
