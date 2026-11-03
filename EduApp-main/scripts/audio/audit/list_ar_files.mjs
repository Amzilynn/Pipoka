import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const dir = 'public/recordings/ar/girl';
const files = fs.readdirSync(dir);
files.forEach(f => {
    if (f.includes('.wav')) {
        console.log(f);
    }
});
