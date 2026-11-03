import os
from pathlib import Path

def get_tts_model():
    from TTS.api import TTS
    # Using CPU for compatibility
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
# Use /mnt/EDUAPP when running inside Docker
BASE_DIR = Path("/mnt/EDUAPP")
RECORDINGS_DIR = BASE_DIR / "public" / "recordings"

refs = {
    "fr_girl": str(BASE_DIR / "reference_voices" / "XTTSV2" / "Frenchgirl" / "girl-voice-fr.mp3"),
    "fr_boy": str(BASE_DIR / "reference_voices" / "XTTSV2" / "Frenchboy" / "le petit nicola.mp3")
}

# Tasks to fix
# 1. "Où est le carré bleu ?" (Ensure consistency and match)
# 2. "Où est le rectangle vert ?" (Ensure boy voice for boy)

tasks = [
    {
        "text": "Où est le carré bleu ?",
        "key": "o_est_le_carr_bleu",
        "voices": ["girl", "boy"]
    },
    {
        "text": "Où est le rectangle vert ?",
        "key": "o_est_le_rectangle_vert",
        "voices": ["girl", "boy"]
    }
]

# ==========================================
# EXECUTION
# ==========================================
def main():
    print("Starting specific audio fixes...")
    model = get_tts_model()
    
    for task in tasks:
        text = task["text"]
        key = task["key"]
        for voice in task["voices"]:
            lang = "fr"
            out_path = RECORDINGS_DIR / lang / voice / f"{key}.wav"
            ref_wav = refs[f"{lang}_{voice}"]
            
            synthesize_one(model, text, out_path, ref_wav, lang)

    print("ALL SPECIFIC FIXES COMPLETE.")

if __name__ == "__main__":
    main()
