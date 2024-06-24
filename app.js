const capture = require("./capture");

const OUTPUT_FORMATS = ["jpeg", "pdf", "png"];

const createErrorResponse = (statusCode, error) => ({
  statusCode,
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({ error }),
});

const handler = async (event) => {
  const body = event.body;
  const url = body.url;

  const exclude = body.exclude || [];
  const format = body.format || OUTPUT_FORMATS[0];
  const fullpage = !!body.fullpage;
  const selector = body.selector;

  const width = parseInt(body.width || 1920);
  const height = parseInt(body.height || 1080);

  if (!url) {
    return createErrorResponse(422, "URL field is required");
  }

  if (!OUTPUT_FORMATS.includes(format)) {
    return createErrorResponse(
      422,
      "Format field value must be one of " + OUTPUT_FORMATS.join(","),
    );
  }

  if (
    format !== "pdf" &&
    (isNaN(width) || isNaN(height) || width <= 0 || height <= 0)
  ) {
    return createErrorResponse(
      422,
      "Field width and height must be valid dimensions",
    );
  }

  try {
    const buffer = await capture({
      url,
      exclude,
      format,
      fullpage,
      selector,
      width,
      height,
    });
    return {
      statusCode: 200,
      headers: {
        "content-type":
          format === "pdf" ? "application/pdf" : `image/${format}`,
        "content-length": buffer.length,
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return createErrorResponse(
      422,
      err.message || "Error encountered while capturing screenshot.",
    );
  }
};

module.exports = { handler };
