(()=>{
 'use strict';
 const products={
  night:{title:'Night Index',artist:'Mara Circuit',catalog:'SB—001 / Electronic',base:2800,image:'assets/side-b-night-product.webp',detail:'assets/side-b-night-detail.webp',cover:'assets/side-b-night-index-cover.png',description:'A fictional late-night electronic release imagined through angular loops and broken signals. Orange ink, concentric cuts and a yellow centre label carry the identity from sleeve to record.',tracks:['Night Index','Cross Signal','Last Connection','Until the Lights']},
  soft:{title:'Soft Static',artist:'Tender Relay',catalog:'SB—002 / Ambient',base:2600,image:'assets/side-b-soft-product.webp',detail:'assets/side-b-soft-static-cover.png',cover:'assets/side-b-soft-static-cover.png',description:'An imagined ambient record: slow textures, drifting signals. A yellow halftone cloud crosses a cobalt sleeve; the shared slab lettering keeps it part of the collection.',tracks:['Soft Static','Open Window','A Quiet Frequency','Long Exhale']},
  after:{title:'After Hours',artist:'Niko Vale',catalog:'SB—003 / Jazz',base:3000,image:'assets/side-b-after-product.webp',detail:'assets/side-b-after-hours-cover.png',cover:'assets/side-b-after-hours-cover.png',description:'An imagined jazz record built around loose rhythm and sharp edges. Stepped black bars create a visual rhythm against a pale green field.',tracks:['After Hours','Loose Meter','The Last Table','Small Morning']}
 };
 const formats={standard:'Black vinyl LP',art:'LP + cover print'};
 const key='sideb.demo.bag.v1';
 const money=cents=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(cents/100);
 const $=id=>document.getElementById(id);
 const productDialog=$('sideb-product-dialog'),bagDialog=$('sideb-bag-dialog');
 let bag=[],selected='night',storageMessage='',storageWorks=true;
 const unit=(p,f)=>products[p].base+(f==='art'?800:0);
 const validQty=q=>Number.isInteger(q)&&q>=1&&q<=9;
 function readBag(){
  try{
   const raw=localStorage.getItem(key); if(raw===null)return;
   const data=JSON.parse(raw);
   if(!data||data.version!==1||!Array.isArray(data.items)||data.items.length>6)throw new Error('Invalid bag');
   const seen=new Set();
   for(const item of data.items){
    if(!item||!Object.hasOwn(products,item.product)||!Object.hasOwn(formats,item.format)||!validQty(item.qty)||seen.has(item.product+':'+item.format))throw new Error('Invalid item');
    seen.add(item.product+':'+item.format);
   }
   bag=data.items.map(({product,format,qty})=>({product,format,qty}));
  }catch(error){
   bag=[];
   if(error.name==='SecurityError'||error.name==='QuotaExceededError'){storageWorks=false;storageMessage='Browser storage is unavailable. Your bag will work for this page visit, but will not persist.';}
   else{storageMessage='The saved demo bag was unreadable and has been reset. You can start a new bag.';try{localStorage.setItem(key,JSON.stringify({version:1,items:[]}))}catch{storageWorks=false;storageMessage+=' Browser storage is unavailable; changes last for this page visit only.';}}
  }
 }
 function save(){
  if(storageWorks)try{localStorage.setItem(key,JSON.stringify({version:1,items:bag}))}catch{storageWorks=false;storageMessage='Browser storage is unavailable. Your bag works for this page visit, but will not persist.';}
  showStorage(); updateCount();
 }
 function showStorage(){
  $('sideb-storage-status').textContent=storageMessage;
  $('sideb-bag-storage').textContent=storageMessage;$('sideb-bag-storage').hidden=!storageMessage;
 }
 function updateCount(){const count=bag.reduce((sum,item)=>sum+item.qty,0);$('sideb-count').textContent=String(count);$('sideb-bag-open').setAttribute('aria-label',`Open demo bag, ${count} ${count===1?'item':'items'}`);}
 const openers=new WeakMap();
 function open(dialog,opener=document.activeElement){openers.set(dialog,opener);dialog.showModal();document.body.classList.add('sideb-dialog-open');dialog.querySelector('[data-close]').focus();}
 function close(dialog){dialog.close();}
 for(const dialog of [productDialog,bagDialog]){
  dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>close(dialog)));
  dialog.addEventListener('close',()=>{if(document.querySelector('.sideb-dialog[open]'))return;document.body.classList.remove('sideb-dialog-open');const opener=openers.get(dialog);if(opener?.isConnected&&!opener.closest('dialog:not([open])'))opener.focus();else $('sideb-bag-open').focus();});
  dialog.addEventListener('keydown',event=>{
   if(event.key!=='Tab')return;
   const focusable=[...dialog.querySelectorAll('button,a[href],input,select,summary,[tabindex="0"]')].filter(el=>!el.disabled&&!el.hidden&&el.getClientRects().length);
   const first=focusable[0],last=focusable.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
 }
 function chooseView(view){
  const p=products[selected],front=view==='front';
  $('sideb-product-image').src=front?p.image:p.detail;
  $('sideb-product-image').alt=front?`${p.title}, physical sleeve and black vinyl concept`:`${p.title}, ${selected==='night'?'printed sleeve and vinyl label detail':'original flat cover artwork'}`;
  $('sideb-gallery-front').setAttribute('aria-pressed',String(front));$('sideb-gallery-detail').setAttribute('aria-pressed',String(!front));
  $('sideb-gallery-caption').textContent=front?'AI-generated physical study.':selected==='night'?'AI-generated material detail. Packaging may vary slightly.':'Original cover design / flat artwork.';
 }
 function showProduct(id,opener){
  selected=id; const p=products[id];
  $('sideb-product-title').textContent=p.title;$('sideb-product-artist').textContent=p.artist;$('sideb-product-catalog').textContent=p.catalog;$('sideb-product-description').textContent=p.description;
  $('sideb-tracks').replaceChildren(...p.tracks.map(title=>{const li=document.createElement('li');li.textContent=title;return li}));
  $('sideb-format').replaceChildren(new Option('Select format',''),...Object.entries(formats).map(([value,title])=>new Option(`${title} — ${money(unit(id,value))}`,value)));
  $('sideb-quantity').value='1';$('sideb-product-price').textContent=`From ${money(p.base)}`;$('sideb-product-status').textContent='';$('sideb-product-view-bag').hidden=true;
  $('sideb-format').removeAttribute('aria-invalid');$('sideb-quantity').removeAttribute('aria-invalid');
  $('sideb-gallery-detail').textContent=id==='night'?'Sleeve detail':'Flat cover art';
  $('sideb-product-dialog').querySelector('details').open=false;
  chooseView('front');open(productDialog,opener);
 }
 document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>showProduct(button.dataset.product,button)));
 document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>chooseView(button.dataset.view)));
 $('sideb-format').addEventListener('change',()=>{$('sideb-product-price').textContent=formats[$('sideb-format').value]?money(unit(selected,$('sideb-format').value)):`From ${money(products[selected].base)}`;$('sideb-format').removeAttribute('aria-invalid');$('sideb-product-status').textContent='';$('sideb-product-view-bag').hidden=true});
 $('sideb-product-form').addEventListener('submit',event=>{
  event.preventDefault();const format=$('sideb-format').value,qty=Number($('sideb-quantity').value),status=$('sideb-product-status');
  if(!Object.hasOwn(formats,format)){status.textContent='Choose a format before adding this record.';$('sideb-format').setAttribute('aria-invalid','true');$('sideb-format').focus();return}
  if(!validQty(qty)){status.textContent='Enter a whole quantity from 1 to 9.';$('sideb-quantity').setAttribute('aria-invalid','true');$('sideb-quantity').focus();return}
  const existing=bag.find(item=>item.product===selected&&item.format===format);
  if(existing&&existing.qty+qty>9){status.textContent='Your bag can hold up to 9 of each format. Reduce the quantity or update the bag.';return}
  if(existing)existing.qty+=qty;else bag.push({product:selected,format,qty});
  $('sideb-quantity').removeAttribute('aria-invalid');save();
  status.textContent=`Added ${qty} × ${products[selected].title}, ${formats[format]}.${storageWorks?' Saved in this browser.':' This visit only; browser storage is unavailable.'}`;
  $('sideb-product-view-bag').hidden=false;
 });
 function renderBag(focusKey){
  const items=$('sideb-bag-items');items.replaceChildren();
  if(!bag.length){const empty=document.createElement('div');empty.className='sideb-empty';const h=document.createElement('h3');h.textContent='A fresh sleeve.';const p=document.createElement('p');p.textContent='Your bag is empty. Explore the collection and choose a format to begin.';empty.append(h,p);items.append(empty)}
  for(const item of bag){
   const p=products[item.product],id=item.product+'-'+item.format;
   const row=document.createElement('article');row.className='sideb-bag-item';
   const img=document.createElement('img');img.src=p.cover;img.alt=p.title+' cover';img.width=90;img.height=90;
   const info=document.createElement('div');const heading=document.createElement('h3');heading.textContent=p.title;const meta=document.createElement('p');meta.textContent=`${p.artist} / ${formats[item.format]}`;const price=document.createElement('p');price.className='sideb-small';price.textContent=`${money(unit(item.product,item.format))} each`;
   const form=document.createElement('form');form.className='sideb-bag-update';form.noValidate=true;
   const label=document.createElement('label');label.htmlFor='sideb-qty-'+id;label.textContent='Quantity';
   const input=document.createElement('input');input.id=label.htmlFor;input.type='number';input.inputMode='numeric';input.min='1';input.max='9';input.step='1';input.value=String(item.qty);input.required=true;input.dataset.focus=id;input.setAttribute('aria-label',`Quantity for ${p.title}, ${formats[item.format]}`);input.setAttribute('aria-describedby','sideb-bag-status');
   const update=document.createElement('button');update.type='submit';update.textContent='Update';update.setAttribute('aria-label',`Update ${p.title}, ${formats[item.format]} quantity`);
   form.append(label,input,update);form.addEventListener('submit',event=>{event.preventDefault();const qty=Number(input.value);if(!validQty(qty)){$('sideb-bag-status').textContent='Enter a whole quantity from 1 to 9. Use Remove to take a record out.';input.setAttribute('aria-invalid','true');input.focus();return}item.qty=qty;save();renderBag(id);$('sideb-bag-status').textContent=`Updated ${p.title}, ${formats[item.format]} to ${qty}. Subtotal ${$('sideb-bag-total').textContent}.`});
   const remove=document.createElement('button');remove.className='sideb-remove';remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${p.title}, ${formats[item.format]}`);
   remove.addEventListener('click',()=>{bag=bag.filter(other=>other!==item);save();renderBag();$('sideb-bag-status').textContent=`Removed ${p.title}, ${formats[item.format]}.${bag.length?'':' Your bag is empty.'}`;bagDialog.querySelector('[data-close]').focus()});
   info.append(heading,meta,price,form,remove);const total=document.createElement('strong');total.className='sideb-line-total';total.textContent=money(unit(item.product,item.format)*item.qty);row.append(img,info,total);items.append(row);
  }
  $('sideb-bag-total').textContent=money(bag.reduce((sum,item)=>sum+unit(item.product,item.format)*item.qty,0));
  if(focusKey)items.querySelector(`[data-focus="${focusKey}"]`)?.focus();
 }
 function showBag(opener){renderBag();showStorage();$('sideb-bag-status').textContent='';open(bagDialog,opener)}
 $('sideb-bag-open').addEventListener('click',event=>showBag(event.currentTarget));
 $('sideb-product-view-bag').addEventListener('click',()=>{const opener=openers.get(productDialog);close(productDialog);showBag(opener)});
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;let visible=0;
  document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  document.querySelectorAll('.sideb-record').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.genre!==filter;if(!card.hidden)visible++});
  $('sideb-filter-status').textContent=`${visible} ${visible===1?'record':'records'}${filter==='all'?'':` / ${filter}`}`;
 }));
 readBag();updateCount();showStorage();
})();
