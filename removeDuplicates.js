const fs = require('fs');

// 'input.txt' ve 'output.txt' dosya adlarını ihtiyacınıza göre değiştirin
const inputFile = 'input4.txt';
const outputFile = 'output.txt';

// Dosyayı okuyun
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Dosya okunamadı:', err);
        return;
    }

    // Satırlara ayırın ve tekrar edenleri tekilleştirin
    const lines = data.split('\n');
    const uniqueLines = [...new Set(lines)];

    // Tekilleştirilmiş satırları birleştirin
    const outputData = uniqueLines.join('\n');

    // Sonuçları dosyaya yazın
    fs.writeFile(outputFile, outputData, (err) => {
        if (err) {
            console.error('Dosya yazılamadı:', err);
        } else {
            console.log('Tekilleştirilmiş veriler', outputFile, 'dosyasına yazıldı.');
        }
    });
});
