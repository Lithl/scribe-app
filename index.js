const express = require('express');

const app = express();

const whitelist = {
  'scribe.js': 'dist/scribe.js',
  'scribe.lib.js': 'dist/vendors~scribe.lib.js',
  'signin.js': '',
  'root.css': '',
  'toc.js': '',
  '': 'index.html',
  'favicon.ico': '',
  'privacy': 'privacy.html',
  'terms': 'terms.html',
};

app.use('/images', express.static('resources/images'));
for (const key in whitelist) {
  const file = whitelist[key] || key;
  app.get(`/${key}`, (req, res) => res.sendFile(`${__dirname}/${file}`));
}

app.listen(3002, () => console.log('Server running on port 3002'));

