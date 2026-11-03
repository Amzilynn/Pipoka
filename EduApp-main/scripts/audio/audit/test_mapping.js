
const AR_MAPPINGS = {
  'أحسنت!': 'bravo',
  'قلم': 'qalam',
  'كتاب': 'kitab',
  'محفظة': 'bag',
  'معلمة': 'teacher',
  'مدرسة': 'school',
  'أمي': 'mother', // I should add these
  'أبي': 'father',
};

const text = 'قلم';
const cleanText = text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
console.log(`Text: "${text}"`);
console.log(`Clean: "${cleanText}"`);
console.log(`Mapping: ${AR_MAPPINGS[cleanText]}`);
