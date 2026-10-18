import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons";
import { EXTERNAL_LINKS, LOGO_FALLBACK, LOGO_SRC, NAV_LINKS } from "../data/site";

const SOCIALS = [
  { label: "Instagram", href: EXTERNAL_LINKS.instagram, icon: <InstagramIcon size={15} /> },
  { label: "Facebook", href: EXTERNAL_LINKS.facebook, icon: <FacebookIcon size={15} /> },
  { label: "TikTok", href: EXTERNAL_LINKS.tiktok, icon: <TikTokIcon size={15} /> },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-cacau-950 text-creme">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-12 text-center lg:px-8">
        <SafeImage
          src={LOGO_SRC}
          fallback={LOGO_FALLBACK}
          alt="Chocolate Sarayi"
          className="h-20 w-auto rounded-lg bg-white object-contain p-1"
        />
        <p className="text-[11px] uppercase tracking-[0.25em] text-gold/80">
          Chocolate · Café · Sobremesas · Momentos Especiais
        </p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-wider text-creme/70">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-cacau-950"
            >
              {s.icon}
            </a>
          ))}
        </div>
        <p className="text-[11px] text-creme/50">
          © 2026 Chocolat Sarayi · Luanda, Angola. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
