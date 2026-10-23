// Admin-panel APIs added after launch: user accounts & roles, activity log, image uploads,
// and case studies managed from the panel. Registered from server.js via registerAdminRoutes(app).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { db, DATA_DIR } = require('./database');
const { requireAdmin, requireRole, ROLES, setSession, clip } = require('./security');

const now = () => new Date().toISOString();
const MIN_PASSWORD = 12;
const USERNAME_RE = /^[a-z0-9._-]{3,40}$/;

// ---------------------------------------------------------------- activity log
const audit = (req, action, target = '') => {
    try {
        db.prepare('INSERT INTO audit_log (at, userId, username, action, target) VALUES (?, ?, ?, ?, ?)')
            .run(now(), req.admin?.id ?? null, req.admin?.username ?? null, action, clip(target, 300));
    } catch (err) { console.error('Audit log write failed:', err.message); } // never block the action itself
};

const publicUser = (u) => ({ id: u.id, username: u.username, role: u.role, disabled: !!u.disabled, createdAt: u.createdAt });
const bumpSessions = (id) => db.prepare('UPDATE users SET tokenVersion = tokenVersion + 1 WHERE id = ?').run(id);
const activeAdmins = () => db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND disabled = 0").get().n;

// ---------------------------------------------------------------- images
const MEDIA_DIR = path.resolve(DATA_DIR, 'media'); // absolute: res.sendFile requires it
fs.mkdirSync(MEDIA_DIR, { recursive: true });
// Raster formats only, identified by their bytes. SVG is refused: it can carry script.
const IMAGE_TYPES = [
    { ext: 'jpg', mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    { ext: 'png', mime: 'image/png', test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
    { ext: 'webp', mime: 'image/webp', test: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
];
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 5 } });

// ---------------------------------------------------------------- case studies
const SECTORS = ['Data Centers', 'Manufacturing', 'Chemical', 'Infrastructure', 'Commercial', 'Pharmaceuticals', 'Plastics', 'FMCG', 'Automobile & Ancillary', 'Engineering'];
const TEXT_FIELDS = { client: 150, projectName: 200, location: 150, sector: 60, facilityType: 150, capacity: 100, evioRole: 150, contractType: 100, duration: 100, mapCity: 80 };
const LIST_FIELDS = ['scope', 'equipment', 'technologies', 'challenges', 'outcomes'];
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// Whitelist + length caps. Image URLs must be our own uploads or site images, never arbitrary hosts.
const cleanProject = (body = {}) => {
    const p = {};
    for (const [k, max] of Object.entries(TEXT_FIELDS)) p[k] = clip(body[k], max).trim();
    for (const k of LIST_FIELDS) {
        p[k] = (Array.isArray(body[k]) ? body[k] : []).map(v => clip(v, 300).trim()).filter(Boolean).slice(0, 20);
    }
    p.images = (Array.isArray(body.images) ? body.images : [])
        .map(String).filter(u => /^\/(api\/media|images)\/[\w./-]+$/.test(u) && !u.includes('..')).slice(0, 12);
    if (!p.client || !p.projectName) throw Object.assign(new Error('Client and project name are required.'), { status: 400 });
    if (!SECTORS.includes(p.sector)) throw Object.assign(new Error(`Sector must be one of: ${SECTORS.join(', ')}`), { status: 400 });
    return p;
};
const rowToProject = (r) => ({ ...JSON.parse(r.data), id: r.slug, dbId: r.id, published: !!r.published, updatedAt: r.updatedAt });

const fail = (res, err) => err.status
    ? res.status(err.status).json({ error: err.message })
    : (console.error(err), res.status(500).json({ error: 'An unexpected error occurred.' }));

