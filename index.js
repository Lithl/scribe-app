const express = require('express');

const app = express();

app.use('/images', express.static('resources/images'));
app.get('/scribe.js', (req, res) => res.sendFile(`${__dirname}/dist/scribe.js`));
app.get('/scribe.lib.js', (req, res) => res.sendFile(`${__dirname}/dist/vendors~scribe.js`));
app.get('/signin.js', (req, res) => res.sendFile(`${__dirname}/signin.js`));
app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));
app.get('/favicon.ico', (req, res) => res.sendFile(`${__dirname}/favicon.ico`));

app.get('/privacy', (req, res) => res.sendFile(`${__dirname}/privacy.html`));
app.get('/terms', (req, res) => res.sendFile(`${__dirname}/terms.html`));

app.listen(3002, () => console.log('Server running on port 3002'));

