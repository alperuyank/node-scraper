// saveData.js

const fs = require('fs');

function saveData(data, jsonFilePath, url) {
  // Add the URL at the top of the data
  const dataWithUrl = {
    url: url,
    products: data
  };

  // Write the modified data to the JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(dataWithUrl, null, 2));
}

module.exports = { saveData };
