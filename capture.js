// capture.js
const puppeteer = require('puppeteer');

async function captureContent(url, fileType, selector, hideSelector, width, height, fullpage) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width, height });

    await page.goto(url);
    
    // Hide the element with the hideSelector, if provided
    if (hideSelector) {
        await page.evaluate((hideSelector) => {
            const elements = document.querySelectorAll(hideSelector);
            elements.forEach(element => {
                element.style.visibility = 'hidden';
            });
        }, hideSelector);
    }

    let contentBuffer;
    if (fileType === 'pdf') {
        // Set PDF options
        const pdfOptions = {
            format: 'A4',
            printBackground: true
        };
        contentBuffer = await page.pdf(pdfOptions);
    } else {
        // Set the screenshot options based on file type and fullpage parameter
        const screenshotOptions = {
            type: fileType,
            fullPage: fullpage === 'true' || false // Capture full page if true, otherwise only visible part
        };

        if (fileType === 'jpeg') {
            screenshotOptions.quality = 80;  // Set quality for JPEG
        }

        if (selector) {
            const element = await page.$(selector);
            if (element) {
                contentBuffer = await element.screenshot(screenshotOptions);
            } else {
                throw new Error(`Element with selector "${selector}" not found`);
            }
        } else {
            contentBuffer = await page.screenshot(screenshotOptions);
        }
    }

    await browser.close();
    return contentBuffer;
}

module.exports = captureContent;
