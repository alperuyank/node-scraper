const fs = require('fs');

/**
 * Save the data to a JSON file with additional checks and messages.
 * @param {Object} data - The data object containing product information and URL.
 * @param {string} jsonFilePath - The path to the JSON file where data will be saved.
 * @param {string} url - The URL to be included in the data.
 * @returns {Object} - An object containing a message and the count of 'logo-simple' images.
 */
function saveData(data, jsonFilePath, url) {
  let message = '';
  let photo = false;
  let counterLogoSimple = 0;

  // Ensure data contains the required properties
  if (!data || typeof data !== 'object' || !data.products || !Array.isArray(data.products.productList) || data.products.productList.length === 0) {
    message = `\nBilgiler gelmedi veya geçersiz veri. Dosya adı: ${jsonFilePath}`;
  } else {
    // Check for images and count 'logo-simple'
    data.products.productList.forEach(item => {
      if (item.image) {
        photo = true;
        if (typeof item.image === 'string' && item.image.includes('logo-simple')) {
          counterLogoSimple++;
        }
      }
    });

    // Check if there are missing images
    if (!photo) {
      message += '\nFotoğraflar eksik. Tekrar deneyin.';
    }

    // Check if enough non-'logo-simple' images are present
    if (data.products.productList.length / 2 > counterLogoSimple) {
      // Add the URL to the data and save to file
      const dataWithUrl = {
        url: url,
        restaurantInfo: data.productInfo,
        products: data.products
      };
      fs.writeFileSync(jsonFilePath, JSON.stringify(dataWithUrl, null, 2));
      message += '\nVeriler başarıyla kaydedildi.';
    } else {
      message += '\nYeterli sayıda "logo-simple" resmi bulunamadı.';
    }
  }

  return {
    message: message.trim(), // Return a trimmed message
    counterlogo: counterLogoSimple
  };
}

module.exports = { saveData };
