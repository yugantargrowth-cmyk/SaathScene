// Lightweight, zero-dependency Node.js development server for SaathScene
// Routes static files, assets, and /api/* serverless handlers
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import customerHandler from './api/customer-enquiry.js';
import companionHandler from './api/companion-apply.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  let reqPath = decodeURI(urlParts[0]);

  // Handle API Endpoints
  if (reqPath === '/api/customer-enquiry' || reqPath === '/api/customer-enquiry/') {
    return handleApiRequest(req, res, customerHandler);
  }
  if (reqPath === '/api/companion-apply' || reqPath === '/api/companion-apply/') {
    return handleApiRequest(req, res, companionHandler);
  }

  // Handle Clean URLs (e.g. /privacy -> /privacy.html)
  if (reqPath === '/') {
    reqPath = '/index.html';
  } else if (!path.extname(reqPath) && fs.existsSync(path.join(ROOT_DIR, `${reqPath}.html`))) {
    reqPath = `${reqPath}.html`;
  }

  // Check in ROOT_DIR first, then PUBLIC_DIR
  let filePath = path.join(ROOT_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, reqPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 fallback
    const notFoundPath = path.join(ROOT_DIR, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - SaathScene');
    }
  }
});

async function handleApiRequest(req, res, handler) {
  let bodyBuffer = '';
  req.on('data', chunk => {
    bodyBuffer += chunk;
  });

  req.on('end', async () => {
    try {
      if (bodyBuffer) {
        req.body = JSON.parse(bodyBuffer);
      }
    } catch (e) {
      req.body = bodyBuffer;
    }

    // Adapt res to Vercel/Express helper methods
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.end(JSON.stringify(data));
      return this;
    };

    try {
      await handler(req, res);
    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
    }
  });
}

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` SaathScene Ahmedabad Local Server Running!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` APIs Active: /api/customer-enquiry & /api/companion-apply`);
  console.log(`==================================================\n`);
});
