(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const WA = '244923876030';
const KEY = 'sarayi_cart_v1';
const kz = n => n.toLocaleString('en-US') + ' Kz';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I = {
  x: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  prev: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
};

/* ================= Painéis (menu lateral e carrinho) ================= */
const scrim = $('#scrim'), drawer = $('#drawer');
const cartEl = document.createElement('aside');
cartEl.className = 'cart'; cartEl.id = 'cart'; cartEl.setAttribute('aria-label', 'Carrinho');
cartEl.innerHTML = `
  <div class="cart-head"><h2>O seu pedido</h2><button class="icon-btn dark" type="button" data-close aria-label="Fechar carrinho">${I.x}</button></div>
  <div class="cart-list" id="cartList"></div>
  <div class="cart-foot" id="cartFoot">
    <div class="total-row"><span>Total</span><strong id="cartTotal">0 Kz</strong></div>
    <p class="cart-note" id="cartNote" hidden>Alguns itens têm preço por confirmar.</p>
    <label for="orderName">Nome (opcional)</label><input id="orderName" autocomplete="name">
    <label for="orderNotes">Notas (opcional)</label><textarea id="orderNotes" rows="2" placeholder="Ex.: levantamento às 15h"></textarea>
    <button class="btn gold block" id="sendOrder" type="button">Enviar pedido pelo WhatsApp</button>
    <button class="link-btn" id="clearCart" type="button">Esvaziar carrinho</button>
  </div>`;
document.body.append(cartEl);
let openPanel = null, lastFocus = null;
[drawer, cartEl].forEach(p => { if (p) p.inert = true; });

function open(panel) {
  if (!panel) return;
  if (openPanel && openPanel !== panel) close(true);
  lastFocus = document.activeElement;
  panel.inert = false; panel.classList.add('open'); scrim.classList.add('on');
  document.body.classList.add('lock'); openPanel = panel;
  (panel.querySelector('a,button,input') || panel).focus({preventScroll: true});
}
function close(keepScrim) {
  if (!openPanel) return;
  openPanel.classList.remove('open'); openPanel.inert = true;
  if (!keepScrim) { scrim.classList.remove('on'); document.body.classList.remove('lock'); lastFocus && lastFocus.focus && lastFocus.focus({preventScroll: true}); }
  openPanel = null;
}
$('#navToggle')?.addEventListener('click', () => { open(drawer); $('#navToggle').setAttribute('aria-expanded', 'true'); });
$('#navClose')?.addEventListener('click', () => close());
$('#cartToggle')?.addEventListener('click', () => open(cartEl));
cartEl.querySelector('[data-close]').addEventListener('click', () => close());
scrim?.addEventListener('click', () => close());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && openPanel) close(); });
$$('#drawer nav a').forEach(a => a.addEventListener('click', () => close()));
new MutationObserver(() => { if (!drawer.classList.contains('open')) $('#navToggle')?.setAttribute('aria-expanded', 'false'); }).observe(drawer, {attributes: true, attributeFilter: ['class']});

/* ================= Carrinho ================= */
let cart = [];
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    cart = (Array.isArray(raw) ? raw : []).filter(l => l && typeof l.id === 'string' && typeof l.name === 'string')
      .map(l => ({ id: l.id, name: l.name, img: typeof l.img === 'string' ? l.img : '', price: Number.isFinite(l.price) ? l.price : null, qty: Math.max(1, Math.min(99, parseInt(l.qty, 10) || 1)) }));
  } catch (e) { cart = []; }
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
const count = () => cart.reduce((a, l) => a + l.qty, 0);
const qtyOf = id => (cart.find(l => l.id === id) || {qty: 0}).qty;

function renderBadge(bump) {
  const b = $('.cart-count'); if (!b) return;
  const n = count(); b.textContent = n > 99 ? '99+' : n; b.hidden = n === 0;
  $('#cartToggle')?.setAttribute('aria-label', n ? `Abrir carrinho (${n} itens)` : 'Abrir carrinho');
  if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}
