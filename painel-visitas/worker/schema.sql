CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,            -- milissegundos (UTC)
  site TEXT NOT NULL,
  vid TEXT NOT NULL,              -- visitante anónimo (id aleatório no navegador)
  sid TEXT NOT NULL,              -- sessão
  type TEXT NOT NULL,             -- pageview, scroll, time, view_item, add_to_cart, order, click, gallery, store, section...
  name TEXT DEFAULT '',
  path TEXT DEFAULT '',
  ref TEXT DEFAULT '',
  value REAL,
  device TEXT, browser TEXT, os TEXT, country TEXT, city TEXT, lang TEXT,
  new_visitor INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_ev_site_ts ON events(site, ts);
CREATE INDEX IF NOT EXISTS idx_ev_type_ts ON events(type, ts);
