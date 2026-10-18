import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import SafeImage from "../components/SafeImage";
import { EXTERNAL_LINKS, LOCATIONS, LOGO_FALLBACK, LOGO_SRC } from "../data/site";

const BUTTON_CLASS =
  "block rounded-md border border-gold/40 bg-cacau-900/70 px-4 py-3.5 text-center text-sm font-medium tracking-wide text-creme transition hover:border-gold hover:bg-gold hover:text-cacau-950";

const EXTERNAL_BUTTONS = [
  { label: "Website oficial", href: EXTERNAL_LINKS.website },
  { label: "Instagram", href: EXTERNAL_LINKS.instagram },
  { label: "Facebook", href: EXTERNAL_LINKS.facebook },
  { label: "TikTok", href: EXTERNAL_LINKS.tiktok },
];

export default function Landing() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-cacau-950">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-14 md:pt-20">
        {/* Logótipo e nome */}
        <div className="flex flex-col items-center text-center">
          <SafeImage
            src={LOGO_SRC}
            fallback={LOGO_FALLBACK}
            alt="Chocolate Sarayi — Chocolate Sweets & Coffee House"
            className="h-44 w-auto rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-gold/30"
          />
          <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-gold">@chocolatsarayi.luanda</p>
          <p className="mt-2 text-xs text-creme/60">Menu oficial e contactos</p>
        </div>

        {/* Ligações */}
        <nav className="mt-10 flex flex-col gap-3" aria-label="Ligações oficiais">
          <Link to="/menu-visual" className={BUTTON_CLASS}>
            Menu Visual
          </Link>
          {EXTERNAL_BUTTONS.map((b) => (
            <a
              key={b.label}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className={BUTTON_CLASS}
            >
              {b.label}
            </a>
          ))}
        </nav>

        {/* Localizações */}
        <div className="mt-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Localizações</p>
          <ul className="mt-3 divide-y divide-gold/10 rounded-md border border-gold/20 bg-cacau-900/60">
            {LOCATIONS.map((location) => (
              <li key={location.name} className="flex items-center gap-3 px-4 py-3.5">
                <MapPin className="shrink-0 text-gold" size={18} strokeWidth={1.6} />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-creme">{location.name}</span>
                  <span className="text-[11px] text-creme/60">{location.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rodapé */}
        <footer className="mt-auto pt-12">
          <div className="rounded-md border border-gold/20 bg-cacau-900/60 px-4 py-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Redirecionamento oficial</p>
            <p className="mt-2 text-xs tracking-wide text-creme/80">
              Chocolates · Sandes · Pizzas · Sobremesas
            </p>
          </div>
          <p className="mt-5 text-center text-[10px] text-creme/40">
            © 2026 Chocolate Sarayi · Luanda, Angola
          </p>
        </footer>
      </main>
    </div>
  );
}
