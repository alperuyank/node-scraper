// scrollToBottom.js

async function scrollToBottom(page) {
    const distance = 250; // Distance to scroll (in pixels)
    const delay = 300;     // Delay between each scroll step (in milliseconds)
    let scrollAttempts = 0;
    const maxScrollAttempts = 50; // Max attempts to scroll
  
    // Initial scroll position
    let previousHeight = await page.evaluate('document.body.scrollHeight');
  
    while (scrollAttempts < maxScrollAttempts) {
      // Scroll down by the specified distance
      await page.evaluate((y) => window.scrollBy(0, y), distance);
  
      // Wait for content to load
      await page.waitForTimeout(delay);
  
      // Get the new scroll height
      const currentHeight = await page.evaluate('document.body.scrollHeight');
  
      // Check if the scroll height has increased
      if (currentHeight === previousHeight) {
        scrollAttempts++;
      } else {
        scrollAttempts = 0; // Reset attempts if new content is loaded
        previousHeight = currentHeight;
      }
    }
  
    console.log("Reached the bottom of the page");
  }
  
  module.exports = { scrollToBottom };
  