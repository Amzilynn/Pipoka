export async function childrenRequest(path = '', input) {
  let response;
  try { response = await fetch(`/api/children${path}`, { method: input === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: input === undefined ? {} : { 'Content-Type': 'application/json' }, body: input === undefined ? undefined : JSON.stringify(input) }); }
  catch { throw new Error('Le serveur est inaccessible. Réessayez.'); }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error || 'Impossible de retrouver vos enfants. Réessayez.');
  return data;
}
