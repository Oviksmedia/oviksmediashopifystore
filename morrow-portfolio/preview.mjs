import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORTFOLIO_PREVIEW_PORT || 4391);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');
const types = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ttf':'font/ttf', '.json':'application/json', '.txt':'text/plain; charset=utf-8'};
http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) {res.writeHead(403); res.end(); return;}
    const data = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404);
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port}`));
