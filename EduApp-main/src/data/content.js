/**
 * Full content data for all activities across all levels and languages
 */

// ==========================================
// LEVEL 3 — LA FAMILLE
// ==========================================
const famille_fr = {
  id: 'famille',
  type: 'drag-text-to-image',
  title: 'La Famille',
  instruction: 'Glisse le mot vers le bon personnage !',
  items: [
    { id: 'mere',      label: 'Mère',       imageKey: 'family-mere',      audio: 'La mère' },
    { id: 'pere',      label: 'Père',       imageKey: 'family-pere',      audio: 'Le père' },
    { id: 'frere',     label: 'Frère',      imageKey: 'family-frere',     audio: 'Le frère' },
    { id: 'soeur',     label: 'Sœur',       imageKey: 'family-soeur',     audio: 'La sœur' },
    { id: 'grandmere', label: 'Grand-mère', imageKey: 'family-grandmere', audio: 'La grand-mère' },
    { id: 'grandpere', label: 'Grand-père', imageKey: 'family-grandpere', audio: 'Le grand-père' },
  ]
};

const famille_ar = {
  id: 'famille',
  type: 'drag-text-to-image',
  title: 'العائلة',
  instruction: 'اسحب الكلمة إلى الشخص الصحيح!',
  items: [
    { id: 'mere',      label: 'الأم',   imageKey: 'family-mere',      audio: 'الأم' },
    { id: 'pere',      label: 'الأب',   imageKey: 'family-pere',      audio: 'الأب' },
    { id: 'frere',     label: 'الأخ',   imageKey: 'family-frere',     audio: 'الأخ' },
    { id: 'soeur',     label: 'الأخت',  imageKey: 'family-soeur',     audio: 'الأخت' },
    { id: 'grandmere', label: 'الجدة',  imageKey: 'family-grandmere', audio: 'الجدة' },
    { id: 'grandpere', label: 'الجد',   imageKey: 'family-grandpere', audio: 'الجد' },
  ]
};

// ==========================================
// LEVEL 3 — LES COULEURS (BASE — 5)
// ==========================================
const couleurs3_fr = {
  id: 'couleurs',
  type: 'drag-text-to-image',
  title: 'Les Couleurs',
  instruction: 'Glisse le mot vers la bonne couleur !',
  items: [
    { id: 'rouge',  label: 'Rouge',  imageKey: 'color-rouge',  audio: 'Rouge',  color: '#FF4444' },
    { id: 'bleu',   label: 'Bleu',   imageKey: 'color-bleu',   audio: 'Bleu',   color: '#4488FF' },
    { id: 'jaune',  label: 'Jaune',  imageKey: 'color-jaune',  audio: 'Jaune',  color: '#FFD700' },
    { id: 'noir',   label: 'Noir',   imageKey: 'color-noir',   audio: 'Noir',   color: '#222222' },
    { id: 'blanc',  label: 'Blanc',  imageKey: 'color-blanc',  audio: 'Blanc',  color: '#F5F5F5' },
  ]
};

const couleurs3_ar = {
  id: 'couleurs',
  type: 'drag-text-to-image',
  title: 'الألوان',
  instruction: 'اسحب الكلمة إلى اللون الصحيح!',
  items: [
    { id: 'rouge',  label: 'أحمر',   imageKey: 'color-rouge',  audio: 'أحمر',   color: '#FF4444' },
    { id: 'bleu',   label: 'أزرق',   imageKey: 'color-bleu',   audio: 'أزرق',   color: '#4488FF' },
    { id: 'jaune',  label: 'أصفر',   imageKey: 'color-jaune',  audio: 'أصفر',   color: '#FFD700' },
    { id: 'noir',   label: 'أسود',   imageKey: 'color-noir',   audio: 'أسود',   color: '#222222' },
    { id: 'blanc',  label: 'أبيض',   imageKey: 'color-blanc',  audio: 'أبيض',   color: '#F5F5F5' },
  ]
};

