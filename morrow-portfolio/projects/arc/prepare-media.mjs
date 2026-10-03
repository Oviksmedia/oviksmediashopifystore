import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const here=new URL('.',import.meta.url);
const images={campaign:'exec-53aa2ccb-06de-49b1-9178-0e99475e0440.png',silver:'exec-b369edd8-3f4f-4a8e-9f58-98cd995f5c10.png',graphite:'exec-e596dda6-b874-47c6-ac80-87c8be933826.png'};
const evidence=[];
for(const [name,file] of Object.entries(images)){
 const source='C:/Users/Oviks/.codex/generated_images/01a0ff09-a143-7440-bfac-3ad13064c1c1/'+file;
 const output=new URL('assets/arc-'+name+'.webp',here);
 const meta=await sharp(source).resize({width:name==='campaign'?1536:1000,withoutEnlargement:true}).webp({quality:86}).toFile(fileURLToPath(output));
 evidence.push({name,source,output:'assets/arc-'+name+'.webp',...meta});
}
const detail=await fs.readFile(new URL('evidence/arc-detail-original.png',here));
const meta=await sharp(detail).resize({width:1200,withoutEnlargement:true}).webp({quality:86}).toFile(fileURLToPath(new URL('assets/arc-detail.webp',here)));
evidence.push({name:'detail',source:'Built-in imagegen returned image data; original saved to evidence/arc-detail-original.png',output:'assets/arc-detail.webp',...meta});
await fs.writeFile(new URL('evidence/arc-media-manifest.json',here),JSON.stringify(evidence,null,2));
console.log(evidence.map(x=>({name:x.name,width:x.width,height:x.height,bytes:x.size})));
