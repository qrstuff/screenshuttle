const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

async function capture({
  url,
  exclude,
  format,
  fullpage,
  selector,
  width,
  height,
}) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle0" });

    if (selector) {
      await page.waitForSelector(selector);
    }

    if (exclude?.length) {
      await page.evaluate((selectors) => {
        selectors.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.style.visibility = "hidden";
          }
        });
      }, exclude);
    }

    let buffer;
    if (format === "pdf") {
      buffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
    } else {
      const options = {
        type: format,
        fullPage: fullpage || false,
      };

      if (format === "jpeg") {
        options.quality = 80;
      }

      if (selector) {
        const element = await page.$(selector);
        if (!element) {
          throw new Error(`Element ${selector} could not be found.`);
        }

        buffer = await element.screenshot(options);
      } else {
        buffer = await page.screenshot(options);
      }
    }

    return buffer;
  } finally {
    await browser?.close();
  }
}

module.exports = capture;
