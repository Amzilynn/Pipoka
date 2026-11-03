const fs = require('fs');
const path = require('path');

// Paths below are project-root relative, so resolve them from this file's location.
const ROOT = path.resolve(__dirname, '../../..');

// Mocking the recordingsManifest since I can't import it easily
// I'll extract it from the file content or just look at the categories
const manifest = {
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
    { text: 'Réresponds aux questions suivantes', lang: 'fr' }, // Note: typo in manifest? 'Réponds' vs 'Réresponds'
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
  ]
};

function getRecordingPath(text, lang, voice) {
  let t = text.toLowerCase();
  
  if (lang === 'fr') {
    if (t === 'î') return `/recordings/fr/${voice}/i_chapeau.wav`;
    if (t === 'é') return `/recordings/fr/${voice}/e_accent.wav`;
    if (t === 'ç') return `/recordings/fr/${voice}/c_cedille.wav`;
  }

  const normalized = t
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
  
  return `/recordings/${lang}/${voice}/${normalized}.wav`;
}

const voices = ['girl', 'boy'];
const languages = ['fr', 'ar'];

languages.forEach(lang => {
  voices.forEach(voice => {
    console.log(`\nChecking ${lang} ${voice}:`);
    let missingCount = 0;
    
    Object.values(manifest).forEach(items => {
      items.forEach(item => {
        if (item.lang !== lang) return;
        
        const relPath = getRecordingPath(item.text, lang, voice);
        const absPath = path.join(ROOT, 'public', relPath);
        
        if (!fs.existsSync(absPath)) {
          console.log(`  MISSING: "${item.text}" -> ${relPath}`);
          missingCount++;
        }
      });
    });
    
    console.log(`  Total missing: ${missingCount}`);
  });
});
