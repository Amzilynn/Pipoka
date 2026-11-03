import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { recordingsManifest } from '../src/data/recordingsManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'recordings');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

const BACKEND_URL = process.env.TTS_BACKEND_URL || 'http://localhost:7860';
const PARALLEL_REQUESTS = 1;
const RETRY_ATTEMPTS = 3;
const TIMEOUT_MS = 600000; // 10 minutes
const DELAY_BETWEEN_MS = 1000; // 1 second delay to let backend breathe

const SHAPES = {
  fr: ['Cercle', 'Carré', 'Triangle', 'Rectangle'],
  ar: ['دائرة', 'مربع', 'مثلث', 'مستطيل']
};

const COLORS = {
  fr: ['Rouge', 'Bleu', 'Jaune', 'Noir', 'Blanc', 'Vert', 'Orange', 'Rose', 'Violet', 'Gris'],
  ar: ['أحمر', 'أزرق', 'أصفر', 'أسود', 'أبيض', 'أخضر', 'برتقالي', 'وردي', 'بنفسجي', 'رمادي']
};

const ARABIC_LETTERS = ['ب', 'ي', 'ت', 'ق', 'م', 'ر', 'ش', 'س', 'ك', 'ا', 'ل', 'أ', 'د', 'ح', 'و', 'ف', 'ج', 'ن', 'ع', 'ة'];
const FRENCH_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getAllPhrases() {
  const phrases = [];
  const seen = new Set();

  for (const items of Object.values(recordingsManifest)) {
    for (const item of items) {
      const key = `${item.lang}:${item.text}`;
      if (!seen.has(key)) {
        seen.add(key);
        phrases.push(item);
      }
    }
  }

  for (const lang of ['fr', 'ar']) {
    for (const shape of SHAPES[lang]) {
      for (const color of COLORS[lang]) {
        const combined = `${shape} ${color}`;
        const key = `${lang}:${combined}`;
        if (!seen.has(key)) {
          seen.add(key);
          phrases.push({ text: combined, lang, category: 'shape_color' });
        }
      }
    }
  }

  for (const letter of FRENCH_LETTERS) {
    const key = `fr:${letter}`;
    if (!seen.has(key)) {
      seen.add(key);
      phrases.push({ text: letter, lang: 'fr', category: 'letter' });
    }
  }

  for (const letter of ARABIC_LETTERS) {
    const key = `ar:${letter}`;
    if (!seen.has(key)) {
      seen.add(key);
      phrases.push({ text: letter, lang: 'ar', category: 'letter' });
    }
  }

  return phrases;
}

function normalizeKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function synthesize(text, lang, voice) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: lang, voice }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function synthesizeWithRetry(text, lang, voice, attempt = 1) {
  try {
    return await synthesize(text, lang, voice);
  } catch (error) {
    if (attempt < RETRY_ATTEMPTS) {
      console.log(`\n    Retry ${attempt + 1}/${RETRY_ATTEMPTS} for "${text.substring(0, 25)}..."`);
      await new Promise(r => setTimeout(r, 15000));
      return synthesizeWithRetry(text, lang, voice, attempt + 1);
    }
    throw error;
  }
}

async function warmup() {
  console.log('  Warming up backend (this may take 30-60 seconds)...');
  try {
    await synthesize('Bonjour', 'fr', 'girl');
    console.log('  Backend ready!');
  } catch (e) {
    console.log(`  Warmup note: ${e.message}`);
    console.log('  Continuing anyway...');
  }
}

async function main() {
  console.log('\n🎙️  TTS Recording Generator\n');
  console.log(`  Backend: ${BACKEND_URL}`);
  console.log(`  Output:  ${OUTPUT_DIR}`);
  console.log('');

  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, 'fr', 'girl'));
  ensureDir(path.join(OUTPUT_DIR, 'fr', 'boy'));
  ensureDir(path.join(OUTPUT_DIR, 'ar', 'girl'));
  ensureDir(path.join(OUTPUT_DIR, 'ar', 'boy'));

  const phrases = getAllPhrases();
  const total = phrases.length * 2;

  console.log(`  Found ${phrases.length} unique phrases × 2 voices = ${total} files to generate`);
  console.log('');

  await warmup();

  const startTime = Date.now();
  let completed = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < phrases.length; i += PARALLEL_REQUESTS) {
    const batch = phrases.slice(i, i + PARALLEL_REQUESTS);

    const batchPromises = batch.map(async (item) => {
      const key = normalizeKey(item.text);

      for (const voice of ['girl', 'boy']) {
        const filePath = path.join(OUTPUT_DIR, item.lang, voice, `${key}.wav`);

        if (fs.existsSync(filePath)) {
          return;
        }

        try {
          const audioBuffer = await synthesizeWithRetry(item.text, item.lang, voice);
          fs.writeFileSync(filePath, Buffer.from(audioBuffer));
        } catch (error) {
          errors.push({ text: item.text, lang: item.lang, voice, error: error.message });
        }
      }
    });

    await Promise.all(batchPromises);
    completed += batch.length;

    // Small delay to prevent overwhelming the single-threaded backend
    await new Promise(r => setTimeout(r, DELAY_BETWEEN_MS));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = (completed / elapsed).toFixed(1);
    const pct = Math.round((completed / phrases.length) * 100);

    process.stdout.write(`\r  [${elapsed}s] ${completed}/${phrases.length} phrases (${pct}%) | ~${rate}/s | Errors: ${errors.length}    `);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n\n');
  console.log('═══════════════════════════════════════');
  console.log('  GENERATION COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`  Time: ${elapsed}s`);
  console.log(`  Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n  Failed items:');
    for (const err of errors.slice(0, 10)) {
      console.log(`    - [${err.lang}/${err.voice}] "${err.text}" — ${err.error}`);
    }
    if (errors.length > 10) {
      console.log(`    ... and ${errors.length - 10} more`);
    }
  }

  const manifest = { recordings: { fr: { girl: [], boy: [] }, ar: { girl: [], boy: [] } } };

  for (const lang of ['fr', 'ar']) {
    for (const voice of ['girl', 'boy']) {
      const dir = path.join(OUTPUT_DIR, lang, voice);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.wav'));
        manifest.recordings[lang][voice] = files.map(f => ({
          file: f,
          key: f.replace('.wav', '')
        }));
      }
    }
  }

  const totalFiles = Object.values(manifest.recordings).reduce((sum, lang) => {
    return sum + lang.girl.length + lang.boy.length;
  }, 0);

  console.log(`  Total files generated: ${totalFiles}`);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`  Manifest updated: ${MANIFEST_PATH}`);
  console.log('═══════════════════════════════════════\n');
}

main().catch(console.error);
