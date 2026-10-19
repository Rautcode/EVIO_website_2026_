require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { db, initDb, DATA_DIR } = require('./database');
const { sendMail, getLeadEmail, getCareersEmail } = require('./mailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
    securityHeaders, limits, issueFormToken, spamGuard,
    setSession, clearSession, requireAdmin, sameOriginWrites, errorHandler, clip,
} = require('./security');

// Multipart limits: one file, few short fields (blocks oversized/abusive form payloads)
const FORM_LIMITS = { fileSize: 10 * 1024 * 1024, files: 1, fields: 20, fieldSize: 20 * 1024, parts: 25 };

// Multer Upload Configuration with Strict MimeType Filters
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: FORM_LIMITS,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents (.doc/.docx) are allowed.'));
        }
    }
});

// Temp must sit on the same disk as uploads/: RFQ files are moved (renamed) from one to the other
const tempDir = path.join(DATA_DIR, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// RFQ attachments are kept here (linked from the lead) so they survive an SMTP failure
const uploadsDir = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// RFQ Upload Configuration (Disk Storage)
const rfqStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add random bytes for security against overwriting
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${crypto.randomBytes(8).toString('hex')}-${cleanName}`);
    }
});

const rfqUpload = multer({
    storage: rfqStorage,
    limits: FORM_LIMITS,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        // Check extension mapping
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
        
        if (allowedTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, Word, and Excel documents are allowed. ZIP is not permitted.'));
        }
    }
});

const app = express();
app.disable('x-powered-by');
// Behind a reverse proxy / load balancer set TRUST_PROXY (e.g. 1) so rate limits see the real client IP.
const trustProxy = process.env.TRUST_PROXY;
app.set('trust proxy', trustProxy ? (Number.isNaN(Number(trustProxy)) ? trustProxy : Number(trustProxy)) : false);

// Secure CORS Origin Restrictions
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://evio.in',
    'https://www.evio.in',
    ...(process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(securityHeaders);
app.use(express.json({ limit: '100kb' }));
app.use(sameOriginWrites(allowedOrigins));

// Initialize Database
initDb();

// ==========================================
// UTILITIES & CUSTOM MIDDLEWARE
// ==========================================

// Health check for the host (Render). Registered before the rate limiter so frequent
// probes can never be throttled into a "service unhealthy" restart loop.
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Rate limits (always on; see security.js)
app.use('/api/', limits.api);

// Input Sanitization Helper to prevent HTML injection & Cross-Site Scripting (XSS)
const escapeHtml = (text) => {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// Safe error logger/sender to prevent stack trace leakages
const sendError = (res, err) => {
    console.error("API Error Stack:", err.stack || err.message);
    const isProd = process.env.NODE_ENV === 'production';
    const message = isProd ? 'An unexpected error occurred. Please try again later.' : err.message;
    res.status(500).json({ error: message });
};

// =======================
// AUTH API (HttpOnly cookie session, see security.js)
// =======================
// Same bcrypt cost as real hashes, so "unknown user" takes as long as "wrong password".
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10);

app.post('/api/auth/login', limits.login, async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (typeof username !== 'string' || typeof password !== 'string' || !password || password.length > 200) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.slice(0, 100));
        const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
        if (!user || !ok) {
            console.warn('Failed admin login', req.ip);
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        setSession(res, user);
        res.json({ username: user.username });
    } catch (err) {
        sendError(res, err);
    }
});

app.get('/api/auth/me', requireAdmin, (req, res) => res.json({ username: req.admin.username }));
app.post('/api/auth/logout', (req, res) => { clearSession(res); res.json({ success: true }); });

// Anti-spam token for the public forms (contact, RFQ, downloads, careers)
app.get('/api/form-token', issueFormToken);

// =======================
// INQUIRIES API (Leads)
// =======================
// Shared lead pipeline: validate -> save to DB -> notify by email.
// The DB row is the source of truth; an email failure is logged, never fatal,
// so a lead is not lost just because SMTP is down.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
// Stored attachment names are "<16 hex>-<clean original name>"
const originalName = (stored) => stored.slice(17);

const saveLead = async ({ body, emailSubject, extraHtml = '', file }) => {
    // Store raw text (React escapes on render); escape only when building email HTML.
    const raw = (v, max) => (v ?? '').toString().trim().slice(0, max);
    const lead = {
        name: raw(body.name, 200),
        email: raw(body.email, 200),
        company: raw(body.company, 200),
        phone: raw(body.phone, 50),
        projectType: raw(body.projectType || body.subject, 100),
        source: raw(body.source, 1000),
        message: raw(body.message, 5000),
    };
    if (!lead.name || !EMAIL_RE.test(lead.email)) {
        const err = new Error('Name and a valid email are required.');
        err.status = 400;
        throw err;
    }
    const h = Object.fromEntries(Object.entries(lead).map(([k, v]) => [k, escapeHtml(v)]));

    let attachmentPath = null;
    if (file) {
        attachmentPath = path.join(uploadsDir, file.filename);
        fs.renameSync(file.path, attachmentPath);
    }
    let info;
    try {
        info = db.prepare(
            'INSERT INTO inquiries (name, company, email, phone, projectType, source, message, attachment, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(lead.name, lead.company, lead.email, lead.phone, lead.projectType, lead.source, lead.message, file ? file.filename : null, new Date().toISOString());
    } catch (err) {
        if (attachmentPath) fs.unlink(attachmentPath, () => {});
        throw err;
    }
    const attachments = file ? [{ filename: file.originalname, path: attachmentPath }] : [];

    try {
        await sendMail({
            to: getLeadEmail(lead.projectType),
            subject: emailSubject(lead),
            html: `
                <h3>New Lead from evio.in</h3>
                <p><strong>Name:</strong> ${h.name}</p>
                <p><strong>Company:</strong> ${h.company || 'N/A'}</p>
                <p><strong>Email:</strong> ${h.email}</p>
                <p><strong>Phone:</strong> ${h.phone || 'N/A'}</p>
                <p><strong>Type:</strong> ${h.projectType || 'General'}</p>
                ${extraHtml}
                <p><strong>Source:</strong> ${h.source || 'Direct'}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${h.message || '-'}</p>
            `,
            attachments
        });
    } catch (err) {
        console.error(`Lead #${info.lastInsertRowid} saved, but notification email failed:`, err.message);
    }
    return info.lastInsertRowid;
};

