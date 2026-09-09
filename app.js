import { contact, products, services, cities } from './data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const encode = encodeURIComponent;
const waUrl = message => `https://wa.me/${contact.whatsapp}?text=${encode(message)}`;

function icon(name) {
  const paths = {
    heat: '<circle cx="12" cy="7" r="3"/><path d="M12 1v2M5 3l2 2M19 3l-2 2M3 14l9-4 9 4M5 16l14 5M5 20l14-4"/>',
    roof: '<path d="M3 11 12 4l9 7M6 10v9h12v-9M9 19v-5h6v5"/>',
    tank: '<path d="M7 6c0-2 10-2 10 0v12c0 2-10 2-10 0zM7 6c0 2 10 2 10 0M7 10c0 2 10 2 10 0"/>',
    bath: '<path d="M4 13h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM7 13V7a3 3 0 0 1 6 0M4 20l-1 2M20 20l1 2"/>',
    basement: '<path d="M4 4h16v16H4zM4 10h16M9 10v10M15 10v10M7 7h2M13 7h2"/>',
    wall: '<path d="M4 4h16v16H4zM4 9h16M4 15h16M9 4v5M15 9v6M9 15v5"/>',
    repair: '<path d="m14 6 4-4 4 4-4 4M15 9 6 18l-3 3M8 16l3 3M4 5l15 15"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.repair}</svg>`;
}

function header() {
  return `<header class="site-header">
    <div class="topbar"><div class="container"><span>Building Trust. Delivering Protection.</span><span><a href="mailto:${contact.email}">${contact.email}</a><i></i><a href="tel:+923008548956">${contact.whatsappDisplay}</a></span></div></div>
    <div class="nav-wrap"><div class="container nav-row">
      <a class="brand" href="index.html" aria-label="CRETE-CHEM home"><img src="assets/logo-mark.svg" width="46" height="46" alt=""><span><strong>CRETE-CHEM</strong><small>Authorized Agent of Sika Pakistan</small></span></a>
      <nav class="desktop-nav" aria-label="Primary navigation"><a href="index.html">Home</a><a href="index.html#about">About us</a><a href="index.html#solutions">Solutions</a><a href="index.html#products">Products</a><a href="index.html#projects">Projects</a><a href="index.html#resources">Resources</a><a href="index.html#contact">Contact</a></nav>
      <a class="button button-nav" href="${waUrl('Hi CRETE-CHEM, I would like to request a site inspection.')}">Request inspection</a>
      <button class="cart-toggle" type="button" data-open-cart aria-label="Open cart">Cart <span data-cart-count>0</span></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span><b class="sr-only">Open menu</b></button>
    </div></div>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation"><div class="container"><a href="index.html">Home</a><a href="index.html#about">About us</a><a href="index.html#solutions">Solutions</a><a href="index.html#products">Products</a><a href="index.html#projects">Projects</a><a href="index.html#resources">Resources</a><a href="index.html#contact">Contact</a><a class="button button-whatsapp" href="${waUrl('Hi CRETE-CHEM, I would like to request a site inspection.')}" >Request inspection</a></div></nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-brand"><a class="brand brand-light" href="index.html"><img src="assets/logo-mark.svg" width="52" height="52" alt=""><span><strong>CRETE-CHEM</strong><small>Authorized Agent of Sika Pakistan</small></span></a><p>Your trusted partner for construction chemicals, waterproofing and concrete solutions across Pakistan.</p><div class="social-icons" aria-label="Social platforms"><span role="img" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9z"/></svg></span><span role="img" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 8h4v13H3zM3 3h4v3H3zM10 8h4v2c1-2 7-3 7 4v7h-4v-7c0-3-3-3-3 0v7h-4z"/></svg></span><span role="img" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></svg></span></div></div>
    <div><h2>Explore</h2><a href="index.html#about">About us</a><a href="index.html#solutions">Solutions</a><a href="index.html#products">Products</a><a href="index.html#projects">Projects</a></div>
    <div><h2>Our Services</h2>${services.map(s=>`<a href="${waUrl(`Hi CRETE-CHEM, I need assistance with ${s.title}.`)}">${s.title}</a>`).join('')}</div>
    <div><h2>Contact</h2><address>${contact.address}</address><a href="tel:+92512808395">+92 51-2808395</a><a href="tel:+92512808409">+92 51-2808409</a><a href="tel:+923008548956">${contact.whatsappDisplay}</a><a href="mailto:${contact.email}">${contact.email}</a><a href="https://www.crete-chem.com.pk/">www.crete-chem.com.pk</a><a href="${waUrl('Hi CRETE-CHEM, I would like technical assistance.')}" target="_blank" rel="noopener">WhatsApp enquiry ↗</a></div>
  </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} CRETE-CHEM (Pvt.) Ltd.</span><span><a href="admin.html">Admin dashboard</a></span></div></footer>`;
}

function pack(product, large = false) {
  return `<div class="product-visual${large ? ' product-visual-large' : ''}"><div class="pack ${product.tone}"><span>CC</span><b>${product.name.split(' ').slice(0, 2).join(' ')}</b><small>${product.category}</small></div><i></i></div>`;
}

function productCard(product) {
  return `<article class="product-card" data-category="${product.category}">${pack(product)}<div class="product-card-body"><span class="product-category">${product.category}</span><h3><a href="product.html?id=${product.id}">${product.name}</a></h3><p>${product.use}</p><div class="product-actions"><a class="text-link" href="product.html?id=${product.id}">View details <span aria-hidden="true">→</span></a><button class="quick-button" type="button" data-quick-view="${product.id}" aria-label="Quick view ${product.name}">Quick view</button></div><button class="button button-primary add-cart" type="button" data-add-cart="${product.id}">Add to cart <span aria-hidden="true">+</span></button><p class="quote-note">Price &amp; pack size confirmed by quotation.</p></div></article>`;
}

function renderProducts(items, root) {
  if (root) root.innerHTML = items.map(productCard).join('');
}

function serviceCard(service) {
  const message = `Hi CRETE-CHEM, I need assistance with ${service.title}.`;
  return `<article class="service-card"><div class="service-icon">${icon(service.icon)}</div><h3>${service.title}</h3><p>${service.copy}</p><a href="${waUrl(message)}" target="_blank" rel="noopener">WhatsApp Now <span aria-hidden="true">↗</span></a><a class="inspection-link" href="${waUrl(`Hi CRETE-CHEM, I would like a free inspection for ${service.title}.`)}" target="_blank" rel="noopener">Get Free Inspection →</a></article>`;
}

function initHeader() {
  $('#site-header').innerHTML = header();
  $('#site-footer').innerHTML = footer();
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); document.body.classList.remove('menu-open');
  }));
  let previous = 0;
  addEventListener('scroll', () => {
    const current = scrollY;
    $('.site-header')?.classList.toggle('compact', current > 48);
    $('.site-header')?.classList.toggle('hidden', current > previous && current > 280 && !document.body.classList.contains('menu-open'));
    $('.mobile-wa')?.classList.toggle('visible', current > 520);
    previous = current;
  }, { passive: true });
}

