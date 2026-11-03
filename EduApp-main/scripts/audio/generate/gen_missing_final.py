import os
from pathlib import Path
import subprocess
import time

def synthesize(model, text, output_path, speaker_wav, language):
    print(f"Synthesizing: '{text}' ({language}) -> {output_path.name}")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(output_path),
            speaker_wav=speaker_wav,
            language=language
        )
        # Post-process
        temp_path = str(output_path).replace(".wav", "_temp.wav")
        os.rename(output_path, temp_path)
        subprocess.run([
            "ffmpeg", "-y", "-i", temp_path,
            "-af", "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11",
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
    
    # Paths
    ar_boy_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Arabicboy" / "arabic_boyy_ref.wav")
    fr_girl_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Frenchgirl" / "girl-voice-fr.mp3")
    fr_boy_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Frenchboy" / "le petit nicola.mp3")

    # 1. Arabic Boy instruction
    ar_boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"
    synthesize(model, "رتّب الحروف لتكوين الكلمة!", ar_boy_dir / "رتب_الحروف_لتكوين_الكلمة_v1.wav", ar_boy_ref, "ar")

    # 2. French École (Girl & Boy)
    fr_girl_dir = base_dir / "public" / "recordings" / "fr" / "girl"
    fr_boy_dir = base_dir / "public" / "recordings" / "fr" / "boy"
    
    synthesize(model, "École", fr_girl_dir / "_cole_v1.wav", fr_girl_ref, "fr")
    synthesize(model, "École", fr_boy_dir / "_cole_v1.wav", fr_boy_ref, "fr")

    print("\n✅ Done! Generated the 3 missing items.")

if __name__ == "__main__":
    main()
