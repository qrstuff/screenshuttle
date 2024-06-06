const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

async function capture(
  url,
  format,
  selector,
  exclude,
  width,
  height,
  fullpage,
) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width, height });

    await page.goto(url);

    if (exclude) {
      await page.evaluate((exclude) => {
        const elements = document.querySelectorAll(exclude);
        elements.forEach((element) => {
          element.style.visibility = "hidden";
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
        //options
        type: format,
        fullPage: fullpage === "true" || false,
      };

      if (format === "jpeg") {
        options.quality = 80; // Set quality for JPEG
      }

      if (selector) {
        const element = await page.$(selector);
        if (element) {
          buffer = await element.screenshot(options);
        } else {
          throw new Error(`Element with selector "${selector}" not found`);
        }
      } else {
        buffer = await page.screenshot(options);
      }
    }

    return buffer;
  } catch (error) {
    throw error; // Re-throw the error after logging it
  } finally {
    await browser?.close();
  }
}

module.exports = capture;
