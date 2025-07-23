const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const assetDir = path.join(__dirname, 'assets');

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Intercept specific resources
app.get('*', async (req, res, next) => {
  const urlPath = req.path;

  try {
    if (urlPath.endsWith('debugger.7de3a.js')) {
      return res.sendFile(path.join(assetDir, 'dibat.js'));
    }

    if (urlPath.endsWith('index.0d8e0.js')) {
      const configContent = fs.readFileSync('./config.txt', 'utf-8');
      res.setHeader('Content-Type', 'application/javascript');
      return res.send(configContent);
    }

    if (urlPath.endsWith('b6ba4.m4a')) {
      return res.sendFile(path.join(assetDir, 'Intro12.mp3'));
    }

    if (urlPath.endsWith('bg.jpg') || urlPath.endsWith('bg.44a58.jpg')) {
      return res.sendFile(path.join(assetDir, 'background.jpg'));
    }

    // Add more as needed...

    return next(); // not intercepted, go to proxy
  } catch (err) {
    console.error('File serve error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Proxy route using axios
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  const token = req.query.token || '';
  const phone = req.query.phone || '';

  if (!targetUrl) return res.status(400).send('Missing ?url param');

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'access-token': token,
        'lang': 'en',
        'phone-number': phone,
        'User-Agent': req.headers['user-agent']
      },
      responseType: 'stream'
    });

    // Set headers
    res.set(response.headers);
    response.data.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(502).send('Bad Gateway');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ WebView Proxy Server running with axios');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
