const captureContent = require('./capture');

module.exports.capture = async (event) => {
    const query = event.queryStringParameters;
    const url = query.url;
    const fileType = query.type || 'png';  // Default to 'png' if not specified
    const selector = query.selector;
    const hideSelector = query.hideSelector;
    const width = parseInt(query.width) || 1920;  // Default to 1920 if not specified
    const height = parseInt(query.height) || 1080;  // Default to 1080 if not specified
    const fullpage = query.fullpage;

    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL is required' }),
        };
    }

    // Validate file type
    if (!['png', 'jpeg', 'pdf'].includes(fileType)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid file type. Only "png", "jpeg", and "pdf" are supported.' }),
        };
    }

    // Validate width and height if the file type is not PDF
    if (fileType !== 'pdf' && (isNaN(width) || isNaN(height) || width <= 0 || height <= 0)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid width or height values' }),
        };
    }

    try {
        const contentBuffer = await captureContent(url, fileType, selector, hideSelector, width, height, fullpage);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': fileType === 'pdf' ? 'application/pdf' : `image/${fileType}`,
                'Content-Length': contentBuffer.length,
            },
            body: contentBuffer.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (err) {
        console.error('Error capturing content:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error capturing content: ${err.message}` }),
        };
    }
};
