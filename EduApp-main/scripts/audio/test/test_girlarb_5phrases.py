import os
from pathlib import Path
import subprocess

print("Preparing reference voice from girlarb.mp4...")

# Source: girlarb.mp4 (video) — extract audio, normalize, convert to 22050Hz mono WAV
ref_source = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb.mp4"
ref_wav    = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"

# Extract audio: stereo AAC 48kHz → mono 22050Hz WAV, normalized to -3dB peak
result = subprocess.run(
    [
        "ffmpeg", "-y",
        "-i", ref_source,
        "-vn",                          # no video
        "-ac", "1",                     # mono
        "-ar", "22050",                 # sample rate XTTS expects
        "-af", "loudnorm=I=-16:TP=-3:LRA=11",  # normalize loudness (EBU R128)
        ref_wav
    ],
    capture_output=True, text=True
)
if result.returncode == 0:
    print(f"  -> Reference WAV prepared: {ref_wav}")
else:
    print(f"  -> FFmpeg error during extraction:\n{result.stderr}")
    exit(1)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False
    print(f"Loading XTTS-v2 model (use_gpu={use_gpu})...")
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError as e:
    print(f"TTS module not found: {e}")
    exit(1)

output_dir = Path("/mnt/EDUAPP/public/recordings/test_girlarb")
output_dir.mkdir(parents=True, exist_ok=True)

phrases = [
    "مرحبا",
    "ما اسمك",
    "كيف حالك",
    "انا بخير",
    "شكرا لك"
]

print(f"\nReference voice: {ref_wav}")
print(f"Output directory: {output_dir}")
print(f"Phrases to synthesize: {len(phrases)}\n")

generated = 0
for i, phrase in enumerate(phrases, 1):
    file_name = f"phrase_{i}.wav"
    mp3_name  = f"phrase_{i}.mp3"
    wav_path  = output_dir / file_name
    mp3_path  = output_dir / mp3_name

    print(f"[{i}/{len(phrases)}] Synthesizing: '{phrase}'")
    try:
        model.tts_to_file(
            text=phrase,
            file_path=str(wav_path),
            speaker_wav=ref_wav,
            language="ar"
        )
        print(f"  -> WAV saved: {wav_path}")

        result = subprocess.run(
            ["ffmpeg", "-y", "-i", str(wav_path),
             "-codec:a", "libmp3lame", "-qscale:a", "2",
             str(mp3_path)],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            print(f"  -> MP3 saved: {mp3_path}")
            os.remove(wav_path)
            print(f"  -> Removed WAV file")
        else:
            print(f"  -> FFmpeg error: {result.stderr}")

        generated += 1
    except Exception as e:
        print(f"  -> Error: {e}")

print(f"\nDone! Generated {generated}/{len(phrases)} MP3 files using girlarb reference.")
print(f"Files saved to: {output_dir}")
