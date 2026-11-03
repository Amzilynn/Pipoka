const fs = require('fs');
const path = require('path');

// Paths below are project-root relative, so resolve them from this file's location.
const ROOT = path.resolve(__dirname, '../../..');

function getNormalizedName(text) {
  let t = text.toLowerCase();
  const normalized = t
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
  return normalized + '.wav';
}

const voices = ['girl', 'boy'];
const lang = 'ar';

voices.forEach(voice => {
  const dir = path.join(ROOT, 'public', 'recordings', lang, voice);
  console.log(`Checking directory: ${dir}`);
  if (!fs.existsSync(dir)) {
    console.log(`  Directory does not exist!`);
    return;
  }

  const files = fs.readdirSync(dir);
  console.log(`  Found ${files.length} files.`);
  
  files.forEach(file => {
    if (!file.endsWith('.wav')) return;
    
    const nameWithoutExt = file.replace('.wav', '');
    const normalizedName = getNormalizedName(nameWithoutExt);
    
    if (file !== normalizedName) {
      const oldPath = path.join(dir, file);
      const newPath = path.join(dir, normalizedName);
      
      console.log(`  Renaming: ${file} -> ${normalizedName}`);
      
      if (fs.existsSync(newPath)) {
        console.log(`    Target already exists, deleting old one.`);
        fs.unlinkSync(oldPath);
      } else {
        try {
          fs.renameSync(oldPath, newPath);
        } catch (e) {
          console.log(`    Error renaming: ${e.message}`);
        }
      }
    }
  });
});

console.log('Renaming complete.');
