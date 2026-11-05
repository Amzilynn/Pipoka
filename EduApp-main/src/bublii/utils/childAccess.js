const KEY = 'boblii-child-access-v1';
export function readChildAccess() {
  try {
    const records = JSON.parse(localStorage.getItem(KEY)) || {};
    return Object.fromEntries(Object.entries(records).filter(([id, record]) => record?.child?.id === id && /^\d{8}$/.test(record.code)));
  } catch { return {}; }
}
export function registerChildAccess(child, rotate = false) {
  const records = readChildAccess();
  let code = records[child.id]?.code;
  if (!code || rotate) {
    do {
      const values = crypto.getRandomValues(new Uint32Array(2));
      code = Array.from(values, value => String(value % 10000).padStart(4, '0')).join('');
    } while (Object.values(records).some(record => record.code === code));
  }
  // Only the child's activity workspace is shared with child mode on this device.
  records[child.id] = { code, child: { id: child.id, firstName: child.firstName, age: child.age, settings: child.settings } };
  localStorage.setItem(KEY, JSON.stringify(records));
  return code;
}
export function childForCode(value) {
  const code = value.replace(/[\s-]/g, '');
  if (!/^\d{8}$/.test(code)) return null;
  return Object.values(readChildAccess()).find(record => record.code === code)?.child.id || null;
}
