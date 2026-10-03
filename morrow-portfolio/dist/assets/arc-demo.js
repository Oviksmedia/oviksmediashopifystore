(()=>{
 'use strict';
 const key='arc.demo.bag.v1';
 const catalog={silver:{name:'Brushed aluminium',price:42000,image:'assets/arc-silver.webp'},graphite:{name:'Graphite',price:44000,image:'assets/arc-graphite.webp'}};
 const $=id=>document.getElementById(id);
 const dialog=$('arc-bag'), form=$('arc-product-form'), lines=$('arc-bag-lines');
 const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
 let bag=[],persistent=true,recovery='',returnFocus=null;
 const validQuantity=value=>Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=20;
 function notice(){return persistent?'':' Storage is unavailable; this bag lasts only for this page session.';}
 function storageNotice(){if(!persistent)$('arc-storage-note').textContent='Storage is unavailable. Your demo bag works for this page session only. No checkout, real inventory or Shopify integration.';}
 function save(){try{if(persistent)localStorage.setItem(key,JSON.stringify(bag));}catch{persistent=false;storageNotice();}}
 try{
  const raw=localStorage.getItem(key);
  if(raw!==null){
   const parsed=JSON.parse(raw);
   if(!Array.isArray(parsed)||parsed.length>2)throw new Error('Invalid bag');
   const seen=new Set();
   for(const row of parsed){if(!row||!Object.hasOwn(catalog,row.id)||typeof row.qty!=='number'||!validQuantity(row.qty)||seen.has(row.id))throw new Error('Invalid bag');seen.add(row.id);}
   bag=parsed.map(row=>({id:row.id,qty:row.qty}));
  }
 }catch(error){
  if(error instanceof SyntaxError||error.message==='Invalid bag'){recovery='Saved demo bag data was invalid and has been reset.';save();}
  else{persistent=false;storageNotice();}
 }
 function announce(message){$('arc-bag-status').textContent=message+notice();}
 function count(){return bag.reduce((sum,row)=>sum+row.qty,0);}
 function render(){
  $('arc-count').textContent=count();lines.replaceChildren();
  if(!bag.length){const p=document.createElement('p');p.className='arc-empty-copy';p.textContent='Your demo bag is empty. Explore ARC 01 to choose a finish.';lines.append(p);}
  for(const row of bag){
   const product=catalog[row.id],article=document.createElement('article');article.className='arc-bag-line';
   article.innerHTML='<img width="84" height="100"><div><h3></h3><p class="arc-line-price"></p><div class="arc-bag-line-controls"><label>Quantity<input type="number" min="1" max="20" step="1" inputmode="numeric"></label><button type="button">Remove</button></div></div>';
   const img=article.querySelector('img');img.src=product.image;img.alt='ARC 01 in '+product.name.toLowerCase();
   article.querySelector('h3').textContent='ARC 01 / '+product.name;
   article.querySelector('.arc-line-price').textContent=money(product.price)+' each · '+money(product.price*row.qty)+' line total';
   const input=article.querySelector('input');input.value=row.qty;input.id='arc-line-'+row.id;input.setAttribute('aria-label','Quantity for '+product.name);
   input.addEventListener('change',()=>{
    if(!validQuantity(input.value)){input.value=row.qty;announce('Enter a whole quantity from 1 to 20. Previous quantity kept.');input.focus();return;}
    row.qty=Number(input.value);save();render();$('arc-line-'+row.id).focus();announce(product.name+' quantity updated to '+row.qty+'. Total '+$('arc-total').textContent+'.');
   });
   const remove=article.querySelector('button');remove.id='arc-remove-'+row.id;remove.setAttribute('aria-label','Remove '+product.name);
   remove.addEventListener('click',()=>{bag=bag.filter(x=>x.id!==row.id);save();render();const next=lines.querySelector('button');(next||$('arc-continue')).focus();announce(product.name+' removed. '+count()+' items remaining.');});
   lines.append(article);
  }
  $('arc-total').textContent=money(bag.reduce((sum,row)=>sum+catalog[row.id].price*row.qty,0))+' USD';
  $('arc-bag-summary').hidden=!bag.length;
 }
 function open(message){returnFocus=document.activeElement;render();dialog.showModal();$('arc-bag-close').focus();announce(message||recovery||('Demo bag opened. '+count()+' items.'));recovery='';}
 function close(){dialog.close();}
 $('arc-bag-open').addEventListener('click',()=>open());$('arc-bag-close').addEventListener('click',close);$('arc-continue').addEventListener('click',close);
 dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();});
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button,input,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 $('arc-empty').addEventListener('click',()=>{bag=[];save();render();$('arc-continue').focus();announce('Demo bag emptied.');});
 const views={silver:{src:catalog.silver.image,alt:'ARC 01 in brushed aluminium, shown in a three-quarter studio view.',caption:'Studio view / Brushed aluminium'},graphite:{src:catalog.graphite.image,alt:'The same ARC 01 lamp in satin graphite, with matching camera angle and scale.',caption:'Studio view / Graphite'},detail:{src:'assets/arc-detail.webp',alt:'Close-up of the brushed aluminium arch shoulder and warm recessed diffuser.',caption:'Detail / Brushed aluminium'}};
 function view(id){const item=views[id];$('arc-product-image').src=item.src;$('arc-product-image').alt=item.alt;$('arc-gallery-caption').textContent=item.caption;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===id)));$('arc-gallery-live').textContent=item.caption;}
 document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>view(button.dataset.view)));
 form.addEventListener('change',event=>{if(event.target.name!=='finish')return;const id=event.target.value,product=catalog[id];$('arc-finish-selected').textContent='— '+product.name;$('arc-price').replaceChildren(document.createTextNode(money(product.price)+' '));const note=document.createElement('span');note.textContent='USD · Illustrative price';$('arc-price').append(note);view(id);$('arc-form-status').textContent=product.name+' selected.';});
 form.addEventListener('submit',event=>{
  event.preventDefault();const id=new FormData(form).get('finish'),input=$('arc-quantity');
  if(!Object.hasOwn(catalog,id)){$('arc-form-status').textContent='Choose a finish before adding to your demo bag.';form.querySelector('input[name=finish]').focus();return;}
  if(!validQuantity(input.value)){$('arc-form-status').textContent='Enter a whole quantity from 1 to 20.';input.focus();return;}
  const qty=Number(input.value),existing=bag.find(x=>x.id===id);
  if((existing?.qty||0)+qty>20){$('arc-form-status').textContent='The demo limit is 20 of each finish. Adjust the quantity or your bag.';input.focus();return;}
  if(existing)existing.qty+=qty;else bag.push({id,qty});save();$('arc-form-status').textContent=qty+' '+catalog[id].name+' added to the demo bag.';open(qty+' '+catalog[id].name+' added. Total '+money(bag.reduce((s,r)=>s+catalog[r.id].price*r.qty,0))+' USD.');
 });
 $('arc-add').disabled=false;render();if(recovery)$('arc-form-status').textContent=recovery;
})();
