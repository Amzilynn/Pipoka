const fs = require('fs');
const path = require('path');

// Paths below are project-root relative, so resolve them from this file's location.
const ROOT = path.resolve(__dirname, '../../..');

const srcDir = path.join(ROOT, 'public/recordings/ar/girl');
const finalDir = path.join(ROOT, 'final girl arabic');
const backupDir = path.join(ROOT, 'final girl backup');

const fileMap = {
  "Age 3": {
    "Family": ["mother", "father", "brother", "sister", "grandmother", "grandfather", "instr_person", "الأم", "الأب", "الأخ", "الأخت", "الجد", "الجدة"],
    "Colors": ["rouge", "bleu", "jaune", "noir", "blanc", "instr_color", "أحمر", "أزرق", "أصفر", "أسود", "أبيض"]
  },
  "Age 4": {
    "Shapes": ["cercle", "carre", "triangle", "rectangle", "instr_shape", "دائرة", "مربع", "مثلث", "مستطيل"],
    "Colors Mixing": ["green", "orange", "pink", "purple", "gris", "marron", "mix_colors", "اِخْلِطِ_الْأَلْوَانَ_لِتَجِدَ_النَّتِيجَةَ_الصَّح", "instr_mix", "أخضر", "برتقالي", "وردي", "بنفسجي", "رمادي", "بني"],
    "Combinations": ["instr_questions", "o_est_le_cercle_rouge", "where_is_blue_square", "o_est_le_triangle_jaune", "where_is_green_rectangle"]
  },
  "Age 5": {
    "Alphabet": [
      "alif", "baa", "taa", "thaa", "jeem", "haa_soft", "khaa", "daal", "thaal", "raa", "zay", "seen", "sheen", "saad", "daad", "taa_hard", "zaa", "ayn", "ghayn", "faa", "qaaf", "kaaf", "laam", "meem", "noon", "haa", "waw", "yaa", "taa_marbuta",
      "qalam", "kitab", "bayt", "qamar", "shams", "asad", "jamal", "bahr", "warda", "samaka", "ba9ara", "bag", "teacher", "school", "friend", "cat", "dog", "sheep",
      "mother", "father", "brother", "sister", 
      "الأم", "الأب", "الأخ", "الأخت", "بقرة", "سمكة", "أسد", "قمر", "شمس", "كتاب", "قلم", "بحر", "وردة", "تفاحة", "جمل", "بيت",
      "instr_order"
    ],
    "Numbers": ["instr_numbers", "طابق_الرقم_مع_الكمية_الصحيحة"]
  },
  "General": {
    "Feedback": ["bravo", "mumtaz", "rae", "jayid_jiddan", "anta_mumtaz"],
    "Errors": ["essaie_encore", "pas_tout_a_fait", "reessaie", "repeat_again", "حاول_مرة_أخرى", "أعد_المحاولة", "أعد_مرة_أخرى"],
    "UI": ["welcome_learn", "selection_cat", "ماذا_نريد_أن_نتعلم_اليوم", "أي_فئة_تريد_استكشافها"]
  }
};

function findCategories(baseName) {
  let cats = [];
  for (const age in fileMap) {
    for (const activity in fileMap[age]) {
      if (fileMap[age][activity].includes(baseName)) {
        cats.push({ age, activity });
      }
    }
  }
  if (cats.length === 0) cats.push({ age: 'Uncategorized', activity: 'Misc' });
  return cats;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

if (!fs.existsSync(srcDir)) {
  console.log('Source directory does not exist:', srcDir);
  process.exit(1);
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (!file.endsWith('.wav')) return;

  const matchBackup = file.match(/^(.*)_v\d+\.wav$/);
  const isBackup = !!matchBackup;
  const baseName = isBackup ? matchBackup[1] : file.replace('.wav', '');

  const categories = findCategories(baseName);

  categories.forEach(({ age, activity }) => {
    const targetBaseDir = isBackup ? backupDir : finalDir;
    const destDir = path.join(targetBaseDir, age, activity);
    ensureDir(destDir);

    const destFile = path.join(destDir, file);
    fs.copyFileSync(path.join(srcDir, file), destFile);
  });
});

console.log('Files copied successfully!');
