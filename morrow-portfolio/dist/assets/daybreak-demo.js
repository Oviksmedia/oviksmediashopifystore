(() => {
'use strict';
const KEY='oviks-daybreak-demo-bag-v1';
const products={'day-one':{name:'Day One',price:1600,image:'day-one'},'high-noon':{name:'High Noon',price:1800,image:'high-noon'},'after-hours':{name:'After Hours',price:1600,image:'after-hours'}};
const grinds={'whole-bean':'Whole bean',filter:'Ground for filter',espresso:'Ground for espresso','french-press':'Ground for French press'};
const $=id=>document.getElementById('daybreak-'+id);
const dialog=$('bag'),items=$('items'),feedback=$('feedback');
let bag=[],persistent=true,storageNote='',opener=null;
const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const key=line=>line.product+':'+line.grind;
function valid(raw){
 if(!Array.isArray(raw)||raw.length>12)return false;
 const seen=new Set();
 return raw.every(x=>{
  if(!x||typeof x!=='object'||Array.isArray(x)||!Object.hasOwn(products,x.product)||!Object.hasOwn(grinds,x.grind)||!Number.isInteger(x.qty)||x.qty<1||x.qty>12||seen.has(key(x)))return false;
  seen.add(key(x));return true;
 });
}
function load(){
 try{
  const raw=localStorage.getItem(KEY);
  if(raw===null){bag=[];return;}
  const parsed=JSON.parse(raw);
  if(!valid(parsed))throw new SyntaxError('Invalid demo bag');
  bag=parsed.map(({product,grind,qty})=>({product,grind,qty}));
 }catch(error){
  if(error instanceof SyntaxError){bag=[];storageNote='The saved demo bag was unreadable and has been reset.';save();}
  else{persistent=false;storageNote='Browser storage is unavailable. Your demo bag works for this visit only.';}
 }
}
function save(){
 if(!persistent)return;
 try{localStorage.setItem(KEY,JSON.stringify(bag));}
 catch{persistent=false;storageNote='Browser storage is unavailable. Your demo bag works for this visit only.';}
}
function announce(text){feedback.textContent=text;}
function render(){
 $('count').textContent=String(bag.reduce((sum,x)=>sum+x.qty,0));
 $('open').setAttribute('aria-label','Open demo bag, '+$('count').textContent+' items');
 $('storage').textContent=storageNote||'Saved only in this browser. You can empty it at any time.';
 items.replaceChildren();
 if(!bag.length){const p=document.createElement('p');p.className='daybreak-empty-state';p.textContent='A good day starts with a choice. Your demo bag is empty.';items.append(p);}
 for(const line of bag){
  const product=products[line.product],article=document.createElement('article');
  article.className='daybreak-bag-line';
  // Interpolated strings below are drawn only from validated catalog keys, fixed labels and integers.
  article.innerHTML='<img src="assets/daybreak-'+product.image+'.webp" width="68" height="78" alt=""><div><h3>'+product.name+'</h3><p>'+grinds[line.grind]+' · 250 g · '+money(product.price)+' each</p><div class="daybreak-line-controls"><label for="daybreak-qty-'+line.product+'-'+line.grind+'">Quantity</label><input id="daybreak-qty-'+line.product+'-'+line.grind+'" data-daybreak-key="'+key(line)+'" type="number" min="1" max="12" step="1" value="'+line.qty+'" aria-label="Quantity for '+product.name+', '+grinds[line.grind]+'"><button type="button" data-daybreak-remove="'+key(line)+'" aria-label="Remove '+product.name+', '+grinds[line.grind]+'">Remove</button><strong>'+money(product.price*line.qty)+'</strong></div></div>';
  items.append(article);
 }
 $('total').textContent=money(bag.reduce((sum,x)=>sum+products[x.product].price*x.qty,0));
 $('empty').hidden=bag.length===0;
}
function open(source,message){
 opener=source;render();
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';}
 $('close').focus();announce(message||'Review your selected roasts and quantities.');
}
function close(){dialog.close();}
dialog.addEventListener('close',()=>{document.body.style.overflow='';if(opener?.isConnected)opener.focus();});
dialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const controls=[...dialog.querySelectorAll('button:not([hidden]):not(:disabled),input,select,a[href]')].filter(x=>x.getClientRects().length);
 const first=controls[0],last=controls.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
$('open').addEventListener('click',event=>open(event.currentTarget));
$('close').addEventListener('click',close);$('continue').addEventListener('click',close);
for(const form of document.querySelectorAll('[data-daybreak-product]')){
 form.querySelector('button').disabled=false;
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const product=form.dataset.daybreakProduct,grind=form.elements.grind.value;
  if(!Object.hasOwn(products,product)||!Object.hasOwn(grinds,grind))return;
  const line=bag.find(x=>x.product===product&&x.grind===grind);
  if(line?.qty===12){open(form.querySelector('button'),'Demo limit: 12 of this exact roast and grind. You can change its quantity here.');return;}
  if(line)line.qty++;else bag.push({product,grind,qty:1});
  save();open(form.querySelector('button'),products[product].name+', '+grinds[grind]+' added to your demo bag.');
 });
}
items.addEventListener('change',event=>{
 const input=event.target;if(!input.matches('input[data-daybreak-key]'))return;
 const line=bag.find(x=>key(x)===input.dataset.daybreakKey);if(!line)return;
 const value=input.valueAsNumber;
 if(!Number.isInteger(value)||value<1||value>12){input.value=String(line.qty);announce('Choose a whole-number quantity from 1 to 12. The previous quantity was kept.');return;}
 const id=input.id;line.qty=value;save();render();document.getElementById(id)?.focus();announce(products[line.product].name+' quantity updated to '+value+'. Demo subtotal '+$('total').textContent+'.');
});
items.addEventListener('click',event=>{
 const button=event.target.closest('button[data-daybreak-remove]');if(!button)return;
 const index=bag.findIndex(x=>key(x)===button.dataset.daybreakRemove);if(index<0)return;
 const removed=bag.splice(index,1)[0];save();render();
 const next=items.querySelector('input');(next||$('close')).focus();announce(products[removed.product].name+', '+grinds[removed.grind]+' removed. Demo subtotal '+$('total').textContent+'.');
});
$('empty').addEventListener('click',()=>{bag=[];save();render();$('close').focus();announce('Demo bag emptied.');});
window.addEventListener('storage',event=>{
 if(event.key!==KEY||!persistent)return;
 load();const focusId=document.activeElement?.id;render();if(dialog.open){(document.getElementById(focusId)||$('close')).focus();announce('Your demo bag changed in another browser tab.');}
});
load();render();
})();
