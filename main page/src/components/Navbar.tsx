import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu as MenuIcon, Search, ShoppingBag, X } from "lucide-react";
import SafeImage from "./SafeImage";
import { LOGO_FALLBACK, LOGO_SRC, NAV_LINKS } from "../data/site";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-cacau-950/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" aria-label="Chocolat Sarayi - Início" className="flex items-center gap-2.5">
          <SafeImage
            src={LOGO_SRC}
            fallback={LOGO_FALLBACK}
            alt="Chocolate Sarayi"
            className="h-10 w-10 rounded bg-white object-contain p-0.5"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg text-gold">Chocolat</span>
            <span className="-mt-0.5 self-end font-display text-xs italic text-gold/80">Sarayi</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-[11px] font-medium uppercase tracking-[0.16em] transition hover:text-gold ${
                  isActive ? "text-gold" : "text-creme/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/menu-visual"
            className="hidden rounded-sm border border-gold/70 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-gold transition hover:bg-gold hover:text-cacau-950 md:inline-block"
          >
            Menu Visual
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir cesto (${count} ${count === 1 ? "item" : "itens"})`}
            className="relative p-2 text-creme/80 transition hover:text-gold"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-cacau-950">
                {count}
              </span>
            )}
          </button>
          <Link to="/menu" aria-label="Pesquisar no menu" className="p-2 text-creme/80 transition hover:text-gold">
            <Search size={18} />
          </Link>
          <button
            type="button"
            className="p-2 text-creme transition hover:text-gold xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 bg-cacau-950 px-5 pb-6 pt-2 xl:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block border-b border-gold/10 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                  isActive ? "text-gold" : "text-creme/85"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/menu-visual"
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-sm border border-gold px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gold md:hidden"
          >
            Menu Visual
          </Link>
        </nav>
      )}
    </header>
  );
}