// ==========================================
// LEVEL 4 — LES FORMES
// ==========================================
const formes_fr = {
  id: 'formes',
  type: 'drag-text-to-image',
  title: 'Les Formes',
  instruction: 'Glisse le mot vers la bonne forme !',
  items: [
    { id: 'cercle',    label: 'Cercle',    imageKey: 'shape-cercle',    audio: 'Cercle' },
    { id: 'rectangle', label: 'Rectangle', imageKey: 'shape-rectangle', audio: 'Rectangle' },
    { id: 'triangle',  label: 'Triangle',  imageKey: 'shape-triangle',  audio: 'Triangle' },
    { id: 'carre',     label: 'Carré',     imageKey: 'shape-carre',     audio: 'Carré' },
  ]
};

const formes_ar = {
  id: 'formes',
  type: 'drag-text-to-image',
  title: 'الأشكال',
  instruction: 'اسحب الكلمة إلى الشكل الصحيح!',
  items: [
    { id: 'cercle',    label: 'دائرة',   imageKey: 'shape-cercle',    audio: 'دائرة' },
    { id: 'rectangle', label: 'مستطيل', imageKey: 'shape-rectangle', audio: 'مستطيل' },
    { id: 'triangle',  label: 'مثلث',   imageKey: 'shape-triangle',  audio: 'مثلث' },
    { id: 'carre',     label: 'مربع',   imageKey: 'shape-carre',     audio: 'مربع' },
  ]
};

// ==========================================
// LEVEL 4 — LES COULEURS (ÉTENDU — 10)
// ==========================================
const couleurs4_fr = {
  id: 'couleurs',
  type: 'drag-text-to-image',
  title: 'Les Couleurs',
  instruction: 'Glisse le mot vers la bonne couleur !',
  items: [
    { id: 'rouge',    label: 'Rouge',    imageKey: 'color-rouge',    audio: 'Rouge',    color: '#FF4444' },
    { id: 'bleu',     label: 'Bleu',     imageKey: 'color-bleu',     audio: 'Bleu',     color: '#4488FF' },
    { id: 'jaune',    label: 'Jaune',    imageKey: 'color-jaune',    audio: 'Jaune',    color: '#FFD700' },
    { id: 'noir',     label: 'Noir',     imageKey: 'color-noir',     audio: 'Noir',     color: '#222222' },
    { id: 'blanc',    label: 'Blanc',    imageKey: 'color-blanc',    audio: 'Blanc',    color: '#F5F5F5' },
    { id: 'vert',     label: 'Vert',     imageKey: 'color-vert',     audio: 'Vert',     color: '#44AA44' },
    { id: 'orange',   label: 'Orange',   imageKey: 'color-orange',   audio: 'Orange',   color: '#FF8C00' },
    { id: 'rose',     label: 'Rose',     imageKey: 'color-rose',     audio: 'Rose',     color: '#FF69B4' },
    { id: 'violet',   label: 'Violet',   imageKey: 'color-violet',   audio: 'Violet',   color: '#8B00FF' },
    { id: 'gris',     label: 'Gris',     imageKey: 'color-gris',     audio: 'Gris',     color: '#808080' },
  ]
};

const couleurs4_ar = {
  id: 'couleurs',
  type: 'drag-text-to-image',
  title: 'الألوان',
  instruction: 'اسحب الكلمة إلى اللون الصحيح!',
  items: [
    { id: 'rouge',    label: 'أحمر',     imageKey: 'color-rouge',    audio: 'أحمر',     color: '#FF4444' },
    { id: 'bleu',     label: 'أزرق',     imageKey: 'color-bleu',     audio: 'أزرق',     color: '#4488FF' },
    { id: 'jaune',    label: 'أصفر',     imageKey: 'color-jaune',    audio: 'أصفر',     color: '#FFD700' },
    { id: 'noir',     label: 'أسود',     imageKey: 'color-noir',     audio: 'أسود',     color: '#222222' },
    { id: 'blanc',    label: 'أبيض',     imageKey: 'color-blanc',    audio: 'أبيض',     color: '#F5F5F5' },
    { id: 'vert',     label: 'أخضر',     imageKey: 'color-vert',     audio: 'أخضر',     color: '#44AA44' },
    { id: 'orange',   label: 'برتقالي', imageKey: 'color-orange',   audio: 'برتقالي', color: '#FF8C00' },
    { id: 'rose',     label: 'وردي',    imageKey: 'color-rose',     audio: 'وردي',    color: '#FF69B4' },
    { id: 'violet',   label: 'بنفسجي',  imageKey: 'color-violet',   audio: 'بنفسجي',  color: '#8B00FF' },
    { id: 'gris',     label: 'رمادي',   imageKey: 'color-gris',     audio: 'رمادي',   color: '#808080' },
  ]
};

