import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Armchair, CakeSlice, ChevronLeft, ChevronRight, Coffee, Leaf } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MenuCard from "../components/MenuCard";
import { FEATURES, HERO_SLIDES, MENU_ITEMS } from "../data/site";

const ICONS: Record<string, LucideIcon> = { CakeSlice, Armchair, Leaf, Coffee };

export default function Home() {
  const [index, setIndex] = useState(0);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), 7000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const slide = HERO_SLIDES[index];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate h-[600px] overflow-hidden bg-cacau-950 md:h-[640px]">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            <img src={s.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-cacau-950/95 via-cacau-950/70 to-cacau-950/10" />
          </div>
        ))}

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 lg:px-8">
          <div key={index} className="max-w-xl animate-fade-up">
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-gold">Chocolat Sarayi · Luanda</p>
            <h1 className="whitespace-pre-line font-display text-4xl leading-tight text-creme md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-creme/80 md:text-base">{slide.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="rounded-sm border border-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-gold transition hover:bg-gold hover:text-cacau-950"
              >
                Ver Menu
              </Link>
              <Link
                to="/menu-visual"
                className="rounded-sm bg-cacau-800 px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-creme transition hover:bg-cacau-950"
              >
                Menu Visual
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Slide anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-creme/80 transition hover:text-gold md:left-6"
        >
          <ChevronLeft size={34} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Próximo slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-creme/80 transition hover:text-gold md:right-6"
        >
          <ChevronRight size={34} />
        </button>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-1.5 bg-creme/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="border-t border-gold/20 bg-cacau-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-gold/15">
          {FEATURES.map(({ icon, label }) => {
            const Icon = ICONS[icon];
            return (
              <div key={label} className="flex flex-col items-center gap-3 px-4 py-8 text-center">
                <Icon className="text-gold" size={28} strokeWidth={1.5} />
                <span className="text-xs tracking-wide text-creme/85">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Destaques */}
      <section className="bg-papel py-20 text-cacau-800">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Destaques</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">As nossas favoritas</h2>
              <p className="mt-2 text-sm text-cacau-700">Uma seleção dos pratos que os nossos clientes mais adoram.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/menu-visual"
                className="rounded-sm bg-cacau-800 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-950"
              >
                Menu Visual
              </Link>
              <Link
                to="/menu"
                className="rounded-sm border border-cacau-800 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-cacau-800 transition hover:bg-cacau-800 hover:text-creme"
              >
                Ver menu completo
              </Link>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_ITEMS.slice(0, 4).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
