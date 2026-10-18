import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { NAV_LINKS } from "../data/site";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-cacau-950 text-creme">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-12 text-center lg:px-8">
        <Logo />
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
        <SocialLinks />
        <p className="text-[11px] text-creme/50">
          © 2026 Chocolat Sarayi · Luanda, Angola. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