function showQuickView(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const root = $('#quick-view-root');
  const previous = document.activeElement;
  root.innerHTML = `<div class="modal-backdrop" data-close-modal></div><section class="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title" tabindex="-1"><button class="modal-close" type="button" data-close-modal aria-label="Close quick view">×</button><div class="quick-layout">${pack(product, true)}<div class="quick-content"><p class="eyebrow">${product.category}</p><h2 id="quick-title">${product.name}</h2><p>${product.use}</p><div class="quick-columns"><div><h3>Application areas</h3><ul>${product.applications.map(x => `<li>${x}</li>`).join('')}</ul></div><div><h3>Benefits</h3><ul>${product.benefits.map(x => `<li>${x}</li>`).join('')}</ul></div></div><div class="quick-actions"><button class="button button-primary" type="button" data-add-cart="${product.id}">Add to cart +</button><a class="button button-whatsapp" href="${waUrl(`Hi CRETE-CHEM, I would like information about ${product.name}.`)}" target="_blank" rel="noopener">Ask on WhatsApp <span aria-hidden="true">↗</span></a><a class="button button-outline" href="product.html?id=${product.id}">Full product page</a></div></div></div></section>`;
  root.classList.add('active'); document.body.classList.add('modal-open');
  const modal = $('.quick-modal', root); modal.focus();
  const close = () => { root.classList.remove('active'); root.innerHTML = ''; document.body.classList.remove('modal-open'); previous?.focus(); removeEventListener('keydown', keydown); };
  const keydown = event => {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const focusable = $$('button,a', modal); const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  $$('[data-close-modal]', root).forEach(el => el.addEventListener('click', close)); addEventListener('keydown', keydown);
}

function showVideo(id, title) {
  const root = $('#video-modal-root'); const previous = document.activeElement;
  root.innerHTML = `<div class="modal-backdrop" data-video-close></div><section class="video-modal" role="dialog" aria-modal="true" aria-labelledby="video-title" tabindex="-1"><div class="video-modal-head"><h2 id="video-title">${title}</h2><button type="button" data-video-close aria-label="Close video">×</button></div><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div><p>External manufacturer demonstration. Confirm the selected product system and project-specific application requirements before work.</p></section>`;
  root.classList.add('active'); document.body.classList.add('modal-open'); $('.video-modal', root).focus();
  const close = () => { root.classList.remove('active'); root.innerHTML = ''; document.body.classList.remove('modal-open'); previous?.focus(); removeEventListener('keydown', keydown); };
  const keydown = e => e.key === 'Escape' && close();
  $$('[data-video-close]', root).forEach(el => el.addEventListener('click', close)); addEventListener('keydown', keydown);
}

function initHome() {
  const serviceRoot = $('#service-grid'); if (serviceRoot) serviceRoot.innerHTML = services.map(serviceCard).join('');
  renderProducts(products, $('#product-grid'));
  const problems = [
    ['roof', 'Roof leakage', 'Roof Waterproofing'], ['tank', 'Water tank', 'Water Tank Leakage'], ['bath', 'Bathroom', 'Bathroom Leakage'],
    ['basement', 'Basement', 'Basement Seepage'], ['wall', 'Wall dampness', 'Wall Dampness'], ['heat', 'Heat proofing', 'Heat Proofing']
  ];
  const grid = $('#problem-grid');
  if (grid) grid.innerHTML = problems.map(([i, label, service], index) => `<button class="problem-card${index === 0 ? ' active' : ''}" type="button" data-service="${service}" role="listitem"><span>${icon(i)}</span><strong>${label}</strong><small>Select area</small></button>`).join('');
  $$('.problem-card').forEach(button => button.addEventListener('click', () => {
    $$('.problem-card').forEach(x => x.classList.remove('active')); button.classList.add('active');
    const service = button.dataset.service;
    $('#finder-selection').textContent = service;
    $('#finder-copy').textContent = `Tell us where the issue appears, when it is most visible and whether it has been treated before.`;
    $('#finder-action').href = waUrl(`Hi CRETE-CHEM, I need assistance with ${service}.`);
  }));
  const filters = $('.filter-row');
  if(filters) filters.innerHTML = '<button class="filter active" data-filter="all" type="button">All products</button>' + products.map(p => `<button class="filter" data-filter="${p.category}" type="button">${p.name}</button>`).join('');
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(x => x.classList.remove('active')); button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.product-card', $('#product-grid')).forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
  }));
  const range = $('#compare-range');
  const updateCompare = () => {
    const value = `${range.value}%`;
    $('#comparison-mask').style.width = value;
    $('#comparison-mask img').style.width = `${$('#comparison').clientWidth}px`;
    $('#compare-handle').style.left = value;
  };
  if (range) {
    range.addEventListener('input', updateCompare);
    addEventListener('resize', updateCompare, { passive: true });
    updateCompare();
  }
  $$('.video-card').forEach(button => button.addEventListener('click', () => showVideo(button.dataset.video, button.dataset.videoTitle)));
}

