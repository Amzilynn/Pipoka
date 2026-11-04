// Local convenience unlock only. Production accounts need server-issued challenges,
// server-side verification and protected sessions. Never store biometric data here.
const prefix = 'bublii-device-v1:';
const bytes = buffer => new Uint8Array(buffer);
const encode = buffer => btoa(String.fromCharCode(...bytes(buffer)));
const decode = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
const challenge = () => crypto.getRandomValues(new Uint8Array(32));
export function readDevice(id) {
  try {
    const value = JSON.parse(localStorage.getItem(prefix + id));
    return value && typeof value.credential === 'string' && typeof value.key === 'string' ? value : null;
  } catch { return null; }
}
export function forgetDevice(id) { localStorage.removeItem(prefix + id); }
export async function deviceAvailable() {
  try {
    return Boolean(window.isSecureContext && window.PublicKeyCredential && navigator.credentials &&
      window.AuthenticatorAttestationResponse?.prototype.getPublicKey &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
  } catch { return false; }
}
export async function enrollDevice(child, signal) {
  const credential = await navigator.credentials.create({ signal, publicKey: {
    challenge: challenge(), rp: { name: 'Booblii' },
    user: { id: new TextEncoder().encode(String(child.id)), name: String(child.id), displayName: child.firstName },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
    attestation: 'none',
  } });
  const key = credential?.response.getPublicKey();
  if (!key || credential.response.getPublicKeyAlgorithm() !== -7) throw new Error('Unsupported key');
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
  const record = { credential: encode(credential.rawId), key: encode(key) };
  localStorage.setItem(prefix + child.id, JSON.stringify(record));
  return record;
}
// WebAuthn ECDSA signatures are DER encoded; Web Crypto expects r || s.
function rawSignature(buffer) {
  const data = bytes(buffer);
  if (data[0] !== 0x30 || data[1] !== data.length - 2 || data[2] !== 2) throw new Error('Invalid signature');
  const rLength = data[3];
  const sOffset = 4 + rLength;
  if (data[sOffset] !== 2) throw new Error('Invalid signature');
  const sLength = data[sOffset + 1];
  if (sOffset + 2 + sLength !== data.length) throw new Error('Invalid signature');
  const result = new Uint8Array(64);
  [data.slice(4, sOffset), data.slice(sOffset + 2)].forEach((value, index) => {
    if (value.length === 33 && value[0] === 0) value = value.slice(1);
    if (!value.length || value.length > 32) throw new Error('Invalid signature');
    result.set(value, index * 32 + 32 - value.length);
  });
  return result;
}
export async function unlockDevice(id, signal) {
  const record = readDevice(id);
  if (!record) throw new Error('No credential');
  const nonce = challenge();
  const credential = await navigator.credentials.get({ signal, publicKey: {
    challenge: nonce, allowCredentials: [{ id: decode(record.credential), type: 'public-key' }],
    userVerification: 'required',
  } });
  if (!credential || encode(credential.rawId) !== record.credential) throw new Error('Wrong credential');
  const response = credential.response;
  const client = JSON.parse(new TextDecoder().decode(response.clientDataJSON));
  const expected = encode(nonce).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (client.type !== 'webauthn.get' || client.challenge !== expected || client.origin !== location.origin || client.crossOrigin) throw new Error('Invalid client');
  const auth = bytes(response.authenticatorData);
  const rpHash = bytes(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(location.hostname)));
  if (auth.length < 37 || (auth[32] & 5) !== 5 || !rpHash.every((value, index) => auth[index] === value)) throw new Error('Invalid authenticator');
  const hash = bytes(await crypto.subtle.digest('SHA-256', response.clientDataJSON));
  const signed = new Uint8Array(auth.length + hash.length);
  signed.set(auth); signed.set(hash, auth.length);
  const key = await crypto.subtle.importKey('spki', decode(record.key), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
  const valid = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, rawSignature(response.signature), signed);
  if (!valid || signal.aborted) throw new Error('Verification failed');
  return true;
}
