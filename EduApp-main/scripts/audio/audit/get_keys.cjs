const fs = require('fs');
const path = require('path');

// Paths below are project-root relative, so pin the working directory to the repo root.
process.chdir(path.resolve(__dirname, '../../..'));

const manifest = JSON.parse(fs.readFileSync('./public/recordings/manifest.json', 'utf-8'));
const boyFiles = manifest.recordings.fr.boy;

let mapping = {};
boyFiles.forEach(item => {
  mapping[item.file] = item.key;
});

console.log(JSON.stringify(mapping, null, 2));
