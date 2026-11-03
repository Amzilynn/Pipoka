import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths below are project-root relative, so pin the working directory to the repo root.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
process.chdir(ROOT);

const selections = {
    "alif": "V1", "anta_mumtaz": "V3", "asad": "V3", "ayn": "V2", "baa": "V4", "bahr": "V2", "bayt": "V2", "blanc": "V1", "bleu": "V6", "blue": "V2", "bravo": "V2", "brother": "V2", "carre": "V2", "cercle": "V2", "daad": "V2", "daal": "V1", "essaie_encore": "V3", "faa": "V4", "father": "V3", "ghayn": "V1", "grandfather": "V1", "grandmother": "V2", "green": "V3", "gris": "V2", "haa": "V6", "haa_soft": "V3", "instr_color": "V3", "instr_mix": "V3", "instr_order": "V2", "instr_person": "V2", "instr_questions": "REGENERATE", "instr_shape": "V3", "jaune": "V2", "jayid_jiddan": "V3", "jeem": "V2", "kaaf": "V2", "khaa": "V2", "kitab": "V3", "laam": "V2", "marron": "V1", "meem": "V1", "mix_colors": "V3", "mother": "V3", "mumtaz": "V2", "noir": "V2", "noon": "V1", "o_est_le_cercle_rouge": "V2", "o_est_le_triangle_jaune": "V2", "orange": "V2", "pas_tout_a_fait": "V2", "pink": "V1", "purple": "V1", "qaaf": "V3", "qalam": "V2", "qamar": "V2", "raa": "V3", "rae": "V2", "rectangle": "V2", "reessaie": "V1", "rouge": "V2", "saad": "V2", "seen": "V2", "selection_cat": "V1", "shams": "V2", "sheen": "V1", "sister": "V5", "taa": "V1", "taa_hard": "V1", "thaa": "V2", "thaal": "V5", "triangle": "V1", "tuffaha": "V3", "violet": "V3", "warda": "V2", "waw": "V5", "welcome_learn": "V3", "where_is_blue_square": "V3", "where_is_green_rectangle": "V3", "yaa": "V5", "zaa": "V1", "zay": "V5", "أ": "BASE", "أبيض": "BASE", "أجب_على_الأسئلة_التالية": "REGENERATE", "أحسنت": "BASE", "أحمر": "BASE", "أخضر": "BASE", "أزرق": "BASE", "أسد": "BASE", "أسود": "BASE", "أصفر": "BASE", "أعد_المحاولة": "BASE", "أنت_ممتاز": "BASE", "أين_الدائرة_الحمراء؟": "BASE", "أين_المثلث_الأصفر؟": "BASE", "أين_المربع_الأزرق؟": "BASE", "أين_المستطيل_الأخضر؟": "BASE", "اسحب_الكلمة_إلى_الشخص_الصحيح": "BASE", "الأب": "BASE", "الأخ": "BASE", "الأخت": "REGENERATE", "الأم": "BASE", "الجدة": "BASE", "امزج_الألوان_لتجد_النتيجة": "BASE", "امزج_الألوان_لتجد_النتيجة_الصحيحة": "BASE", "ب": "BASE", "برتقالي": "BASE", "بنفسجي": "BASE", "بني": "BASE", "بيت": "BASE", "ت": "BASE", "ث": "BASE", "ج": "BASE", "جيد_جدا": "BASE", "ح": "BASE", "حاول_مرة_أخرى": "BASE", "خ": "BASE", "د": "BASE", "دائرة": "BASE", "ذ": "BASE", "ر": "BASE", "رائع": "BASE", "رتب_الحروف_لتكوين_الكلمة": "V1", "رمادي": "BASE", "ز": "BASE", "س": "BASE", "ش": "BASE", "شمس": "BASE", "ص": "BASE", "ض": "BASE", "ط": "BASE", "طابق_الرقم_مع_الكمية_الصحيحة": "BASE", "ظ": "BASE", "ع": "BASE", "غ": "BASE", "ف": "BASE", "ق": "BASE", "قلم": "BASE", "قمر": "BASE", "ك": "BASE", "كتاب": "BASE", "ل": "BASE", "ليس_صحيحا": "BASE", "م": "BASE", "مثلث": "BASE", "مربع": "BASE", "مستطيل": "BASE", "ممتاز": "BASE", "ن": "BASE", "هـ": "BASE", "و": "BASE", "وردة": "BASE", "وردي": "BASE", "ي": "BASE"
};

