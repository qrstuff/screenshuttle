// index.js
const express = require('express');
const app = express();
const port = 3000;

const screenshotRoute = require('./routes/screenshot');

// Use the screenshot route
app.use(screenshotRoute);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
