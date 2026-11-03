import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const items = [
  'ماذا_نريد_أن_نتعلم_اليوم.wav',
  'اسحب_الكلمة_إلى_الشخص_الصحيح.wav',
  'بيت.wav'
];

const dir = 'public/recordings/ar/girl/';

items.forEach(file => {
  const fullPath = path.join(dir, file);
  console.log(`${file}: ${fs.existsSync(fullPath) ? 'EXISTS' : 'NOT FOUND'}`);
});
