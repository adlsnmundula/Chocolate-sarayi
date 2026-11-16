/*  Tracker de visitas — anónimo, sem cookies.
 *  1) Edite SITE e ENDPOINT aqui em baixo (uma só vez por site).
 *  2) Inclua em todas as páginas:  <script src="tracker.js" defer></script>
 *  Eventos extra:  window.track('view_item', 'Waffle Clássico')  |  window.track('add_to_cart', 'Waffle', 2800)
 */
(() => {
  'use strict';
  const SITE = 'chocolate-sarayi';                       // nome deste site (aparece no painel)
  const ENDPOINT = 'https://SEU-WORKER.workers.dev/collect'; // endereço do Worker (ver LEIA-ME)

  const debug = document.currentScript && document.currentScript.hasAttribute('data-debug');
  const host = location.hostname;
  if (!debug && (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1')) return;
  if (ENDPOINT.includes('SEU-WORKER')) return;                       // ainda não configurado
  if (navigator.doNotTrack === '1') return;                           // respeita "Do Not Track"
  try { if (localStorage.getItem('tk_ignore') === '1') return; } catch (e) {} // o dono pode ignorar as próprias visitas

  const rid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
  let vid = '', isNew = 0;
  try { vid = localStorage.getItem('tk_vid'); if (!vid) { vid = rid(); localStorage.setItem('tk_vid', vid); isNew = 1; } } catch (e) { vid = rid(); }
  let sid = '';
  try {
    const last = +sessionStorage.getItem('tk_last') || 0;
    sid = sessionStorage.getItem('tk_sid');
    if (!sid || Date.now() - last > 30 * 60 * 1000) { sid = rid(); sessionStorage.setItem('tk_sid', sid); }
    sessionStorage.setItem('tk_last', String(Date.now()));
  } catch (e) { sid = rid(); }

  const path = () => location.pathname.replace(/\/index\.html$/, '/') || '/';
  function send(type, name, value, props) {
    const body = JSON.stringify({ site: SITE, vid, sid, type, name: name || '', value: value == null ? null : +value, path: path(), vw: innerWidth, lang: navigator.language || '', nv: isNew, props: props || null });
    try { sessionStorage.setItem('tk_last', String(Date.now())); } catch (e) {}
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
    fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  }
  window.track = (type, name, value, props) => send(type, name, value, props);

  // visita à página (origem + campanha)
  let ref = '';
  try { const r = document.referrer ? new URL(document.referrer) : null; if (r && r.hostname !== host) ref = r.hostname.replace(/^www\./, ''); } catch (e) {}
  const q = new URLSearchParams(location.search);
  const utm = q.get('utm_source') || q.get('ref');
  send('pageview', '', null, utm ? { utm } : (ref ? { ref } : null));
  isNew = 0;

  // profundidade de scroll
  const fired = new Set();
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - innerHeight;
    const pct = max <= 0 ? 100 : Math.round((scrollY / max) * 100);
    [25, 50, 75, 100].forEach(m => { if (pct >= m - 1 && !fired.has(m)) { fired.add(m); send('scroll', String(m)); } });
  };
  let st; addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(onScroll, 150); }, { passive: true });
  setTimeout(onScroll, 800);

  // tempo na página (só conta com o separador visível)
  let shown = document.visibilityState === 'visible' ? Date.now() : 0, acc = 0, sent = false;
  const flush = () => {
    if (shown) { acc += Date.now() - shown; shown = 0; }
    const s = Math.round(acc / 1000);
    if (s >= 1 && !sent) { sent = true; send('time', '', Math.min(s, 3600)); }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
    else { shown = Date.now(); sent = false; acc = 0; }
  });
  addEventListener('pagehide', flush);

  // cliques importantes
  document.addEventListener('click', e => {
    const a = e.target.closest('a,[data-track]'); if (!a) return;
    if (a.dataset.track) return send('click', a.dataset.track);
    const h = a.getAttribute('href') || '';
    if (/wa\.me|whatsapp/i.test(h)) send('click', 'whatsapp');
    else if (h.startsWith('tel:')) send('click', 'telefone');
    else if (h.startsWith('mailto:')) send('click', 'email');
    else if (/google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app/i.test(h)) send('click', 'direcoes');
    else if (/instagram|facebook|tiktok|youtube/i.test(h)) send('click', (h.match(/instagram|facebook|tiktok|youtube/i) || [''])[0].toLowerCase());
  }, true);

  // secções vistas (para sites de página única): <section id="..."> ou [data-section]
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, n = el.dataset.section || el.id; if (!n || seen.has(n)) return;
      seen.add(n); send('section', n);
    }), { threshold: 0.5 });
    document.querySelectorAll('section[id],[data-section]').forEach(el => io.observe(el));
  }
})();
