// Emergency password reset when nobody can sign in to the admin panel.
// Run it on the server itself (locally, or in the Render shell):  node reset-password.js [username]
// Prints a new random password once, re-enables the account and signs it out everywhere.
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { db } = require('./database');

const username = (process.argv[2] || 'admin').toLowerCase();
const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (!user) {
    console.error(`No user called "${username}". Existing users: ${db.prepare('SELECT username FROM users').all().map(u => u.username).join(', ')}`);
    process.exit(1);
}
const password = crypto.randomBytes(12).toString('base64url');
db.prepare('UPDATE users SET passwordHash = ?, disabled = 0, tokenVersion = tokenVersion + 1 WHERE id = ?')
    .run(bcrypt.hashSync(password, 10), user.id);
db.prepare('INSERT INTO audit_log (at, username, action, target) VALUES (?, ?, ?, ?)')
    .run(new Date().toISOString(), 'server console', 'user.update', `${username}: password reset from server`);
console.log(`New password for "${username}": ${password}\nSign in, then change it under My account.`);
