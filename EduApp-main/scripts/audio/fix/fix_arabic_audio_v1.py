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
    
    # Post-process with FFmpeg to trim silence and normalize
    # This helps remove "random voice" or clicks at start/end
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
    print("Initializing TTS...")
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found. Make sure this runs inside the Docker container.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    # Base paths inside the container
    base_dir = Path("/mnt/EDUAPP")
    ref_dir = base_dir / "reference_voices" / "XTTSV2"
    girl_ref = ref_dir / "Arabicgirl" / "girlarb_ref.wav"
    boy_ref = ref_dir / "Arabicboy" / "arabic_boyy_ref.wav"

    # Define tasks
    girl_phrases = {
        "repeat_again": "أَعِدْ مَرَّةً أُخْرَى",
        "where_is_blue_square": "أَيْنَ الْمُرَبَّعُ الْأَزْرَقُ؟",
        "where_is_green_rectangle": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟",
        "bravo": "أَحْسَنْتِ!",
        "rouge": "أَحْمَر",
        "jaune": "أَصْفَر",
        "green": "أَخْضَر",
        "pink": "وَرْدِيّ",
        "marron": "بُنِّيّ",
        "purple": "بَنَفْسَجِيّ",
        "rectangle": "مُسْتَطِيل",
        "triangle": "مُثَلَّث",
        "mix_colors": "اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ"
    }
    
    # Adding characters for girl voice as requested "random voice in characters"
    alphabet = {
        "alif": "أَلِف", "baa": "بَاء", "taa": "تَاء", "thaa": "ثَاء", "jeem": "جِيم",
        "haa_soft": "حَاء", "khaa": "خَاء", "daal": "دَال", "thaal": "ذَال", "raa": "رَاء",
        "zay": "زَاي", "seen": "سِين", "sheen": "شِين", "saad": "صَاد", "daad": "ضَاد",
        "taa_hard": "طَاء", "zaa": "ظَاء", "ayn": "عَيْن", "ghayn": "غَيْن", "faa": "فَاء",
        "qaaf": "قَاف", "kaaf": "كَاف", "laam": "لاَم", "meem": "مِيم", "noon": "نُون",
        "haa": "هَاء", "waw": "وَاو", "yaa": "يَاء"
    }
    girl_phrases.update(alphabet)

    boy_phrases = {
        "father": "أَب",
        "grandfather": "جَدّ",
        "bravo": "أَحْسَنْتَ!",
        "rectangle": "مُسْتَطِيل",
        "triangle": "مُثَلَّث",
        "marron": "بُنِّيّ",
        "pink": "وَرْدِيّ",
        "purple": "بَنَفْسَجِيّ",
        "gris": "رَمَادِيّ",
        "where_is_blue_square": "أَيْنَ الْمُرَبَّعُ الْأَزْرَقُ؟",
        "where_is_green_rectangle": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟"
    }

    tasks = [
        {"voice": "girl", "ref": girl_ref, "phrases": girl_phrases},
        {"voice": "boy", "ref": boy_ref, "phrases": boy_phrases}
    ]

    for task in tasks:
        voice = task["voice"]
        ref = task["ref"]
        phrases = task["phrases"]
        
        output_dir = base_dir / "public" / "recordings" / "ar" / voice
        output_dir.mkdir(parents=True, exist_ok=True)

        for key, text in phrases.items():
            print(f"\nProcessing {key} for {voice}...")
            for v in range(1, 4):  # Generate 3 variants
                wav_name = f"{key}_v{v}.wav"
                wav_path = output_dir / wav_name
                
                try:
                    synthesize(model, text, wav_path, str(ref))
                except Exception as e:
                    print(f"Error synthesizing {wav_name}: {e}")

if __name__ == "__main__":
    main()
