
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const AR_MAPPINGS = {
  // Phrases & Instructions
  'ماذا نريد أن نتعلم اليوم؟': 'welcome_learn',
  'أي فئة تريد استكشافها؟': 'selection_cat',
  'اسحب الكلمة إلى الشخص الصحيح!': 'instr_person',
  'اسحب الكلمة إلى اللون الصحيح!': 'instr_color',
  'اسحب الكلمة إلى الشكل الصحيح!': 'instr_shape',
  'أجب على الأسئلة التالية': 'instr_questions',
  'رتّب الحروف لتكوين الكلمة!': 'instr_order',
  'امزج الألوان لتجد النتيجة!': 'instr_mix',
  'طابق الرقم مع الكمية الصحيحة!': 'instr_numbers',
  'أين المربع الأزرق؟': 'where_is_blue_square',
  'أين المستطيل الأخضر؟': 'where_is_green_rectangle',
  'أين الدائرة الحمراء؟': 'o_est_le_cercle_rouge',
  'أين المثلث الأصفر؟': 'o_est_le_triangle_jaune',
  'اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ': 'mix_colors',
  'حاول مرة أخرى!': 'essaie_encore',
  'ليس صحيحا...': 'pas_tout_a_fait',
  'أعد المحاولة!': 'reessaie',
  'أعد مرة أخرى!': 'repeat_again',

  // Family
  'الأم': 'mother', 'الأب': 'father', 'الأخ': 'brother', 'الأخت': 'sister', 'الجدة': 'grandmother', 'الجد': 'grandfather',

  // Colors
  'أحمر': 'rouge', 'أزرق': 'bleu', 'أصفر': 'jaune', 'أسود': 'noir', 'أبيض': 'blanc', 'أخضر': 'green', 'برتقالي': 'orange', 'وردي': 'pink', 'بنفسجي': 'purple', 'رمادي': 'gris',

  // Shapes
  'دائرة': 'cercle', 'مربع': 'carre', 'مثلث': 'triangle', 'مستطيل': 'rectangle',

  // Success
  'أحسنت!': 'bravo', 'ممتاز!': 'mumtaz', 'رائع!': 'rae', 'جيد جدا!': 'jayid_jiddan', 'أنت ممتاز!': 'anta_mumtaz',

  // Words
  'بقرة': 'ba9ara', 'سمكة': 'samaka', 'أسد': 'asad', 'قمر': 'qamar', 'شمس': 'shams', 'كتاب': 'kitab', 'قلم': 'qalam', 'بحر': 'bahr', 'وردة': 'warda', 'تفاحة': 'tuffaha', 'جمل': 'jamal', 'بيت': 'bayt',
  'محفظة': 'bag', 'معلمة': 'teacher', 'مدرسة': 'school', 'صديقي': 'friend', 'قطة': 'cat', 'كلب': 'dog', 'خروف': 'sheep', 'بني': 'brown',

  // Alphabet
  'أ': 'alif', 'ب': 'baa', 'ت': 'taa', 'ث': 'thaa', 'ج': 'jeem', 'ح': 'haa_soft', 'خ': 'khaa', 'د': 'daal', 'ذ': 'thaal', 'ر': 'raa', 'ز': 'zay', 'س': 'seen', 'ش': 'sheen', 'ص': 'saad', 'ض': 'daad', 'ط': 'taa_hard', 'ظ': 'zaa', 'ع': 'ayn', 'غ': 'ghayn', 'ف': 'faa', 'ق': 'qaaf', 'ك': 'kaaf', 'ل': 'laam', 'م': 'meem', 'ن': 'noon', 'هـ': 'haa', 'و': 'waw', 'ي': 'yaa'
};

function getRecordingPath(text, lang, voice) {
  let t = text.toLowerCase().trim();

  if (lang === 'ar') {
    const cleanText = text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
    if (AR_MAPPINGS[cleanText]) {
      return `/recordings/ar/${voice}/${AR_MAPPINGS[cleanText]}.wav`;
    }

    if (t === 'أمي') t = 'الأم';
    if (t === 'أبي') t = 'الأب';
    if (t === 'أخي') t = 'الأخ';
    if (t === 'أختي') t = 'الأخت';
  }

  const normalized = t
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);

  return `/recordings/${lang}/${voice}/${normalized}.wav`;
}

const alphabet_ar_words = [
  'قلم', 'كتاب', 'محفظة', 'معلمة', 'مدرسة',
  'أمي', 'أبي', 'أختي', 'أخي', 'صديقي',
  'قطة', 'كلب', 'خروف', 'سمكة', 'بقرة'
];

const results = [];
const voice = 'girl';
const baseDir = 'public';

alphabet_ar_words.forEach(word => {
  const relPath = getRecordingPath(word, 'ar', voice);
  const fullPath = path.join(process.cwd(), baseDir, relPath);
  const exists = fs.existsSync(fullPath);
  results.push({ word, relPath, exists });
});

console.log(JSON.stringify(results, null, 2));
