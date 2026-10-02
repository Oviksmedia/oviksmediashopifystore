import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
http.createServer((req,res)=>{const pathname=new URL(req.url,'http://127.0.0.1').pathname;const file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{const data=fs.readFileSync(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(4391,'127.0.0.1',()=>console.log('Portfolio preview: http://127.0.0.1:4391'));
