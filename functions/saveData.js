// saveData.js

const fs = require('fs');

// Save extracted data to a JSON file
function saveData(data, filePath) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing file', err);
  }
}

module.exports = { saveData };
