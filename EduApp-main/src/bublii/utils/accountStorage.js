// Workspace data remains on this device, separated for each adult account.
let accountId = null;
export function setStorageAccount(id) { accountId = id || null; }
export const accountKey = key => accountId ? `boblii-account:${accountId}:${key}` : key;
export const accountDatabase = name => accountId ? `${name}:${accountId}` : name;
export const accountLocalStorage = {
  getItem: key => window.localStorage.getItem(accountKey(key)),
  setItem: (key, value) => window.localStorage.setItem(accountKey(key), value),
  removeItem: key => window.localStorage.removeItem(accountKey(key)),
};
export const accountSessionStorage = {
  getItem: key => window.sessionStorage.getItem(accountKey(key)),
  setItem: (key, value) => window.sessionStorage.setItem(accountKey(key), value),
  removeItem: key => window.sessionStorage.removeItem(accountKey(key)),
};
