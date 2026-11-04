/**
 * Bublii — Mock content data for all four modules across levels 3–5.
 * Localised for French and Arabic. No audio required; activity type defines
 * how the data is presented. All items include realistically designed labels
 * and accessible instructions. Each activity type mirrors one of the five
 * existing types (drag-text-to-image, drag-image-to-zone, letter-sequencer,
 * number-matcher, color-mixer) so the frontend can reuse the same component
 * signatures.
 */

/* ── Module 1 : APPRENDRE ── */

const apprendre_fr_level3 = {
  id: 'apprendre_3_fr',
  module: 'apprendre',
  level: 3,
  language: 'fr',
  title: 'Apprendre : La Famille',
  type: 'drag-text-to-image',
  instruction: 'Glisse le mot vers le bon personnage !',
  items: [
    { id: 'mere', label: 'Mère', imageKey: 'family-mere', audioKey: 'la_mere' },
    { id: 'pere', label: 'Père', imageKey: 'family-pere', audioKey: 'le_pere' },
    { id: 'frere', label: 'Frère', imageKey: 'family-frere', audioKey: 'le_frere' },
    { id: 'soeur', label: 'Sœur', imageKey: 'family-soeur', audioKey: 'la_soeur' },
  ],
};

const apprendre_ar_level3 = {
  id: 'apprendre_3_ar',
  module: 'apprendre',
  level: 3,
  language: 'ar',
  title: 'Apprendre : La Famille',
  type: 'drag-text-to-image',
  instruction: 'اسحب الكلمة إلى الشخص الصحيح!',
  items: [
    { id: 'mere', label: 'الأم', imageKey: 'family-mere', audioKey: 'al_umm' },
    { id: 'pere', label: 'الأب', imageKey: 'family-pere', audioKey: 'al_ab' },
    { id: 'frere', label: 'الأخ', imageKey: 'family-frere', audioKey: 'al_akh' },
    { id: 'soeur', label: 'الأخت', imageKey: 'family-soeur', audioKey: 'al_ukht' },
  ],
};

const apprendre_fr_level4 = {
  id: 'apprendre_4_fr',
  module: 'apprendre',
  level: 4,
  language: 'fr',
  title: 'Apprendre : Les Formes',
  type: 'drag-text-to-image',
  instruction: 'Glisse le mot vers la bonne forme !',
  items: [
    { id: 'cercle', label: 'Cercle', imageKey: 'shape-cercle' },
    { id: 'rectangle', label: 'Rectangle', imageKey: 'shape-rectangle' },
    { id: 'triangle', label: 'Triangle', imageKey: 'shape-triangle' },
    { id: 'carre', label: 'Carré', imageKey: 'shape-carre' },
  ],
};

const apprendre_ar_level4 = {
  id: 'apprendre_4_ar',
  module: 'apprendre',
  level: 4,
  language: 'ar',
  title: 'Apprendre : Les Formes',
  type: 'drag-text-to-image',
  instruction: 'اسحب الكلمة إلى الشكل الصحيح!',
  items: [
    { id: 'cercle', label: 'دائرة', imageKey: 'shape-cercle' },
    { id: 'rectangle', label: 'مستطيل', imageKey: 'shape-rectangle' },
    { id: 'triangle', label: 'مثلث', imageKey: 'shape-triangle' },
    { id: 'carre', label: 'مربع', imageKey: 'shape-carre' },
  ],
};

const apprendre_fr_level5 = {
  id: 'apprendre_5_fr',
  module: 'apprendre',
  level: 5,
  language: 'fr',
  title: 'Apprendre : L\'Alphabet',
  type: 'letter-sequencer',
  instruction: 'Mets les lettres dans le bon ordre pour former le mot !',
  wordLists: [
    [
      { word: 'MOT', letters: ['M', 'O', 'T'], distractors: ['A', 'B', 'C'], hint: 'mot', hintLabel: 'MOT' },
      { word: 'FILLE', letters: ['F', 'I', 'L', 'L', 'E'], distractors: ['A', 'M', 'R'], hint: 'fille', hintLabel: 'FILLE' },
      { word: 'AMI', letters: ['A', 'M', 'I'], distractors: ['E', 'O', 'U'], hint: 'ami', hintLabel: 'AMI' },
    ],
    [
      { word: 'MAISON', letters: ['M', 'A', 'I', 'S', 'O', 'N'], distractors: ['B', 'P', 'R'], hint: 'maison', hintLabel: 'MAISON' },
      { word: 'CHAT', letters: ['C', 'H', 'A', 'T'], distractors: ['O', 'E', 'M'], hint: 'chat', hintLabel: 'CHAT' },
      { word: 'ARBRE', letters: ['A', 'R', 'B', 'R', 'E'], distractors: ['F', 'L', 'T'], hint: 'arbre', hintLabel: 'ARBRE' },
    ],
  ],
  trials: 5,
};

