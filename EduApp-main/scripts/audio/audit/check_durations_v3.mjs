
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

function getWavDuration(filePath) {
    const buffer = fs.readFileSync(filePath);
    const byteRate = buffer.readUInt32LE(28);
    const dataSize = buffer.readUInt32LE(40);
    return dataSize / byteRate;
}

const files = [
    'public/recordings/ar/girl/instr_color.wav',
    'public/recordings/ar/girl/instr_color_v1.wav',
    'public/recordings/ar/girl/instr_color_v2.wav',
    'public/recordings/ar/girl/instr_color_v3.wav'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            const duration = getWavDuration(file);
            const size = fs.statSync(file).size;
            console.log(`${file}: ${duration.toFixed(2)}s (${size} bytes)`);
        } catch (e) {
            console.log(`${file}: Error reading - ${e.message}`);
        }
    } else {
        console.log(`${file}: Not found`);
    }
});
