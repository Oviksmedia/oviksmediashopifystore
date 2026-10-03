import {createRequire} from 'node:module';
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const sharp=require('sharp');
const b64=new URL('./evidence/daybreak-high-noon-source.b64',import.meta.url);
try {await writeFile(new URL('./evidence/daybreak-high-noon-original.png',import.meta.url),Buffer.from(await readFile(b64,'utf8'),'base64'));await unlink(b64);}catch(e){if(e.code!=='ENOENT')throw e;}
const data=JSON.parse(await readFile(new URL('./evidence/daybreak-media-source.json',import.meta.url)));
for(const source of data.sources){
  const width=source.slug==='campaign'?1536:900;
  await sharp(source.path).resize({width,withoutEnlargement:true}).webp({quality:87}).toFile(fileURLToPath(new URL('./assets/daybreak-'+source.slug+'.webp',import.meta.url)));
}
console.log('Four selected photographs optimized.');
