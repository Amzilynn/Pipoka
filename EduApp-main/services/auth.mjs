import { createChildrenService } from './children.mjs';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, scrypt as derive, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const scrypt = promisify(derive);
const cookieName = 'boblii_session';
const digest = value => createHash('sha256').update(value).digest('hex');
const publicUser = row => ({ id: row.id, name: row.name, email: row.email, role: row.role });
const passwordHash = (password, salt) => scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
const tokenFrom = req => {
  const value = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  return /^[a-f0-9]{64}$/.test(value || '') ? value : null;
};

export function createAuthService({ databasePath = resolve('.data/auth.sqlite'), origin, secureCookies = origin?.startsWith('https://'), sessionMs = 7 * 86400000, rateLimit = 30 } = {}) {
  if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('parent','specialiste')), salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(email, role));
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);`);
  const attempts = new Map();
  let hashing = 0;
  const limited = key => {
    const now = Date.now();
    for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry);
    const value = attempts.get(key) || { count: 0, until: now + 15 * 60000 };
    value.count++; attempts.set(key, value);
    return value.count > rateLimit;
  };
  async function hash(password, salt) {
    if (hashing >= 4) throw Object.assign(new Error('Le service est occupé. Réessayez dans quelques instants.'), { status: 503 });
    hashing++;
    try { return await passwordHash(password, salt); } finally { hashing--; }
  }
  const send = (res, status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(body));
  };
  const setCookie = (res, token, maxAge) => res.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureCookies ? '; Secure' : ''}`);
  const currentUser = req => {
    const token = tokenFrom(req);
    if (!token) return null;
    return db.prepare('SELECT u.id, u.name, u.email, u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?').get(digest(token), Date.now()) || null;
  };
  const issueSession = (req, res, user) => {
    const old = tokenFrom(req);
    const token = randomBytes(32).toString('hex');
    db.exec('BEGIN IMMEDIATE');
    try {
      if (old) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(old));
      db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(Date.now());
      db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(token), user.id, Date.now() + sessionMs);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
    setCookie(res, token, Math.ceil(sessionMs / 1000));
  };
  async function body(req, limit = 8192) {
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw Object.assign(new Error('Format de requête invalide.'), { status: 415 });
    let data = '';
    let tooLarge = false;
    for await (const chunk of req) {
      if (tooLarge) continue;
      data += chunk;
      if (Buffer.byteLength(data) > limit) { tooLarge = true; data = ''; }
    }
    if (tooLarge) throw Object.assign(new Error('Requête trop volumineuse.'), { status: 413 });
    try { const value = JSON.parse(data); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); return value; }
    catch { throw Object.assign(new Error('Requête invalide.'), { status: 400 }); }
  }
  const validOrigin = req => req.headers.origin === (origin || `${req.socket.encrypted ? 'https' : 'http'}://${req.headers.host}`) && req.headers['sec-fetch-site'] !== 'cross-site';
  const handleChildren = createChildrenService({ db, currentUser, send, body, validOrigin, limited });
  async function handle(req, res, next = () => send(res, 404, { error: 'Page introuvable.' })) {
    const path = req.url?.split('?')[0];
    if (!path?.startsWith('/api/auth/') && path !== '/api/children' && !path?.startsWith('/api/children/')) return next();
    try {
      if (path.startsWith('/api/children')) return await handleChildren(req, res);
      if (path === '/api/auth/session' && req.method === 'GET') return send(res, 200, { user: currentUser(req) });
      if (req.method !== 'POST') return send(res, 405, { error: 'Méthode non autorisée.' });
      const expectedOrigin = origin || `${req.socket.encrypted ? 'https' : 'http'}://${req.headers.host}`;
      if (req.headers.origin !== expectedOrigin || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { error: 'Origine de la requête refusée.' });
      if (path === '/api/auth/logout') {
        const token = tokenFrom(req);
        if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(token));
        setCookie(res, '', 0);
        return send(res, 200, { user: null });
      }
      if (!['/api/auth/signup', '/api/auth/login'].includes(path)) return send(res, 404, { error: 'Page introuvable.' });
      if (limited(`ip:${req.socket.remoteAddress}`)) { res.setHeader('Retry-After', '900'); return send(res, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }); }
      const input = await body(req);
      const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
      const password = typeof input.password === 'string' ? input.password : '';
      const role = input.role;
      if (!['parent', 'specialiste'].includes(role) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length > 128) return send(res, 400, { error: 'Vérifiez votre adresse e-mail, votre mot de passe et votre espace.' });
      if (limited(`email:${email}:${role}`)) { res.setHeader('Retry-After', '900'); return send(res, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }); }
      if (path === '/api/auth/signup') {
        const name = typeof input.name === 'string' ? input.name.trim() : '';
        if (name.length < 2 || name.length > 80 || password.length < 12) return send(res, 400, { error: 'Indiquez votre nom (2 à 80 caractères) et un mot de passe de 12 caractères minimum.' });
        const salt = randomBytes(16).toString('hex');
        const hashed = await hash(password, salt);
        const user = { id: randomUUID(), name, email, role };
        try { db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,?)').run(user.id, name, email, role, salt, hashed.toString('hex'), Date.now()); }
        catch (error) {
          if (error.code?.startsWith('ERR_SQLITE') && db.prepare('SELECT id FROM users WHERE email=? AND role=?').get(email, role)) return send(res, 409, { error: 'Impossible de créer ce compte. Si vous êtes déjà inscrit, connectez-vous.' });
          throw error;
        }
        issueSession(req, res, user);
        return send(res, 201, { user });
      }
      const user = db.prepare('SELECT * FROM users WHERE email=? AND role=?').get(email, role);
      const hashed = await hash(password, user?.salt || '00000000000000000000000000000000');
      if (!user || !timingSafeEqual(hashed, Buffer.from(user.password_hash, 'hex'))) return send(res, 401, { error: 'Adresse e-mail ou mot de passe incorrect pour cet espace.' });
      issueSession(req, res, user);
      return send(res, 200, { user: publicUser(user) });
    } catch (error) {
      if (!res.headersSent) send(res, error.status || 500, { error: error.status ? error.message : 'Connexion indisponible. Réessayez dans quelques instants.' });
    }
  }
  return { handle, close: () => db.close() };
}

export function authPlugin(options = {}) {
  const attach = server => {
    const service = createAuthService(options);
    server.middlewares.use((req, res, next) => { void service.handle(req, res, next); });
    server.httpServer?.once('close', service.close);
  };
  return { name: 'boblii-auth', configureServer: attach, configurePreviewServer: attach };
}