// ==========================================
// LEVEL 4 — COMBINAISONS (Formes + Couleurs)
// ==========================================
const combinaisons_fr = {
  id: 'combinaisons',
  type: 'drag-image-to-zone',
  title: 'Formes et Couleurs',
  instruction: 'Réponds aux questions suivantes',
  questions: [
    {
      id: 'q1',
      question: 'Où est le cercle rouge ?',
      correctId: 'cercle-rouge',
      options: [
        { id: 'cercle-rouge',      shape: 'circle',    color: '#FF4444', colorName: 'rouge',  shapeName: 'cercle' },
        { id: 'carre-bleu',        shape: 'square',    color: '#4488FF', colorName: 'bleu',   shapeName: 'carré' },
        { id: 'triangle-jaune',    shape: 'triangle',  color: '#FFD700', colorName: 'jaune',  shapeName: 'triangle' },
        { id: 'rectangle-vert',    shape: 'rectangle', color: '#44AA44', colorName: 'vert',   shapeName: 'rectangle' },
      ]
    },
    {
      id: 'q2',
      question: 'Où est le carré bleu ?',
      correctId: 'carre-bleu',
      options: [
        { id: 'cercle-orange',     shape: 'circle',    color: '#FF8C00', colorName: 'orange', shapeName: 'cercle' },
        { id: 'carre-bleu',        shape: 'square',    color: '#4488FF', colorName: 'bleu',   shapeName: 'carré' },
        { id: 'triangle-rose',     shape: 'triangle',  color: '#FF69B4', colorName: 'rose',   shapeName: 'triangle' },
        { id: 'rectangle-rouge',   shape: 'rectangle', color: '#FF4444', colorName: 'rouge',  shapeName: 'rectangle' },
      ]
    },
    {
      id: 'q3',
      question: 'Où est le triangle jaune ?',
      correctId: 'triangle-jaune',
      options: [
        { id: 'cercle-violet',     shape: 'circle',    color: '#8B00FF', colorName: 'violet', shapeName: 'cercle' },
        { id: 'carre-rouge',       shape: 'square',    color: '#FF4444', colorName: 'rouge',  shapeName: 'carré' },
        { id: 'triangle-jaune',    shape: 'triangle',  color: '#FFD700', colorName: 'jaune',  shapeName: 'triangle' },
        { id: 'rectangle-bleu',    shape: 'rectangle', color: '#4488FF', colorName: 'bleu',   shapeName: 'rectangle' },
      ]
    },
    {
      id: 'q4',
      question: 'Où est le rectangle vert ?',
      correctId: 'rectangle-vert',
      options: [
        { id: 'cercle-jaune',      shape: 'circle',    color: '#FFD700', colorName: 'jaune',  shapeName: 'cercle' },
        { id: 'carre-gris',        shape: 'square',    color: '#808080', colorName: 'gris',   shapeName: 'carré' },
        { id: 'triangle-orange',   shape: 'triangle',  color: '#FF8C00', colorName: 'orange', shapeName: 'triangle' },
        { id: 'rectangle-vert',    shape: 'rectangle', color: '#44AA44', colorName: 'vert',   shapeName: 'rectangle' },
      ]
    },
  ]
};

