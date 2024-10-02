// extractData.js

async function extractData(page) {
  // Extract product data from the page without categories
  return await page.evaluate(() => {
    const productElements = document.querySelectorAll('li[data-testid="menu-product"]');
    const productList = [];

    productElements.forEach((element) => {
      const name = element.querySelector('[data-testid="menu-product-name"]')?.innerText.trim();
      const price = element.querySelector('[data-testid="menu-product-price"]')?.innerText.trim();
      const description = element.querySelector('[data-testid="menu-product-description"]')?.innerText.trim();
      const image = element.querySelector('[data-testid="menu-product-image"]')?.style.backgroundImage
        .replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

      productList.push({ name, price, description, image });
    });

    return {productList};
  });
}

module.exports = { extractData };
