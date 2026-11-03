import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const dirs = [
    'public/recordings/ar/girl',
    'public/recordings/ar/boy',
    'public/recordings/fr/girl',
    'public/recordings/fr/boy'
];

const results = {};

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    results[dir] = {};
    
    files.forEach(file => {
        if (!file.endsWith('.wav')) return;
        const base = file.replace('.wav', '');
        
        // Match name_vN
        const match = base.match(/^(.+)_v(\d+)$/);
        if (match) {
            const key = match[1];
            const version = parseInt(match[2]);
            if (!results[dir][key]) results[dir][key] = [];
            results[dir][key].push(version);
        } else {
            // Base file
            if (!results[dir][base]) results[dir][base] = [];
        }
    });
});

console.log(JSON.stringify(results, null, 2));