const baseDir = 'public/recordings/ar/boy/';

Object.entries(selections).forEach(([key, value]) => {
    if (value === 'REGENERATE') {
        console.log(`[SKIP] ${key} needs regeneration.`);
        return;
    }
    
    let sourceFile = '';
    if (value === 'BASE') {
        sourceFile = `${key}.wav`;
    } else {
        sourceFile = `${key}_${value.toLowerCase()}.wav`;
    }

    const sourcePath = path.join(baseDir, sourceFile);
    const targetPath = path.join(baseDir, `${key}.wav`);

    if (fs.existsSync(sourcePath)) {
        if (sourcePath !== targetPath) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`[APPLIED] ${sourceFile} -> ${key}.wav`);
        } else {
            console.log(`[OK] ${key}.wav is already base.`);
        }
    } else {
        console.log(`[ERROR] File missing: ${sourcePath}`);
    }
});

// Final cleanup: Rename Arabic-named files to slugs if they are redundant
const RENAME_MAP = {
    'أ.wav': 'alif.wav', 'ب.wav': 'baa.wav', 'ت.wav': 'taa.wav', 'ث.wav': 'thaa.wav', 'ج.wav': 'jeem.wav', 'ح.wav': 'haa_soft.wav', 'خ.wav': 'khaa.wav', 'د.wav': 'daal.wav', 'ذ.wav': 'thaal.wav', 'ر.wav': 'raa.wav', 'ز.wav': 'zay.wav', 'س.wav': 'seen.wav', 'ش.wav': 'sheen.wav', 'ص.wav': 'saad.wav', 'ض.wav': 'daad.wav', 'ط.wav': 'taa_hard.wav', 'ظ.wav': 'zaa.wav', 'ع.wav': 'ayn.wav', 'غ.wav': 'ghayn.wav', 'ف.wav': 'faa.wav', 'ق.wav': 'qaaf.wav', 'ك.wav': 'kaaf.wav', 'ل.wav': 'laam.wav', 'ن.wav': 'noon.wav', 'هـ.wav': 'haa.wav', 'و.wav': 'waw.wav', 'ي.wav': 'yaa.wav',
    'أحمر.wav': 'rouge.wav', 'أزرق.wav': 'bleu.wav', 'أصفر.wav': 'jaune.wav', 'أسود.wav': 'noir.wav', 'أبيض.wav': 'blanc.wav', 'أخضر.wav': 'green.wav', 'برتقالي.wav': 'orange.wav', 'وردي.wav': 'pink.wav', 'بنفسجي.wav': 'purple.wav', 'رمادي.wav': 'gris.wav',
    'دائرة.wav': 'cercle.wav', 'مربع.wav': 'carre.wav', 'مثلث.wav': 'triangle.wav', 'مستطيل.wav': 'rectangle.wav',
    'الأم.wav': 'mother.wav', 'الأب.wav': 'father.wav', 'الأخ.wav': 'brother.wav', 'الأخت.wav': 'sister.wav', 'الجدة.wav': 'grandmother.wav', 'الجد.wav': 'grandfather.wav',
    'أسد.wav': 'asad.wav', 'شمس.wav': 'shams.wav', 'كتاب.wav': 'kitab.wav', 'قلم.wav': 'qalam.wav', 'قمر.wav': 'qamar.wav', 'بيت.wav': 'bayt.wav'
};

Object.entries(RENAME_MAP).forEach(([oldName, newName]) => {
    const oldPath = path.join(baseDir, oldName);
    const newPath = path.join(baseDir, newName);
    if (fs.existsSync(oldPath)) {
        if (fs.existsSync(newPath) && oldPath !== newPath) {
            console.log(`[MERGE] Removing duplicate: ${oldName} (Keeping ${newName})`);
            fs.unlinkSync(oldPath);
        } else {
            fs.renameSync(oldPath, newPath);
        }
    }
});