const apprendre_ar_level5 = {
  id: 'apprendre_5_ar',
  module: 'apprendre',
  level: 5,
  language: 'ar',
  title: 'Apprendre : L\'Alphabet',
  type: 'letter-sequencer',
  instruction: 'رتّب الحروف لتكوين الكلمة!',
  wordLists: [
    [
      { word: 'كلمة', letters: ['ك', 'ك', 'ل', 'م'], distractors: ['ب', 'ت', 'ر'], hint: 'كلمة', hintLabel: 'كلمة' },
      { word: 'فتاة', letters: ['ف', 'ت', 'آ', 'ة'], distractors: ['ب', 'ر', 'ح'], hint: 'فتاة', hintLabel: 'فتاة' },
      { word: 'قلم', letters: ['ق', 'ل', 'م'], distractors: ['ب', 'ت', 'ر'], hint: 'قلم', hintLabel: 'قلم' },
    ],
    [
      { word: 'مدرسة', letters: ['م', 'د', 'ر', 'س', 'ة'], distractors: ['ق', 'ل', 'ي'], hint: 'مدرسة', hintLabel: 'مدرسة' },
      { word: 'كلب', letters: ['ك', 'ل', 'ب'], distractors: ['س', 'م', 'ر'], hint: 'كلب', hintLabel: 'كلب' },
      { word: 'حافلة', letters: ['ح', 'ف', 'ا', 'ب', 'ة'], distractors: ['س', 'ة', 'ر'], hint: 'حافلة', hintLabel: 'حافلة' },
    ],
  ],
  trials: 5,
};

/* ── Module 2 : COMMUNIQUER ── */

const communiquer_fr_level3 = {
  id: 'communiquer_3_fr',
  module: 'communiquer',
  level: 3,
  language: 'fr',
  title: 'Communiquer : Les émotions',
  type: 'drag-image-to-zone',
  instruction: 'Dépose l\'image de l\'émotion dans le bon cercle !',
  questions: [
    {
      id: 'q1',
      question: 'Quelle émotion montre ce visage ?',
      correctId: 'emotion-heureux',
      options: [
        { id: 'emotion-heureux', label: 'Heureux', emoji: '😊', imageKey: 'emotion-heureux' },
        { id: 'emotion-triste', label: 'Triste', emoji: '😢', imageKey: 'emotion-triste' },
        { id: 'emotion-colere', label: 'En colère', emoji: '😠', imageKey: 'emotion-colere' },
        { id: 'emotion-surpris', label: 'Surpris', emoji: '😲', imageKey: 'emotion-surpris' },
      ],
    },
    {
      id: 'q2',
      question: 'Comment se sent cet enfant ?',
      correctId: 'emotion-triste',
      options: [
        { id: 'emotion-heureux', label: 'Heureux', emoji: '😊', imageKey: 'emotion-heureux' },
        { id: 'emotion-triste', label: 'Triste', emoji: '😢', imageKey: 'emotion-triste' },
        { id: 'emotion-colere', label: 'En colère', emoji: '😠', imageKey: 'emotion-colere' },
        { id: 'emotion-surpris', label: 'Surpris', emoji: '😲', imageKey: 'emotion-surpris' },
      ],
    },
  ],
};

