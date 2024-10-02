// extractDataInfo.js

async function extractDataInfo(page) {
    return await page.evaluate(async () => {
        // Önce butona tıklayın
        const button = document.querySelector('[data-testid="vendor-main-info-section-button"]');

        if (button) {
            button.click();
            // Modalin yüklenmesini bekleyin
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            console.log('Öğe bulunamadı');
            return { headline: 'Başlık bulunamadı', scheduleItem: 'Açılış zamanı bulunamadı', address: 'Adres bulunamadı' };
        }

        // Modal içeriğini alın
        const headlineElement = document.querySelector('.bds-c-modal__header__headlines');
        const scheduleItemElement = document.querySelector('[data-testid="vendor-schedule-item"]');
        const addressElement = document.querySelector('[data-testid="vendor-info-modal-vendor-address"]');
        const mersisNumberElement = document.querySelector('[data-testid="provider-info-mersis-number"]');
        const remAddressElement = document.querySelector('[data-testid="provider-info-rem-address"]');
        const listItems = document.querySelectorAll('.bds-c-breadcrumbs.main-info__breadcrumbs li');


        // Metin içeriklerini alın
        const headline = headlineElement ? headlineElement.textContent.trim() : 'Başlık bulunamadı';
        const scheduleItem = scheduleItemElement ? scheduleItemElement.textContent.trim() : 'Açılış zamanı bulunamadı';
        const address = addressElement ? addressElement.textContent.trim() : 'Adres bulunamadı';
        const ratingDiv = document.querySelector('.bds-c-rating.bds-c-rating--star-type-full');
        const spanElement = ratingDiv?.querySelector('.bds-c-rating__label-primary');
        const ratingText = spanElement?.textContent.trim();
        const ratingValue = parseFloat(ratingText);

        const mersisNumber = mersisNumberElement.textContent;
        const remAddress = remAddressElement.textContent;
        const secondListItem = listItems[1]; // İkinci <li>
        const linkElement = secondListItem.querySelector('a');
        const city = linkElement.textContent.trim();

        const vendorLogoDiv = document.querySelector('.main-info__vendor-logo');
        const img = vendorLogoDiv.querySelector('img');
        const logoUrl = img.src;



        return {logoUrl, city, address, headline, scheduleItem, ratingValue, mersisNumber, remAddress };
    });
}

module.exports = { extractDataInfo };
