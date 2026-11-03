
import os
from pathlib import Path
import subprocess
import time

def synthesize(model, text, output_path, speaker_wav, language="ar"):
    print(f"Synthesizing: '{text}' -> {output_path}")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(output_path),
            speaker_wav=speaker_wav,
            language=language
        )
        
        # Post-processing: remove silence and normalize
        temp_path = str(output_path).replace(".wav", "_temp.wav")
        os.rename(output_path, temp_path)
        
        result = subprocess.run([
            "ffmpeg", "-y", "-i", temp_path,
            "-af", "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB,silenceremove=stop_periods=1:stop_silence=0.1:stop_threshold=-50dB,loudnorm=I=-16:TP=-1.5:LRA=11",
            str(output_path)
        ], capture_output=True)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        size = os.path.getsize(output_path)
        print(f"  Done! Size: {size} bytes")
        return size
    except Exception as e:
        print(f"  Error: {e}")
        return 0

def main():
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found. Run inside docker.")
        return

    print("Loading XTTS-v2 model...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
    
    base_dir = Path("/mnt/EDUAPP")
    girl_ref = str(base_dir / "reference_voices" / "XTTSV2" / "Arabicgirl" / "girlarb_ref.wav")
    girl_dir = base_dir / "public" / "recordings" / "ar" / "girl"

    # All Instructions, Questions & Missing Activity Words for Arabic Girl
    items = [
        ('welcome_learn',          'ماذا نريد أن نتعلم اليوم؟'),
        ('selection_cat',           'أي فئة تريد استكشافها؟'),
        ('instr_person',           'اسحب الكلمة إلى الشخص الصحيح!'),
        ('instr_color',            'اسحب الكلمة إلى اللون الصحيح!'),
        ('instr_shape',            'اسحب الكلمة إلى الشكل الصحيح!'),
        ('instr_questions',        'أجب على الأسئلة التالية'),
        ('instr_order',            'رتب الحروف لتكوين الكلمة!'),
        ('instr_mix',              'امزج الألوان لتجد النتيجة!'),
        ('instr_numbers',          'طابق الرقم مع الكمية الصحيحة!'),
        ('mix_colors',             'اخلط الألوان لتجد النتيجة الصحيحة'),
        ('o_est_le_cercle_rouge',   'أين الدائرة الحمراء؟'),
        ('where_is_blue_square',    'أين المربع الأزرق؟'),
        ('o_est_le_triangle_jaune', 'أين المثلث الأصفر؟'),
        ('where_is_green_rectangle','أين المستطيل الأخضر؟'),
        
        # Alphabet Activity missing words
        ('bag',      'محفظة'),
        ('teacher',  'معلمة'),
        ('school',   'مدرسة'),
        ('friend',   'صديقي'),
        ('cat',      'قطة'),
        ('dog',      'كلب'),
        ('sheep',    'خروف'),
        
        # Color Mixer missing words
        ('brown',    'بني'),
    ]

    for key, text in items:
        print(f"\n" + "="*40)
        print(f"REGENERATING: {key}")
        print(f"TEXT: {text}")
        print("="*40)
        
        variants = []
        # Generate 6 fresh variants (v10-v15)
        for v in range(10, 16):
            wav_path = girl_dir / f"{key}_v{v}.wav"
            size = synthesize(model, text, wav_path, girl_ref)
            if size > 10000: # Sanity check: more than 10KB
                variants.append((wav_path, size))
            time.sleep(0.2)
        
        if variants:
            # Pick the largest variant (usually the most complete)
            best_wav, best_size = max(variants, key=lambda x: x[1])
            target_wav = girl_dir / f"{key}.wav"
            
            # Copy the best one to the primary file
            import shutil
            shutil.copy2(best_wav, target_wav)
            print(f"\n⭐ PROMOTED: {best_wav.name} (Size: {best_size}) -> {key}.wav")
        else:
            print(f"\n❌ FAILED to generate any valid variants for {key}")

    print("\n✅ COMPLETE! All Arabic Girl instructions and questions have been regenerated and the best versions promoted.")

if __name__ == "__main__":
    main()
