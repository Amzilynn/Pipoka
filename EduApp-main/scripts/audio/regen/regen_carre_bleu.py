import os
from pathlib import Path

def get_tts_model():
    from TTS.api import TTS
    return TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

def synthesize_one(model, text, out_path, ref_wav, lang):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"[{lang}] Synthesizing to {out_path}: '{text}'")
    try:
        model.tts_to_file(text=text, file_path=str(out_path), speaker_wav=ref_wav, language=lang)
        print(f"Success: {out_path}")
    except Exception as e:
        print(f"Error on {out_path}: {e}")

# ==========================================
# CONFIGURATION
# ==========================================
BASE_DIR = Path("/mnt/EDUAPP")
RECORDINGS_DIR = BASE_DIR / "public" / "recordings"

refs = {
    "fr_girl": str(BASE_DIR / "reference_voices" / "XTTSV2" / "Frenchgirl" / "girl-voice-fr.mp3"),
    "fr_boy": str(BASE_DIR / "reference_voices" / "XTTSV2" / "Frenchboy" / "le petit nicola.mp3")
}

# Generate a few variants for "carré bleu"
# v1: Standard with question mark
# v2: Standard without punctuation
# v3: Phonetic hint "car-ré"
tasks = [
    {"text": "Où est le carré bleu ?", "key": "o_est_le_carr_bleu", "voices": ["girl", "boy"]},
    {"text": "Où est le carré bleu", "key": "o_est_le_carr_bleu_v2", "voices": ["girl", "boy"]},
    {"text": "Où est le ca-rré bleu ?", "key": "o_est_le_carr_bleu_v3", "voices": ["girl", "boy"]}
]

def main():
    print("Regenerating carré bleu variants...")
    model = get_tts_model()
    
    for task in tasks:
        text = task["text"]
        key = task["key"]
        for voice in task["voices"]:
            lang = "fr"
            out_path = RECORDINGS_DIR / lang / voice / f"{key}.wav"
            ref_wav = refs[f"{lang}_{voice}"]
            synthesize_one(model, text, out_path, ref_wav, lang)

    print("REGENERATION COMPLETE.")

if __name__ == "__main__":
    main()
