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

    # Each item: (file_key, [v1_text, v2_text, ..., v6_text])
    # 6 phrasings per word — varying diacritics, context, punctuation
    items = [
        # ─── أَزْرَق (blue) ───────────────────────────────────────
        ("bleu", [
            "أَزْرَقُ",
            "أَزْرَق",
            "ازرق",
            "اللَّوْنُ أَزْرَق",
            "أَزْرَقُ.",
            "أَزْرَق، أَزْرَق",
        ]),

        # ─── أُمّ (mother) ────────────────────────────────────────
        ("mother", [
            "أُمٌّ",
            "أُمّ",
            "الأُمُّ",
            "هذِهِ أُمٌّ",
            "أُمّ.",
            "أُمٌّ، أُمٌّ",
        ]),

        # ─── أُخْت (sister) ───────────────────────────────────────
        ("sister", [
            "أُخْتٌ",
            "أُخْت",
            "الأُخْتُ",
            "هذِهِ أُخْتٌ",
            "أُخْت.",
            "أُخْتٌ، أُخْتٌ",
        ]),

        # ─── اِخْلِطِ الْأَلْوَانَ (mix the colors) ──────────────
        ("mix_colors", [
            "اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ.",
            "اخلط الألوان لتجد النتيجة الصحيحة.",
            "امْزُجِ الأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ.",
            "اخلط الألوان وابحث عن النتيجة الصحيحة.",
            "اِخْلِطِ الأَلوانَ لِتَكْشِفَ النَّتِيجَةَ الصَّحِيحَةَ.",
            "امزج الألوان لتعرف الناتج الصحيح.",
        ]),

        # ─── حَاوِلْ مَرَّةً أُخْرَى (try again) ────────────────
        ("essaie_encore", [
            "حَاوِلْ مَرَّةً أُخْرَى!",
            "حاول مرة أخرى!",
            "حَاوِلْ مَرَّةً أُخْرَى.",
            "اُحاوِلْ مَرَّةً أُخرى!",
            "جَرِّبْ مَرَّةً أُخْرَى!",
            "أَعِدِ الْمُحَاوَلَةَ مِنْ جَدِيدٍ.",
        ]),

        # ─── Alphabet letters ─────────────────────────────────────
        ("baa", [
            "بَاءٌ",
            "بَاء",
            "حَرْفُ بَاء",
            "الْبَاء",
            "بَاءٌ، بَاءٌ",
            "هذا حرف بَاء",
        ]),
        ("taa", [
            "تَاءٌ",
            "تَاء",
            "حَرْفُ تَاء",
            "الْتَاء",
            "تَاءٌ، تَاءٌ",
            "هذا حرف تَاء",
        ]),
        ("daal", [
            "دَالٌ",
            "دَال",
            "حَرْفُ دَال",
            "الدَّال",
            "دَالٌ، دَالٌ",
            "هذا حرف دَال",
        ]),
        ("thaal", [
            "ذَالٌ",
            "ذَال",
            "حَرْفُ ذَال",
            "الذَّال",
            "ذَالٌ، ذَالٌ",
            "هذا حرف ذَال",
        ]),
        ("zay", [
            "زَايٌ",
            "زَاي",
            "حَرْفُ زَاي",
            "الزَّاي",
            "زَايٌ، زَايٌ",
            "هذا حرف زَاي",
        ]),
        ("faa", [
            "فَاءٌ",
            "فَاء",
            "حَرْفُ فَاء",
            "الْفَاء",
            "فَاءٌ، فَاءٌ",
            "هذا حرف فَاء",
        ]),
        ("haa", [
            "هَاءٌ",
            "هَاء",
            "حَرْفُ هَاء",
            "الْهَاء",
            "هَاءٌ، هَاءٌ",
            "هذا حرف هَاء",
        ]),
        ("waw", [
            "وَاوٌ",
            "وَاو",
            "حَرْفُ وَاو",
            "الْوَاو",
            "وَاوٌ، وَاوٌ",
            "هذا حرف وَاو",
        ]),
        ("yaa", [
            "يَاءٌ",
            "يَاء",
            "حَرْفُ يَاء",
            "الْيَاء",
            "يَاءٌ، يَاءٌ",
            "هذا حرف يَاء",
        ]),
    ]

    for file_key, texts in items:
        print(f"\n═══ {file_key} ═══")
        for v, text in enumerate(texts, start=1):
            wav_path = boy_dir / f"{file_key}_v{v}.wav"
            synthesize(model, text, wav_path, boy_ref)
            time.sleep(0.2)

    print("\n✅ All done! Boy Arabic variants V1-V6 generated.")

if __name__ == "__main__":
    main()
