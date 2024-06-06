const capture = require("./capture");

const handler = async (event) => {
  const query = event.queryStringParameters;
  const url = query.url;
  const format = query.format || "png";
  const selector = query.selector;
  const exclude = query.exclude;
  const width = parseInt(query.width) || 1920;
  const height = parseInt(query.height) || 1080;
  const fullpage = query.fullpage;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
    };
  }

  const supportedFormats = ["png", "jpeg", "pdf"];

  if (!supportedFormats.includes(format)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Invalid file type. Only supported formats are " +
          supportedFormats.join(","),
      }),
    };
  }

  if (
    format !== "pdf" &&
    (isNaN(width) || isNaN(height) || width <= 0 || height <= 0)
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid width or height values" }),
    };
  }

  try {
    const buffer = await capture(
      url,
      format,
      selector,
      exclude,
      width,
      height,
      fullpage,
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          format === "pdf" ? "application/pdf" : `image/${format}`,
        "Content-Length": buffer.length,
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error capturing content: ${err.message}`,
      }),
    };
  }
};

module.exports = { handler };
