const fs = require('fs');
const path = require('path');

// Paths below are project-root relative, so pin the working directory to the repo root.
process.chdir(path.resolve(__dirname, '../../..'));

const files = fs.readdirSync('public/recordings/ar/girl');
const match = files.find(f => f.includes('طابق'));
console.log(match);
