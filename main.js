const { chromium } = require('playwright');
const { extractData } = require('./functions/extractData');
const { saveData } = require('./functions/saveData');
const { scrollToBottom } = require('./functions/scrollToBottom');
const { config } = require('./functions/config');
const path = require('path');
const fs = require('fs');

async function startScraper(url, jsonFileName) {
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    userAgent: config.userAgent,
    viewport: config.viewport,
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    await scrollToBottom(page);

    const products = await extractData(page);

    const dataFolder = path.join(__dirname, 'data');

    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }

    const jsonFilePath = path.join(dataFolder, `${jsonFileName}.json`);
    
    // Save the extracted data along with the URL to a JSON file
    saveData(products, jsonFilePath, url);

    console.log(`Data written to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { startScraper };
