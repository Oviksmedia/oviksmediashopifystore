import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const inherited=path.resolve(root,'../../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.json':'application/json'};
http.createServer((req,res)=>{
 let pathname; try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return}
 let file;
 if(pathname==='/'||pathname==='/side-b.html'){
  const content=fs.readFileSync(path.join(root,'case.html'),'utf8');
  res.writeHead(200,{'Content-Type':types['.html']});res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SIDE B — Oviks Media</title><link rel="stylesheet" href="assets/side-b.css"></head><body style="margin:0"><a class="sideb-skip" href="#main">Skip to content</a><main id="main">${content}</main></body></html>`);return;
 }
 if(pathname==='/side-b-demo.html')file=path.join(root,'demo.html');
 else if(pathname.startsWith('/assets/side-b'))file=path.resolve(root,'.'+pathname);
 else if(['/index.html','/morrow.html','/rift.html','/rift-demo.html'].includes(pathname)||pathname.startsWith('/assets/'))file=path.resolve(inherited,'.'+pathname);
 else {res.writeHead(404);res.end('Not found');return;}
 if(!file.startsWith(root+path.sep)&&!file.startsWith(inherited+path.sep)){res.writeHead(403);res.end();return;}
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4404,'127.0.0.1',()=>console.log('SIDE B case: http://127.0.0.1:4404/side-b.html — Shop: http://127.0.0.1:4404/side-b-demo.html'));
