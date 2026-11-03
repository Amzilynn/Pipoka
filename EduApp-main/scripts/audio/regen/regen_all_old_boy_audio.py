import os
import re
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

def get_arabic_texts_from_manifest(manifest_path):
    import json
    # Simple regex extraction since it's JS
    with open(manifest_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match { text: '...', lang: 'ar', ... }
    matches = re.findall(r"text:\s*['\"]([^'\"]+)['\"]\s*,\s*lang:\s*['\"]ar['\"]", content)
    return set(matches)

def get_recording_path_name(text):
    t = text.lower()
    # Apply the same JS regex replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    # \u0600-\u06FF are Arabic chars.
    safe_chars = set("abcdefghijklmnopqrstuvwxyz0123456789")
    
    normalized = ""
    for char in t:
        if ('a' <= char <= 'z') or ('0' <= char <= '9') or ('\u0600' <= char <= '\u06FF'):
            normalized += char
        else:
            normalized += "_"
            
    # replace multiple _ with single _
    normalized = re.sub(r"_+", "_", normalized)
    # strip _ from start/end
    normalized = normalized.strip("_")
    normalized = normalized[:50]
    
    return f"{normalized}.wav"

def main():
    print("Initializing TTS...")
    try:
        from TTS.api import TTS
    except ImportError:
        print("TTS not found. Make sure this runs inside the Docker container.")
        return

    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
    
    base_dir = Path("/mnt/EDUAPP")
    boy_ref = base_dir / "reference_voices" / "XTTSV2" / "Arabicboy" / "arabic_boyy_ref.wav"
    boy_dir = base_dir / "public" / "recordings" / "ar" / "boy"
    manifest_path = base_dir / "src" / "data" / "recordingsManifest.js"

    arabic_texts = get_arabic_texts_from_manifest(manifest_path)
    print(f"Found {len(arabic_texts)} Arabic texts in manifest.")

    # We also need to add the Alphabet characters because they aren't explicitly in the manifest with lang:'ar'
    # Wait, let's check content.js for alphabet.
    
    # Hardcode alphabet and some missing ones just in case:
    alphabet_ar = [
        "أَلِف", "بَاء", "تَاء", "ثَاء", "جِيم", "حَاء", "خَاء", "دَال", "ذَالْ", "رَاء",
        "زَايْ", "سِين", "شِين", "صَاد", "ضَاد", "طَاءْ", "ظَاء", "عَيْن", "غَيْن", "فَاءْ",
        "قَاف", "كَاف", "لاَم", "مِيمْ", "نُون", "هَاء", "وَاو", "يَاء"
    ]
    # In recordingsManifest, alphabet might not be listed. Wait, they are not! They are just played from content.js letters.
    # The letter keys are 'أ', 'ب', 'ت' etc.
    # The file names are just 'أ.wav'
    letter_mapping = {
        "أ.wav": "أَلِف", "ب.wav": "بَاء", "ت.wav": "تَاء", "ث.wav": "ثَاء", "ج.wav": "جِيم",
        "ح.wav": "حَاء", "خ.wav": "خَاء", "د.wav": "دَال", "ذ.wav": "ذَالْ", "ر.wav": "رَاء",
        "ز.wav": "زَايْ", "س.wav": "سِين", "ش.wav": "شِين", "ص.wav": "صَاد", "ض.wav": "ضَاد",
        "ط.wav": "طَاءْ", "ظ.wav": "ظَاء", "ع.wav": "عَيْن", "غ.wav": "غَيْن", "ف.wav": "فَاءْ",
        "ق.wav": "قَاف", "ك.wav": "كَاف", "ل.wav": "لاَم", "م.wav": "مِيمْ", "ن.wav": "نُون",
        "هـ.wav": "هَاء", "و.wav": "وَاو", "ي.wav": "يَاء"
    }

    tasks = {}
    for text in arabic_texts:
        # Some texts need tashkeel for better pronunciation
        tashkeel_dict = {
            "الأم": "اَلْأُمّ", "الأب": "اَلْأَب", "الأخ": "اَلْأَخ", "الأخت": "اَلْأُخْت", 
            "الجدة": "اَلْجَدَّة", "الجد": "اَلْجَدّ", "أحمر": "أَحْمَر", "أزرق": "أَزْرَق", 
            "أصفر": "أَصْفَر", "أسود": "أَسْوَد", "أبيض": "أَبْيَض", "أخضر": "أَخْضَر", 
            "برتقالي": "بُرْتُقَالِيّ", "وردي": "وَرْدِيّ", "بنفسجي": "بَنَفْسَجِيّ", "رمادي": "رَمَادِيّ",
            "دائرة": "دَائِرَة", "مربع": "مُرَبَّع", "مثلث": "مُثَلَّث", "مستطيل": "مُسْتَطِيل",
            "أين الدائرة الحمراء؟": "أَيْنَ الدَّائِرَةُ الْحَمْرَاءُ؟",
            "أين المربع الأزرق؟": "أَيْنَ الْمُرَبَّعُ الْأَزْرَقُ؟",
            "أين المثلث الأصفر؟": "أَيْنَ الْمُثَلَّثُ الْأَصْفَرُ؟",
            "أين المستطيل الأخضر؟": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟",
            "أحسنت!": "أَحْسَنْتَ!", "ممتاز!": "مُمْتَاز!", "رائع!": "رَائِع!", "جيد جدا!": "جَيِّد جِدًّا!",
            "أنت ممتاز!": "أَنْتَ مُمْتَاز!", "حاول مرة أخرى!": "حَاوِل مَرَّةً أُخْرَى!", "ليس صحيحا...": "لَيْسَ صَحِيحًا...",
            "أعد المحاولة!": "أَعِد الْمُحَاوَلَة!", "أي فئة تريد استكشافها؟": "أَيُّ فِئَةٍ تُرِيدُ اسْتِكْشَافَهَا؟",
            "ماذا نريد أن نتعلم اليوم؟": "مَاذَا نُرِيدُ أَنْ نَتَعَلَّمَ الْيَوْمَ؟",
            "اسحب الكلمة إلى الشخص الصحيح!": "اِسْحَب الْكَلِمَةَ إِلَى الشَّخْصِ الصَّحِيح!",
            "اسحب الكلمة إلى اللون الصحيح!": "اِسْحَب الْكَلِمَةَ إِلَى اللَّوْنِ الصَّحِيح!",
            "اسحب الكلمة إلى الشكل الصحيح!": "اِسْحَب الْكَلِمَةَ إِلَى الشَّكْلِ الصَّحِيح!",
            "أجب على الأسئلة التالية": "أَجِب عَلَى الْأَسْئِلَةِ التَّالِيَة",
            "رتّب الحروف لتكوين الكلمة!": "رَتِّبِ الْحُرُوفَ لِتَكْوِينِ الْكَلِمَة!",
            "امزج الألوان لتجد النتيجة!": "اِمْزِجِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَة!",
            "بيت": "بَيْت", "قمر": "قَمَر", "شمس": "شَمْس", "كتاب": "كِتَاب", "قلم": "قَلَم",
            "أسد": "أَسَد", "بحر": "بَحْر", "وردة": "وَرْدَة", "تفاحة": "تُفَّاحَة", "جمل": "جَمَل"
        }
        
        filename = get_recording_path_name(text)
        tasks[filename] = tashkeel_dict.get(text, text)

    tasks.update(letter_mapping)

    # Find which ones need to be generated (if created before April 30, 2026)
    # The recent session was April 30.
    from datetime import datetime
    cutoff_date = datetime(2026, 4, 30).timestamp()

    count = 0
    for filename, text_to_synth in tasks.items():
        file_path = boy_dir / filename
        needs_regen = True
        if file_path.exists():
            mtime = os.path.getmtime(file_path)
            if mtime > cutoff_date:
                needs_regen = False
                
        if needs_regen:
            print(f"[{count}] Regenerating: {filename}")
            try:
                synthesize(model, text_to_synth, file_path, str(boy_ref))
                count += 1
            except Exception as e:
                print(f"Error on {filename}: {e}")

    print(f"\nDone! Regenerated {count} old Arabic boy files.")

if __name__ == "__main__":
    main()
