/* Native Shopify forms and server-side carts. No browser-local bag or variant IDs. */
document.querySelectorAll('.native-buy').forEach(form => {
  const options = form.querySelector('select[name="id"]');
  function sync() {
    const choice = options ? options.selectedOptions[0] : form.querySelector('input[name="id"]:checked');
    if (!choice?.value) return;
    form.querySelector('[data-native-price]').textContent = choice.dataset.money;
    const quantity = form.querySelector('[name="quantity"]');
    quantity.min = choice.dataset.min || '1';
    quantity.step = choice.dataset.step || '1';
    if (choice.dataset.max) quantity.max = choice.dataset.max;
    else quantity.removeAttribute('max');
    if (!quantity.checkValidity()) quantity.value = quantity.min;
    form.querySelector('.native-selection-status').textContent = 'Selected: ' + (options ? choice.textContent.trim() : choice.nextElementSibling.textContent.trim());
    const image = form.closest('.native-product-layout')?.querySelector('.native-product-image');
    if (image && choice.dataset.image) { image.removeAttribute('srcset'); image.src = choice.dataset.image; image.alt = 'Product view / ' + (options ? choice.textContent.trim() : choice.nextElementSibling.textContent.trim()); }
    const product = form.closest('.sable-product-arc');
    if (product && choice.dataset.image) {
      const galleryImage = product.querySelector('#sable-arc-image');
      galleryImage.removeAttribute('srcset'); galleryImage.src = choice.dataset.image;
      const finish = choice.dataset.variantTitle;
      galleryImage.alt = 'Full form / ' + finish;
      product.querySelector('#sable-image-caption').textContent = galleryImage.alt;
      product.querySelectorAll('[data-gallery-src]').forEach(button => {
        const selected = button.dataset.view === 'form'; button.setAttribute('aria-pressed', String(selected));
        if (selected) { button.dataset.gallerySrc = choice.dataset.image; button.dataset.galleryAlt = galleryImage.alt; }
      });
    }
  }
  form.addEventListener('change', sync);
});
document.querySelectorAll('[data-gallery-src]').forEach(button => button.addEventListener('click', () => {
  const container = button.closest('.sable-gallery, .arc-product-gallery');
  const image = container?.querySelector('img');
  if (!image) return;
  image.removeAttribute('srcset'); image.src = button.dataset.gallerySrc;
  image.alt = button.dataset.galleryAlt || button.textContent.trim();
  container.querySelectorAll('[data-gallery-src]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const caption = container.querySelector('#sable-image-caption, #arc-gallery-caption');
  if (caption) caption.textContent = button.dataset.galleryAlt || button.textContent.trim();
}));
document.querySelectorAll('[data-native-gallery-src]').forEach(button => button.addEventListener('click', () => {
  const gallery = button.closest('.native-gallery'), image = gallery.querySelector('.native-product-image');
  image.removeAttribute('srcset'); image.src = button.dataset.nativeGallerySrc; image.alt = button.dataset.nativeGalleryAlt;
  gallery.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter; let count = 0;
  document.querySelectorAll('.sideb-record').forEach(record => {
    const show = filter === 'all' || record.dataset.genre === filter; record.hidden = !show; if (show) count++;
  });
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const status = document.querySelector('#sideb-filter-status'); if (status) status.textContent = count + (count === 1 ? ' record' : ' records');
}));
