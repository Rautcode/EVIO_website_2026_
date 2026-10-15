import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle0' });
    
    console.log("Scrolling page to trigger GSAP animations...");
    // Auto-scroll function
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    // Wait a sec for animations to settle
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Page loaded and animated. Taking screenshot...");
    await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/scratch/evio-website/contact_screenshot.png', fullPage: true });
    console.log("Screenshot saved.");
  } catch (err) {
    console.error("Failed to load page:", err);
  } finally {
    await browser.close();
  }
})();
