import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
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
    await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle2' });
    console.log("Page loaded. Waiting 2 seconds...");
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if the service title exists
    const html = await page.content();
    if (html.includes('Precision')) {
        console.log("SUCCESS: Page rendered successfully. It includes the text 'Precision'.");
    } else {
        console.log("FAIL: Page appears blank or did not render the Services component.");
    }
  } catch (err) {
    console.error("Failed to load page:", err);
  } finally {
    await browser.close();
  }
})();