const combinaisons_ar = {
  id: 'combinaisons',
  type: 'drag-image-to-zone',
  title: 'الأشكال والألوان',
  instruction: 'أجب على الأسئلة التالية',
  questions: [
    {
      id: 'q1',
      question: 'أين الدائرة الحمراء؟',
      correctId: 'cercle-rouge',
      options: [
        { id: 'cercle-rouge',      shape: 'circle',    color: '#FF4444', colorName: 'أحمر',     shapeName: 'دائرة' },
        { id: 'carre-bleu',        shape: 'square',    color: '#4488FF', colorName: 'أزرق',     shapeName: 'مربع' },
        { id: 'triangle-jaune',    shape: 'triangle',  color: '#FFD700', colorName: 'أصفر',     shapeName: 'مثلث' },
        { id: 'rectangle-vert',    shape: 'rectangle', color: '#44AA44', colorName: 'أخضر',     shapeName: 'مستطيل' },
      ]
    },
    {
      id: 'q2',
      question: 'أَيْنَ الْمُرَبَّعُ الْأَزْرَقُ؟',
      correctId: 'carre-bleu',
      options: [
        { id: 'cercle-orange',     shape: 'circle',    color: '#FF8C00', colorName: 'برتقالي', shapeName: 'دائرة' },
        { id: 'carre-bleu',        shape: 'square',    color: '#4488FF', colorName: 'أزرق',     shapeName: 'مربع' },
        { id: 'triangle-rose',     shape: 'triangle',  color: '#FF69B4', colorName: 'وردي',     shapeName: 'مثلث' },
        { id: 'rectangle-rouge',   shape: 'rectangle', color: '#FF4444', colorName: 'أحمر',     shapeName: 'مستطيل' },
      ]
    },
    {
      id: 'q3',
      question: 'أين المثلث الأصفر؟',
      correctId: 'triangle-jaune',
      options: [
        { id: 'cercle-violet',     shape: 'circle',    color: '#8B00FF', colorName: 'بنفسجي',  shapeName: 'دائرة' },
        { id: 'carre-rouge',       shape: 'square',    color: '#FF4444', colorName: 'أحمر',     shapeName: 'مربع' },
        { id: 'triangle-jaune',    shape: 'triangle',  color: '#FFD700', colorName: 'أصفر',     shapeName: 'مثلث' },
        { id: 'rectangle-bleu',    shape: 'rectangle', color: '#4488FF', colorName: 'أزرق',     shapeName: 'مستطيل' },
      ]
    },
    {
      id: 'q4',
      question: 'أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟',
      correctId: 'rectangle-vert',
      options: [
        { id: 'cercle-jaune',      shape: 'circle',    color: '#FFD700', colorName: 'أصفر',     shapeName: 'دائرة' },
        { id: 'carre-gris',        shape: 'square',    color: '#808080', colorName: 'رمادي',    shapeName: 'مربع' },
        { id: 'triangle-orange',   shape: 'triangle',  color: '#FF8C00', colorName: 'برتقالي', shapeName: 'مثلث' },
        { id: 'rectangle-vert',    shape: 'rectangle', color: '#44AA44', colorName: 'أخضر',     shapeName: 'مستطيل' },
      ]
    },
  ]
};

// ==========================================
// LEVEL 4 — MÉLANGE DES COULEURS
// ==========================================
const melange_fr = {
  id: 'melange',
  type: 'color-mixer',
  title: 'Mélange des Couleurs',
  instruction: 'Mélange les couleurs pour trouver le résultat !',
  rounds: [
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Jaune', value: '#FFD700' },
      resultId: 'orange'
    },
    {
      color1: { label: 'Jaune', value: '#FFD700' },
      color2: { label: 'Bleu', value: '#4488FF' },
      resultId: 'vert'
    },
    {
      color1: { label: 'Bleu', value: '#4488FF' },
      color2: { label: 'Rouge', value: '#FF4444' },
      resultId: 'violet'
    },
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Vert', value: '#44AA44' },
      resultId: 'marron'
    },
    {
      color1: { label: 'Rouge', value: '#FF4444' },
      color2: { label: 'Blanc', value: '#F5F5F5' },
      resultId: 'rose'
    },
    {
      color1: { label: 'Blanc', value: '#F5F5F5' },
      color2: { label: 'Noir', value: '#222222' },
      resultId: 'gris'
    }
  ],
  options: [
    { id: 'orange', label: 'Orange', color: '#FF8C00' },
    { id: 'vert',   label: 'Vert',   color: '#44AA44' },
    { id: 'violet', label: 'Violet', color: '#8B00FF' },
    { id: 'marron', label: 'Marron', color: '#8B4513' },
    { id: 'rose',   label: 'Rose',   color: '#FF69B4' },
    { id: 'gris',   label: 'Gris',   color: '#808080' },
  ]
};

