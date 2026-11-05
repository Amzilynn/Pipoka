import { populateRepresentation } from './representation.mjs';
import { validateProfile } from './childProfile.mjs';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
const hash = value => createHash('sha256').update(value).digest('hex');

export function createChildrenService({ db, currentUser, send, body, validOrigin, limited }) {
  db.exec(`CREATE TABLE IF NOT EXISTS children (id TEXT PRIMARY KEY, first_name TEXT NOT NULL, age INTEGER, owner_id TEXT NOT NULL REFERENCES users(id), created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS child_members (child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY(child_id,user_id));
    CREATE TABLE IF NOT EXISTS child_invitations (code_hash TEXT PRIMARY KEY, child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE, target_role TEXT NOT NULL, expires_at INTEGER NOT NULL, used_at INTEGER);
    CREATE TABLE IF NOT EXISTS child_profiles (child_id TEXT PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE, details TEXT NOT NULL DEFAULT '{}', photo_data BLOB, photo_mime TEXT, revision INTEGER NOT NULL DEFAULT 0, updated_at TEXT);
    CREATE TABLE IF NOT EXISTS parent_child (user_id TEXT PRIMARY KEY REFERENCES users(id), child_id TEXT NOT NULL REFERENCES children(id));
    CREATE TABLE IF NOT EXISTS child_presets (child_id TEXT PRIMARY KEY REFERENCES children(id), preset_key TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS child_members_user ON child_members(user_id);`);
  const publicChild = (child, user) => ({ ...JSON.parse(child.details || '{}'), id: child.id, firstName: child.first_name, age: child.age, canInvite: child.owner_id === user.id, createdByRole: child.owner_role, presentationKey: child.preset_key || null, revision: child.revision || 0, updatedAt: child.updated_at || null, photoUrl: child.has_photo ? `/api/children/${child.id}/photo?v=${child.revision}` : null });
  const primary = user => {
    if (user.role !== 'parent') return null;
    let childId = db.prepare('SELECT child_id FROM parent_child WHERE user_id=?').get(user.id)?.child_id;
    if (!childId) {
      childId = db.prepare("SELECT c.id FROM children c JOIN child_members m ON m.child_id=c.id WHERE m.user_id=? ORDER BY CASE WHEN lower(c.first_name) LIKE 'peter%' THEN 0 ELSE 1 END,c.created_at,c.id LIMIT 1").get(user.id)?.id;
      if (childId) db.prepare('INSERT OR IGNORE INTO parent_child VALUES (?,?)').run(user.id, childId);
    }
    return childId;
  };
  const hasAccess = (childId, user) => (user.role !== 'parent' || primary(user) === childId) && Boolean(db.prepare('SELECT 1 FROM child_members WHERE child_id=? AND user_id=?').get(childId, user.id));
  const list = user => db.prepare("SELECT c.*, u.role AS owner_role, p.details, p.revision, p.updated_at, r.preset_key, length(p.photo_data)>0 AS has_photo FROM children c JOIN child_members m ON m.child_id=c.id JOIN users u ON u.id=c.owner_id LEFT JOIN child_profiles p ON p.child_id=c.id LEFT JOIN child_presets r ON r.child_id=c.id WHERE m.user_id=? AND COALESCE(r.preset_key,'') NOT IN ('lina','youssef') AND (?='specialiste' OR c.id=?) ORDER BY c.created_at,c.id").all(user.id, user.role, primary(user) || '').map(child => publicChild(child, user));
  return async function handleChildren(req, res) {
    const user = currentUser(req);
    if (!user) return send(res, 401, { error: 'Connectez-vous pour retrouver vos enfants.' });
    const path = req.url.split('?')[0];
    if (req.method === 'GET' && path === '/api/children') return send(res, 200, { children: list(user) });
    const photoMatch = /^\/api\/children\/([a-f0-9-]{36})\/photo$/.exec(path);
    if (req.method === 'GET' && photoMatch) {
      if (!hasAccess(photoMatch[1], user)) return send(res, 404, { error: 'Photo indisponible.' });
      const photo = db.prepare('SELECT p.photo_data,p.photo_mime FROM child_profiles p JOIN child_members m ON m.child_id=p.child_id WHERE p.child_id=? AND m.user_id=?').get(photoMatch[1], user.id);
      if (!photo?.photo_data) return send(res, 404, { error: 'Photo indisponible.' });
      res.writeHead(200, { 'Content-Type': photo.photo_mime, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Length': photo.photo_data.length });
      return res.end(Buffer.from(photo.photo_data));
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Méthode non autorisée.' });
    if (!validOrigin(req)) return send(res, 403, { error: 'Origine de la requête refusée.' });
    if (limited('children:' + user.id)) { res.setHeader('Retry-After', '900'); return send(res, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }); }
    const profileMatch = /^\/api\/children\/([a-f0-9-]{36})\/profile$/.exec(path);
    if (profileMatch) {
      const childId = profileMatch[1];
      if (!hasAccess(childId, user)) return send(res, 404, { error: 'Ce profil est indisponible.' });
      const input = await body(req, 400 * 1024);
      let profile;
      try { profile = validateProfile(input); } catch (error) { return send(res, 400, { error: error.message }); }
      db.exec('BEGIN IMMEDIATE');
      try {
        const old = db.prepare('SELECT * FROM child_profiles WHERE child_id=?').get(childId);
        if ((old?.revision || 0) !== profile.revision) { db.exec('ROLLBACK'); return send(res, 409, { error: 'Le profil a été modifié par un autre adulte. Fermez le formulaire, actualisez le profil et réessayez.' }); }
        db.prepare('UPDATE children SET first_name=?,age=? WHERE id=?').run(profile.firstName, profile.age, childId);
        db.prepare('INSERT INTO child_profiles (child_id,details,photo_data,photo_mime,revision,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(child_id) DO UPDATE SET details=excluded.details,photo_data=excluded.photo_data,photo_mime=excluded.photo_mime,revision=excluded.revision,updated_at=excluded.updated_at').run(childId, JSON.stringify({ ...JSON.parse(old?.details || '{}'), ...profile.details }), profile.photo === undefined ? old?.photo_data ?? null : profile.photo.data, profile.photo === undefined ? old?.photo_mime ?? null : profile.photo.mime, profile.revision + 1, new Date().toISOString());
        db.exec('COMMIT');
        const children = list(user);
        return send(res, 200, { child: children.find(child => child.id === childId), children });
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
    if (path === '/api/children/representation') {
      populateRepresentation(db, user, list(user));
      return send(res, 200, { children: list(user) });
    }
    if (path === '/api/children') {
      if (user.role === 'parent' && primary(user)) return send(res, 409, { error: 'Votre espace parent est consacré à votre enfant.' });
      const input = await body(req);
      const firstName = typeof input.firstName === 'string' ? input.firstName.trim() : '';
      const age = input.age === '' || input.age === null || input.age === undefined ? null : input.age;
      if (!firstName || firstName.length > 60 || /[<>\x00-\x1f]/.test(firstName) || (age !== null && (!Number.isInteger(age) || age < 0 || age > 25))) return send(res, 400, { error: 'Indiquez un prénom (60 caractères maximum) et un âge entre 0 et 25 ans, ou laissez l’âge vide.' });
      const child = { id: randomUUID(), first_name: firstName, age, owner_id: user.id, owner_role: user.role };
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('INSERT INTO children VALUES (?,?,?,?,?)').run(child.id, firstName, age, user.id, Date.now());
        db.prepare('INSERT INTO child_members VALUES (?,?)').run(child.id, user.id);
        if (user.role === 'parent') db.prepare('INSERT INTO parent_child VALUES (?,?)').run(user.id, child.id);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
      return send(res, 201, { child: publicChild(child, user), children: list(user) });
    }
    if (path === '/api/children/associate') {
      if (user.role === 'parent' && primary(user)) return send(res, 409, { error: 'Votre compte est déjà associé à votre enfant.' });
      const input = await body(req);
      const code = typeof input.code === 'string' ? input.code.replace(/[-\s]/g, '').toUpperCase() : '';
      if (!/^[A-F0-9]{24}$/.test(code)) return send(res, 400, { error: 'Code invalide ou expiré. Demandez un nouveau code à l’adulte qui a créé le profil.' });
      // Validate and consume atomically: the same invitation cannot link two accounts.
      db.exec('BEGIN IMMEDIATE');
      try {
        const invite = db.prepare('SELECT * FROM child_invitations WHERE code_hash=? AND used_at IS NULL AND expires_at>? AND target_role=?').get(hash(code), Date.now(), user.role);
        if (!invite) { db.exec('ROLLBACK'); return send(res, 400, { error: 'Code invalide ou expiré pour cet espace. Demandez un nouveau code.' }); }
        if (db.prepare('SELECT 1 FROM child_members WHERE child_id=? AND user_id=?').get(invite.child_id, user.id)) { db.exec('ROLLBACK'); return send(res, 409, { error: 'Cet enfant est déjà dans votre liste.' }); }
        db.prepare('INSERT INTO child_members VALUES (?,?)').run(invite.child_id, user.id);
        if (user.role === 'parent') db.prepare('INSERT INTO parent_child VALUES (?,?)').run(user.id, invite.child_id);
        db.prepare('UPDATE child_invitations SET used_at=? WHERE code_hash=?').run(Date.now(), hash(code));
        db.exec('COMMIT');
        return send(res, 200, { childId: invite.child_id, children: list(user) });
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
    const invitation = /^\/api\/children\/([a-f0-9-]{36})\/invitation$/.exec(path);
    if (invitation) {
      if (!hasAccess(invitation[1], user)) return send(res, 404, { error: 'Ce profil est indisponible.' });
      const child = db.prepare('SELECT * FROM children WHERE id=? AND owner_id=?').get(invitation[1], user.id);
      if (!child) return send(res, 404, { error: 'Ce profil ne vous permet pas de créer une invitation.' });
      const code = randomBytes(12).toString('hex').toUpperCase();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      const targetRole = user.role === 'parent' ? 'specialiste' : 'parent';
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('DELETE FROM child_invitations WHERE child_id=? AND used_at IS NULL').run(child.id);
        db.prepare('INSERT INTO child_invitations VALUES (?,?,?,?,NULL)').run(hash(code), child.id, targetRole, expiresAt);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
      return send(res, 201, { code: code.match(/.{4}/g).join('-'), expiresAt: new Date(expiresAt).toISOString(), targetRole });
    }
    return send(res, 404, { error: 'Page introuvable.' });
  };
}