const sendLeadError = (res, err) =>
    err.status === 400 ? res.status(400).json({ error: err.message }) : sendError(res, err);

// Public Endpoint - Simple lead (download gate, quick enquiries)
app.post('/api/inquiries', limits.forms, spamGuard, async (req, res) => {
    try {
        const id = await saveLead({
            body: req.body,
            emailSubject: (l) => `New EVIO Lead: ${l.projectType || 'General'} - ${l.company || l.name}`,
        });
        res.json({ success: true, id });
    } catch (err) {
        sendLeadError(res, err);
    }
});

// Public Endpoint - Enterprise RFQ with Document Upload
app.post('/api/rfq', limits.forms, rfqUpload.single('file'), spamGuard, async (req, res) => {
    try {
        // Verify File Signature (Magic Numbers) if file exists
        if (req.file) {
            const buffer = Buffer.alloc(8);
            const fd = fs.openSync(req.file.path, 'r');
            fs.readSync(fd, buffer, 0, 8, 0);
            fs.closeSync(fd);

            const hex = buffer.toString('hex').toUpperCase();

            // PDF: 25504446
            // Office (DOC/XLS): D0CF11E0 (legacy) or 504B0304 (OOXML / ZIP)
            if (!hex.startsWith('25504446') && !hex.startsWith('D0CF11E0') && !hex.startsWith('504B0304')) {
                fs.unlinkSync(req.file.path); // clean up
                return res.status(400).json({ error: 'File signature validation failed.' });
            }
        }

        const id = await saveLead({
            body: req.body,
            emailSubject: (l) => `Enterprise RFQ: ${l.projectType || 'General'} - ${l.company || l.name}`,
            extraHtml: `
                <p><strong>Capacity:</strong> ${escapeHtml(req.body.capacity) || 'N/A'}</p>
                <p><strong>Timeline:</strong> ${escapeHtml(req.body.timeline) || 'N/A'}</p>
                <p><strong>Attachment:</strong> ${req.file ? escapeHtml(req.file.originalname) : 'None'}</p>
            `,
            file: req.file,
        });

        res.json({ success: true, id });
    } catch (err) {
        sendLeadError(res, err);
    } finally {
        // Temp file is gone if saveLead moved it to uploads/; only rejected uploads remain
        if (req.file && fs.existsSync(req.file.path)) fs.unlink(req.file.path, () => {});
    }
});

// Public Endpoint - Submit Job Application
// Saved to the DB (+ resume to uploads/) before emailing, so an SMTP failure never loses a candidate.
const isPdfOrOffice = (buf) => ['25504446', 'D0CF11E0', '504B0304'].includes(buf.subarray(0, 4).toString('hex').toUpperCase());

