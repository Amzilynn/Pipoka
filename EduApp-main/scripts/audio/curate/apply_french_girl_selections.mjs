import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const selections = {
    "ami": "BASE",
    "la_grand_m_re": "V1",
    "le_p_re": "V1",
    "o_est_le_carr_bleu": "V2"
};

const baseDir = 'public/recordings/fr/girl/';

// 1. Process explicit selections
Object.entries(selections).forEach(([key, value]) => {
    let sourceFile = '';
    if (value === 'BASE') {
        sourceFile = `${key}.wav`;
    } else {
        sourceFile = `${key}_${value.toLowerCase()}.wav`;
    }

    const sourcePath = path.join(baseDir, sourceFile);
    const targetPath = path.join(baseDir, `${key}.wav`);

    if (fs.existsSync(sourcePath)) {
        if (sourcePath !== targetPath) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`[APPLIED] ${sourceFile} -> ${key}.wav`);
        } else {
            console.log(`[OK] ${key}.wav is already base.`);
        }
    } else {
        console.log(`[ERROR] File missing: ${sourcePath}`);
    }
});

// 2. Note: For all other files, they are already BASE, so no action needed.
console.log("All other French Girl items are set to BASE (No changes required).");
