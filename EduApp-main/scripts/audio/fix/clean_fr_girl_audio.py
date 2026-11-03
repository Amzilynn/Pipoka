import os
import subprocess
from pathlib import Path

# Paths inside Docker
audio_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")

def clean_file(filename, start_trim=None, end_trim=None):
    """
    Uses ffmpeg to trim specific parts of a wav file.
    start_trim: timestamp to start at (e.g. '00:00:00.500')
    end_trim: timestamp to end at (e.g. '00:00:01.200')
    """
    file_path = audio_dir / filename
    temp_path = audio_dir / f"temp_{filename}"
    
    if not file_path.exists():
        return

    # Build the ffmpeg command
    # -y: overwrite
    # -i: input
    # -ss: start position
    # -to: end position
    cmd = ["ffmpeg", "-y", "-i", str(file_path)]
    
    if start_trim:
        cmd.extend(["-ss", start_trim])
    if end_trim:
        cmd.extend(["-to", end_trim])
        
    # -acodec copy: fast trim without re-encoding
    cmd.extend(["-acodec", "pcm_s16le", str(temp_path)])
    
    print(f"Processing {filename}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0 and temp_path.exists():
        os.replace(temp_path, file_path)
        print(f"Successfully cleaned {filename}")
    else:
        print(f"Failed to clean {filename}: {result.stderr}")

# --- SPECIFIC FIXES ---

# 1. Clean 'i.wav': The user reports an 'ouh' at the end.
# We trim it to keep only the first 1.1 seconds.
clean_file("i.wav", end_trim="00:00:01.100")

# 2. Clean 'm.wav': The user reports a random voice at the start.
# We skip the first 0.7 seconds where the artifact usually lives.
clean_file("m.wav", start_trim="00:00:00.700")

print("\nPost-processing cleanup finished.")
