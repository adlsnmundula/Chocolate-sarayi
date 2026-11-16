/*  Backend do painel de visitas — Cloudflare Worker + base de dados D1.
 *  Guarda eventos anónimos (sem IP, sem nomes) e devolve estatísticas ao painel.
 *  Variáveis: ADMIN_TOKEN (segredo, a palavra-passe do painel), ALLOWED_ORIGINS (opcional, ex.: https://utilizador.github.io)
 */
const TZ = 3600; // Luanda = UTC+1 (sem horário de verão), em segundos

const cors = (req, env) => {
  const allow = (env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
  const o = req.headers.get('Origin') || '';
  const origin = allow.includes('*') ? '*' : (allow.includes(o) ? o : allow[0]);
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Authorization,Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' };
};
const json = (data, status, h) => new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...h } });
const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, '').trim().slice(0, n);

function parseUA(ua, vw) {
  const tablet = /ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua));
  const mobile = /mobi|iphone|ipod|android/i.test(ua);
  const device = tablet ? 'Tablet' : (mobile ? 'Telemóvel' : 'Computador');
  let browser = 'Outro';
  if (/instagram/i.test(ua)) browser = 'Instagram (app)';
  else if (/fban|fbav|fb_iab/i.test(ua)) browser = 'Facebook (app)';
  else if (/tiktok|musical_ly|bytedance/i.test(ua)) browser = 'TikTok (app)';
  else if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  let os = 'Outro';
  if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux|cros/i.test(ua)) os = 'Linux';
  return { device, browser, os };
}

