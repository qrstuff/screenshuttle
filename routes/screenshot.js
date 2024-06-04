// routes/screenshot.js
const express = require('express');
const captureContent = require('../capture');
const router = express.Router();

// Route to handle screenshot and PDF requests
router.get('/capture', async (req, res) => {
    const url = req.query.url;
    const fileType = req.query.type || 'png';  // Default to 'png' if not specified
    const selector = req.query.selector;
    const hideSelector = req.query.hideSelector;
    const width = parseInt(req.query.width) || 1920;  // Default to 1920 if not specified
    const height = parseInt(req.query.height) || 1080;  // Default to 1080 if not specified
    const fullpage = req.query.fullpage;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Validate file type
    if (!['png', 'jpeg', 'pdf'].includes(fileType)) {
        return res.status(400).send('Invalid file type. Only "png", "jpeg", and "pdf" are supported.');
    }

    // Validate width and height if the file type is not PDF
    if (fileType !== 'pdf' && (isNaN(width) || isNaN(height) || width <= 0 || height <= 0)) {
        return res.status(400).send('Invalid width or height values');
    }

    try {
        const contentBuffer = await captureContent(url, fileType, selector, hideSelector, width, height, fullpage);
        res.writeHead(200, {
            'Content-Type': fileType === 'pdf' ? 'application/pdf' : `image/${fileType}`,
            'Content-Length': contentBuffer.length
        });
        res.end(contentBuffer);
    } catch (err) {
        console.error('Error capturing content:', err);
        res.status(500).send(`Error capturing content: ${err.message}`);
    }
});

module.exports = router;