function renderCart() {
  const list = $('#cartList'), foot = $('#cartFoot');
  if (!cart.length) {
    list.innerHTML = '<div class="cart-empty"><p>O seu carrinho está vazio.</p><a href="menu.html">Ver o menu</a></div>';
    foot.hidden = true; return;
  }
  foot.hidden = false;
  list.innerHTML = cart.map(l => `
    <div class="cart-line" data-id="${esc(l.id)}">
      <img src="${esc(l.img)}" alt="" ${/logo\.png$/.test(l.img) ? 'class="ph"' : ''}>
      <div><div class="nm">${esc(l.name)}</div><div class="pr">${l.price != null ? kz(l.price * l.qty) : 'Preço por confirmar'}</div></div>
      <div class="qty"><button type="button" data-act="dec" aria-label="Diminuir">${I.minus}</button><span aria-live="polite">${l.qty}</span><button type="button" data-act="inc" aria-label="Aumentar">${I.plus}</button></div>
    </div>`).join('');
  const total = cart.reduce((a, l) => a + (l.price != null ? l.price * l.qty : 0), 0);
  $('#cartTotal').textContent = kz(total);
  $('#cartNote').hidden = !cart.some(l => l.price == null);
}
function commit(bump) { save(); renderBadge(bump); renderCart(); }
function addToCart(item) {
  const l = cart.find(x => x.id === item.id);
  if (l) l.qty = Math.min(99, l.qty + 1); else cart.push({...item, qty: 1});
  commit(true);
}
function changeQty(id, d) {
  const l = cart.find(x => x.id === id); if (!l) return;
  l.qty += d; if (l.qty <= 0) cart = cart.filter(x => x.id !== id);
  commit();
}
cartEl.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  changeQty(b.closest('.cart-line').dataset.id, b.dataset.act === 'inc' ? 1 : -1);
});
$('#clearCart').addEventListener('click', () => { if (confirm('Esvaziar o carrinho?')) { cart = []; commit(); } });
$('#sendOrder').addEventListener('click', () => {
  if (!cart.length) return;
  const total = cart.reduce((a, l) => a + (l.price != null ? l.price * l.qty : 0), 0);
  const pend = cart.some(l => l.price == null);
  const name = $('#orderName').value.trim(), notes = $('#orderNotes').value.trim();
  let t = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
  t += cart.map(l => `• ${l.qty}× ${l.name} — ${l.price != null ? kz(l.price * l.qty) : 'preço a confirmar'}`).join('\n');
  t += `\n\nTotal: ${kz(total)}${pend ? ' (mais os itens com preço a confirmar)' : ''}`;
  if (name) t += `\nNome: ${name}`;
  if (notes) t += `\nNotas: ${notes}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
});
window.addEventListener('storage', e => { if (e.key === KEY) { load(); commit(); } });
load(); commit();

/* ================= Menu: filtros + popup do item ================= */
const items = $$('.menu-item');
if (items.length) {
  $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
    const cat = btn.dataset.filter;
    items.forEach(it => it.hidden = cat !== 'Todos' && it.dataset.category !== cat);
  }));

  const dlg = document.createElement('dialog');
  dlg.className = 'sheet'; dlg.setAttribute('aria-labelledby', 'ppName');
  dlg.innerHTML = `
    <div class="pp-head">
      <div><h3 class="pp-name" id="ppName"></h3><div class="pp-price" id="ppPrice"></div></div>
      <button class="plus" id="ppAdd" type="button" aria-label="Adicionar ao carrinho">${I.plus}</button>
    </div>
    <div class="pp-img"><img id="ppImg" alt=""><button class="pp-close" id="ppClose" type="button" aria-label="Fechar">${I.x}</button></div>
    <div class="pp-body"><p class="pp-desc" id="ppDesc"></p><p class="pp-incart" id="ppIn" hidden></p></div>`;
  document.body.append(dlg);
  let cur = null, doneTimer = 0;
  const ppAdd = $('#ppAdd', dlg), ppIn = $('#ppIn', dlg);

  function inCart() {
    const n = cur ? qtyOf(cur.id) : 0;
    ppIn.hidden = !n;
    ppIn.innerHTML = n ? `No carrinho: ${n}<button class="link-btn" type="button" data-cart>Ver carrinho</button>` : '';
  }
  function show(el) {
    const d = el.dataset;
    cur = { id: d.id, name: d.name, price: d.price === '' ? null : Number(d.price), img: d.img };
    $('#ppName', dlg).textContent = d.name;
    $('#ppPrice', dlg).textContent = cur.price != null ? kz(cur.price) : 'Preço sob consulta';
    const img = $('#ppImg', dlg); img.src = d.img; img.alt = d.name; img.className = /logo\.png$/.test(d.img) ? 'ph' : '';
    $('#ppDesc', dlg).textContent = d.desc;
    clearTimeout(doneTimer); ppAdd.classList.remove('done'); ppAdd.innerHTML = I.plus;
    inCart();
    if (!dlg.open) { dlg.showModal(); document.body.classList.add('lock'); }
    dlg.scrollTop = 0;
  }
  items.forEach(el => $('.menu-hit', el).addEventListener('click', () => show(el)));
  ppAdd.addEventListener('click', () => {
    if (!cur) return;
    addToCart({ id: cur.id, name: cur.name, price: cur.price, img: cur.img });
    ppAdd.classList.add('done'); ppAdd.innerHTML = I.check; inCart();
    clearTimeout(doneTimer); doneTimer = setTimeout(() => { ppAdd.classList.remove('done'); ppAdd.innerHTML = I.plus; }, 1300);
  });
  $('#ppClose', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => {
    if (e.target === dlg) dlg.close();
    if (e.target.closest('[data-cart]')) { dlg.close(); open(cartEl); }
  });
  dlg.addEventListener('close', () => { document.body.classList.toggle('lock', !!openPanel); if (location.hash) history.replaceState(null, '', location.pathname + location.search); });
  const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); const el = id && items.find(i => i.dataset.id === id); if (el) { $$('[data-filter]')[0]?.click(); show(el); } };
  fromHash(); window.addEventListener('hashchange', fromHash);
}

/* ================= Galeria: lightbox com fotos e vídeos ================= */
const gItems = $$('.g-open');
if (gItems.length) {
  const lb = document.createElement('dialog');
  lb.className = 'lightbox'; lb.setAttribute('aria-label', 'Galeria');
  lb.innerHTML = `<button class="lb-btn lb-close" type="button" aria-label="Fechar">${I.x}</button>
    <button class="lb-btn lb-prev" type="button" aria-label="Anterior">${I.prev}</button>
    <button class="lb-btn lb-next" type="button" aria-label="Seguinte">${I.next}</button>
    <div class="lb-stage" id="lbStage"></div><div class="lb-cap" id="lbCap"></div>`;
  document.body.append(lb);
  let idx = 0;
  const stage = $('#lbStage', lb);
  function clear() { const v = $('video', stage); if (v) { v.pause(); v.removeAttribute('src'); v.load(); } stage.innerHTML = ''; }
  function go(i) {
    idx = (i + gItems.length) % gItems.length; clear();
    const b = gItems[idx], d = b.dataset;
    if (d.video) {
      const v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.autoplay = true; v.poster = d.poster || ''; v.src = d.video; v.setAttribute('aria-label', d.caption);
      stage.append(v); v.play().catch(() => {});
    } else { const im = document.createElement('img'); im.src = d.src; im.alt = d.caption; stage.append(im); }
    $('#lbCap', lb).textContent = d.caption;
  }
  gItems.forEach((b, i) => b.addEventListener('click', () => { go(i); lb.showModal(); document.body.classList.add('lock'); }));
  $('.lb-close', lb).addEventListener('click', () => lb.close());
  $('.lb-prev', lb).addEventListener('click', () => go(idx - 1));
  $('.lb-next', lb).addEventListener('click', () => go(idx + 1));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1); });
  let sx = 0; lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive: true});
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60 && !e.target.closest('video')) go(idx + (dx < 0 ? 1 : -1)); });
  lb.addEventListener('close', () => { clear(); document.body.classList.remove('lock'); });
}

/* ================= Mapa das lojas ================= */
const mapEl = $('#map');
if (mapEl) {
  const cards = $$('.store');
  if (window.L && cards.length) {
    const map = L.map(mapEl, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(map);
    const icon = L.divIcon({ className: 'pin-wrap', html: '<span class="pin"></span>', iconSize: [34, 42], iconAnchor: [17, 40], popupAnchor: [0, -38] });
    const pts = [];
    cards.forEach(c => {
      const ll = [parseFloat(c.dataset.lat), parseFloat(c.dataset.lng)]; pts.push(ll);
      const m = L.marker(ll, { icon, title: c.dataset.name, keyboard: true }).addTo(map)
        .bindPopup(`<strong>${esc(c.dataset.name)}</strong>${esc(c.dataset.addr)}`);
      c._marker = m;
      $('[data-focus]', c)?.addEventListener('click', () => { map.flyTo(ll, 16, { duration: .8 }); m.openPopup(); mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    });
    map.fitBounds(pts, { padding: [50, 50] });
    mapEl.addEventListener('click', () => map.scrollWheelZoom.enable(), { once: true });
  } else {
    mapEl.innerHTML = '<p style="padding:20px;font-size:14px">Não foi possível carregar o mapa. Use os botões “Direções” de cada loja.</p>';
  }
}

/* ================= Formulário de contacto ================= */
const form = $('#contactForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#name').value.trim(), email = $('#email').value.trim(), msg = $('#message').value.trim();
  const body = `Olá! Sou ${name}.${email ? ` O meu e-mail é ${email}.` : ''} ${msg}`;
  window.open(`https://wa.me/${WA}?text=` + encodeURIComponent(body), '_blank', 'noopener');
});
})();
