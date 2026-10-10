import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { MenuItem } from "../data/site";
import SafeImage from "./SafeImage";

export default function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Feedback visual temporário depois de adicionar ao cesto.
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-cacau-800/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-cacau-800/10">
        <SafeImage
          src={item.image}
          fallback={item.fallbackImage}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base leading-snug text-cacau-800 md:text-lg">{item.name}</h3>
        <p className="mt-1 text-xs italic text-cacau-700/80">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-sm font-semibold text-cacau-800">{item.price}</p>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Adicionar ${item.name} ao cesto`}
            className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition ${
              added ? "bg-gold text-cacau-950" : "bg-cacau-800 text-creme hover:bg-cacau-950"
            }`}
          >
            {added ? <Check size={14} /> : <Plus size={14} />}
            {added ? "Adicionado" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
