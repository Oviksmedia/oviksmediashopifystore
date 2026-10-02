(() => {
  'use strict';
  const KEY = 'oviks-rift-concept-bag-v1';
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const price = 95;
  const form = document.getElementById('rift-product-form');
  const dialog = document.getElementById('rift-bag');
  const items = document.getElementById('rift-bag-items');
  const status = document.getElementById('rift-status');
  const storageNote = document.getElementById('rift-storage-note');
  const productError = document.getElementById('rift-product-error');
  const bagError = document.getElementById('rift-bag-error');
  let bag = {};
  let statusTimer;
  const money = amount => `£${amount}`;
  const announce = message => {
    clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = setTimeout(() => { status.textContent = ''; }, 5500);
  };
  const storageWarning = message => {
    storageNote.textContent = message;
    storageNote.hidden = false;
  };
  const persist = () => {
    try { localStorage.setItem(KEY, JSON.stringify(bag)); }
    catch { storageWarning('This browser cannot save the demo bag. You can keep exploring; items will last only until this page closes.'); }
  };
  try {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object' || Object.keys(parsed).some(size => !sizes.includes(size) || !Number.isInteger(parsed[size]) || parsed[size] < 1 || parsed[size] > 10)) throw new Error('Invalid bag');
      bag = parsed;
    }
  } catch {
    storageWarning('The saved demo bag could not be read. An empty bag is ready to use; new items can still be added.');
  }
  const render = () => {
    const count = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
    document.getElementById('rift-bag-count').textContent = count;
    document.getElementById('rift-subtotal').textContent = money(count * price);
    items.replaceChildren();
    if (!count) {
      const empty = document.createElement('div');
      empty.className = 'rift-empty';
      empty.innerHTML = '<h3>Your next ride starts here.</h3><p>Your demo bag is empty. Choose a jersey size and add it to explore the interaction.</p>';
      items.append(empty);
      return;
    }
    sizes.filter(size => bag[size]).forEach(size => {
      const row = document.createElement('article');
      row.className = 'rift-bag-item';
      row.dataset.size = size;
      row.innerHTML = `<img src="assets/rift-jersey.webp" alt="Cobalt and acid yellow jersey concept" width="78" height="90"><div><h3>The Line Jersey</h3><p class="rift-item-description">Cobalt / Acid · Size ${size} · ${money(price)} each</p><div class="rift-item-controls"><div class="rift-qty"><button type="button" data-action="minus" aria-label="Decrease size ${size} quantity" ${bag[size] === 1 ? 'disabled' : ''}>−</button><output aria-label="Size ${size} quantity">${bag[size]}</output><button type="button" data-action="plus" aria-label="Increase size ${size} quantity" ${bag[size] === 10 ? 'disabled' : ''}>+</button></div><button type="button" class="rift-remove" data-action="remove" aria-label="Remove size ${size} jersey">Remove</button></div><strong class="rift-item-total">${money(bag[size] * price)}</strong></div>`;
      items.append(row);
    });
  };
  form.addEventListener('change', () => {
    const selected = form.elements.size.value;
    document.getElementById('rift-size-chosen').textContent = `— ${selected} selected`;
    productError.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const size = form.elements.size.value;
    if (!sizes.includes(size)) {
      productError.textContent = 'Choose a size before adding the jersey to your demo bag.';
      productError.hidden = false;
      form.querySelector('input[name="size"]').focus();
      return;
    }
    if ((bag[size] || 0) >= 10) {
      productError.textContent = `Size ${size} already has the demo maximum of 10. Open the bag to update or remove items.`;
      productError.hidden = false;
      return;
    }
    bag[size] = (bag[size] || 0) + 1;
    productError.hidden = true;
    bagError.hidden = true;
    persist();
    render();
    dialog.showModal();
    requestAnimationFrame(() => announce(`The Line Jersey, size ${size}, added to your demo bag. ${Object.values(bag).reduce((sum, value) => sum + value, 0)} item(s) in the bag.`));
  });
  document.querySelector('.rift-bag-open').addEventListener('click', () => { render(); dialog.showModal(); });
  document.getElementById('rift-bag-close').addEventListener('click', () => dialog.close());
  document.getElementById('rift-continue').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled])')].filter(control => control.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  items.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const size = button.closest('[data-size]').dataset.size;
    const action = button.dataset.action;
    if (!bag[size]) return;
    bagError.hidden = true;
    if (action === 'remove') delete bag[size];
    else if (action === 'minus' && bag[size] > 1) bag[size] -= 1;
    else if (action === 'plus' && bag[size] < 10) bag[size] += 1;
    else {
      bagError.textContent = 'Demo quantities must be between 1 and 10. Use Remove to take this size out of the bag.';
      bagError.hidden = false;
      return;
    }
    persist();
    render();
    const restoredButton = items.querySelector(`[data-size="${size}"] [data-action="${action}"]`);
    if (restoredButton && !restoredButton.disabled) restoredButton.focus();
    else if (bag[size]) items.querySelector(`[data-size="${size}"] [data-action="remove"]`).focus();
    else document.getElementById('rift-continue').focus();
    announce(action === 'remove' ? `Size ${size} removed from the demo bag.` : `Size ${size} quantity updated to ${bag[size]}.`);
  });
  render();
})();
