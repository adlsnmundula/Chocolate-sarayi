import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import SafeImage from "../components/SafeImage";
import ShortSlide from "../components/ShortSlide";
import { useCart } from "../context/CartContext";
import { LOGO_FALLBACK, LOGO_SRC, MENU_ITEMS, MENU_VIDEOS } from "../data/site";
import type { MenuItem } from "../data/site";

type MenuType = "doces" | "sobremesas" | "outros";

const MENU_TYPES: { id: MenuType; label: string }[] = [
  { id: "doces", label: "Doces" },
  { id: "sobremesas", label: "Sobremesas" },
  { id: "outros", label: "Bebidas/Outros" },
];

// Agrupa as categorias do menu nos três tipos mostrados no cabeçalho.
const TYPE_OF: Record<string, MenuType> = {
  Chocolates: "doces",
  Sobremesas: "sobremesas",
  Bebidas: "outros",
  "Sanduíches": "outros",
};

const LIKES_KEY = "chocolat-sarayi-likes";

function loadLikes(): number[] {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as number[]) : [];
  } catch {
    return [];
  }
}

export default function TikTokMenu() {
  const { addItem, count, openCart } = useCart();
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [type, setType] = useState<MenuType>("doces");
  const items = useMemo(() => MENU_ITEMS.filter((i) => TYPE_OF[i.category] === type), [type]);
  const [active, setActive] = useState(0);
  const [likes, setLikes] = useState<number[]>(loadLikes);
  const [toast, setToast] = useState<string | null>(null);

  const total = items.length;

  // Guarda os "gostos" no navegador.
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch {
      // Armazenamento indisponível: os gostos só duram nesta sessão.
    }
  }, [likes]);

  // Deteta qual o slide visível para reproduzir apenas esse vídeo.
  useEffect(() => {
    const root = document.getElementById("tiktok-feed");
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { root, threshold: [0.6] }
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [type]);

  const changeType = (next: MenuType) => {
    if (next === type) return;
    slideRefs.current = [];
    setActive(0);
    setType(next);
    document.getElementById("tiktok-feed")?.scrollTo({ top: 0 });
  };

  const goTo = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Setas ↑ ↓ do teclado para mudar de item.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(Math.min(active + 1, total - 1));
      if (e.key === "ArrowUp") goTo(Math.max(active - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const toggleLike = (id: number) => {
    setLikes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    showToast(`${item.name} adicionado ao cesto`);
  };

  const handleShare = async (item: MenuItem) => {
    const text = `${item.name} · ${item.price} — Chocolate Sarayi`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.name, text, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      showToast("Link copiado!");
    } catch {
      // Partilha cancelada ou não suportada.
    }
  };

  return (
    <section className="bg-cacau-950">
      <div className="relative mx-auto h-[100svh] min-h-[560px] max-w-[460px] overflow-hidden md:my-6 md:h-[calc(100svh-3rem)] md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-gold/20">
        <div
          id="tiktok-feed"
          key={type}
          className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
        >
          {items.map((item, i) => (
            <section
              key={item.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              className="relative h-full w-full snap-start snap-always"
            >
              <ShortSlide
                item={item}
                video={MENU_VIDEOS[item.id]}
                isActive={i === active}
                liked={likes.includes(item.id)}
                onToggleLike={() => toggleLike(item.id)}
                onAdd={() => handleAdd(item)}
                onShare={() => handleShare(item)}
              />
            </section>
          ))}
        </div>

        {/* Cabeçalho sobreposto */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-cacau-950/90 to-transparent px-5 pb-14 pt-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="pointer-events-auto text-[11px] font-medium uppercase tracking-[0.25em] text-gold transition hover:text-gold-light"
            >
              Menu Visual
            </Link>
            <div className="pointer-events-auto flex items-center gap-3">
              <span className="text-xs tabular-nums text-creme/70">
                {active + 1}/{total}
              </span>
              <button
                type="button"
                onClick={openCart}
                aria-label={`Abrir cesto (${count} ${count === 1 ? "item" : "itens"})`}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-cacau-950/40 text-gold backdrop-blur transition hover:bg-gold hover:text-cacau-950"
              >
                <ShoppingBag size={17} />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold leading-none text-cacau-950">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <SafeImage
              src={LOGO_SRC}
              fallback={LOGO_FALLBACK}
              alt="Chocolate Sarayi"
              className="h-9 w-auto rounded bg-white px-1 object-contain"
            />
            <div className="pointer-events-auto flex gap-1.5" role="tablist" aria-label="Tipos do menu">
              {MENU_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={type === t.id}
                  onClick={() => changeType(t.id)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                    type === t.id
                      ? "bg-gold text-cacau-950"
                      : "border border-creme/30 bg-cacau-950/40 text-creme/85 backdrop-blur hover:border-gold hover:text-gold"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {toast && (
          <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-4 py-2 text-xs font-medium text-cacau-950 shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </section>
  );
}