const communiquer_ar_level3 = {
  id: 'communiquer_3_ar',
  module: 'communiquer',
  level: 3,
  language: 'ar',
  title: 'Communiquer : المشاعر',
  type: 'drag-image-to-zone',
  instruction: 'اسحب الصورة إلى الدائرة الصحيحة!',
  questions: [
    {
      id: 'q1',
      question: 'أي مشاعر يوضح هذا الوجه؟',
      correctId: 'emotion-heureux',
      options: [
        { id: 'emotion-heureux', label: 'سعيدة', emoji: '😊', imageKey: 'emotion-heureux' },
        { id: 'emotion-triste', label: 'حزينة', emoji: '😢', imageKey: 'emotion-triste' },
        { id: 'emotion-colere', label: 'غاضبة', emoji: '😠', imageKey: 'emotion-colere' },
        { id: 'emotion-surpris', label: 'مستاءة', emoji: '😲', imageKey: 'emotion-surpris' },
      ],
    },
    {
      id: 'q2',
      question: 'كيف يشعر هذا الطفل؟',
      correctId: 'emotion-triste',
      options: [
        { id: 'emotion-heureux', label: 'سعيدة', emoji: '😊', imageKey: 'emotion-heureux' },
        { id: 'emotion-triste', label: 'حزينة', emoji: '😢', imageKey: 'emotion-triste' },
        { id: 'emotion-colere', label: 'غاضبة', emoji: '😠', imageKey: 'emotion-colere' },
        { id: 'emotion-surpris', label: 'مستاءة', emoji: '😲', imageKey: 'emotion-surpris' },
      ],
    },
  ],
};

const communiquer_fr_level4 = {
  id: 'communiquer_4_fr',
  module: 'communiquer',
  level: 4,
  language: 'fr',
  title: 'Communiquer : Les besoins',
  type: 'drag-image-to-zone',
  instruction: 'Associe le besoin à la bonne image !',
  questions: [
    {
      id: 'q1',
      question: 'Que veut cet enfant ?',
      correctId: 'need-drink',
      options: [
        { id: 'need-drink', label: 'Boire', emoji: '🧃', imageKey: 'need-drink' },
        { id: 'need-eat', label: 'Manger', emoji: '🍎', imageKey: 'need-eat' },
        { id: 'need-toilet', label: 'Toilette', emoji: '🚽', imageKey: 'need-toilet' },
        { id: 'need-break', label: 'Pause', emoji: '⏱️', imageKey: 'need-break' },
      ],
    },
    {
      id: 'q2',
      question: 'Que recherche cet enfant ?',
      correctId: 'need-eat',
      options: [
        { id: 'need-drink', label: 'Boire', emoji: '🧃', imageKey: 'need-drink' },
        { id: 'need-eat', label: 'Manger', emoji: '🍎', imageKey: 'need-eat' },
        { id: 'need-toilet', label: 'Toilette', emoji: '🚽', imageKey: 'need-toilet' },
        { id: 'need-break', label: 'Pause', emoji: '⏱️', imageKey: 'need-break' },
      ],
    },
  ],
};

const communiquer_ar_level4 = {
  id: 'communiquer_4_ar',
  module: 'communiquer',
  level: 4,
  language: 'ar',
  title: 'Communiquer : الاحتياجات',
  type: 'drag-image-to-zone',
  instruction: 'اطبّق الاحتياج على الصورة الصحيحة!',
  questions: [
    {
      id: 'q1',
      question: 'ماذا يريد الطفل؟',
      correctId: 'need-drink',
      options: [
        { id: 'need-drink', label: 'شرب', emoji: '🧃', imageKey: 'need-drink' },
        { id: 'need-eat', label: 'أكل', emoji: '🍎', imageKey: 'need-eat' },
        { id: 'need-toilet', label: 'حمام', emoji: '🚽', imageKey: 'need-toilet' },
        { id: 'need-break', label: 'استراحة', emoji: '⏱️', imageKey: 'need-break' },
      ],
    },
    {
      id: 'q2',
      question: 'ماذا يبحث الطفل؟',
      correctId: 'need-eat',
      options: [
        { id: 'need-drink', label: 'شرب', emoji: '🧃', imageKey: 'need-drink' },
        { id: 'need-eat', label: 'أكل', emoji: '🍎', imageKey: 'need-eat' },
        { id: 'need-toilet', label: 'حمام', emoji: '🚽', imageKey: 'need-toilet' },
        { id: 'need-break', label: 'استراحة', emoji: '⏱️', imageKey: 'need-break' },
      ],
    },
  ],
};