app.post('/api/applications', limits.forms, upload.single('resume'), spamGuard, async (req, res) => {
    try {
        const raw = (v, max) => (v ?? '').toString().trim().slice(0, max);
        const a = {
            name: raw(req.body.name, 200),
            email: raw(req.body.email, 200),
            phone: raw(req.body.phone, 50),
            role: raw(req.body.role, 100),
            experience: raw(req.body.experience, 20),
            linkedin: raw(req.body.linkedin, 300),
            note: raw(req.body.note, 5000),
        };
        if (!a.name || !EMAIL_RE.test(a.email)) {
            return res.status(400).json({ error: 'Name and a valid email are required.' });
        }
        if (a.linkedin && !/^https?:\/\//i.test(a.linkedin)) {
            return res.status(400).json({ error: 'LinkedIn must be a full https:// link.' });
        }
        if (req.file && !isPdfOrOffice(req.file.buffer)) {
            return res.status(400).json({ error: 'Resume must be a PDF or Word document.' });
        }

        let resume = null;
        if (req.file) {
            resume = `${crypto.randomBytes(8).toString('hex')}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            fs.writeFileSync(path.join(uploadsDir, resume), req.file.buffer);
        }
        let info;
        try {
            info = db.prepare(
                'INSERT INTO applications (name, email, phone, role, experience, linkedin, note, resume, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).run(a.name, a.email, a.phone, a.role, a.experience, a.linkedin, a.note, resume, new Date().toISOString());
        } catch (err) {
            if (resume) fs.unlink(path.join(uploadsDir, resume), () => {});
            throw err;
        }

        const h = Object.fromEntries(Object.entries(a).map(([k, v]) => [k, escapeHtml(v)]));
        try {
            await sendMail({
                to: getCareersEmail(a.role),
                subject: `Job Application: ${a.role || 'General'} - ${a.name}`,
                html: `
                    <h3>New Job Application Received</h3>
                    <p><strong>Name:</strong> ${h.name}</p>
                    <p><strong>Email:</strong> ${h.email}</p>
                    <p><strong>Phone:</strong> ${h.phone || 'N/A'}</p>
                    <p><strong>Applied Role/Department:</strong> ${h.role || 'N/A'}</p>
                    <p><strong>Experience:</strong> ${h.experience || 'N/A'} years</p>
                    <p><strong>LinkedIn:</strong> ${h.linkedin || 'N/A'}</p>
                    <br/>
                    <p><strong>Cover Note:</strong></p>
                    <p style="white-space: pre-wrap;">${h.note || 'None provided'}</p>
                `,
                attachments: req.file ? [{ filename: req.file.originalname, content: req.file.buffer }] : []
            });
        } catch (err) {
            console.error(`Application #${info.lastInsertRowid} saved, but notification email failed:`, err.message);
        }

        res.json({ success: true, id: info.lastInsertRowid });
    } catch (err) {
        sendError(res, err);
    }
});

// Protected Endpoints - Applications inbox
app.get('/api/applications', requireAdmin, (req, res) => {
    try {
        res.json(db.prepare('SELECT * FROM applications ORDER BY date DESC').all());
    } catch (err) {
        sendError(res, err);
    }
});

