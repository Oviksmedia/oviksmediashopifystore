(() => {
  'use strict';
  const catalog = Object.freeze({
    'arc-oxblood': { name: 'The Arc', finish: 'Oxblood', price: 28000, image: 'assets/sable-arc-oxblood.webp' },
    'arc-ink': { name: 'The Arc', finish: 'Ink', price: 28000, image: 'assets/sable-arc-ink.webp' },
    'fold-ink': { name: 'The Fold', finish: 'Ink / Oxblood interior', price: 6500, image: 'assets/sable-fold.webp' }
  });
  const key = 'sable.demo-bag.v1';
  const bag = document.getElementById('sable-bag');
  const items = document.getElementById('sable-bag-items');
  const announcement = document.getElementById('sable-bag-status');
  const storageNote = document.getElementById('sable-storage-note');
  const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  let lines = [], persistent = true, recovered = false, returnFocus;
  const validQty = value => Number.isInteger(value) && value >= 1 && value <= 9;
  function decode(raw) {
    if (raw === null) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length > 3) throw new Error('Invalid bag');
    const seen = new Set();
    for (const line of data) {
      if (!line || typeof line.id !== 'string' || !Object.hasOwn(catalog, line.id) || !validQty(line.qty) || seen.has(line.id)) throw new Error('Invalid line');
      seen.add(line.id);
    }
    return data.map(({id,qty}) => ({id,qty}));
  }
  function save() {
    if (persistent) { try { localStorage.setItem(key, JSON.stringify(lines)); } catch { persistent = false; } }
    storageNote.textContent = persistent ? (recovered ? 'Unreadable saved bag was reset. New changes save in this browser.' : 'Saved in this browser only. Quantities are limited to 9 per finish.') : 'Browser storage is unavailable. Your bag works for this page session; changes will not survive a reload.';
  }
  try { const raw = localStorage.getItem(key); try { lines = decode(raw); } catch { lines = []; recovered = true; } } catch { persistent = false; }
  save();
  function element(tag, className, text) { const node = document.createElement(tag); if(className) node.className = className; if(text !== undefined) node.textContent = text; return node; }
  function render(focusId) {
    items.replaceChildren();
    if (!lines.length) items.append(element('p', 'sable-bag-empty', 'Your bag has room for an idea.'));
    for (const line of lines) {
      const product = catalog[line.id], row = element('article', 'sable-bag-row');
      const img = element('img'); img.src = product.image; img.alt = `${product.name}, ${product.finish}`; img.width = 80; img.height = 105;
      const copy = element('div'); copy.append(element('h3', '', product.name), element('p', '', product.finish), element('p', '', `${money(product.price)} each · ${money(product.price * line.qty)}`));
      const controls = element('div', 'sable-bag-row-controls'); const label = element('label', '', 'Quantity (1–9)');
      const input = element('input'); input.type = 'number'; input.min = '1'; input.max = '9'; input.step = '1'; input.required = true; input.inputMode = 'numeric'; input.value = line.qty; input.id = `sable-bag-qty-${line.id}`; input.dataset.id = line.id; input.setAttribute('aria-label', `Quantity for ${product.name}, ${product.finish}`); label.htmlFor = input.id;
      const remove = element('button', '', 'Remove'); remove.type = 'button'; remove.dataset.remove = line.id; remove.id = `sable-remove-${line.id}`; remove.setAttribute('aria-label', `Remove ${product.name}, ${product.finish}`);
      controls.append(label,input,remove); copy.append(controls); row.append(img,copy); items.append(row);
    }
    document.getElementById('sable-count').textContent = lines.reduce((sum,line) => sum + line.qty, 0);
    document.getElementById('sable-total').textContent = money(lines.reduce((sum,line) => sum + catalog[line.id].price * line.qty, 0));
    if (focusId && bag.open) (document.getElementById(focusId) || document.getElementById('sable-bag-close')).focus();
  }
  function announce(message) { announcement.textContent = ''; requestAnimationFrame(() => { announcement.textContent = message; }); }
  function openBag(trigger, message = '') { returnFocus = trigger; render(); if(!bag.open) bag.showModal(); document.getElementById('sable-bag-close').focus(); announce(message || `${lines.reduce((sum,line) => sum + line.qty, 0)} items in your demo bag.`); }
  function closeBag() { bag.close(); if(returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); }
  document.querySelector('.sable-bag-open').addEventListener('click', event => openBag(event.currentTarget));
  document.getElementById('sable-bag-close').addEventListener('click', closeBag);
  document.getElementById('sable-continue').addEventListener('click', closeBag);
  bag.addEventListener('cancel', event => { event.preventDefault(); closeBag(); });
  bag.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...bag.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],select:not([disabled])')].filter(node => node.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelectorAll('form[data-product]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form), qty = Number(data.get('quantity')), id = `${form.dataset.product}-${data.get('finish')}`, status = form.querySelector('[data-product-status]');
    if(!Object.hasOwn(catalog,id) || !validQty(qty)) { status.textContent = 'Choose a finish and a whole quantity from 1 to 9.'; return; }
    const existing = lines.find(line => line.id === id);
    if((existing?.qty || 0) + qty > 9) { status.textContent = 'Your bag can hold up to 9 of each finish. Open the bag to adjust its quantity.'; return; }
    if(existing) existing.qty += qty; else lines.push({id,qty});
    save(); render(); status.textContent = `${catalog[id].name}, ${catalog[id].finish} added to your demo bag.`;
    openBag(form.querySelector('button[type=submit]'), `${qty} × ${catalog[id].name}, ${catalog[id].finish} added. Illustrative total ${document.getElementById('sable-total').textContent}.`);
  }));
  items.addEventListener('change', event => {
    const input = event.target, id = input.dataset.id; if(!id) return;
    const line = lines.find(line => line.id === id); if(!line) return;
    const qty = Number(input.value);
    if(!validQty(qty)) { input.value = line.qty; announce('Use a whole quantity from 1 to 9. Your previous quantity was kept.'); return; }
    line.qty = qty; save(); render(input.id); announce(`Quantity updated for ${catalog[id].name}, ${catalog[id].finish}. Illustrative total ${document.getElementById('sable-total').textContent}.`);
  });
  items.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]'); if(!button) return;
    const id = button.dataset.remove, index = lines.findIndex(line => line.id === id); if(index < 0) return;
    lines.splice(index,1); save(); render(lines[index] ? `sable-remove-${lines[index].id}` : lines[index - 1] ? `sable-remove-${lines[index - 1].id}` : 'sable-bag-close'); announce(`${catalog[id].name}, ${catalog[id].finish} removed. ${lines.length ? 'Bag updated.' : 'Your demo bag is empty.'}`);
  });
  const heroImage = document.getElementById('sable-arc-image'); let view = 'form';
  function updateGallery() {
    const finish = document.querySelector('#sable-arc-form input[name=finish]:checked').value, name = finish === 'oxblood' ? 'Oxblood' : 'Ink';
    document.getElementById('sable-finish-name').textContent = `/ ${name}`;
    heroImage.src = view === 'detail' ? 'assets/sable-detail.webp' : catalog[`arc-${finish}`].image;
    heroImage.alt = view === 'detail' ? 'Close-up reference of the Arc in Oxblood, showing grain, stitching and a brass mount. This detail reference is shared by both finishes.' : `Full view of the ${name} Arc shoulder bag, including its arched strap and curved zip-top.`;
    document.getElementById('sable-image-caption').textContent = view === 'detail' ? 'Material detail / Oxblood reference, shared for both finishes' : `Full form / ${name}`;
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  }
  document.querySelectorAll('#sable-arc-form input[name=finish]').forEach(input => input.addEventListener('change', () => { view = 'form'; updateGallery(); document.querySelector('#sable-arc-form [data-product-status]').textContent = `${input.value === 'ink' ? 'Ink' : 'Oxblood'} finish selected. Full form shown.`; }));
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; updateGallery(); }));
  window.addEventListener('storage', event => { if(event.key !== key || !persistent) return; try { lines = decode(event.newValue); recovered = false; } catch { lines = []; recovered = true; } save(); render(); if(bag.open) announce('Your demo bag was updated in another tab.'); });
  render();
})();