const communiquer_fr_level5 = {
  id: 'communiquer_5_fr',
  module: 'communiquer',
  level: 5,
  language: 'fr',
  title: 'Communiquer : La phrase simple',
  type: 'drag-text-to-image',
  instruction: 'Construis une phrase simple !',
  wordLists: [
    [
      { word: 'JE', letters: ['J', 'E'], distractors: ['M', 'T', 'R'], hint: 'je', hintLabel: 'JE' },
      { word: 'VEUX', letters: ['V', 'E', 'U', 'X'], distractors: ['B', 'P', 'R'], hint: 'veux', hintLabel: 'VEUX' },
      { word: 'BOIRE', letters: ['B', 'O', 'I', 'R', 'E'], distractors: ['M', 'T', 'S'], hint: 'boire', hintLabel: 'BOIRE' },
    ],
    [
      { word: 'JE', letters: ['J', 'E'], distractors: ['M', 'T', 'R'], hint: 'je', hintLabel: 'JE' },
      { word: 'MANGE', letters: ['M', 'A', 'N', 'G', 'E'], distractors: ['B', 'L', 'P'], hint: 'mange', hintLabel: 'MANGE' },
      { word: 'DU pain', letters: ['D', 'U', 'P', 'A', 'I', 'N'], distractors: ['F', 'C', 'R'], hint: 'du pain', hintLabel: 'DU pain' },
    ],
  ],
  trials: 5,
};

const communiquer_ar_level5 = {
  id: 'communiquer_5_ar',
  module: 'communiquer',
  level: 5,
  language: 'ar',
  title: 'Communiquer : الجملة البسيطة',
  type: 'drag-text-to-image',
  instruction: 'بناء جملة بسيطة!',
  wordLists: [
    [
      { word: 'أر', letters: ['أ', 'ر'], distractors: ['ب', 'ت', 'ر'], hint: 'أر', hintLabel: 'أر' },
      { word: 'أريد', letters: ['أ', 'أ', 'ر', 'ي', 'د'], distractors: ['م', 'ن', 'س'], hint: 'أريد', hintLabel: 'أريد' },
      { word: 'أشرب', letters: ['أ', 'ش', 'ر', 'ب'], distractors: ['ب', 'ت', 'ل'], hint: 'أشرب', hintLabel: 'أشرب' },
    ],
    [
      { word: 'أريد', letters: ['أ', 'أ', 'ر', 'ي', 'د'], distractors: ['م', 'ن', 'س'], hint: 'أريد', hintLabel: 'أريد' },
      { word: 'آكل', letters: ['أ', 'أ', 'ك', 'ل'], distractors: ['ب', 'ل', 'ص'], hint: 'آكل', hintLabel: 'آكل' },
      { word: 'من الخبز', letters: ['م', 'ن', 'ل', 'ل', 'ا', 'ل', 'خ', 'ب'], distractors: ['ب', 'ر', 'س'], hint: 'من الخبز', hintLabel: 'من الخبز' },
    ],
  ],
  trials: 5,
};

/* ── Module 3 : BOUGER ── */

const bouger_fr_level3 = {
  id: 'bouger_3_fr',
  module: 'bouger',
  level: 3,
  language: 'fr',
  title: 'Bouger : Mouvements du corps',
  type: 'color-mixer',
  instruction: 'Mélange les couleurs pour trouver le résultat !',
  rounds: [
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Jaune', value: '#FFD700' },
      resultId: 'orange',
    },
    {
      color1: { label: 'Bleu', value: '#4488FF' },
      color2: { label: 'Jaune', value: '#FFD700' },
      resultId: 'vert',
    },
    {
      color1: { label: 'Bleu', value: '#4488FF' },
      color2: { label: 'Rouge', value: '#FF4444' },
      resultId: 'violet',
    },
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Vert', value: '#44AA44' },
      resultId: 'marron',
    },
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Blanc', value: '#F5F5F5' },
      resultId: 'rose',
    },
    {
      color1: { label: 'Blanc', value: '#F5F5F5' },
      color2: { label: 'Noir', value: '#222222' },
      resultId: 'gris',
    },
  ],
  options: [
    { id: 'orange', label: 'Orange', color: '#FF8C00' },
    { id: 'vert', label: 'Vert', color: '#44AA44' },
    { id: 'violet', label: 'Violet', color: '#8B00FF' },
    { id: 'marron', label: 'Marron', color: '#8B4513' },
    { id: 'rose', label: 'Rose', color: '#FF69B4' },
    { id: 'gris', label: 'Gris', color: '#808080' },
  ],
};

