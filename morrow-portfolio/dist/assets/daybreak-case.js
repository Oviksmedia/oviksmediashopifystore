(() => {
 const select=document.getElementById('daybreak-label-select');if(!select)return;
 const data={'day-one':{name:'Day One',number:'01 / MEDIUM ROAST',sun:'#fff5db'},'high-noon':{name:'High Noon',number:'02 / LIGHT ROAST',sun:'#f66a32'},'after-hours':{name:'After Hours',number:'03 / DARK ROAST',sun:'#fff5db'}};
 const label=document.getElementById('daybreak-label'),art=label.querySelector('.daybreak-label-art');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let timer;
 select.addEventListener('change',()=>{
  const item=data[select.value];if(!item)return;
  clearTimeout(timer);
  label.dataset.roast=select.value;label.setAttribute('aria-label',item.name+' label artwork');
  document.getElementById('daybreak-label-name').textContent=item.name;
  document.getElementById('daybreak-label-number').textContent=item.number;
  document.getElementById('daybreak-label-sun').setAttribute('fill',item.sun);
  document.getElementById('daybreak-label-feedback').textContent=item.name+' label selected. Same grid, a distinct roast personality.';
  if(!reduced.matches){art.classList.add('daybreak-label-changing');timer=setTimeout(()=>art.classList.remove('daybreak-label-changing'),160);}
 });
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(timer);art.classList.remove('daybreak-label-changing');}});
})();
