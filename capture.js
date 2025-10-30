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
  // defaults if caller didn't pass width/height
  const viewportWidth = width || 430;
  const viewportHeight = height || 900;

  let lastErr = null;

  // Try a few times (helps transient network / race conditions)
  for (let attempt = 1; attempt <= 3; attempt++) {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });

      const page = await browser.newPage();

      // set viewport similar to card layout breakpoint
      await page.setViewport({ width: viewportWidth, height: viewportHeight });

      // mimic normal browser UA (avoid simple bot-blocking)
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36'
      );

      // navigate - use networkidle2 which is better for SPAs
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // robust wait for selector: ensure element exists AND is visible (height>0)
      if (selector) {
        const waitTimeout = 120000; // 120s
        try {
          await page.waitForFunction(
            (sel) => {
              const el = document.querySelector(sel);
              if (!el) return false;
              const style = window.getComputedStyle(el);
              // offsetParent !== null ensures element is actually rendered (not display:none)
              return (
                el.offsetParent !== null &&
                style.visibility !== 'hidden' &&
                el.offsetHeight > 0
              );
            },
            { timeout: waitTimeout },
            selector
          );
        } catch (err) {
          // capture small HTML preview to help debug in CloudWatch
          let htmlPreview = '';
          try {
            htmlPreview = (await page.content()).slice(0, 4000);
          } catch (ignored) {}
          console.error('Screenshuttle: selector wait failed', {
            url,
            selector,
            attempt,
            message: err.message,
            htmlPreview,
          });
          throw new Error(
            `Waiting for selector ${selector} failed: ${err.message}`
          );
        }
      }

      if (exclude?.length) {
        await page.evaluate((selectors) => {
          selectors.forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.style.visibility = 'hidden';
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

      // success - close browser and return buffer
      await browser.close();
      return buffer;
    } catch (err) {
      lastErr = err;
      try {
        await browser?.close();
      } catch (e) {
        // ignore close errors
      }

      // If not last attempt, exponential backoff before retry
      if (attempt < 3) {
        const backoffMs = 1000 * Math.pow(2, attempt); // 2s, 4s
        console.warn(
          `Screenshuttle: attempt ${attempt} failed, retrying after ${backoffMs}ms`,
          {
            url,
            selector,
            error: err.message,
          }
        );
        await new Promise((r) => setTimeout(r, backoffMs));
        continue; // next attempt
      }

      // last attempt -> rethrow
      console.error('Screenshuttle: all attempts failed', {
        url,
        selector,
        error: err.message,
      });
      throw err;
    }
  }

  // if somehow we exit loop without return (shouldn't happen)
  throw lastErr || new Error('Capture failed without specific error');
}

module.exports = capture;
