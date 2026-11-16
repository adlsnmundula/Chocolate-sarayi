(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf = n => Number(n || 0).toLocaleString('pt-PT');
const kz = n => nf(Math.round(n)) + ' Kz';
const dur = s => s >= 60 ? Math.floor(s / 60) + ' min ' + (s % 60) + ' s' : s + ' s';
const params = new URLSearchParams(location.search);
let api = (localStorage.getItem('pv_api') || (window.PAINEL && window.PAINEL.api) || '').replace(/\/$/, '');
let token = sessionStorage.getItem('pv_token') || '';
let range = '7d', site = '', demo = params.has('demo'), timer = 0;

/* ---------- dados de demonstração ---------- */
function demoData() {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const n = { today: 1, '7d': 7, '30d': 30, '90d': 90 }[range];
  const daily = []; for (let i = n - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5); const v = Math.round(40 + rnd() * 90 + (d.getDay() % 6 === 0 ? 50 : 0)); daily.push({ d: d.toISOString().slice(0, 10), visitors: v, pageviews: Math.round(v * (2 + rnd() * 1.5)) }); }
  const hourly = Array.from({ length: 24 }, (_, h) => ({ h, n: Math.round((h > 8 && h < 22 ? 20 : 2) * (1 + rnd()) * (h === 12 || h === 19 ? 2.2 : 1)) }));
  const vs = daily.reduce((a, d) => a + d.visitors, 0), pv = daily.reduce((a, d) => a + d.pageviews, 0), ss = Math.round(vs * 1.15);
  const L = (arr, base) => arr.map((k, i) => ({ k, n: Math.max(1, Math.round(base * (1 - i * 0.13) * (0.8 + rnd() * 0.4))) }));
  const LU = (arr, base) => L(arr, base).map(x => ({ ...x, u: Math.max(1, Math.round(x.n * 0.8)) }));
  const recent = Array.from({ length: 16 }, (_, i) => { const t = [['pageview', '', '/menu.html'], ['view_item', 'Waffle Clássico', '/menu.html'], ['add_to_cart', 'Brownie com Gelado', '/menu.html'], ['click', 'whatsapp', '/'], ['gallery', 'A nossa fachada', '/galeria.html'], ['order', 'whatsapp', '/menu.html'], ['store', 'Talatona Shopping', '/localizacao.html']][Math.floor(rnd() * 7)]; return { ts: Date.now() - i * 150000 - rnd() * 90000, type: t[0], name: t[1], path: t[2], device: rnd() > .25 ? 'Telemóvel' : 'Computador', city: ['Luanda', 'Luanda', 'Talatona', 'Viana'][Math.floor(rnd() * 4)], v: Math.random().toString(16).slice(2, 6) }; });
  return { range, site, generated: Date.now(), sites: ['chocolate-sarayi', 'xurrascao-no-limao'],
    kpi: { visitors: vs, sessions: ss, pageviews: pv, newVisitors: Math.round(vs * .64), avgTime: 74, bounce: 38, orders: Math.round(vs * .06), orderValue: Math.round(vs * .06) * 6800, live: 3 },
    daily, hourly, pages: L(['/', '/menu.html', '/galeria.html', '/localizacao.html', '/contactos.html'], pv * .4), refs: L(['Direto', 'instagram.com', 'google.com', 'l.facebook.com', 'wa.me'], ss * .4),
    devices: L(['Telemóvel', 'Computador', 'Tablet'], vs * .7), browsers: L(['Chrome', 'Safari', 'Instagram (app)', 'Samsung Internet', 'Firefox'], vs * .5), os: L(['Android', 'iOS', 'Windows', 'macOS'], vs * .55),
    countries: L(['AO', 'PT', 'BR'], vs * .9), cities: L(['Luanda', 'Talatona', 'Viana', 'Cacuaco', 'Benguela'], vs * .6),
    viewed: LU(['Waffle Clássico', 'Brownie com Gelado', 'Crepe com Caramelo', 'Bolo de Chocolate', 'Fonte de Chocolate', 'Profiteroles'], vs * .35), added: LU(['Brownie com Gelado', 'Waffle Clássico', 'Panqueca com Gelado', 'Crepe de Morango'], vs * .12),
    gallery: LU(['A nossa fachada', 'A nossa vitrine', 'Nos bastidores', 'O nosso espaço'], vs * .1), clicks: LU(['whatsapp', 'direcoes', 'telefone', 'instagram'], vs * .15),
    stores: LU(['Morro Bento', 'Talatona Shopping', 'Patriota'], vs * .12), sections: LU(['hero', 'menu', 'sobre', 'galeria', 'contactos'], ss * .8),
    scroll: [{ k: '25', n: Math.round(ss * .8) }, { k: '50', n: Math.round(ss * .55) }, { k: '75', n: Math.round(ss * .34) }, { k: '100', n: Math.round(ss * .18) }],
    funnel: { sessions: ss, viewed: Math.round(ss * .42), added: Math.round(ss * .13), ordered: Math.round(ss * .06) }, recent };
}

