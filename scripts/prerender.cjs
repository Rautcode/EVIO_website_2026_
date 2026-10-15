// Pre-renders every URL in public/sitemap.xml into dist/<route>/index.html so search engines and
// link previews (WhatsApp, LinkedIn) get real HTML instead of an empty SPA shell.
// React still boots normally in the browser and takes over (createRoot replaces the snapshot).
//
// Usage: npm run build   (runs vite build, then this script)
// Needs: Edge or Chrome installed, and the API server running (blog/jobs content comes from it).
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const PORT = 4179;

const browser = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe', // first: Edge headless may return before rendering
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
].find(fs.existsSync);
if (!browser) throw new Error('No Edge/Chrome found for pre-rendering');

const routes = [...fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8').matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)]
    .map(m => m[1]);

const get = (url) => new Promise((resolve) => {
    http.get(url, (res) => { res.resume(); resolve(res.statusCode); }).on('error', () => resolve(0));
});

(async () => {
    // Keep the untouched SPA shell for routes that are not pre-rendered (e.g. /admin).
    fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '200.html'));

    const server = spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
    try {
        for (let i = 0; i < 40 && (await get(`http://localhost:${PORT}/`)) !== 200; i++) await new Promise(r => setTimeout(r, 500));
        if ((await get('http://localhost:5000/api/blogs')) !== 200) console.warn('! API server not reachable on :5000: blog/jobs content will be missing from snapshots');

        const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'evio-prerender-'));
        // Render everything before writing anything: the preview server must keep serving the
        // original shell as dist/index.html, or later pages inherit the home page's head tags.
        const pages = [];
        for (const route of routes) {
            const html = execFileSync(browser, [
                '--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profile}`,
                '--virtual-time-budget=10000', '--dump-dom', `http://localhost:${PORT}${route}`,
            ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 90000 });

            if (!html.includes('id="root"') || html.length < 5000) { console.warn('! skipped (empty render):', route); continue; }
            pages.push([route, html]);
            console.log('✓', route);
        }
        for (const [route, html] of pages) {
            const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, '<!doctype html>\n' + html.replace(/^<!DOCTYPE html>\s*/i, ''));
        }
        try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 }); } catch { /* temp profile still locked; harmless */ }
        console.log(`Pre-rendered ${pages.length}/${routes.length} pages`);
    } finally {
        server.kill();
    }
})();
