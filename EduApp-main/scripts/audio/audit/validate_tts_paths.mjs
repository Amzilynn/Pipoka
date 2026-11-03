import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

// Replicate the exact logic from getRecordingPath
function getRecordingPath(text, lang, voice) {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
  return `public/recordings/${lang}/${voice}/${normalized}.wav`;
}

// Replicate categories from recordingsManifest
const recordingsManifest = {
  welcome: [
    { text: "Qu'est-ce qu'on veut apprendre aujourd'hui ?", lang: 'fr' },
    { text: 'ماذا نريد أن نتعلم اليوم؟', lang: 'ar' },
  ],
  instructions: [
    { text: 'Glisse le mot vers le bon personnage !', lang: 'fr' },
    { text: 'اسحب الكلمة إلى الشخص الصحيح!', lang: 'ar' },
    { text: 'Glisse le mot vers la bonne couleur !', lang: 'fr' },
    { text: 'اسحب الكلمة إلى اللون الصحيح!', lang: 'ar' },
    { text: 'Glisse le mot vers la bonne forme !', lang: 'fr' },
    { text: 'اسحب الكلمة إلى الشكل الصحيح!', lang: 'ar' },
    { text: 'Réponds aux questions suivantes', lang: 'fr' },
    { text: 'أجب على الأسئلة التالية', lang: 'ar' },
    { text: 'Mets les lettres dans le bon ordre pour former le mot !', lang: 'fr' },
    { text: 'رتّب الحروف لتكوين الكلمة!', lang: 'ar' },
    { text: 'Mélange les couleurs pour trouver le résultat !', lang: 'fr' },
    { text: 'امزج الألوان لتجد النتيجة!', lang: 'ar' },
  ],
  family: [
    { text: 'La mère', lang: 'fr' },
    { text: 'Le père', lang: 'fr' },
    { text: 'Le frère', lang: 'fr' },
    { text: 'La sœur', lang: 'fr' },
    { text: 'La grand-mère', lang: 'fr' },
    { text: 'Le grand-père', lang: 'fr' },
    { text: 'الأم', lang: 'ar' },
    { text: 'الأب', lang: 'ar' },
    { text: 'الأخ', lang: 'ar' },
    { text: 'الأخت', lang: 'ar' },
    { text: 'الجدة', lang: 'ar' },
    { text: 'الجد', lang: 'ar' },
  ],
  colors: [
    { text: 'Rouge', lang: 'fr' },
    { text: 'Bleu', lang: 'fr' },
    { text: 'Jaune', lang: 'fr' },
    { text: 'Noir', lang: 'fr' },
    { text: 'Blanc', lang: 'fr' },
    { text: 'Vert', lang: 'fr' },
    { text: 'Orange', lang: 'fr' },
    { text: 'Rose', lang: 'fr' },
    { text: 'Violet', lang: 'fr' },
    { text: 'Gris', lang: 'fr' },
    { text: 'أحمر', lang: 'ar' },
    { text: 'أزرق', lang: 'ar' },
    { text: 'أصفر', lang: 'ar' },
    { text: 'أسود', lang: 'ar' },
    { text: 'أبيض', lang: 'ar' },
    { text: 'أخضر', lang: 'ar' },
    { text: 'برتقالي', lang: 'ar' },
    { text: 'وردي', lang: 'ar' },
    { text: 'بنفسجي', lang: 'ar' },
    { text: 'رمادي', lang: 'ar' },
  ],
  shapes: [
    { text: 'Cercle', lang: 'fr' },
    { text: 'Carré', lang: 'fr' },
    { text: 'Triangle', lang: 'fr' },
    { text: 'Rectangle', lang: 'fr' },
    { text: 'دائرة', lang: 'ar' },
    { text: 'مربع', lang: 'ar' },
    { text: 'مثلث', lang: 'ar' },
    { text: 'مستطيل', lang: 'ar' },
  ],
  combinations: [
    { text: 'Où est le cercle rouge ?', lang: 'fr' },
    { text: 'Où est le carré bleu ?', lang: 'fr' },
    { text: 'Où est le triangle jaune ?', lang: 'fr' },
    { text: 'Où est le rectangle vert ?', lang: 'fr' },
    { text: 'أين الدائرة الحمراء؟', lang: 'ar' },
    { text: 'أين المربع الأزرق؟', lang: 'ar' },
    { text: 'أين المثلث الأصفر؟', lang: 'ar' },
    { text: 'أين المستطيل الأخضر؟', lang: 'ar' },
  ],
  alphabetHints: [
    { text: 'Stylo', lang: 'fr' },
    { text: 'Livre', lang: 'fr' },
    { text: 'Cartable', lang: 'fr' },
    { text: 'Maîtresse', lang: 'fr' },
    { text: 'École', lang: 'fr' },
    { text: 'Maman', lang: 'fr' },
    { text: 'Papa', lang: 'fr' },
    { text: 'Fille', lang: 'fr' },
    { text: 'Garçon', lang: 'fr' },
    { text: 'Ami', lang: 'fr' },
    { text: 'Mouton', lang: 'fr' },
    { text: 'Vache', lang: 'fr' },
    { text: 'Poule', lang: 'fr' },
    { text: 'Chat', lang: 'fr' },
    { text: 'Chien', lang: 'fr' },
    { text: 'Poisson', lang: 'fr' },
    { text: 'بيت', lang: 'ar' },
    { text: 'قمر', lang: 'ar' },
    { text: 'شمس', lang: 'ar' },
    { text: 'كتاب', lang: 'ar' },
    { text: 'قلم', lang: 'ar' },
    { text: 'أسد', lang: 'ar' },
    { text: 'بحر', lang: 'ar' },
    { text: 'وردة', lang: 'ar' },
    { text: 'تفاحة', lang: 'ar' },
    { text: 'جمل', lang: 'ar' },
  ],
  feedback: [
    { text: 'Très bien !', lang: 'fr' },
    { text: 'Bravo !', lang: 'fr' },
    { text: 'Excellent !', lang: 'fr' },
    { text: 'Super !', lang: 'fr' },
    { text: 'Tu es formidable !', lang: 'fr' },
    { text: 'أحسنت!', lang: 'ar' },
    { text: 'ممتاز!', lang: 'ar' },
    { text: ' رائع!', lang: 'ar' },
    { text: 'جيد جدا!', lang: 'ar' },
    { text: ' أنت ممتاز!', lang: 'ar' },
  ],
  errors: [
    { text: 'Essaie encore !', lang: 'fr' },
    { text: 'Pas tout à fait...', lang: 'fr' },
    { text: 'Réessaie !', lang: 'fr' },
    { text: 'حاول مرة أخرى!', lang: 'ar' },
    { text: 'ليس صحيحا...', lang: 'ar' },
    { text: 'أعد المحاولة!', lang: 'ar' },
  ],
};

let missing = 0;
let checked = 0;

['girl', 'boy'].forEach(voice => {
  Object.values(recordingsManifest).forEach(category => {
    category.forEach(item => {
      checked++;
      const filepath = getRecordingPath(item.text, item.lang, voice);
      const fullPath = path.join(process.cwd(), filepath);
      if (!fs.existsSync(fullPath)) {
        console.error(`MISSING: ${filepath} (for text: "${item.text}")`);
        missing++;
      }
    });
  });
});

console.log(`\nValidation complete. Checked ${checked} runtime mappings.`);
console.log(`Missing files: ${missing}`);
