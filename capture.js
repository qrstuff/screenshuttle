const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function captureContent(url, fileType, selector, hideSelector, width, height, fullpage) {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

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

        return contentBuffer;
    } catch (error) {
        console.error('Error capturing content:', error);
        throw error;  // Re-throw the error after logging it
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
}

module.exports = captureContent;
