const pattern = 'https:\\/\\/www\\.yemeksepeti\\.com\\/restaurant\\/(?:(?:.*\\/)?([^\\/]+))(?:\\/.*)?';

/**
 * Generates a file name from the given URL.
 * @param {string} path - The URL to extract the file name from.
 * @returns {string} - The generated file name.
 */
const fileNameGenerator = (path) => {
    const match = path.match(pattern);

    if (match && match[1]) {
        return match[1].replace('-', '');
    } else {
        console.error('URL does not match the expected pattern:', path);
        return '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url');
    const resultParagraph = document.getElementById('result');
    const fileInput = document.getElementById('fileInput');

    let restaurantUrls = [];
    let currentIndex = 0;

    async function scrapeUrl(url) {
        try {
            const response = await fetch('/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    jsonFileName: fileNameGenerator(url)
                }),
            });

            const result = await response.json();
            resultParagraph.innerText = result.message || result.error;
        } catch (error) {
            resultParagraph.innerText = `Error: ${error.message}`;
        }
    }

    async function scrapeNextUrl() {
        if (currentIndex >= restaurantUrls.length) {
            resultParagraph.textContent = 'All URLs have been processed.';
            return;
        }

        const currentUrl = restaurantUrls[currentIndex];
        urlInput.value = currentUrl;

        // Formu gönderin ve URL'yi işleyin
        await scrapeUrl(currentUrl);

        // URL'yi işledikten sonra bir süre bekleyin ve sonra bir sonraki URL'yi işleyin
        setTimeout(() => {
            currentIndex++;
            scrapeNextUrl();
        }, 5000); // 5 saniye bekleyin, gerekirse bu süreyi ayarlayın
    }

    // Formun submit olayını ele alın
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const url = urlInput.value;
        await scrapeUrl(url);
    });

    // Dosya seçildiğinde URL'leri yükle
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                restaurantUrls = content.split('\n').map(url => url.trim()).filter(Boolean);
                scrapeNextUrl(); // URL'leri işlemek için başlat
            };
            reader.readAsText(file);
        }
    });

    let matchingActive = false; // Eşleşme durumu

    document.getElementById('startButton').addEventListener('click', () => {
        const googleUrl = document.getElementById('google-url').value;
        if (googleUrl) {
            matchingActive = true;
            scrapeGoogleUrl([googleUrl]); // Eşleşecek URL'yi al ve scrape fonksiyonunu çağır
        } else {
            alert('Lütfen eşlemek için bir URL girin.');
        }
    });

    document.getElementById('stopButton').addEventListener('click', () => {
        matchingActive = false;
        document.getElementById('result').textContent = 'Eşleşme durduruldu.';
    });

    async function scrapeGoogleUrl(urls) {
        for (const url of urls) {
            if (!matchingActive) break; // Durdurulduysa döngüyü kır
            await scrapeUrl(url); // Her bir URL için scrapeUrl'i çağır
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 saniye bekleyin
        }
        if (matchingActive) {
            document.getElementById('result').textContent = 'Tüm Google URL\'leri işlenmiştir.';
        }
    }
});