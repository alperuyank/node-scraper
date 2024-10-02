const { chromium } = require('playwright');
const { extractData } = require('./functions/extractData');
const { saveData } = require('./functions/saveData');
const { scrollToBottom } = require('./functions/scrollToBottom');
const { config } = require('./functions/config');
const path = require('path');
const fs = require('fs');
const { extractDataInfo } = require('./functions/extractDataInfo');


async function startScraper(url, jsonFileName) {

  const dataFolder = path.join(__dirname, 'data');
  const jsonFilePath = path.join(dataFolder, `${jsonFileName}.json`);

  if (fs.existsSync(jsonFilePath)) {
    console.log(`File ${jsonFilePath} already exists. Skipping scraping.`);
    return { fileExists: true }; // Exit the function if file exists
  }

  const extUrl = 'buster-main/webpack.config.js';

  // Path to your extension
  const extensionPath = path.join(__dirname, extUrl);

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      `--load-extension=${extensionPath}`
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
    const productInfo = await extractDataInfo(page);

    const result = {
      productInfo,
      products
    };
    // console.log('Product Info:', JSON.stringify(result.productInfo, null, 2));
    // console.log('Products List:', JSON.stringify(result.products.productList, null, 2));

    // Ensure the data folder exists
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }

    // Save the extracted data along with the URL to a JSON file
    let saveResult = saveData(result, jsonFilePath, url);

    return {
      message: `\nVeriler ${jsonFilePath} dosyasına yazıldı \n${saveResult.message}`,
      logoSimple: `\nLogo simple sayısı: ${saveResult.counterlogo} `
    };

  } catch (error) {
    console.error('Error occurred during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { startScraper };