const melange_ar = {
  id: 'melange',
  type: 'color-mixer',
  title: 'مزج الألوان',
  instruction: 'اِخْلِطِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ',
  rounds: [
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أصفر', value: '#FFD700' },
      resultId: 'orange'
    },
    {
      color1: { label: 'أصفر', value: '#FFD700' },
      color2: { label: 'أزرق', value: '#4488FF' },
      resultId: 'vert'
    },
    {
      color1: { label: 'أزرق', value: '#4488FF' },
      color2: { label: 'أحمر', value: '#FF4444' },
      resultId: 'violet'
    },
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أخضر', value: '#44AA44' },
      resultId: 'marron'
    },
    {
      color1: { label: 'أحمر', value: '#FF4444' },
      color2: { label: 'أبيض', value: '#F5F5F5' },
      resultId: 'rose'
    },
    {
      color1: { label: 'أبيض', value: '#F5F5F5' },
      color2: { label: 'أسود', value: '#222222' },
      resultId: 'gris'
    }
  ],
  options: [
    { id: 'orange', label: 'برتقالي', color: '#FF8C00' },
    { id: 'vert',   label: 'أخضر',   color: '#44AA44' },
    { id: 'violet', label: 'بنفسجي', color: '#8B00FF' },
    { id: 'marron', label: 'بني',    color: '#8B4513' },
    { id: 'rose',   label: 'وردي',   color: '#FF69B4' },
    { id: 'gris',   label: 'رمادي',   color: '#808080' },
  ]
};

// ==========================================
// LEVEL 5 — L'ALPHABET
// ==========================================
const alphabet_fr = {
  id: 'alphabet',
  type: 'letter-sequencer',
  title: "L'Alphabet",
  instruction: 'Mets les lettres dans le bon ordre pour former le mot !',
  wordLists: [
    [
      { word: 'STYLO',  letters: ['S','T','Y','L','O'],   distractors: ['M','R','A'],     hint: '🖊️', hintLabel: 'STYLO' },
      { word: 'LIVRE',  letters: ['L','I','V','R','E'],   distractors: ['A','M','P'],     hint: '📚', hintLabel: 'LIVRE' },
      { word: 'CARTABLE', letters: ['C','A','R','T','A','B','L','E'], distractors: ['M','O','S'],   hint: '🎒', hintLabel: 'CARTABLE' },
      { word: 'MAÎTRESSE', letters: ['M','A','Î','T','R','E','S','S','E'], distractors: ['B','O','N'],   hint: '👩‍🏫', hintLabel: 'MAÎTRESSE' },
      { word: 'ÉCOLE',  letters: ['É','C','O','L','E'],   distractors: ['M','T','R'],     hint: '🏫', hintLabel: 'ÉCOLE' },
    ],
    [
      { word: 'MAMAN',  letters: ['M','A','M','A','N'],   distractors: ['E','R','I'],     hint: 'maman', hintLabel: 'MAMAN' },
      { word: 'PAPA',   letters: ['P','A','P','A'],       distractors: ['M','E','O'],     hint: 'papa', hintLabel: 'PAPA' },
      { word: 'FILLE',  letters: ['F','I','L','L','E'],   distractors: ['A','M','R'],     hint: 'fille', hintLabel: 'FILLE' },
      { word: 'GARÇON', letters: ['G','A','R','Ç','O','N'], distractors: ['E','M','T'],   hint: 'garcon', hintLabel: 'GARÇON' },
      { word: 'AMI',    letters: ['A','M','I'],           distractors: ['E','O','U'],     hint: 'ami', hintLabel: 'AMI' },
    ],
    [
      { word: 'MOUTON', letters: ['M','O','U','T','O','N'], distractors: ['A','E','I'],   hint: '🐑', hintLabel: 'MOUTON' },
      { word: 'VACHE',  letters: ['V','A','C','H','E'],   distractors: ['O','M','R'],     hint: '🐄', hintLabel: 'VACHE' },
      { word: 'POULE',  letters: ['P','O','U','L','E'],   distractors: ['A','I','M'],     hint: '🐔', hintLabel: 'POULE' },
      { word: 'CHAT',   letters: ['C','H','A','T'],       distractors: ['O','E','M'],     hint: '🐱', hintLabel: 'CHAT' },
      { word: 'CHIEN',  letters: ['C','H','I','E','N'],   distractors: ['A','O','U'],     hint: '🐶', hintLabel: 'CHIEN' },
      { word: 'POISSON', letters: ['P','O','I','S','S','O','N'], distractors: ['A','E','M'],   hint: '🐟', hintLabel: 'POISSON' },
    ]
  ],
  listDetails: [
    { title: 'École', icon: '🏫' },
    { title: 'Famille', icon: '👨‍👩‍👧‍👦' },
    { title: 'Animaux', icon: '🐾' }
  ],
  trials: 5
};

