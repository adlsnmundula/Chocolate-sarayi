import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GALLERY_ITEMS, photo } from "../data/site";

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const current = selected !== null ? GALLERY_ITEMS[selected] : null;

  return (
    <section className="bg-papel py-16 text-cacau-800 md:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Galeria</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Momentos que nos inspiram</h1>
        <p className="mt-3 text-sm text-cacau-700 md:text-base">
          Conheça um pouco mais do nosso espaço e das nossas delícias.
        </p>

        <div className="mt-10 grid auto-rows-[160px] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4 md:gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Ampliar imagem: ${item.alt}`}
              className={`group relative overflow-hidden rounded-md bg-cacau-800/10 ${item.span}`}
            >
              <img
                src={photo(item.id, 900, 700)}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-cacau-950/0 transition group-hover:bg-cacau-950/20" />
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-cacau-950/95 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full p-2 text-creme transition hover:text-gold"
          >
            <X size={28} />
          </button>
          <img
            src={photo(current.id, 1600, 1100)}
            alt={current.alt}
            className="max-h-[88vh] max-w-full rounded-md object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