async function collect(req, env, h) {
  const text = await req.text();
  if (text.length > 4096) return json({ ok: false }, 413, h);
  let b; try { b = JSON.parse(text); } catch (e) { return json({ ok: false }, 400, h); }
  const ua = req.headers.get('User-Agent') || '';
  if (/bot|crawl|spider|headless|lighthouse|preview|monitor|uptime|curl|wget/i.test(ua)) return new Response(null, { status: 204, headers: h });
  const site = clean(b.site, 40), vid = clean(b.vid, 64), sid = clean(b.sid, 64), type = clean(b.type, 24);
  if (!/^[a-z0-9._-]{1,40}$/i.test(site) || !vid || !sid || !/^[a-z_]{1,24}$/.test(type)) return json({ ok: false }, 400, h);
  const props = b.props && typeof b.props === 'object' ? b.props : null;
  const ref = clean(props && (props.ref || props.utm) || '', 80);
  const value = Number.isFinite(b.value) ? Math.max(-1e9, Math.min(1e9, b.value)) : null;
  const { device, browser, os } = parseUA(ua, b.vw);
  const cf = req.cf || {};
  await env.DB.prepare('INSERT INTO events (ts,site,vid,sid,type,name,path,ref,value,device,browser,os,country,city,lang,new_visitor) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(Date.now(), site, vid, sid, type, clean(b.name, 120), clean(b.path, 200), ref, value, device, browser, os, clean(cf.country, 2), clean(cf.city, 60), clean(b.lang, 10), b.nv ? 1 : 0).run();
  return new Response(null, { status: 204, headers: h });
}

function authed(req, env) {
  const tok = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const real = env.ADMIN_TOKEN || '';
  if (!real || tok.length !== real.length) return false;
  let d = 0; for (let i = 0; i < real.length; i++) d |= tok.charCodeAt(i) ^ real.charCodeAt(i);
  return d === 0;
}

function range(url) {
  const now = Date.now(), day = 86400000, r = url.searchParams.get('range') || '7d';
  const startToday = Math.floor((now + TZ * 1000) / day) * day - TZ * 1000;
  let from;
  if (r === 'today') from = startToday;
  else { const n = { '7d': 7, '30d': 30, '90d': 90 }[r] || 7; from = startToday - (n - 1) * day; }
  return { from, to: now + 1000, now };
}

async function stats(env, url) {
  const { from, to, now } = range(url);
  const site = clean(url.searchParams.get('site'), 40);
  const W = site ? 'ts>=? AND ts<? AND site=?' : 'ts>=? AND ts<?';
  const B = site ? [from, to, site] : [from, to];
  const all = async (sql, ...extra) => (await env.DB.prepare(sql).bind(...B, ...extra).all()).results || [];
  const one = async (sql, ...extra) => (await all(sql, ...extra))[0] || {};
  const top = (col, type, distinct, lim) => all(`SELECT ${col} k, ${distinct ? 'COUNT(DISTINCT vid)' : 'COUNT(*)'} n FROM events WHERE ${W} AND type=? AND ${col}!='' GROUP BY ${col} ORDER BY n DESC LIMIT ${lim || 8}`, type);
  const byName = type => all(`SELECT name k, COUNT(*) n, COUNT(DISTINCT vid) u FROM events WHERE ${W} AND type=? AND name!='' GROUP BY name ORDER BY n DESC LIMIT 10`, type);

  const k = await one(`SELECT COUNT(DISTINCT vid) visitors, COUNT(DISTINCT sid) sessions, COUNT(*) pageviews, COUNT(DISTINCT CASE WHEN new_visitor=1 THEN vid END) newv FROM events WHERE ${W} AND type='pageview'`);
  const t = await one(`SELECT AVG(value) t FROM events WHERE ${W} AND type='time' AND value BETWEEN 1 AND 3600`);
  const bn = await one(`SELECT COUNT(*) n FROM (SELECT sid FROM events WHERE ${W} AND type='pageview' GROUP BY sid HAVING COUNT(*)=1)`);
  const od = await one(`SELECT COUNT(*) n, COALESCE(SUM(value),0) s FROM events WHERE ${W} AND type='order'`);
  const liveW = site ? 'ts>=? AND site=?' : 'ts>=?';
  const live = (await env.DB.prepare(`SELECT COUNT(DISTINCT sid) n FROM events WHERE ${liveW}`).bind(...(site ? [now - 300000, site] : [now - 300000])).first()) || {};
  const funnel = async type => (await one(`SELECT COUNT(DISTINCT sid) n FROM events WHERE ${W} AND type=?`, type)).n || 0;

  const refs = await all(`SELECT CASE WHEN ref='' THEN 'Direto' ELSE ref END k, COUNT(DISTINCT sid) n FROM events WHERE ${W} AND type='pageview' GROUP BY k ORDER BY n DESC LIMIT 8`);
  const recentW = site ? 'ts>=? AND site=?' : 'ts>=?';
  const recent = (await env.DB.prepare(`SELECT ts,site,type,name,path,device,city,country,substr(vid,1,4) v FROM events WHERE ${recentW} ORDER BY ts DESC LIMIT 40`).bind(...(site ? [now - 86400000, site] : [now - 86400000])).all()).results || [];
  const sites = ((await env.DB.prepare('SELECT DISTINCT site FROM events ORDER BY site').all()).results || []).map(r => r.site);

  return {
    range: url.searchParams.get('range') || '7d', site, generated: now, sites,
    kpi: { visitors: k.visitors || 0, sessions: k.sessions || 0, pageviews: k.pageviews || 0, newVisitors: k.newv || 0, avgTime: Math.round(t.t || 0), bounce: k.sessions ? Math.round(100 * (bn.n || 0) / k.sessions) : 0, orders: od.n || 0, orderValue: od.s || 0, live: live.n || 0 },
    daily: await all(`SELECT date((ts/1000)+${TZ},'unixepoch') d, COUNT(DISTINCT vid) visitors, COUNT(*) pageviews FROM events WHERE ${W} AND type='pageview' GROUP BY d ORDER BY d`),
    hourly: await all(`SELECT CAST(strftime('%H',(ts/1000)+${TZ},'unixepoch') AS INTEGER) h, COUNT(*) n FROM events WHERE ${W} AND type='pageview' GROUP BY h ORDER BY h`),
    pages: await top('path', 'pageview', false, 8), refs,
    devices: await top('device', 'pageview', true), browsers: await top('browser', 'pageview', true), os: await top('os', 'pageview', true),
    countries: await top('country', 'pageview', true), cities: await top('city', 'pageview', true),
    viewed: await byName('view_item'), added: await byName('add_to_cart'), clicks: await byName('click'),
    gallery: await byName('gallery'), stores: await byName('store'), sections: await byName('section'),
    scroll: await all(`SELECT name k, COUNT(DISTINCT sid||path) n FROM events WHERE ${W} AND type='scroll' GROUP BY name ORDER BY CAST(name AS INTEGER)`),
    funnel: { sessions: k.sessions || 0, viewed: await funnel('view_item'), added: await funnel('add_to_cart'), ordered: await funnel('order') },
    recent
  };
}

async function exportCsv(env, url) {
  const { from, to } = range(url), site = clean(url.searchParams.get('site'), 40);
  const sql = `SELECT ts,site,type,name,path,ref,value,device,browser,os,country,city,substr(vid,1,8) visitante FROM events WHERE ts>=? AND ts<? ${site ? 'AND site=?' : ''} ORDER BY ts DESC LIMIT 50000`;
  const rows = (await env.DB.prepare(sql).bind(...(site ? [from, to, site] : [from, to])).all()).results || [];
  const cols = ['ts', 'site', 'type', 'name', 'path', 'ref', 'value', 'device', 'browser', 'os', 'country', 'city', 'visitante'];
  const q = v => { v = v == null ? '' : String(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const body = [cols.join(',')].concat(rows.map(r => cols.map(c => q(c === 'ts' ? new Date(r.ts + TZ * 1000).toISOString().replace('T', ' ').slice(0, 19) : r[c])).join(','))).join('\n');
  return body;
}

export default {
  async fetch(req, env) {
    const h = cors(req, env), url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    try {
      if (url.pathname === '/collect' && req.method === 'POST') return await collect(req, env, h);
      if (url.pathname.startsWith('/api/')) {
        if (!authed(req, env)) return json({ error: 'unauthorized' }, 401, h);
        if (url.pathname === '/api/stats') return json(await stats(env, url), 200, h);
        if (url.pathname === '/api/export') return new Response(await exportCsv(env, url), { headers: { ...h, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="visitas.csv"' } });
      }
      if (url.pathname === '/') return new Response('Painel de visitas: ok', { headers: h });
      return json({ error: 'not_found' }, 404, h);
    } catch (e) { console.error(e && e.stack || e); return json({ error: 'server_error' }, 500, h); }
  },
  // limpeza diária: apaga eventos com mais de 400 dias
  async scheduled(event, env) { await env.DB.prepare('DELETE FROM events WHERE ts<?').bind(Date.now() - 400 * 86400000).run(); }
};