const alphabet_ar = {
  id: 'alphabet',
  type: 'letter-sequencer',
  title: 'الأبجدية',
  instruction: 'رتّب الحروف لتكوين الكلمة!',
  wordLists: [
    [
      { word: 'قلم', letters: ['ق','ل','م'], distractors: ['ب','ت','ر'], hint: '🖊️', hintLabel: 'قلم' },
      { word: 'كتاب', letters: ['ك','ت','ا','ب'], distractors: ['م','ن','ر'], hint: '📚', hintLabel: 'كتاب' },
      { word: 'حقيبة', letters: ['ح','ق','ي','ب','ة'], distractors: ['م','س','ل'], hint: '🎒', hintLabel: 'حقيبة' },
      { word: 'معلمة', letters: ['م','ع','ل','م','ة'], distractors: ['ك','ت','ر'], hint: '👩‍🏫', hintLabel: 'معلمة' },
      { word: 'مدرسة', letters: ['م','د','ر','س','ة'], distractors: ['ق','ل','ي'], hint: '🏫', hintLabel: 'مدرسة' },
    ],
    [
      { word: 'أمي', letters: ['أ','م','ي'], distractors: ['و','ك','ت'], hint: 'أمي', hintLabel: 'أمي' },
      { word: 'أب', letters: ['أ','ب'], distractors: ['م','و','ك'], hint: 'أب', hintLabel: 'أب' },
      { word: 'أختي', letters: ['أ','خ','ت','ي'], distractors: ['ب','م','و'], hint: 'أختي', hintLabel: 'أختي' },
      { word: 'أخي', letters: ['أ','خ','ي'], distractors: ['ت','ب','م'], hint: 'أخي', hintLabel: 'أخي' },
      { word: 'صديقي', letters: ['ص','د','ي','ق','ي'], distractors: ['م','ر','ل'], hint: 'صديقي', hintLabel: 'صديقي' },
    ],
    [
      { word: 'قطة', letters: ['ق','ط','ة'], distractors: ['م','س','ر'], hint: '🐱', hintLabel: 'قطة' },
      { word: 'كلب', letters: ['ك','ل','ب'], distractors: ['س','م','ر'], hint: '🐶', hintLabel: 'كلب' },
      { word: 'خروف', letters: ['خ','ر','و','ف'], distractors: ['م','س','ق'], hint: '🐑', hintLabel: 'خروف' },
      { word: 'سمكة', letters: ['س','م','ك','ة'], distractors: ['خ','ر','ب'], hint: '🐟', hintLabel: 'سمكة' },
      { word: 'بقرة', letters: ['ب','ق','ر','ة'], distractors: ['ك','س','خ'], hint: '🐄', hintLabel: 'بقرة' },
    ]
  ],
  listDetails: [
    { title: 'المدرسة', icon: '🏫' },
    { title: 'العائلة', icon: '👨‍👩‍👧‍👦' },
    { title: 'الحيوانات', icon: '🐾' }
  ],
  trials: 5
};

// ==========================================
// LEVEL 5 — LES CHIFFRES (NO AUDIO)
// ==========================================
const chiffres_fr = {
  id: 'chiffres',
  type: 'number-matcher',
  title: 'Les Chiffres',
  instruction: 'Associe le chiffre à la bonne quantité !',
  trials: 5,
  items: [
    { number: 1, object: 'cake',    emoji: '🍰', label: '1' },
    { number: 2, object: 'star',    emoji: '⭐', label: '2' },
    { number: 3, object: 'car',     emoji: '🚗', label: '3' },
    { number: 4, object: 'apple',   emoji: '🍎', label: '4' },
    { number: 5, object: 'candy',   emoji: '🍬', label: '5' },
    { number: 6,  object: 'tree',    emoji: '🌲', label: '6' },
    { number: 7,  object: 'flower',  emoji: '🌸', label: '7' },
    { number: 8,  object: 'balloon', emoji: '🎈', label: '8' },
    { number: 9,  object: 'heart',   emoji: '❤️', label: '9' },
    { number: 10, object: 'moon',    emoji: '🌙', label: '10' },
  ]
};