/* ---------- API ---------- */
async function call(path, raw) {
  const r = await fetch(api + path, { headers: { Authorization: 'Bearer ' + token } });
  if (r.status === 401) { const e = new Error('401'); e.code = 401; throw e; }
  if (!r.ok) throw new Error(String(r.status));
  return raw ? r.blob() : r.json();
}
async function load() {
  let d;
  try { d = demo ? demoData() : await call(`/api/stats?range=${range}&site=${encodeURIComponent(site)}`); }
  catch (e) { if (e.code === 401) { logout(); return showLogin('Palavra-passe incorreta.'); } return $('#updated').textContent = 'Erro ao ligar ao servidor — a tentar de novo…'; }
  render(d);
}

/* ---------- desenho ---------- */
function bars(el, rows, opt = {}) {
  const max = Math.max(1, ...rows.map(r => r.n));
  el.innerHTML = rows.length ? rows.map(r => `<div class="bar"><span class="k" title="${esc(r.k)}">${esc(opt.fmt ? opt.fmt(r.k) : r.k)}</span><span class="n">${nf(r.n)}${opt.suffix ? esc(opt.suffix(r)) : ''}</span><span class="t"><i style="width:${Math.max(3, Math.round(100 * r.n / max))}%"></i></span></div>`).join('') : '<p class="empty">Ainda sem dados.</p>';
}
function colChart(el, data, key, label, labelEvery) {
  const W = 600, H = 190, pad = 22, max = Math.max(1, ...data.map(d => d[key]));
  if (!data.length) return el.innerHTML = '<p class="empty">Ainda sem dados.</p>';
  const bw = (W - 10) / data.length;
  const g = data.map((d, i) => { const h = Math.max(2, (H - pad - 18) * d[key] / max), x = 5 + i * bw; return `<rect x="${x + bw * .12}" y="${H - pad - h}" width="${bw * .76}" height="${h}" rx="3" fill="#BB8B4A"><title>${esc(label(d))}: ${nf(d[key])}</title></rect>${i % labelEvery === 0 ? `<text x="${x + bw / 2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="#7c6a5b">${esc(label(d))}</text>` : ''}`; }).join('');
  el.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico"><text x="5" y="12" font-size="11" fill="#7c6a5b">máx. ${nf(max)}</text>${g}</svg>`;
}
const tagFor = t => ({ pageview: ['Entrou', ''], view_item: ['Viu', ''], add_to_cart: ['Carrinho', 'g'], order: ['Pedido', 'o'], click: ['Clicou', ''], gallery: ['Abriu', ''], store: ['Loja', ''], section: ['Secção', ''] }[t]);
const clickName = n => ({ whatsapp: 'WhatsApp', direcoes: 'Direções (mapa)', telefone: 'Telefone', email: 'E-mail', instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube' }[n] || n);

function render(d) {
  $('#demoBanner').hidden = !demo;
  $('#updated').textContent = 'Atualizado às ' + new Date(d.generated).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  const sel = $('#site'), cur = site;
  sel.innerHTML = '<option value="">Todos os sites</option>' + d.sites.map(s => `<option value="${esc(s)}"${s === cur ? ' selected' : ''}>${esc(s)}</option>`).join('');
  const k = d.kpi, ret = k.visitors ? Math.round(100 * (k.visitors - k.newVisitors) / k.visitors) : 0;
  const cards = [['Visitantes', nf(k.visitors), 'pessoas diferentes'], ['Visitas', nf(k.sessions), 'sessões'], ['Páginas vistas', nf(k.pageviews), ''], ['Tempo médio', dur(k.avgTime), 'por página'], ['Voltam ao site', ret + '%', 'já tinham visitado'], ['Saem logo', k.bounce + '%', 'viram só 1 página'], ['Pedidos', nf(k.orders), k.orderValue ? kz(k.orderValue) : 'enviados pelo WhatsApp'], ['A navegar agora', nf(k.live), 'últimos 5 min', 'live']];
  $('#kpis').innerHTML = cards.map(c => `<div class="kpi ${c[3] || ''}"><b>${esc(c[1])}</b><span>${esc(c[0])}${c[2] ? ' · ' + esc(c[2]) : ''}</span></div>`).join('');
  const every = Math.max(1, Math.ceil(d.daily.length / 8));
  colChart($('#daily'), d.daily, 'visitors', x => x.d.slice(8, 10) + '/' + x.d.slice(5, 7), every);
  const hrs = Array.from({ length: 24 }, (_, h) => ({ h, n: (d.hourly.find(x => x.h === h) || {}).n || 0 }));
  colChart($('#hourly'), hrs, 'n', x => x.h + 'h', 3);
  bars($('#viewed'), d.viewed); bars($('#added'), d.added); bars($('#gallery'), d.gallery);
  const f = d.funnel, base = Math.max(1, f.sessions), steps = [['Visitas', f.sessions], ['Viram um item', f.viewed], ['Adicionaram ao carrinho', f.added], ['Enviaram o pedido', f.ordered]];
  bars($('#funnel'), steps.map(s => ({ k: s[0], n: s[1] })), { suffix: r => ` (${Math.round(100 * r.n / base)}%)` });
  bars($('#sections'), d.sections); bars($('#stores'), d.stores);
  bars($('#pages'), d.pages); bars($('#refs'), d.refs); bars($('#clicks'), d.clicks, { fmt: clickName });
  bars($('#devices'), d.devices); bars($('#os'), d.os); bars($('#browsers'), d.browsers); bars($('#cities'), d.cities); bars($('#countries'), d.countries);
  const sb = Math.max(1, k.sessions);
  bars($('#scroll'), d.scroll.map(s => ({ k: 'Até ' + s.k + '% da página', n: Math.min(s.n, sb) })), { suffix: r => ` (${Math.round(100 * r.n / sb)}%)` });
  const fmt = new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Luanda' });
  const ev = d.recent.filter(e => tagFor(e.type));
  $('#recent').innerHTML = ev.length ? ev.map(e => { const [lab, cls] = tagFor(e.type); const what = e.type === 'pageview' ? esc(e.path) : e.type === 'click' ? esc(clickName(e.name)) : esc(e.name || e.path);
    return `<div class="ev"><time>${fmt.format(e.ts)}</time><div><span class="tag ${cls}">${lab}</span>${what}<br><em>Visitante #${esc(e.v)} · ${esc(e.device || '')}${e.city ? ' · ' + esc(e.city) : ''}</em></div></div>`; }).join('') : '<p class="empty">Ainda sem atividade.</p>';
}

/* ---------- ecrãs e ações ---------- */
function showLogin(msg) {
  $('#app').hidden = true; $('#login').hidden = false;
  $('#api').value = api.includes('SEU-WORKER') ? '' : api;
  const e = $('#loginErr'); e.hidden = !msg; e.textContent = msg || '';
}
function showApp() { $('#login').hidden = true; $('#app').hidden = false; load(); clearInterval(timer); timer = setInterval(() => { if (!document.hidden) load(); }, 30000); }
function logout() { sessionStorage.removeItem('pv_token'); token = ''; clearInterval(timer); }
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); demo = false;
  api = $('#api').value.trim().replace(/\/$/, ''); token = $('#pw').value;
  localStorage.setItem('pv_api', api);
  try { await call('/api/stats?range=today'); sessionStorage.setItem('pv_token', token); showApp(); }
  catch (er) { showLogin(er.code === 401 ? 'Palavra-passe incorreta.' : 'Não consegui ligar ao Worker. Confirme o endereço.'); }
});
$('#demoBtn').addEventListener('click', () => { demo = true; showApp(); });
$('#range').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; range = b.dataset.r; [...$('#range').children].forEach(x => x.classList.toggle('on', x === b)); load(); });
$('#site').addEventListener('change', e => { site = e.target.value; load(); });
$('#refresh').addEventListener('click', load);
$('#menuBtn').addEventListener('click', () => { const m = $('#more'); m.hidden = !m.hidden; });
$('#logout').addEventListener('click', () => { logout(); demo = false; showLogin(); });
const ign = $('#ignore'), setIgn = () => { ign.textContent = localStorage.getItem('tk_ignore') === '1' ? 'Voltar a contar as minhas visitas' : 'Não contar as minhas visitas (neste aparelho)'; };
ign.addEventListener('click', () => { localStorage.getItem('tk_ignore') === '1' ? localStorage.removeItem('tk_ignore') : localStorage.setItem('tk_ignore', '1'); setIgn(); }); setIgn();
$('#csv').addEventListener('click', async () => {
  if (demo) return alert('A exportação só funciona com dados reais.');
  try { const b = await call(`/api/export?range=${range}&site=${encodeURIComponent(site)}`, true); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'visitas.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); } catch (e) { alert('Não foi possível exportar.'); }
});

if (demo) showApp(); else if (token && api && !api.includes('SEU-WORKER')) showApp(); else showLogin();
})();
