document.getElementById('scrape-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const url = document.getElementById('url').value;
    const jsonFileName = document.getElementById('jsonFileName').value;
  
    try {
      const response = await fetch('/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, jsonFileName }),
      });
  
      const result = await response.json();
      document.getElementById('result').innerText = result.message || result.error;
    } catch (error) {
      document.getElementById('result').innerText = 'Error occurred while scraping.';
    }
  });
  