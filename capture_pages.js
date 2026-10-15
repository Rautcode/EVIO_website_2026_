const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Auto-scroll function to trigger lazy-loaded images and GSAP scroll animations
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    });
}

(async () => {
    console.log('Starting browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });

    const pages = ['life-at-evio', 'services', 'projects', 'clients'];
    const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/31d12ea2-ddc2-453c-8293-a4c15308be75';

    for (const p of pages) {
        console.log(`Processing: ${p}`);
        await page.goto(`http://localhost:5173/${p}`, { waitUntil: 'networkidle0' });

        // Scroll to trigger animations
        await autoScroll(page);

        // Wait for animations to settle
        await new Promise(r => setTimeout(r, 2000));

        // Scroll back to top for screenshot
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 500));

        const imgPath = path.join(artifactDir, `${p}_screenshot.png`);
        await page.screenshot({ path: imgPath, fullPage: true });
        console.log(`Saved screenshot for ${p} at ${imgPath}`);
    }

    await browser.close();
    console.log('Done!');
})();
