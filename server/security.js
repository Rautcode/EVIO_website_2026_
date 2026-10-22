// Security middleware for the EVIO API: headers, rate limits, form anti-spam tokens,
// cookie-based admin sessions and CSRF origin checks. No extra dependencies.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const IS_PROD = process.env.NODE_ENV === 'production';

// Never fall back to a secret that is written in the source: anyone reading the code could
// forge admin tokens. Without JWT_SECRET we use a random per-process secret (sessions end on restart).
const JWT_SECRET = process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32
    ? process.env.JWT_SECRET
    : (() => {
        if (IS_PROD) { console.error('FATAL: JWT_SECRET must be set (32+ chars) in production.'); process.exit(1); }
        console.warn('⚠️  JWT_SECRET missing/short: using a random secret; admin sessions reset on restart.');
        return crypto.randomBytes(48).toString('hex');
    })();

const SESSION_COOKIE = 'evio_admin';
const SESSION_HOURS = 8;
const ISSUER = 'evio-api';

// ---------------------------------------------------------------- headers
const securityHeaders = (req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'Cache-Control': 'no-store',
    });
    if (IS_PROD) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
};

// ---------------------------------------------------------------- rate limiting
// ponytail: in-memory, per process. Use Redis/Cloudflare if the API ever runs on several instances.
const rateLimit = ({ windowMs, max, message, key = (req) => req.ip }) => {
    const hits = new Map();
    setInterval(() => {
        const cutoff = Date.now() - windowMs;
        for (const [key, times] of hits) {
            const recent = times.filter(t => t > cutoff);
            recent.length ? hits.set(key, recent) : hits.delete(key);
        }
    }, 60_000).unref();

    return (req, res, next) => {
        if (process.env.DISABLE_RATE_LIMIT === 'true' && !IS_PROD) return next();
        const k = key(req);
        const now = Date.now();
        const recent = (hits.get(k) || []).filter(t => now - t < windowMs);
        if (recent.length >= max) {
            res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
            return res.status(429).json({ error: message });
        }
        recent.push(now);
        hits.set(k, recent);
        next();
    };
};

const limits = {
    api: rateLimit({ windowMs: 15 * 60_000, max: 300, message: 'Too many requests. Please try again in a few minutes.' }),
    forms: rateLimit({ windowMs: 15 * 60_000, max: 8, message: 'Too many submissions. Please try again in 15 minutes or call us directly.' }),
    login: rateLimit({ windowMs: 15 * 60_000, max: 5, message: 'Too many login attempts. Please try again in 15 minutes.' }),
    // Site-wide caps. req.ip comes from X-Forwarded-For, which a caller hitting the Render URL directly
    // (bypassing Vercel) can forge, so per-IP limits alone can't stop a distributed brute force or form flood.
    loginGlobal: rateLimit({ windowMs: 15 * 60_000, max: 30, key: () => 'all', message: 'Login is temporarily locked. Please try again in 15 minutes.' }),
    formsGlobal: rateLimit({ windowMs: 15 * 60_000, max: 150, key: () => 'all', message: 'We are receiving unusually many submissions. Please call us or try again shortly.' }),
};

// ---------------------------------------------------------------- form anti-spam
// The page fetches a server-signed token when a form opens. On submit we require a valid
// signature, a minimum fill time (bots submit instantly) and an empty honeypot field.
const FORM_MIN_MS = 2500;
const FORM_MAX_MS = 6 * 60 * 60_000;
const sign = (value) => crypto.createHmac('sha256', JWT_SECRET).update(value).digest('base64url');

const issueFormToken = (req, res) => {
    const ts = String(Date.now());
    res.json({ token: `${ts}.${sign(ts)}` });
};

const spamGuard = (req, res, next) => {
    const { website, formToken } = req.body || {};
    // A rejected RFQ upload is already on disk in temp/; remove it whenever we stop here.
    const reject = () => { if (req.file?.path) require('fs').unlink(req.file.path, () => {}); };
    // Honeypot filled: almost certainly a bot. Pretend success so it doesn't retry.
    if (website) { reject(); console.warn('Spam blocked (honeypot)', req.ip, req.path); return res.json({ success: true }); }

    const [ts, sig] = String(formToken || '').split('.');
    // Compare byte lengths first: timingSafeEqual throws on unequal lengths (e.g. multi-byte junk)
    const got = Buffer.from(sig || ''), want = Buffer.from(sign(ts || ''));
    const valid = ts && got.length === want.length && crypto.timingSafeEqual(got, want);
    if (!valid) { reject(); return res.status(400).json({ error: 'This form has expired. Please refresh the page and try again.' }); }

    const age = Date.now() - Number(ts);
    if (age < FORM_MIN_MS) { reject(); console.warn('Spam blocked (too fast)', req.ip, req.path); return res.json({ success: true }); }
    if (age > FORM_MAX_MS) { reject(); return res.status(400).json({ error: 'This form has expired. Please refresh the page and try again.' }); }
    next();
};

// ---------------------------------------------------------------- admin session (HttpOnly cookie)
const parseCookies = (header = '') => Object.fromEntries(
    header.split(';').map(c => c.trim()).filter(Boolean).map(c => {
        const i = c.indexOf('=');
        try { return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))]; } catch { return [c.slice(0, i), '']; } // malformed %-escape
    })
);

const setSession = (res, user) => {
    const token = jwt.sign({ sub: String(user.id), username: user.username }, JWT_SECRET,
        { expiresIn: `${SESSION_HOURS}h`, issuer: ISSUER, algorithm: 'HS256' });
    res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,            // not readable by page scripts, so XSS can't steal it
        secure: IS_PROD,           // HTTPS only on the live site
        sameSite: 'strict',        // never sent on cross-site requests (CSRF)
        path: '/api',
        maxAge: SESSION_HOURS * 3600_000,
    });
};

const clearSession = (res) => res.clearCookie(SESSION_COOKIE, { path: '/api', httpOnly: true, secure: IS_PROD, sameSite: 'strict' });

let userExists = () => false;
const setUserLookup = (fn) => { userExists = fn; };

const requireAdmin = (req, res, next) => {
    const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
    if (!token) return res.status(401).json({ error: 'Not signed in' });
    try {
        const claims = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], issuer: ISSUER });
        // A deleted admin account loses access immediately, not when its token expires
        if (!userExists(Number(claims.sub))) throw new Error('user removed');
        req.admin = { id: Number(claims.sub), username: claims.username };
        next();
    } catch {
        clearSession(res);
        res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
};

// Defence in depth on top of SameSite: state-changing requests must come from our own origins.
const sameOriginWrites = (allowedOrigins) => (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) return res.status(403).json({ error: 'Cross-site request blocked' });
    next();
};

// ---------------------------------------------------------------- errors
// Turns upload/CORS/parse errors into short JSON instead of Express's HTML error page.
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err.name === 'MulterError' || /file type/i.test(err.message)) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 10 MB).' : err.message });
    if (err.message === 'Not allowed by CORS') return res.status(403).json({ error: 'Origin not allowed' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    console.error('Unhandled error:', err.stack || err.message);
    res.status(500).json({ error: IS_PROD ? 'An unexpected error occurred.' : err.message });
};

// Length-capped string for admin inputs
const clip = (v, max) => (v ?? '').toString().slice(0, max);

module.exports = {
    JWT_SECRET, securityHeaders, limits, issueFormToken, spamGuard,
    setSession, clearSession, requireAdmin, setUserLookup, sameOriginWrites, errorHandler, clip,
};
