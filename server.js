// server.js

const express = require('express');
const request = require('request');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware: Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware: Intercept specific files (simulate shouldInterceptRequest)
app.get('*', (req, res, next) => {
  const urlPath = req.path;

  if (urlPath.endsWith('debugger.7de3a.js')) {
    return res.sendFile(path.join(__dirname, 'assets', 'dibat.js'));
  }

  if (urlPath.endsWith('index.0d8e0.js')) {
    const config = fs.readFileSync('./config.txt', 'utf-8');
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(config);
  }

  if (urlPath.endsWith('b6ba4.m4a')) {
    return res.sendFile(path.join(__dirname, 'assets', 'Intro12.mp3'));
  }

  if (urlPath.endsWith('bg.jpg') || urlPath.endsWith('bg.44a58.jpg')) {
    return res.sendFile(path.join(__dirname, 'assets', 'background.jpg'));
  }

  // If not intercepted, proceed to next middleware
  next();
});

// Proxy other requests to actual server
app.use('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL param');

  request({ url: targetUrl, headers: {
    'access-token': req.query.token || '',
    'lang': 'en',
    'phone-number': req.query.phone || '',
    'User-Agent': req.headers['user-agent']
  } }).pipe(res);
});

// Simple route for testing
app.get('/', (req, res) => {
  res.send('NodeJS WebView Emulator is running');
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
