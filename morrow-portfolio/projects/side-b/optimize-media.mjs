import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/runtime.cjs');
const sharp=require('sharp');
const provenance=JSON.parse(fs.readFileSync(path.join(root,'media-provenance.json'),'utf8'));
const summary=[];
for(const asset of provenance.assets){
 const output=path.join(root,asset.output), max=asset.name==='campaign'||asset.name==='detail'?1600:1100;
 await sharp(asset.sourcePath).resize({width:max,withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(output);
 const meta=await sharp(output).metadata();summary.push({asset:asset.output,width:meta.width,height:meta.height,bytes:fs.statSync(output).size});
}
fs.writeFileSync(path.join(root,'evidence/media-output.json'),JSON.stringify(summary,null,2));console.log(summary);
