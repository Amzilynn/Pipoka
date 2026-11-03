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
    girl_ref = base_dir / "reference_voices" / "XTTSV2" / "Arabicgirl" / "arabic_girl_ref.wav"
    girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"

    phrases = [
        ('father', 'أَب'), ('mother', 'أُمّ'), ('brother', 'أَخ'), ('sister', 'أُخْت'),
        ('grandfather', 'جَدّ'), ('grandmother', 'جَدَّة'),
        ('orange', 'بُرْتُقَالِيّ'), ('blanc', 'أَبْيَض'), ('noir', 'أَسْوَد'),
        ('gris', 'رَمَادِيّ'), ('violet', 'بَنَفْسَجِيّ'),
        ('cercle', 'دَائِرَة'), ('carre', 'مُرَبَّع'),
        ('mumtaz', 'مُمْتَاز!'), ('rae', 'رَائِع!'), ('jayid_jiddan', 'جَيِّدٌ جِدًّا!'),
        ('anta_mumtaz', 'أَنْتَ مُمْتَاز!'), ('essaie_encore', 'حَاوِلْ مَرَّةً أُخْرَى!'),
        ('pas_tout_a_fait', 'لَيْسَ صَحِيحًا...'), ('reessaie', 'أَعِدِ الْمُحَاوَلَةَ!')
    ]

    for key, text in phrases:
        for v in range(1, 4):
            wav_path = girl_dir / f"{key}_v{v}.wav"
            if not wav_path.exists():
                try:
                    synthesize(model, text, wav_path, str(girl_ref))
                except Exception as e:
                    print(f"Error for {key}: {e}")

    print("\nDone! Missing Arabic Girl phrases variants generated.")

if __name__ == "__main__":
    main()
