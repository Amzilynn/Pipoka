import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const dirs = {
    'ar_girl': 'public/recordings/ar/girl',
    'ar_boy': 'public/recordings/ar/boy',
    'fr_girl': 'public/recordings/fr/girl',
    'fr_boy': 'public/recordings/fr/boy'
};

const audit = {};

for (const [id, dir] of Object.entries(dirs)) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    audit[id] = {};
    files.forEach(f => {
        if (!f.endsWith('.wav')) return;
        const base = f.replace('.wav', '');
        
        // Check for _vN suffix
        const m = base.match(/^(.+)_v(\d+)$/);
        if (m) {
            const k = m[1];
            const v = parseInt(m[2]);
            if (!audit[id][k]) audit[id][k] = [];
            if (!audit[id][k].includes(v)) audit[id][k].push(v);
        } else {
            // It's a base file
            if (!audit[id][base]) audit[id][base] = [];
        }
    });
    // Sort versions
    for (const k in audit[id]) {
        audit[id][k].sort((a,b) => a-b);
    }
}

// Generate the JS file that will be included in the testers
const content = `const AUDIT = ${JSON.stringify(audit, null, 2)};`;
fs.writeFileSync('public/audit_data.js', content);
console.log("Audit data written to public/audit_data.js");
