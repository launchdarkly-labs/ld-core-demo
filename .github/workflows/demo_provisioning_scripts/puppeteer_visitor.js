const puppeteer = require('puppeteer');

const appUrl = process.argv[2];
const numVisits = parseInt(process.argv[3]) || 20;

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    page.on('pageerror', error => {
      console.log(`Frontend error captured: ${error.message}`);
    });
    
    console.log(`Visiting ${appUrl}/bank ${numVisits} times to generate observability errors...`);
    
    for (let i = 0; i < numVisits; i++) {
      try {
        await page.goto(`${appUrl}/bank`, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        await page.waitForTimeout(2000);
        
        if ((i + 1) % 5 === 0) {
          console.log(`Completed ${i + 1}/${numVisits} visits`);
        }
      } catch (err) {
        console.log(`Visit ${i + 1} failed: ${err.message}`);
      }
    }
    
    console.log('Browser visits completed');
    
  } catch (error) {
    console.error('Puppeteer error:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();

