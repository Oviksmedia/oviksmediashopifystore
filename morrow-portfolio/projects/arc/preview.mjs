import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.json':'application/json','.svg':'image/svg+xml'};
const shell=body=>'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ARC / Portfolio case study</title><link rel="stylesheet" href="assets/arc.css"></head><body style="margin:0"><main>'+body+'</main></body></html>';
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let relative=pathname.replace(/^\//,'');
  if(relative===''||relative==='arc.html'){res.setHeader('Content-Type',types['.html']);res.end(shell(await fs.readFile(path.join(root,'case.html'),'utf8')));return;}
  if(relative==='arc-demo.html')relative='demo.html';
  if(relative==='index.html'){res.setHeader('Content-Type',types['.html']);res.end(shell('<article class="arc-case"><section class="arc-case-intro" id="work"><p class="arc-kicker">Isolated module preview</p><h1>ARC</h1><p>The parent owns the combined portfolio overview.</p><a class="arc-text-link" href="arc.html">View ARC case study ↗</a><br><a class="arc-text-link" href="arc-demo.html">Explore ARC storefront ↗</a></section></article>'));return;}
  if(relative==='favicon.ico'){res.writeHead(204);res.end();return;}
  const target=path.resolve(root,relative);if(!target.startsWith(root+path.sep))throw new Error('Outside module');
  const bytes=await fs.readFile(target);res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(4403,'127.0.0.1',()=>console.log('ARC case: http://127.0.0.1:4403/arc.html\nARC demo: http://127.0.0.1:4403/arc-demo.html'));
