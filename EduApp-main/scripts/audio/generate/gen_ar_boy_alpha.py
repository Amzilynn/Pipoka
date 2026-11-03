import os
from pathlib import Path
import subprocess

def synthesize(model, text, output_path, speaker_wav, language="ar"):
    print(f"Synthesizing: '{text}' -> {output_path}")
    model.tts_to_file(
        text=text,
        file_path=str(output_path),
        speaker_wav=speaker_wav,
        language=language
    )
    
    # Post-process with FFmpeg
    temp_path = str(output_path).replace(".wav", "_temp.wav")
    os.rename(output_path, temp_path)
    
    subprocess.run([
        "ffmpeg", "-y", "-i", temp_path,
        "-af", "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11",
        str(output_path)
    ], capture_output=True)
    
    if os.path.exists(temp_path):
        os.remove(temp_path)

def main():
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
    
    base_dir = Path("/mnt/EDUAPP")
    boy_ref = base_dir / "reference_voices" / "XTTSV2" / "Arabicboy" / "arabic_boyy_ref.wav"
    boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"

    alphabet = [
        ("alif", "أَلِف"), ("baa", "بَاء"), ("taa", "تَاء"), ("thaa", "ثَاء"),
        ("jeem", "جِيم"), ("haa_soft", "حَاء"), ("khaa", "خَاء"), ("daal", "دَال"),
        ("thaal", "ذَال"), ("raa", "رَاء"), ("zay", "زَاي"), ("seen", "سِين"),
        ("sheen", "شِين"), ("saad", "صَاد"), ("daad", "ضَاد"), ("taa_hard", "طَاء"),
        ("zaa", "ظَاء"), ("ayn", "عَيْن"), ("ghayn", "غَيْن"), ("faa", "فَاء"),
        ("qaaf", "قَاف"), ("kaaf", "كَاف"), ("laam", "لاَم"), ("meem", "مِيم"),
        ("noon", "نُون"), ("haa", "هَاء"), ("waw", "وَاو"), ("yaa", "يَاء")
    ]

    for key, text in alphabet:
        for v in range(1, 4):
            wav_path = boy_dir / f"{key}_v{v}.wav"
            if not wav_path.exists():
                try:
                    synthesize(model, text, wav_path, str(boy_ref))
                except Exception as e:
                    print(f"Error for {key}: {e}")

    print("\nDone! Arabic Boy Alphabet variants v1-v3 generated.")

if __name__ == "__main__":
    main()
