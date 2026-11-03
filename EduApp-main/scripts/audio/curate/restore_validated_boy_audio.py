import os
import shutil
from pathlib import Path

# Paths below are project-root relative, so resolve them from this file's location.
ROOT = Path(__file__).resolve().parents[3]

missing_keys = [
    "carr_vert", "carr_violet", "cercle_vert", "cercle_violet",
    "glisse_le_mot_vers_la_bonne_couleur", "glisse_le_mot_vers_la_bonne_forme",
    "glisse_le_mot_vers_le_bon_personnage", "o_est_le_rectangle_vert",
    "qu_est_ce_qu_on_veut_apprendre_aujourd_hui", "rectangle_vert",
    "rectangle_violet", "triangle_vert", "triangle_violet"
]

target_dir = ROOT / "public/recordings/fr/boy"
search_dirs = [d for d in Path(".").iterdir() if d.is_dir() and d.name.startswith("recordings_") and d.name != "recordings_fixed"]
# Also include recordings_fixed/fr/boy
search_dirs.append(Path("recordings_fixed/fr/boy"))

restored = 0
for key in missing_keys:
    filename = f"{key}.wav"
    best_file = None
    best_mtime = 0
    
    # Search in all recordings directories
    for sdir in search_dirs:
        # Check recursively if it's a top level recordings_ folder
        for p in sdir.rglob(filename):
            mtime = p.stat().st_mtime
            if mtime > best_mtime:
                best_mtime = mtime
                best_file = p
                
    if best_file:
        print(f"Restoring {filename} from {best_file} (Modified: {best_mtime})")
        shutil.copy2(best_file, target_dir / filename)
        restored += 1
    else:
        print(f"No previous version found for {filename}, keeping newly generated one.")

print(f"Restored {restored} files from previous recordings.")