const registerAdminRoutes = (app) => {
    // ------------------------------------------------ own account
    app.post('/api/auth/password', requireAdmin, async (req, res) => {
        try {
            const { current, next } = req.body || {};
            if (typeof next !== 'string' || next.length < MIN_PASSWORD || next.length > 200) {
                return res.status(400).json({ error: `New password must be at least ${MIN_PASSWORD} characters.` });
            }
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.admin.id);
            if (!(await bcrypt.compare(String(current || ''), user.passwordHash))) {
                return res.status(400).json({ error: 'Current password is incorrect.' });
            }
            db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(await bcrypt.hash(next, 10), user.id);
            bumpSessions(user.id); // signs out every other device
            setSession(res, db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)); // keep this one signed in
            audit(req, 'password.change');
            res.json({ success: true });
        } catch (err) { fail(res, err); }
    });

    // ------------------------------------------------ users (admin only)
    app.get('/api/users', ...requireRole(), (req, res) => {
        res.json(db.prepare('SELECT * FROM users ORDER BY username').all().map(publicUser));
    });

    app.post('/api/users', ...requireRole(), async (req, res) => {
        try {
            const username = String(req.body?.username || '').trim().toLowerCase();
            const { password, role } = req.body || {};
            if (!USERNAME_RE.test(username)) return res.status(400).json({ error: 'Username: 3–40 characters, letters, numbers, dot, dash or underscore.' });
            if (!ROLES.includes(role)) return res.status(400).json({ error: `Role must be one of: ${ROLES.join(', ')}` });
            if (typeof password !== 'string' || password.length < MIN_PASSWORD || password.length > 200) {
                return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters.` });
            }
            if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) return res.status(409).json({ error: 'That username is taken.' });
            const info = db.prepare('INSERT INTO users (username, passwordHash, role, createdAt) VALUES (?, ?, ?, ?)')
                .run(username, await bcrypt.hash(password, 10), role, now());
            audit(req, 'user.create', `${username} (${role})`);
            res.json(publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid)));
        } catch (err) { fail(res, err); }
    });

    app.patch('/api/users/:id', ...requireRole(), async (req, res) => {
        try {
            const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            const { role, disabled, password } = req.body || {};
            const self = user.id === req.admin.id;
            const losesAdmin = user.role === 'admin' && !user.disabled && ((role && role !== 'admin') || disabled === true);
            if (self && (disabled === true || (role && role !== 'admin'))) return res.status(400).json({ error: 'You cannot disable or demote your own account.' });
            if (losesAdmin && activeAdmins() <= 1) return res.status(400).json({ error: 'There must always be at least one active admin.' });
            if (role !== undefined && !ROLES.includes(role)) return res.status(400).json({ error: `Role must be one of: ${ROLES.join(', ')}` });
            if (password !== undefined && (typeof password !== 'string' || password.length < MIN_PASSWORD || password.length > 200)) {
                return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters.` });
            }

            if (role !== undefined) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, user.id);
            if (disabled !== undefined) db.prepare('UPDATE users SET disabled = ? WHERE id = ?').run(disabled ? 1 : 0, user.id);
            if (password !== undefined) db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?').run(await bcrypt.hash(password, 10), user.id);
            if (!self) bumpSessions(user.id); // any change signs the user out so it takes effect immediately
            audit(req, 'user.update', `${user.username}: ${[role && `role=${role}`, disabled !== undefined && (disabled ? 'disabled' : 'enabled'), password && 'password reset'].filter(Boolean).join(', ')}`);
            res.json(publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)));
        } catch (err) { fail(res, err); }
    });

    app.delete('/api/users/:id', ...requireRole(), (req, res) => {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.id === req.admin.id) return res.status(400).json({ error: 'You cannot delete your own account.' });
        if (user.role === 'admin' && !user.disabled && activeAdmins() <= 1) return res.status(400).json({ error: 'There must always be at least one active admin.' });
        db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
        audit(req, 'user.delete', user.username);
        res.json({ success: true });
    });

    // ------------------------------------------------ activity log (admin only)
    app.get('/api/audit', ...requireRole(), (req, res) => {
        res.json(db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 500').all());
    });

    // ------------------------------------------------ images
    app.post('/api/media', ...requireRole('marketing'), imageUpload.single('image'), (req, res) => {
        const type = req.file && IMAGE_TYPES.find(t => t.test(req.file.buffer));
        if (!type) return res.status(400).json({ error: 'Upload a JPG, PNG or WebP image (max 5 MB).' });
        const name = `${crypto.randomBytes(12).toString('hex')}.${type.ext}`;
        fs.writeFileSync(path.join(MEDIA_DIR, name), req.file.buffer);
        audit(req, 'media.upload', name);
        res.json({ url: `/api/media/${name}` });
    });

    // Public: uploaded images are shown on the site. Names are random, so no listing or guessing.
    app.get('/api/media/:name', (req, res) => {
        const m = /^([a-f0-9]{24})\.(jpg|png|webp)$/.exec(req.params.name);
        const file = m && path.join(MEDIA_DIR, req.params.name);
        if (!file || !fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
        res.set({
            'Content-Type': IMAGE_TYPES.find(t => t.ext === m[2]).mime,
            'Cache-Control': 'public, max-age=31536000, immutable', // names never change content
        });
        res.sendFile(file);
    });

    // ------------------------------------------------ case studies
    app.get('/api/projects', (req, res) => {
        res.json(db.prepare('SELECT * FROM projects WHERE published = 1 ORDER BY id DESC').all().map(rowToProject));
    });

    app.get('/api/projects/all', ...requireRole('marketing'), (req, res) => {
        res.json(db.prepare('SELECT * FROM projects ORDER BY id DESC').all().map(rowToProject));
    });

    app.post('/api/projects', ...requireRole('marketing'), (req, res) => {
        try {
            const p = cleanProject(req.body);
            let slug = slugify(`${p.client} ${p.projectName}`) || 'project';
            if (db.prepare('SELECT 1 FROM projects WHERE slug = ?').get(slug)) slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;
            const info = db.prepare('INSERT INTO projects (slug, data, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)')
                .run(slug, JSON.stringify(p), req.body.published === false ? 0 : 1, now(), now());
            audit(req, 'project.create', slug);
            res.json(rowToProject(db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid)));
        } catch (err) { fail(res, err); }
    });

    app.put('/api/projects/:id', ...requireRole('marketing'), (req, res) => {
        try {
            const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
            if (!row) return res.status(404).json({ error: 'Case study not found' });
            const p = cleanProject(req.body);
            db.prepare('UPDATE projects SET data = ?, published = ?, updatedAt = ? WHERE id = ?')
                .run(JSON.stringify(p), req.body.published === false ? 0 : 1, now(), row.id);
            audit(req, 'project.update', row.slug);
            res.json(rowToProject(db.prepare('SELECT * FROM projects WHERE id = ?').get(row.id)));
        } catch (err) { fail(res, err); }
    });

    app.delete('/api/projects/:id', ...requireRole('marketing'), (req, res) => {
        const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        if (!row) return res.status(404).json({ error: 'Case study not found' });
        db.prepare('DELETE FROM projects WHERE id = ?').run(row.id);
        audit(req, 'project.delete', row.slug);
        res.json({ success: true });
    });
};

module.exports = { registerAdminRoutes, audit, SECTORS };
