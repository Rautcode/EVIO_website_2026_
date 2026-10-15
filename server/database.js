const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcrypt');

// Initialize database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA busy_timeout = 5000');

// Create Tables
const initDb = () => {
    // 1. Jobs Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            dept TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL
        )
    `);

    // 2. CSR Initiatives Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS csr_initiatives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            image TEXT
        )
    `);

    // 3. Blog Posts Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            headline TEXT NOT NULL,
            category TEXT NOT NULL,
            readTime TEXT NOT NULL,
            date TEXT NOT NULL,
            excerpt TEXT,
            image TEXT,
            content TEXT
        )
    `);

    // 4. Settings Table (Key-Value pair)
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    `);

    // 5. Users Table for Admin Authentication
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL
        )
    `);

    // 6. Inquiries Table for Lead Management
    db.exec(`
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company TEXT,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT NOT NULL
        )
    `);

    // 7. Job Applications (resume file lives in server/uploads)
    db.exec(`
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            role TEXT,
            experience TEXT,
            linkedin TEXT,
            note TEXT,
            resume TEXT,
            date TEXT NOT NULL
        )
    `);

    // Additive migration: lead fields added after launch. Existing rows keep NULLs.
    const inquiryCols = db.prepare('PRAGMA table_info(inquiries)').all().map(c => c.name);
    const newCols = {
        phone: 'TEXT', projectType: 'TEXT', source: 'TEXT',
        // Lead pipeline
        status: "TEXT NOT NULL DEFAULT 'New'", notes: 'TEXT', attachment: 'TEXT', updatedAt: 'TEXT',
    };
    for (const [col, type] of Object.entries(newCols)) {
        if (!inquiryCols.includes(col)) db.exec(`ALTER TABLE inquiries ADD COLUMN ${col} ${type}`);
    }

    console.log('✅ SQLite Tables Initialized Successfully');

    // Seed Data if empty
    seedData();
};

const seedData = () => {
    // Check if jobs exist
    const jobCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
    if (jobCount === 0) {
        console.log('Seeding Jobs data...');
        const insertJob = db.prepare('INSERT INTO jobs (title, dept, location, type) VALUES (?, ?, ?, ?)');
        
        insertJob.run('Lead Automation Engineer', 'Engineering', 'Mumbai HQ', 'Full-time');
        insertJob.run('Senior Electrical Designer', 'Engineering', 'Pune', 'Full-time');
        insertJob.run('IoT Solutions Architect', 'IT', 'Bengaluru', 'Full-time');
        insertJob.run('Site Execution Supervisor', 'Operations', 'Mumbai HQ', 'Contract');
    }

    // Check if CSR exists
    const csrCount = db.prepare('SELECT COUNT(*) as count FROM csr_initiatives').get().count;
    if (csrCount === 0) {
        console.log('Seeding CSR data...');
        const insertCsr = db.prepare('INSERT INTO csr_initiatives (title, category, date, description, image) VALUES (?, ?, ?, ?, ?)');
        
        insertCsr.run(
            'Toranpada Village Electrification & Solar', 
            'Rural Infrastructure', 
            '2023-11', 
            'Provided solar irrigation modules and basic lighting to tribal homes, empowering local farming communities.',
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000'
        );
        insertCsr.run(
            '400+ Tree Plantation Drive', 
            'Environment', 
            '2024-02', 
            'Partnered with local NGOs to restore green cover around our Pune manufacturing facilities.',
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000'
        );
    }

    // Check if Settings exist
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
    if (settingsCount === 0) {
        console.log('Seeding Settings data...');
        const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
        insertSetting.run('emailDestination', 'hr@evio.in');
        insertSetting.run('crmWebhookUrl', '');
        insertSetting.run('spreadsheetSyncUrl', '');
    }

    // Check if Users exist
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount === 0) {
        console.log('Seeding Admin User...');
        // Never seed a password that is written in the source. Without ADMIN_PASSWORD we
        // generate one and print it once; change it after first login.
        let adminPass = process.env.ADMIN_PASSWORD;
        if (!adminPass) {
            adminPass = require('crypto').randomBytes(12).toString('base64url');
            console.warn(`⚠️  No ADMIN_PASSWORD set. Created admin user with one-time password: ${adminPass}`);
        }
        const passwordHash = bcrypt.hashSync(adminPass, 10);
        const insertUser = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');
        insertUser.run('admin', passwordHash);
    }

    // Blogs: real posts migrated from evio.in (server/seed/blogPosts.json).
    // Also removes the original placeholder posts from existing databases; admin-written posts are kept.
    db.prepare("DELETE FROM blogs WHERE content = 'Full article content goes here.'").run();
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get().count;
    if (blogCount === 0) {
        console.log('Seeding Blogs data...');
        const insertBlog = db.prepare('INSERT INTO blogs (headline, category, readTime, date, excerpt, image, content) VALUES (?, ?, ?, ?, ?, ?, ?)');
        // Oldest first, so the API's ORDER BY id DESC lists the newest post first
        for (const b of [...require('./seed/blogPosts.json')].reverse()) {
            insertBlog.run(b.headline, b.category, b.readTime, b.date, b.excerpt, b.image, b.content);
        }
    }
};

module.exports = {
    db,
    initDb
};
