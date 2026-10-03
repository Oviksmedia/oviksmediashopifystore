import {createRequire} from 'node:module';
import {readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require = createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const sharp = require('sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const provenance=JSON.parse(await readFile(path.join(root,'evidence/sable-media-provenance.json'),'utf8'));
for(const item of provenance.sources){
  const target=path.join(root,item.asset);
  await sharp(item.source).resize({width:item.id==='campaign'?1536:1120,withoutEnlargement:true}).webp({quality:85,effort:6}).toFile(target);
  const meta=await sharp(target).metadata();item.width=meta.width;item.height=meta.height;item.bytes=(await stat(target)).size;
}
await writeFile(path.join(root,'evidence/sable-media-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
console.log(provenance.sources.map(({id,width,height,bytes})=>({id,width,height,bytes})));
