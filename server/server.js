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
    const result = await startScraper(url, jsonFileName);

    if (result && result.fileExists) {
      res.status(200).json({ message: `Dosya ${jsonFileName}.json zaten var.` });
    } else {
      res.status(200).json
      (
        { 
          message: `${result.message} \n ${result.logoSimple}`
        }
      );
    }
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'An error occurred during scraping' });
  }
});

aapp.post('/find-data', async (req, res) => {
  try {
    const { url } = req.body; // Eşleşecek URL'yi al

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // data-copy dizinindeki bağlantıları oku
    const copyFilePath = path.join(__dirname, '../data-copy/collected_links.json');
    const linksData = JSON.parse(fs.readFileSync(copyFilePath, 'utf-8'));

    // URL'yi bul
    const foundLinks = linksData.filter(link => link.includes(url));

    if (foundLinks.length > 0) {
      res.status(200).json({ message: 'Found links:', links: foundLinks });
    } else {
      res.status(404).json({ message: 'No matching links found.' });
    }
  } catch (error) {
    console.error('Error during find-data:', error);
    res.status(500).json({ error: 'An error occurred during find-data' });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
