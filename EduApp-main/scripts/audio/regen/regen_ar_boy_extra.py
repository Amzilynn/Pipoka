import os
from pathlib import Path
import subprocess
import time

def synthesize(model, text, output_path, speaker_wav, language="ar"):
    print(f"  '{text}' -> {output_path.name}")
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
            "-af", (
                "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,"
                "silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB,"
                "loudnorm=I=-16:TP=-1.5:LRA=11"
            ),
            str(output_path)
        ], capture_output=True)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"    ✓ Done")
        return True
    except Exception as e:
        print(f"    ✗ Error: {e}")
        return False

def main():
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    base_dir = Path("/mnt/EDUAPP")
    boy_ref  = str(base_dir / "reference_voices" / "XTTSV2" / "Arabicboy" / "arabic_boyy_ref.wav")
    boy_dir  = base_dir / "public" / "recordings" / "ar" / "boy"

    items = [
        ("haa", [
            "حَرْفُ الْهَاء",
            "هَاءٌ",
            "هَاء",
            "الْهَاءُ",
            "هَاء، هَاء",
            "هذا حرفُ الْهَاء",
        ]),
        ("mix_colors", [
            "اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ.",
            "امْزُجِ الْأَلْوَانَ لِتَحْصُلَ عَلَى النَّتِيجَةِ الصَّحِيحَةِ.",
            "اِخْلِطِ الْأَلْوَانَ وَاكْتَشِفِ النَّتِيجَةَ الصَّحِيحَةَ.",
            "امْزُجِ الْأَلْوَانَ لِمَعْرِفَةِ النَّتِيجَةِ الصَّحِيحَةِ.",
            "اِخْلِطِ الْأَلْوَانَ مَعًا لِلْوُصُولِ إِلَى النَّتِيجَةِ الصَّحِيحَةِ.",
            "امْزُجِ الْأَلْوَانَ بِدِقَّةٍ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ.",
        ]),
    ]

    for file_key, texts in items:
        print(f"\n═══ {file_key} ═══")
        for v, text in enumerate(texts, start=1):
            wav_path = boy_dir / f"{file_key}_v{v}.wav"
            synthesize(model, text, wav_path, boy_ref)
            time.sleep(0.2)

    print("\n✅ Done! Regenerated Boy Arabic variants for 'haa' and 'mix_colors'.")

if __name__ == "__main__":
    main()
