import os
from pathlib import Path
import subprocess
import time

def synthesize(model, text, output_path, speaker_wav, language="ar"):
    print(f"Synthesizing: '{text}' -> {output_path}")
    max_retries = 3
    for attempt in range(max_retries):
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
                "-af", "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11",
                str(output_path)
            ], capture_output=True)
            
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return True
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {output_path}: {e}")
            time.sleep(2)
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
    boy_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Arabicboy" / "arabic_boyy_ref.wav")
    
    girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"
    boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"

    items = [
        ('father', 'أَب'), ('mother', 'أُمّ'), ('brother', 'أَخ'), ('sister', 'أُخْت'),
        ('grandfather', 'جَدّ'), ('grandmother', 'جَدَّة'),
        ('orange', 'بُرْتُقَالِيّ'), ('blanc', 'أَبْيَض'), ('noir', 'أَسْوَد'),
        ('gris', 'رَمَادِيّ'), ('violet', 'بَنَفْسَجِيّ'), ('blue', 'أَزْرَق'), ('jaune', 'أَصْفَر'), ('rouge', 'أَحْمَر'), ('green', 'أَخْضَر'), ('pink', 'وَرْدِيّ'),
        ('cercle', 'دَائِرَة'), ('carre', 'مُرَبَّع'),
        ('mumtaz', 'مُمْتَاز!'), ('rae', 'رَائِع!'), ('jayid_jiddan', 'جَيِّدٌ جِدًّا!'),
        ('anta_mumtaz', 'أَنْتَ مُمْتَاز!'), ('essaie_encore', 'حَاوِلْ مَرَّةً أُخْرَى!'),
        ('pas_tout_a_fait', 'لَيْسَ صَحِيحًا...'), ('reessaie', 'أَعِدِ الْمُحَاوَلَةَ!')
    ]

    # Generate for Girl
    for key, text in items:
        for v in range(1, 4):
            wav_path = girl_dir / f"{key}_v{v}.wav"
            if not wav_path.exists():
                synthesize(model, text, wav_path, girl_ref)

    # Generate for Boy
    for key, text in items:
        for v in range(1, 4):
            wav_path = boy_dir / f"{key}_v{v}.wav"
            if not wav_path.exists():
                synthesize(model, text, wav_path, boy_ref)

    print("\nDone! All missing Arabic variants generated.")

if __name__ == "__main__":
    main()
