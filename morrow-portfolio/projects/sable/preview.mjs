import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const inherited = path.resolve(root,'../../dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.ttf':'font/ttf','.json':'application/json','.jpg':'image/jpeg','.png':'image/png'};
function safe(base, relative) { const resolved = path.resolve(base,relative); return resolved.startsWith(base + path.sep) ? resolved : null; }
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    if(pathname === '/' || pathname === '/sable.html') {
      const fragment = await readFile(path.join(root,'case.html'),'utf8');
      res.writeHead(200,{'Content-Type':types['.html']});
      res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SABLE — Portfolio case study</title><link rel="stylesheet" href="assets/sable-case.css"></head><body style="margin:0"><main>${fragment}</main></body></html>`);return;
    }
    const relative = pathname === '/sable-demo.html' ? 'demo.html' : pathname.slice(1);
    let target = safe(root,relative); if(!target) throw new Error('Invalid path');
    let data;
    try {data = await readFile(target);} catch {target = safe(inherited,relative);if(!target)throw new Error('Invalid path');data=await readFile(target);}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.listen(4401,'127.0.0.1',()=>console.log('SABLE case: http://127.0.0.1:4401/sable.html\nSABLE demo: http://127.0.0.1:4401/sable-demo.html'));
