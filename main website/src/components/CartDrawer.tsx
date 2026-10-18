import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import SafeImage from "./SafeImage";
import { CONTACT, formatKz } from "../data/site";

type View = "cart" | "checkout" | "success";

const TITLES: Record<View, string> = {
  cart: "O seu pedido",
  checkout: "Finalizar pedido",
  success: "Pedido confirmado",
};

const labelClass = "flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-cacau-700";

const inputClass =
  "w-full rounded-sm border border-cacau-800/15 bg-white px-3 py-2.5 text-sm normal-case tracking-normal text-cacau-800 placeholder:text-cacau-700/50 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function CartDrawer() {
  const { items, count, total, isOpen, closeCart, increment, decrement, removeItem, clearCart } = useCart();
  const [view, setView] = useState<View>("cart");
  const [orderNumber, setOrderNumber] = useState("");

  // Volta à vista do cesto depois de o painel fechar (após a animação).
  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => setView("cart"), 350);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Tecla Escape fecha o painel e bloqueia o scroll da página enquanto está aberto.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderNumber(String(Math.floor(1000 + Math.random() * 9000)));
    clearCart();
    setView("success");
  };

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-cacau-950/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[view]}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-papel text-cacau-800 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-cacau-800/10 px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            {view === "checkout" && (
              <button
                type="button"
                onClick={() => setView("cart")}
                aria-label="Voltar ao pedido"
                className="p-1 text-cacau-800 transition hover:text-gold"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-display text-2xl">{TITLES[view]}</h2>
            {view === "cart" && count > 0 && (
              <span className="text-xs text-cacau-700">
                ({count} {count === 1 ? "item" : "itens"})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar"
            className="p-1 text-cacau-800 transition hover:text-gold"
          >
            <X size={22} />
          </button>
        </header>

        {view === "cart" &&
          (items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag size={48} strokeWidth={1.2} className="text-gold" />
              <p className="font-display text-xl">O seu cesto está vazio.</p>
              <p className="max-w-xs text-sm text-cacau-700">
                Escolha as suas sobremesas e bebidas favoritas no menu para começar o pedido.
              </p>
              <Link
                to="/menu"
                onClick={closeCart}
                className="mt-2 rounded-sm bg-cacau-800 px-6 py-3 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-950"
              >
                Ver menu
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-cacau-800/10 overflow-y-auto px-6">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    <SafeImage
                      src={item.image}
                      fallback={item.fallbackImage}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-md object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base leading-snug">{item.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remover ${item.name}`}
                          className="p-1 text-cacau-700 transition hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-cacau-700">{formatKz(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-sm border border-cacau-800/20 bg-white">
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            className="p-2 transition hover:text-gold"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className="p-2 transition hover:text-gold"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatKz(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="border-t border-cacau-800/10 px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cacau-700">Subtotal</span>
                  <span className="text-base font-semibold">{formatKz(total)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setView("checkout")}
                  className="mt-4 w-full rounded-sm bg-cacau-800 py-3.5 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-950"
                >
                  Finalizar pedido
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full text-xs uppercase tracking-wider text-cacau-700 underline underline-offset-4 transition hover:text-cacau-800"
                >
                  Esvaziar cesto
                </button>
              </footer>
            </>
          ))}

        {view === "checkout" && (
          <form onSubmit={handleCheckout} className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 space-y-5 px-6 py-6">
              <div className="rounded-md bg-white p-4 ring-1 ring-cacau-800/5">
                <p className="text-xs font-medium uppercase tracking-wider text-cacau-700">Resumo do pedido</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span className="shrink-0">{formatKz(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-cacau-800/10 pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatKz(total)}</span>
                </div>
              </div>

              <label className={labelClass}>
                Nome
                <input required name="nome" type="text" placeholder="O seu nome" className={inputClass} />
              </label>
              <label className={labelClass}>
                Telefone
                <input required name="telefone" type="tel" placeholder="+244 9XX XXX XXX" className={inputClass} />
              </label>
              <label className={labelClass}>
                Tipo de pedido
                <select name="tipo" className={inputClass}>
                  <option>Takeaway</option>
                  <option>Consumir no local</option>
                </select>
              </label>
              <label className={labelClass}>
                Observações
                <textarea
                  name="observacoes"
                  rows={3}
                  placeholder="Alergias, pedidos especiais..."
                  className={`${inputClass} resize-y`}
                />
              </label>
            </div>

            <div className="border-t border-cacau-800/10 px-6 py-5">
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full rounded-sm bg-cacau-800 py-3.5 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirmar pedido · {formatKz(total)}
              </button>
            </div>
          </form>
        )}

        {view === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-cacau-950">
              <Check size={30} />
            </div>
            <p className="font-display text-2xl">Obrigado pelo seu pedido!</p>
            <p className="text-sm text-cacau-700">
              Número do pedido <span className="font-semibold text-cacau-800">#{orderNumber}</span>
            </p>
            <p className="max-w-xs text-sm text-cacau-700">
              Entraremos em contacto para confirmar. Também pode ligar para {CONTACT.phone}.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-4 rounded-sm border border-cacau-800 px-6 py-3 text-xs font-medium uppercase tracking-wider text-cacau-800 transition hover:bg-cacau-800 hover:text-creme"
            >
              Continuar a explorar
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
