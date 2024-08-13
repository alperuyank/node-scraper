const express = require('express');
const path = require('path');
const { startScraper } = require('../main');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

app.post('/scrape', async (req, res) => {
  const { url, jsonFileName } = req.body;

  if (!url || !jsonFileName) {
    return res.status(400).json({ error: 'URL and JSON file name are required' });
  }

  try {
    await startScraper(url, jsonFileName);
    res.status(200).json({ message: `Data successfully written to ${jsonFileName}.json` });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during scraping' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