const chiffres_ar = {
  id: 'chiffres',
  type: 'number-matcher',
  title: 'الأرقام',
  instruction: 'طابق الرقم مع الكمية الصحيحة!',
  trials: 5,
  items: chiffres_fr.items // Same structure, no TTS
};

// ==========================================
// CATEGORY DEFINITIONS PER LEVEL
// ==========================================
const contentMap = {
  3: {
    fr: {
      welcomeMsg: "Qu'est-ce qu'on veut apprendre aujourd'hui ?",
      categories: [
        {
          id: 'famille',
          title: 'La Famille',
          icon: '👨‍👩‍👧‍👦',
          color: '#FF6B6B',
          bgColor: '#FFF0F0',
          activity: famille_fr,
        },
        {
          id: 'couleurs',
          title: 'Les Couleurs',
          icon: '🎨',
          color: '#4D96FF',
          bgColor: '#F0F6FF',
          activity: couleurs3_fr,
        }
      ]
    },
    ar: {
      welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
      categories: [
        {
          id: 'famille',
          title: 'العائلة',
          icon: '👨‍👩‍👧‍👦',
          color: '#FF6B6B',
          bgColor: '#FFF0F0',
          activity: famille_ar,
        },
        {
          id: 'couleurs',
          title: 'الألوان',
          icon: '🎨',
          color: '#4D96FF',
          bgColor: '#F0F6FF',
          activity: couleurs3_ar,
        }
      ]
    }
  },
  4: {
    fr: {
      welcomeMsg: "Qu'est-ce qu'on veut apprendre aujourd'hui ?",
      categories: [
        {
          id: 'formes',
          title: 'Les Formes',
          icon: '🔷',
          color: '#6BCB77',
          bgColor: '#F0FFF4',
          activity: formes_fr,
        },
        {
          id: 'couleurs',
          title: 'Les Couleurs',
          icon: '🎨',
          color: '#4D96FF',
          bgColor: '#F0F6FF',
          activity: melange_fr,
        },
        {
          id: 'combinaisons',
          title: 'Formes + Couleurs',
          icon: '⭐',
          color: '#C77DFF',
          bgColor: '#F8F0FF',
          activity: combinaisons_fr,
        }
      ]
    },
    ar: {
      welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
      categories: [
        {
          id: 'formes',
          title: 'الأشكال',
          icon: '🔷',
          color: '#6BCB77',
          bgColor: '#F0FFF4',
          activity: formes_ar,
        },
        {
          id: 'couleurs',
          title: 'الألوان',
          icon: '🎨',
          color: '#4D96FF',
          bgColor: '#F0F6FF',
          activity: melange_ar,
        },
        {
          id: 'combinaisons',
          title: 'الأشكال والألوان',
          icon: '⭐',
          color: '#C77DFF',
          bgColor: '#F8F0FF',
          activity: combinaisons_ar,
        }
      ]
    }
  },
  5: {
    fr: {
      welcomeMsg: "Qu'est-ce qu'on veut apprendre aujourd'hui ?",
      categories: [
        {
          id: 'alphabet',
          title: "L'Alphabet",
          icon: '🔤',
          color: '#FF6B6B',
          bgColor: '#FFF0F0',
          activity: alphabet_fr,
        },
        {
          id: 'chiffres',
          title: 'Les Chiffres',
          icon: '🔢',
          color: '#FFD93D',
          bgColor: '#FFFDF0',
          activity: chiffres_fr,
        }
      ]
    },
    ar: {
      welcomeMsg: 'ماذا نريد أن نتعلم اليوم؟',
      categories: [
        {
          id: 'alphabet',
          title: 'الأبجدية',
          icon: 'أ-ب-ت',
          color: '#FF6B6B',
          bgColor: '#FFF0F0',
          activity: alphabet_ar,
        },
        {
          id: 'chiffres',
          title: 'الأرقام',
          icon: '🔢',
          color: '#FFD93D',
          bgColor: '#FFFDF0',
          activity: chiffres_ar,
        }
      ]
    }
  }
};

export function getContent(level, language) {
  return contentMap[level]?.[language] || contentMap[3].fr;
}

export function getCategory(level, language, categoryId) {
  const content = getContent(level, language);
  return content.categories.find(c => c.id === categoryId);
}

export default contentMap;