const bouger_ar_level3 = {
  id: 'bouger_3_ar',
  module: 'bouger',
  level: 3,
  language: 'ar',
  title: 'بويه : خلط الألوان',
  type: 'color-mixer',
  instruction: 'اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ',
  rounds: [
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أصفر', value: '#FFD700' },
      resultId: 'orange',
    },
    {
      color1: { label: 'أزرق', value: '#4488FF' },
      color2: { label: 'أصفر', value: '#FFD700' },
      resultId: 'vert',
    },
    {
      color1: { label: 'أزرق', value: '#4488FF' },
      color2: { label: 'أحمر', value: '#FF4444' },
      resultId: 'violet',
    },
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أخضر', value: '#44AA44' },
      resultId: 'marron',
    },
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أبيض', value: '#F5F5F5' },
      resultId: 'rose',
    },
    {
      color1: { label: 'أبيض', value: '#F5F5F5' },
      color2: { label: 'أسود', value: '#222222' },
      resultId: 'gris',
    },
  ],
  options: [
    { id: 'orange', label: 'برتقالي', color: '#FF8C00' },
    { id: 'vert', label: 'أخضر', color: '#44AA44' },
    { id: 'violet', label: 'بنفسجي', color: '#8B00FF' },
    { id: 'marron', label: 'بني', color: '#8B4513' },
    { id: 'rose', label: 'وردية', color: '#FF69B4' },
    { id: 'gris', label: 'رمادي', color: '#808080' },
  ],
};

const bouger_fr_level4 = {
  id: 'bouger_4_fr',
  module: 'bouger',
  level: 4,
  language: 'fr',
  title: 'Bouger : Activités motrices',
  type: 'drag-image-to-zone',
  instruction: 'Effectue l\'activité motrice !',
  questions: [
    {
      id: 'q1',
      question: 'Levez les bras !',
      correctId: 'move-arms-up',
      options: [
        { id: 'move-arms-up', label: 'Bras en l\'air', emoji: '🙋', imageKey: 'move-arms-up' },
        { id: 'move-arms-down', label: 'Bras bas', emoji: '😐', imageKey: 'move-arms-down' },
        { id: 'move-jump', label: 'Sauter', emoji: '🤸', imageKey: 'move-jump' },
        { id: 'move-turn', label: 'Tourner', emoji: '🙀', imageKey: 'move-turn' },
      ],
    },
    {
      id: 'q2',
      question: 'Tapotez vos pieds !',
      correctId: 'move-feet-tap',
      options: [
        { id: 'move-feet-tap', label: 'Tapoter les pieds', emoji: '👟', imageKey: 'move-feet-tap' },
        { id: 'move-jump', label: 'Sauter', emoji: '🤸', imageKey: 'move-jump' },
        { id: 'move-arms-up', label: 'Bras en l\'air', emoji: '🙋', imageKey: 'move-arms-up' },
        { id: 'move-turn', label: 'Tourner', emoji: '🙀', imageKey: 'move-turn' },
      ],
    },
  ],
};

const bouger_ar_level4 = {
  id: 'bouger_4_ar',
  module: 'bouger',
  level: 4,
  language: 'ar',
  title: 'بويه : أنشطة حركية',
  type: 'drag-image-to-zone',
  instruction: 'قم بالنشاط الحركي!',
  questions: [
    {
      id: 'q1',
      question: 'ارفع arms!',
      correctId: 'move-arms-up',
      options: [
        { id: 'move-arms-up', label: 'رفع arms', emoji: '🙋', imageKey: 'move-arms-up' },
        { id: 'move-arms-down', label: 'arms منخفضة', emoji: '😐', imageKey: 'move-arms-down' },
        { id: 'move-jump', label: 'قفز', emoji: '🤸', imageKey: 'move-jump' },
        { id: 'move-turn', label: 'دوران', emoji: '🙀', imageKey: 'move-turn' },
      ],
    },
    {
      id: 'q2',
      question: 'اضرب vos pieds!',
      correctId: 'move-feet-tap',
      options: [
        { id: 'move-feet-tap', label: 'Tapoter vos pieds', emoji: '👟', imageKey: 'move-feet-tap' },
        { id: 'move-jump', label: 'قفز', emoji: '🤸', imageKey: 'move-jump' },
        { id: 'move-arms-up', label: 'Bras en l\'air', emoji: '🙋', imageKey: 'move-arms-up' },
        { id: 'move-turn', label: 'Tourner', emoji: '🙀', imageKey: 'move-turn' },
      ],
    },
  ],
};

