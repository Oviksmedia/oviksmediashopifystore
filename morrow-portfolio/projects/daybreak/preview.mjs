import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('.',import.meta.url)));
const inherited=path.resolve(root,'../../dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
const shell=fragment=>'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DAYBREAK — design case study</title><link rel="icon" href="assets/daybreak-sun.svg"><link rel="stylesheet" href="assets/daybreak.css"><script src="assets/daybreak-case.js" defer></script></head><body style="margin:0;background:#fff5db">'+fragment+'</body></html>';
const server=http.createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://localhost');
 let pathname=decodeURIComponent(url.pathname),file,wrap=false;
 if(pathname==='/'||pathname==='/daybreak.html'||pathname==='/case.html'){file=path.join(root,'case.html');wrap=true;}
 else if(pathname==='/daybreak-demo.html'||pathname==='/demo.html')file=path.join(root,'demo.html');
 else if(pathname==='/index.html')file=path.join(inherited,'index.html');
 else if(pathname.startsWith('/assets/')||pathname.startsWith('/evidence/')){
 const owned=path.resolve(root,'.'+pathname);if(!owned.startsWith(root+path.sep))throw Error('Invalid path');
 try{await stat(owned);file=owned;}catch{file=path.resolve(inherited,'.'+pathname);if(!file.startsWith(inherited+path.sep))throw Error('Invalid path');}
 }else{res.writeHead(404);res.end('Not found');return;}
 let content=await readFile(file);if(wrap)content=shell(content.toString());
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(content);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(4402,'127.0.0.1',()=>console.log('DAYBREAK case: http://127.0.0.1:4402/daybreak.html | Demo: http://127.0.0.1:4402/daybreak-demo.html'));
