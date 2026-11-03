import os
import io

try:
    from TTS.api import TTS
except ImportError:
    print("TTS module not found. Make sure you install it.")
    exit(1)

# Reference voice path based on docker volume mount
ref_voice_path = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/le petit nicola.mp3"
output_path = "/mnt/EDUAPP/test_output_nicola.wav"

if not os.path.exists(ref_voice_path):
    print(f"Error: Reference voice not found at {ref_voice_path}")
    exit(1)

print("Loading XTTS-v2 model (this may take a while and download the model if not cached)...")
try:
    # Use gpu=False since we are testing on cpu usually, or gpu=True if CUDA is configured
    import torch
    use_gpu = torch.cuda.is_available()
    print(f"Using GPU: {use_gpu}")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except Exception as e:
    print(f"Error initializing TTS: {e}")
    exit(1)

test_words = "Aujourd'hui, à l'école, on a bien rigolé ! La maîtresse nous a dit de dessiner ce qu'on voulait faire plus tard. Moi j'ai dessiné une grosse voiture rouge très rapide, et Alceste a dessiné un gros gâteau au chocolat, évidemment. Après, à la récré, Agnan a pleuré parce qu'il a cru perdre ses lunettes. C'était vraiment super chouette ! J'espère qu'on s'amusera autant demain avec tous les copains."

print(f"Synthesizing exactly 10 words: '{test_words}'")

try:
    model.tts_to_file(
        text=test_words,
        file_path=output_path,
        speaker_wav=ref_voice_path,
        language="fr"
    )
    print(f"Success! Audio saved to {output_path}")
except Exception as e:
    print(f"Error during synthesis: {e}")