function initProductPage() {
  if (document.body.dataset.page !== 'product') return;
  const id = new URLSearchParams(location.search).get('id');
  const product = products.find(p => p.id === id) || products[0];
  document.title = `${product.name} | CRETE-CHEM`;
  $('#crumb-name').textContent = product.name; $('#detail-category').textContent = product.category; $('#detail-name').textContent = product.name; $('#detail-use').textContent = product.use;
  const visualDocument = new DOMParser().parseFromString(pack(product, true), 'text/html');
  $('.product-visual-large', $('#product-detail')).replaceWith(visualDocument.body.firstElementChild);
  $('#detail-applications').innerHTML = product.applications.map(x => `<li>${x}</li>`).join('');
  $('#detail-benefits').innerHTML = product.benefits.map(x => `<li>${x}</li>`).join('');
  const message = `Hi CRETE-CHEM, I would like information about ${product.name}.`;
  $('.detail-actions').insertAdjacentHTML('afterbegin', `<button class="button button-primary" type="button" data-add-cart="${product.id}">Add to cart +</button>`);
  $('#detail-wa').href = waUrl(message); $('#support-wa').href = waUrl(message);
  renderProducts(products.filter(p => p.id !== product.id).slice(0, 3), $('#related-grid'));
  const tabs = $$('[role="tab"]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); $(`#${t.getAttribute('aria-controls')}`).hidden = t !== tab; });
  }));
}

function initGlobalActions() {
  addEventListener('click', event => {
    const quick = event.target.closest('[data-quick-view]'); if (quick) showQuickView(quick.dataset.quickView);
  });
  $$('details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) $$('details').filter(x => x !== detail).forEach(x => x.open = false);
  }));
}

initHeader(); initHome(); initProductPage(); initGlobalActions();

import { initCart } from './cart.js';
initCart();
