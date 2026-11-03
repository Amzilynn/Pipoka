import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const recordingsManifest = {
  welcome: [
    { text: "Qu'est-ce qu'on veut apprendre aujourd'hui ?", lang: 'fr', category: 'welcome' },
    { text: 'ماذا نريد أن نتعلم اليوم؟', lang: 'ar', category: 'welcome' },
  ],
  instructions: [
    { text: 'Glisse le mot vers le bon personnage !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى الشخص الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Glisse le mot vers la bonne couleur !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى اللون الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Glisse le mot vers la bonne forme !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى الشكل الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Réponds aux questions suivantes', lang: 'fr', category: 'instruction' },
    { text: 'أجب على الأسئلة التالية', lang: 'ar', category: 'instruction' },
    { text: 'Mets les lettres dans le bon ordre pour former le mot !', lang: 'fr', category: 'instruction' },
    { text: 'رتّب الحروف لتكوين الكلمة!', lang: 'ar', category: 'instruction' },
    { text: 'Mélange les couleurs pour trouver le résultat !', lang: 'fr', category: 'instruction' },
    { text: 'امزج الألوان لتجد النتيجة!', lang: 'ar', category: 'instruction' },
  ],
  combinations: [
    { text: 'Où est le cercle rouge ?', lang: 'fr', category: 'combination' },
    { text: 'أين الدائرة الحمراء؟', lang: 'ar', category: 'combination' },
    { text: 'أين المثلث الأصفر؟', lang: 'ar', category: 'combination' },
  ],
  alphabetHints: [
    { text: 'Stylo', lang: 'fr', category: 'alphabet' },
    { text: 'Livre', lang: 'fr', category: 'alphabet' },
    { text: 'Cartable', lang: 'fr', category: 'alphabet' },
    { text: 'Maîtresse', lang: 'fr', category: 'alphabet' },
    { text: 'École', lang: 'fr', category: 'alphabet' },
    { text: 'Maman', lang: 'fr', category: 'alphabet' },
    { text: 'Papa', lang: 'fr', category: 'alphabet' },
    { text: 'Fille', lang: 'fr', category: 'alphabet' },
    { text: 'Garçon', lang: 'fr', category: 'alphabet' },
    { text: 'Ami', lang: 'fr', category: 'alphabet' },
    { text: 'Mouton', lang: 'fr', category: 'alphabet' },
    { text: 'Vache', lang: 'fr', category: 'alphabet' },
    { text: 'Poule', lang: 'fr', category: 'alphabet' },
    { text: 'Chat', lang: 'fr', category: 'alphabet' },
    { text: 'Chien', lang: 'fr', category: 'alphabet' },
    { text: 'Poisson', lang: 'fr', category: 'alphabet' },
    { text: 'بيت', lang: 'ar', category: 'alphabet' },
    { text: 'قمر', lang: 'ar', category: 'alphabet' },
    { text: 'شمس', lang: 'ar', category: 'alphabet' },
    { text: 'كتاب', lang: 'ar', category: 'alphabet' },
    { text: 'قلم', lang: 'ar', category: 'alphabet' },
    { text: 'أسد', lang: 'ar', category: 'alphabet' },
    { text: 'بحر', lang: 'ar', category: 'alphabet' },
    { text: 'وردة', lang: 'ar', category: 'alphabet' },
    { text: 'تفاحة', lang: 'ar', category: 'alphabet' },
    { text: 'جمل', lang: 'ar', category: 'alphabet' },
  ],
  selection: [
    { text: "Quelle catégorie veux-tu explorer ?", lang: 'fr', category: 'selection' },
    { text: "أي فئة تريد استكشافها؟", lang: 'ar', category: 'selection' },
  ],
};

function getNormalizedFilename(text, lang) {
  let t = text.toLowerCase();
  
  if (lang === 'fr') {
    if (t === 'î') return 'i_chapeau';
    if (t === 'é') return 'e_accent';
    if (t === 'ç') return 'c_cedille';
    
    // Some manual overrides for words that start with accented letters or contain them
    if (t === 'école') return '_cole'; 
    if (t === 'maîtresse') return 'ma_tresse';
    if (t === 'garçon') return 'gar_on';
  }

  return t
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove Arabic diacritics
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
}

const missing = [];

const voices = ['girl', 'boy'];
const baseDir = 'public/recordings';

Object.values(recordingsManifest).forEach(category => {
  category.forEach(item => {
    voices.forEach(voice => {
      const filename = getNormalizedFilename(item.text, item.lang) + '.wav';
      const fullPath = path.join(baseDir, item.lang, voice, filename);
      
      if (!fs.existsSync(fullPath)) {
        missing.push({ ...item, voice, filename });
      }
    });
  });
});

console.log(JSON.stringify(missing, null, 2));
