const fs = require('fs');
const path = require('path');

// Path to the directories
const data1Dir = path.join(__dirname, 'data1');
const dataDir = path.join(__dirname, 'data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Function to process local JSON files and save the results
async function processJsonFiles() {
  try {
    // Read all JSON files in the data1 directory
    const files = fs.readdirSync(data1Dir).filter(file => file.endsWith('.json'));

    // Iterate over each file
    for (const file of files) {
      // Read the JSON file
      const filePath = path.join(data1Dir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // Here you might process jsonData directly instead of fetching
      // For example, if jsonData contains local file paths or data,
      // you can handle it accordingly

      // Define a placeholder for processed data
      const processedData = {
        ...jsonData,
        processed: true, // Add a flag or process data as needed
      };

      // Define the output file path in the data directory
      const outputFilePath = path.join(dataDir, `${path.basename(file, '.json')}-processed.json`);

      // Save the processed data to the new file
      fs.writeFileSync(outputFilePath, JSON.stringify(processedData, null, 2), 'utf-8');

      console.log(`Saved processed data to ${outputFilePath}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
processJsonFiles();