app.get('/api/applications/:id/resume', requireAdmin, (req, res) => {
    try {
        const row = db.prepare('SELECT resume FROM applications WHERE id = ?').get(req.params.id);
        const file = row?.resume && path.join(uploadsDir, path.basename(row.resume));
        if (!file || !fs.existsSync(file)) return res.status(404).json({ error: 'No resume' });
        res.download(file, originalName(row.resume));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete('/api/applications/:id', requireAdmin, (req, res) => {
    try {
        const row = db.prepare('SELECT resume FROM applications WHERE id = ?').get(req.params.id);
        db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
        if (row?.resume) fs.unlink(path.join(uploadsDir, path.basename(row.resume)), () => {});
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

// Protected Endpoint - View leads
app.get('/api/inquiries', requireAdmin, (req, res) => {
    try {
        const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY date DESC').all();
        res.json(inquiries);
    } catch (err) {
        sendError(res, err);
    }
});

// Protected Endpoint - Move a lead through the pipeline / add notes
app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
    try {
        const { status, notes } = req.body;
        if (status !== undefined && !LEAD_STATUSES.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${LEAD_STATUSES.join(', ')}` });
        }
        const info = db.prepare(
            'UPDATE inquiries SET status = COALESCE(?, status), notes = COALESCE(?, notes), updatedAt = ? WHERE id = ?'
        ).run(status ?? null, notes === undefined ? null : String(notes).slice(0, 5000), new Date().toISOString(), req.params.id);
        if (!info.changes) return res.status(404).json({ error: 'Lead not found' });
        res.json(db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id));
    } catch (err) {
        sendError(res, err);
    }
});

// Protected Endpoint - Download a lead's RFQ attachment
app.get('/api/inquiries/:id/attachment', requireAdmin, (req, res) => {
    try {
        const row = db.prepare('SELECT attachment FROM inquiries WHERE id = ?').get(req.params.id);
        const file = row?.attachment && path.join(uploadsDir, path.basename(row.attachment));
        if (!file || !fs.existsSync(file)) return res.status(404).json({ error: 'No attachment' });
        res.download(file, originalName(row.attachment));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
    try {
        const row = db.prepare('SELECT attachment FROM inquiries WHERE id = ?').get(req.params.id);
        db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
        if (row?.attachment) fs.unlink(path.join(uploadsDir, path.basename(row.attachment)), () => {});
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

// =======================
// JOBS API (Careers)
// =======================
app.get('/api/jobs', (req, res) => {
    try {
        const jobs = db.prepare('SELECT * FROM jobs').all();
        res.json(jobs);
    } catch (err) {
        sendError(res, err);
    }
});

app.post('/api/jobs', requireAdmin, (req, res) => {
    try {
        const [title, dept, location, type] = ['title', 'dept', 'location', 'type'].map(k => clip(req.body[k], 120));
        if (!title || !dept || !location || !type) return res.status(400).json({ error: 'All job fields are required' });
        const info = db.prepare('INSERT INTO jobs (title, dept, location, type) VALUES (?, ?, ?, ?)')
            .run(title, dept, location, type);
        res.json({ id: info.lastInsertRowid, title, dept, location, type });
    } catch (err) {
        sendError(res, err);
    }
});

app.delete('/api/jobs/:id', requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

// =======================
// CSR API
// =======================
app.get('/api/csr', (req, res) => {
    try {
        const initiatives = db.prepare('SELECT * FROM csr_initiatives').all();
        res.json(initiatives);
    } catch (err) {
        sendError(res, err);
    }
});

app.post('/api/csr', requireAdmin, (req, res) => {
    try {
        const title = clip(req.body.title, 200), category = clip(req.body.category, 100), date = clip(req.body.date, 40);
        const description = clip(req.body.description, 5000), image = clip(req.body.image, 500);
        if (!title || !category || !date) return res.status(400).json({ error: 'Title, category and date are required' });
        const info = db.prepare('INSERT INTO csr_initiatives (title, category, date, description, image) VALUES (?, ?, ?, ?, ?)')
            .run(title, category, date, description, image);
        res.json({ id: info.lastInsertRowid, title, category, date, description, image });
    } catch (err) {
        sendError(res, err);
    }
});

app.delete('/api/csr/:id', requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM csr_initiatives WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

// =======================
// BLOGS API
// =======================
app.get('/api/blogs', (req, res) => {
    try {
        // Map database `headline` column to frontend property `title`
        const blogs = db.prepare('SELECT id, headline AS title, category, readTime, date, excerpt, image, content FROM blogs ORDER BY id DESC').all();
        res.json(blogs);
    } catch (err) {
        sendError(res, err);
    }
});

app.post('/api/blogs', requireAdmin, (req, res) => {
    try {
        // Handle input mapping if client submits title instead of headline
        const headlineText = clip(req.body.headline || req.body.title, 300);
        const category = clip(req.body.category, 100), readTime = clip(req.body.readTime, 40), date = clip(req.body.date, 40);
        const excerpt = clip(req.body.excerpt, 1000), image = clip(req.body.image, 500), content = clip(req.body.content, 100000);
        if (!headlineText) {
            return res.status(400).json({ error: 'Headline or title is required' });
        }
        const info = db.prepare('INSERT INTO blogs (headline, category, readTime, date, excerpt, image, content) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(headlineText, category, readTime, date, excerpt, image, content);
        res.json({ id: info.lastInsertRowid, title: headlineText, category, readTime, date, excerpt, image, content });
    } catch (err) {
        sendError(res, err);
    }
});

app.delete('/api/blogs/:id', requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

// =======================
// SETTINGS API
// =======================
app.get('/api/settings', requireAdmin, (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM settings').all();
        const settingsMap = rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
        res.json(settingsMap);
    } catch (err) {
        sendError(res, err);
    }
});

app.post('/api/settings', requireAdmin, (req, res) => {
    try {
        const settings = Object.fromEntries(Object.entries(req.body || {}).map(([k, v]) => [clip(k, 60), clip(v, 500)]));
        const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
        
        db.exec('BEGIN');
        try {
            for (const [key, value] of Object.entries(settings)) {
                stmt.run(value, key);
            }
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }
        res.json({ success: true });
    } catch (err) {
        sendError(res, err);
    }
});

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
// Express 5 passes listen errors (e.g. port already in use) to this callback instead of throwing
app.listen(PORT, (err) => {
    if (err) {
        console.error(`❌ Could not start on port ${PORT}: ${err.code === 'EADDRINUSE' ? 'port already in use (is another API server running?)' : err.message}`);
        process.exit(1);
    }
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