const bouger_fr_level5 = {
  id: 'bouger_5_fr',
  module: 'bouger',
  level: 5,
  language: 'fr',
  title: 'Bouger : Simulations',
  type: 'letter-sequencer',
  instruction: 'Écris le mot de l\'activité !',
  wordLists: [
    [
      { word: 'COURIR', letters: ['C', 'O', 'U', 'R', 'R', 'I', 'R'], distractors: ['A', 'B', 'E'], hint: 'courir', hintLabel: 'COURIR' },
      { word: 'JUMP', letters: ['J', 'U', 'M', 'P'], distractors: ['F', 'L', 'T'], hint: 'jump', hintLabel: 'JUMP' },
      { word: 'TOURNER', letters: ['T', 'O', 'U', 'R', 'N', 'E', 'R'], distractors: ['M', 'P', 'S'], hint: 'tourner', hintLabel: 'TOURNER' },
    ],
    [
      { word: 'SALUT', letters: ['S', 'A', 'L', 'U', 'T'], distractors: ['M', 'R', 'O'], hint: 'salut', hintLabel: 'SALUT' },
      { word: 'COUCHE', letters: ['C', 'O', 'U', 'C', 'H', 'E'], distractors: ['A', 'R', 'M'], hint: 'coucher', hintLabel: 'COUCHE' },
      { word: 'LEVER', letters: ['L', 'E', 'V', 'E', 'R'], distractors: ['B', 'D', 'F'], hint: 'lever', hintLabel: 'LEVER' },
    ],
  ],
  trials: 5,
};

