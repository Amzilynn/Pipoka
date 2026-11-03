import os
import shutil
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
    
    # Post-process with FFmpeg to trim silence and normalize
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
    base_dir = Path("/mnt/EDUAPP")
    girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"
    boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"
    
    # --- PHASE 1: REPLACEMENTS (User Favorites) ---
    print("Applying user favorites to app files...")
    replacements = [
        # General Phrases
        (girl_dir / "repeat_again_v1.wav", girl_dir / "أعد_مرة_أخرى.wav"),
        (girl_dir / "where_is_blue_square_v2.wav", girl_dir / "أين_المربع_الأزرق؟.wav"),
        (girl_dir / "rouge_v3.wav", girl_dir / "أحمر.wav"),
        (girl_dir / "jaune_v1.wav", girl_dir / "أصفر.wav"),
        (girl_dir / "green_v3.wav", girl_dir / "أخضر.wav"),
        (girl_dir / "pink_v1.wav", girl_dir / "وردي.wav"),
        (girl_dir / "marron_v2.wav", girl_dir / "بني.wav"),
        (girl_dir / "purple_v3.wav", girl_dir / "بنفسجي.wav"),
        (girl_dir / "rectangle_v3.wav", girl_dir / "مستطيل.wav"),
        (girl_dir / "triangle_v3.wav", girl_dir / "مثلث.wav"),
        
        # Alphabet
        (girl_dir / "alif_v2.wav", girl_dir / "أ.wav"),
        (girl_dir / "baa_v2.wav", girl_dir / "ب.wav"),
        (girl_dir / "taa_v1.wav", girl_dir / "ت.wav"),
        (girl_dir / "thaa_v3.wav", girl_dir / "ث.wav"),
        (girl_dir / "jeem_v1.wav", girl_dir / "ج.wav"),
        (girl_dir / "haa_soft_v3.wav", girl_dir / "ح.wav"),
        (girl_dir / "khaa_v1.wav", girl_dir / "خ.wav"),
        (girl_dir / "daal_v2.wav", girl_dir / "د.wav"),
        (girl_dir / "raa_v2.wav", girl_dir / "ر.wav"),
        (girl_dir / "seen_v3.wav", girl_dir / "س.wav"),
        (girl_dir / "sheen_v3.wav", girl_dir / "ش.wav"),
        (girl_dir / "saad_v1.wav", girl_dir / "ص.wav"),
        (girl_dir / "daad_v1.wav", girl_dir / "ض.wav"),
        (girl_dir / "zaa_v1.wav", girl_dir / "ظ.wav"),
        (girl_dir / "ayn_v2.wav", girl_dir / "ع.wav"),
        (girl_dir / "ghayn_v3.wav", girl_dir / "غ.wav"),
        (girl_dir / "qaaf_v2.wav", girl_dir / "ق.wav"),
        (girl_dir / "kaaf_v3.wav", girl_dir / "ك.wav"),
        (girl_dir / "laam_v3.wav", girl_dir / "ل.wav"),
        (girl_dir / "noon_v1.wav", girl_dir / "ن.wav"),
        (girl_dir / "haa_v1.wav", girl_dir / "هـ.wav"),
        (girl_dir / "waw_v2.wav", girl_dir / "و.wav"),
        (girl_dir / "yaa_v1.wav", girl_dir / "ي.wav"),
    ]
    
    for src, dst in replacements:
        if src.exists():
            shutil.copy(src, dst)
            print(f"  Copied {src.name} -> {dst.name}")
        else:
            print(f"  Warning: {src} not found")

    # --- PHASE 2: REGENERATIONS ---
    print("\nStarting regenerations...")
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found. Make sure this runs inside the Docker container.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
    ref_dir = base_dir / "reference_voices" / "XTTSV2"
    girl_ref = ref_dir / "Arabicgirl" / "girlarb_ref.wav"
    boy_ref = ref_dir / "Arabicboy" / "arabic_boyy_ref.wav"

    regen_girl = {
        "where_is_green_rectangle": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟",
        "mix_colors": "اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ",
        "bravo": "أَحْسَنْتَ!", # Neutral form
        "thaal": "ذَالْ",
        "zay": "زَايْ",
        "taa_hard": "طَاءْ",
        "faa": "فَاءْ",
        "meem": "مِيمْ"
    }

    # Generate 3 new variants for each (v4, v5, v6)
    for key, text in regen_girl.items():
        print(f"\nProcessing {key} variants...")
        for v in range(4, 7):
            wav_name = f"{key}_v{v}.wav"
            wav_path = girl_dir / wav_name
            try:
                synthesize(model, text, wav_path, str(girl_ref))
            except Exception as e:
                print(f"  Error: {e}")

    # Also regenerate Bravo for boy (to match neutrality)
    print("\nProcessing bravo for boy...")
    for v in range(4, 7):
        wav_name = f"bravo_v{v}.wav"
        wav_path = boy_dir / wav_name
        try:
            synthesize(model, "أَحْسَنْتَ!", wav_path, str(boy_ref))
        except Exception as e:
            print(f"  Error: {e}")

if __name__ == "__main__":
    main()
