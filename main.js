const { chromium } = require('playwright');
const { extractData } = require('./functions/extractData');
const { saveData } = require('./functions/saveData');
const { scrollToBottom } = require('./functions/scrollToBottom');
const { config } = require('./functions/config');
const path = require('path');
const fs = require('fs');

(async () => {
  // Launch the browser with necessary configurations
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  // Create a new browser context with user agent and other settings
  const context = await browser.newContext({
    userAgent: config.userAgent,
    viewport: config.viewport,
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
  });

  // Add a script to modify navigator.webdriver
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // Create a new page in the context
  const page = await context.newPage();

  while (true) { // Infinite loop to keep the program running
    try {
      // Navigate to the target page
      await page.goto(' ', { waitUntil: 'networkidle' });

      // Wait for the page to load
       await page.waitForTimeout(3000);

      // Scroll to the bottom of the page to load all content
      await scrollToBottom(page);

      // Extract product data
      const products = await extractData(page);

      // Define the data directory path
      const dataFolder = path.join(__dirname, 'data');

      // Ensure the data directory exists
      if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
      }

      // Define the JSON file path
      const jsonFilePath = path.join(dataFolder, '.json');

      // Save the extracted data to a JSON file
      saveData(products, jsonFilePath);

      console.log(`Data written to ${jsonFilePath}`);

    } catch (error) {
      console.error('Error occurred:', error);
    }

    // Wait for 30 seconds before scraping again
    await page.waitForTimeout(30000);
  }

  // The browser won't be closed due to the infinite loop
  // await browser.close();
})();