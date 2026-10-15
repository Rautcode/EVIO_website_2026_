// Renders brochure/evio-brochure.html to public/downloads/EVIO-Company-Brochure-2026.pdf
// using the locally installed Edge or Chrome (headless). Usage: node brochure/build.cjs
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const browsers = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe', // first: Edge headless may return before rendering
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
];
const browser = browsers.find(fs.existsSync);
if (!browser) throw new Error('No Edge/Chrome found to print the PDF');

const html = path.join(__dirname, 'evio-brochure.html');
const out = path.join(__dirname, '..', 'public', 'downloads', 'EVIO-Company-Brochure-2026.pdf');
// Own profile dir, so a browser window the user already has open can't swallow the job
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'evio-brochure-'));

fs.rmSync(out, { force: true });
try {
    execFileSync(browser, [
        '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--no-first-run',
        `--user-data-dir=${profile}`,
        '--virtual-time-budget=15000', // let Google Fonts and images load
        `--print-to-pdf=${out}`,
        'file:///' + html.replace(/\\/g, '/'),
    ], { stdio: 'inherit', timeout: 120000 });
} catch (err) {
    // Edge sometimes reports a non-zero exit even though printing continues; we verify below
    console.warn('Browser exited with', err.status ?? err.message);
}

// Edge can hand the print to a background process and return early: wait for a stable file
const waitUntil = Date.now() + 60000;
let lastSize = -1;
while (Date.now() < waitUntil) {
    const size = fs.existsSync(out) ? fs.statSync(out).size : -1;
    if (size > 0 && size === lastSize) break;
    lastSize = size;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
}
try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 }); } catch { /* temp profile still locked; harmless */ }
if (!fs.existsSync(out)) throw new Error('Browser did not write the PDF');
console.log('Wrote', out, `(${Math.round(fs.statSync(out).size / 1024)} KB)`);
