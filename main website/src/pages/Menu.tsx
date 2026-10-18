import { useState } from "react";
import MenuCard from "../components/MenuCard";
import { MENU_FILTERS, MENU_ITEMS } from "../data/site";
import type { MenuFilter } from "../data/site";

export default function Menu() {
  const [active, setActive] = useState<MenuFilter>("Todos");

  const items = active === "Todos" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === active);

  return (
    <section className="min-h-[80vh] bg-papel py-16 text-cacau-800 md:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl">O Nosso Menu</h1>
        <p className="mt-3 text-sm text-cacau-700 md:text-base">
          Uma variedade de sabores para todos os gostos.
        </p>

        <div role="tablist" aria-label="Categorias do menu" className="mt-8 flex flex-wrap gap-2.5">
          {MENU_FILTERS.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter)}
                className={`rounded-full px-5 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-cacau-800 text-creme shadow-sm"
                    : "bg-white text-cacau-800 ring-1 ring-cacau-800/10 hover:ring-gold"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {items.length === 0 && <p className="mt-10 text-center text-cacau-700">Sem itens nesta categoria.</p>}
      </div>
    </section>
  );
}