const bouger_ar_level5 = {
  id: 'bouger_5_ar',
  module: 'bouger',
  level: 5,
  language: 'ar',
  title: 'بويه : Simulations',
  type: 'letter-sequencer',
  instruction: 'اكتب كلمة النشاط!',
  wordLists: [
    [
      { word: 'ركض', letters: ['ر', 'ك', 'د'], distractors: ['ب', 'ت', 'ر'], hint: 'ركض', hintLabel: 'ركض' },
      { word:قفز', letters: ['ق', 'ف', 'ز'], distractors: ['س', 'م', 'ر'], hint: 'قفز', hintLabel: 'قفز' },
      { word: 'دور', letters: ['د', 'و', 'ر'], distractors: ['م', 'ب', 'س'], hint: 'دور', hintLabel: 'دور' },
    ],
    [
      { word: 'تحية', letters: ['ت', 'ح', 'ي', 'ة'], distractors: ['ق', 'ل', 'س'], hint: 'تحية', hintLabel: 'تحية' },
      { word: 'ضبط', letters: ['ض', 'ب', 'ط'], distractors: ['ك', 'ر', 'س'], hint: 'ضبط', hintLabel: 'ضبط' },
      { word: 'إيقاظ', letters: ['ا', 'ي', 'ق', 'ظ'], distractors: ['م', 'ر', 'س'], hint: 'إيقاظ', hintLabel: 'إيقاظ' },
    ],
  ],
  trials: 5,
};

/* ── Module 4 : GRANDIR ── */

const grandir_fr_level3 = {
  id: 'grandir_3_fr',
  module: 'grandir',
  level: 3,
  language: 'fr',
  title: 'Grandir : Les routines quotidiennes',
  type: 'drag-text-to-image',
  instruction: 'Glisse le mot vers la bonne routine !',
  items: [
    { id: 'matin', label: 'Matin', imageKey: 'routine-matin' },
    { id: 'repas', label: 'Repas', imageKey: 'routine-repas' },
    { id: 'dodo', label: 'Dodo', imageKey: 'routine-dodo' },
    { id: 'jouet', label: 'Jouer', imageKey: 'routine-jouer' },
  ],
};

const grandir_ar_level3 = {
  id: 'grandir_3_ar',
  module: 'grandir',
  level: 3,
  language: 'ar',
  title: 'الكبر : الروتين اليومي',
  type: 'drag-text-to-image',
  instruction: 'اسحب الكلمة إلى الروتين الصحيح!',
  items: [
    { id: 'matin', label: 'صباح', imageKey: 'routine-matin' },
    { id: 'repas', label: 'وجبة', imageKey: 'routine-repas' },
    { id: 'dodo', label: 'قيلولة', imageKey: 'routine-dodo' },
    { id: 'jouet', label: 'لعب', imageKey: 'routine-jouer' },
  ],
};

const grandir_fr_level4 = {
  id: 'grandir_4_fr',
  module: 'grandir',
  level: 4,
  language: 'fr',
  title: 'Grandir : L\'indépendance',
  type: 'number-matcher',
  instruction: 'Associe le chiffre à la bonne étape !',
  trials: 5,
  items: [
    { number: 1, object: 'vêtements', emoji: '👕', label: '1' },
    { number: 2, object: 'brosses dents', emoji: '🪥', label: '2' },
    { number: 3, object: 'couvre-cheveux', emoji: '🧢', label: '3' },
    { number: 4, object: 'couvercle', emoji: '🧢', label: '4' },
    { number: 5, object: 'livre', emoji: '📖', label: '5' },
    { number: 6, object: 'verrouiller', emoji: '🔒', label: '6' },
  ],
};

const grandir_ar_level4 = {
  id: 'grandir_4_ar',
  module: 'grandir',
  level: 4,
  language: 'ar',
  title: 'الكبر : الاستقلال',
  type: 'number-matcher',
  instruction: 'طابق الرقم مع الخطوة الصحيحة!',
  trials: 5,
  items: [
    { number: 1, object: '衣服', emoji: '👕', label: '1' },
    { number: 2, object: 'تنظيف الأسنان', emoji: '🪥', label: '2' },
    { number: 3, object: 'غطاء الرأس', emoji: '🧢', label: '3' },
    { number: 4, object: 'غطاء', emoji: '🧢', label: '4' },
    { number: 5, object: 'كتاب', emoji: '📖', label: '5' },
    { number: 6, object: 'قفل', emoji: '🔒', label: '6' },
  ],
};

const grandir_fr_level5 = {
  id: 'grandir_5_fr',
  module: 'grandir',
  level: 5,
  language: 'fr',
  title: 'Grandir : Les repères d\'étape',
  type: 'drag-text-to-image',
  instruction: 'Glisse chaque mot à son repère !',
  wordLists: [
    [
      { word: 'APRES LE REPAS', letters: ['A', 'P', 'R', 'E', 'S', ' ', 'L', 'E', ' ', 'R', 'E', 'P', 'A', 'S'], distractors: ['M', 'A', 'I', 'S'], hint: 'après le repas', hintLabel: 'APRES LE REPAS' },
      { word: 'LE SOIR', letters: ['L', 'E', ' ', 'S', 'O', 'I', 'R'], distractors: ['M', 'A', 'I'], hint: 'le soir', hintLabel: 'LE SOIR' },
      { word: 'LE MATIN', letters: ['L', 'E', ' ', 'M', 'A', 'T', 'I', 'N'], distractors: ['F', 'R', 'E'], hint: 'le matin', hintLabel: 'LE MATIN' },
    ],
    [
      { word: 'APRES LE DEJEUNER', letters: ['A', 'P', 'R', 'E', 'S', ' ', 'L', 'E', ' ', 'D', 'E', 'J', 'E', 'U', 'N', 'E', 'R'], distractors: ['M', 'A', 'I', 'S'], hint: 'après le déjeuner', hintLabel: 'APRES LE DEJEUNER' },
      { word: 'LE REPOS', letters: ['L', 'E', ' ', 'R', 'E', 'P', 'O', 'S'], distractors: ['M', 'A', 'I'], hint: 'le repos', hintLabel: 'LE REPOS' },
      { word: 'LE BAIN', letters: ['L', 'E', ' ', 'B', 'A', 'I', 'N'], distractors: ['M', 'T', 'R'], hint: 'le bain', hintLabel: 'LE BAIN' },
    ],
  ],
  trials: 5,
};

const grandir_ar_level5 = {
  id: 'grandir_5_ar',
  module: 'grandir',
  level: 5,
  language: 'ar',
  title: 'الكبر : المراحل',
  type: 'drag-text-to-image',
  instruction: 'اسحب كل كلمة إلى مكانها!',
  wordLists: [
    [
      { word: 'بَعْدَ الأَكْل', letters: ['ب', 'ع', 'د', 'ا', 'ل', ' ', 'ال', 'أ', 'ك', 'ل'], distractors: ['م', 'أ', 'ي'], hint: 'بعد الأكل', hintLabel: 'بَعْدَ الأَكْل' },
      { word: 'الليل', letters: ['ال', 'ل', 'ي', 'ل'], distractors: ['ب', 'ت', 'ر'], hint: 'الليل', hintLabel: 'الليل' },
      { word: 'الصبح', letters: ['ال', 'ص', 'ب،], distractors: ['ف', 'ر', 'ح'], hint: 'الصبح', hintLabel: 'الصبح' },
    ],
    [
      { word: 'بعد الغداء', letters: ['ب', 'ع', 'د', 'ا', 'ل', ' ', 'ال', 'غ', 'ل', 'د', 'ح'], distractors: ['م', 'أ', 'ي'], hint: 'بعد الغداء', hintLabel: 'بَعْدَ الغداء' },
      { word: 'الراحة', letters: ['الر', 'ح', 'ة'], distractors: ['ب', 'ت', 'ر'], hint: 'الراحة', hintLabel: 'الراحة' },
      { word: 'الاستحمام', letters: ['ال', 'س', 'ت', 'ح', 'م', 'م'], distractors: ['ف', 'ر', 'ح'], hint: 'الاستحمام', hintLabel: 'الاستحمام' },
    ],
  ],
  trials: 5,
};

/* ── Containers & selectors ── */

const modules3_fr = {
  fr: {
    welcomeMsg: 'Qu\'est-ce qu\'on veut apprendre aujourd\'hui ?',
    categories: [
      { id: 'apprendre', title: 'Apprendre', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_fr_level3 },
      { id: 'communiquer', title: 'Communiquer', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_fr_level3 },
      { id: 'bouger', title: 'Bouger', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_fr_level3 },
    ],
  },
  ar: {
    welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
    categories: [
      { id: 'apprendre', title: 'تعلم', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_ar_level3 },
      { id: 'communiquer', title: 'تواصل', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_ar_level3 },
      { id: 'bouger', title: 'تحرك', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_ar_level3 },
    ],
  },
};

const modules4_fr = {
  fr: {
    welcomeMsg: 'Qu\'est-ce qu\'on veut apprendre aujourd\'hui ?',
    categories: [
      { id: 'apprendre', title: 'Apprendre', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_fr_level4 },
      { id: 'communiquer', title: 'Communiquer', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_fr_level4 },
      { id: 'bouger', title: 'Bouger', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_fr_level4 },
      { id: 'grandir', title: 'Grandir', icon: '🌱', color: '#FF9F43', bgColor: '#FFF1DE', activity: grandir_fr_level4 },
    ],
  },
  ar: {
    welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
    categories: [
      { id: 'apprendre', title: 'تعلم', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_ar_level4 },
      { id: 'communiquer', title: 'تواصل', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_ar_level4 },
      { id: 'bouger', title: 'تحرك', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_ar_level4 },
      { id: 'grandir', title: 'الكبر', icon: '🌱', color: '#FF9F43', bgColor: '#FFF1DE', activity: grandir_ar_level4 },
    ],
  },
};

const modules5_fr = {
  fr: {
    welcomeMsg: 'Qu\'est-ce qu\'on veut apprendre aujourd\'hui ?',
    categories: [
      { id: 'apprendre', title: 'Apprendre', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_fr_level5 },
      { id: 'communiquer', title: 'Communiquer', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_fr_level5 },
      { id: 'bouger', title: 'Bouger', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_fr_level5 },
      { id: 'grandir', title: 'Grandir', icon: '🌱', color: '#FF9F43', bgColor: '#FFF1DE', activity: grandir_fr_level5 },
    ],
  },
  ar: {
    welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
    categories: [
      { id: 'apprendre', title: 'تعلم', icon: '📚', color: '#3F8CFF', bgColor: '#E8F1FF', activity: apprendre_ar_level5 },
      { id: 'communiquer', title: 'تواصل', icon: '💬', color: '#FF7A8A', bgColor: '#FFE9ED', activity: communiquer_ar_level5 },
      { id: 'bouger', title: 'تحرك', icon: '🕺', color: '#2FC48D', bgColor: '#E2F9F0', activity: bouger_ar_level5 },
      { id: 'grandir', title: 'الكبر', icon: '🌱', color: '#FF9F43', bgColor: '#FFF1DE', activity: grandir_ar_level5 },
    ],
  },
};

export default function getContent(level, language) {
  if (level === 3) return modules3_fr[language] || modules3_fr.fr;
  if (level === 4) return modules4_fr[language] || modules4_fr.fr;
  if (level === 5) return modules5_fr[language] || modules5_fr.fr;
  return modules3_fr.fr;
}

export function getCategory(level, language, categoryId) {
  const content = getContent(level, language);
  return content.categories.find(c => c.id === categoryId);
}

export default { 3: modules3_fr, 4: modules4_fr, 5: modules5_fr };