import os
from pathlib import Path
import subprocess
import time

def synthesize(model, text, output_path, speaker_wav, language="ar"):
    print(f"  Text: '{text}' -> {output_path.name}")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(output_path),
            speaker_wav=speaker_wav,
            language=language
        )
        temp_path = str(output_path).replace(".wav", "_temp.wav")
        os.rename(output_path, temp_path)
        subprocess.run([
            "ffmpeg", "-y", "-i", temp_path,
            "-af", "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB"
                   ",silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB"
                   ",loudnorm=I=-16:TP=-1.5:LRA=11",
            str(output_path)
        ], capture_output=True)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"  Done!")
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    base_dir = Path("/mnt/EDUAPP")
    girl_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Arabicgirl" / "girlarb_ref.wav")
    girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"

    # Try multiple phrasings/spellings to force full pronunciation
    # "بُرْتُقَالِيّ" = burtuqali (orange). Model clips it so we try variations.
    attempts = [
        # 1: clean diacritics
        "بُرْتُقَالِيّ",
        # 2: without diacritics - sometimes helps
        "برتقالي",
        # 3: spaced out
        "بُرتُقَالِيّ",
        # 4: sentence context forces full word
        "اللون برتقالي",
        # 5: with trailing pause via comma
        "بُرْتُقَالِيّ،",
        # 6: repeated twice in sentence
        "برتقالي، برتقالي",
    ]

    for i, text in enumerate(attempts, start=1):
        wav_path = girl_dir / f"orange_v{i}.wav"
        print(f"\n--- orange V{i} ---")
        synthesize(model, text, wav_path, girl_ref)
        time.sleep(0.3)

    print("\n✅ Done! Orange variants V1-V6 regenerated with varied phrasings.")

if __name__ == "__main__":
    main()
