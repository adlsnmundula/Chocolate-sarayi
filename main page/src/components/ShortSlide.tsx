import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Heart, Share2, ShoppingBag } from "lucide-react";
import SafeImage from "./SafeImage";
import type { MenuItem } from "../data/site";

interface ShortSlideProps {
  item: MenuItem;
  video?: string;
  isActive: boolean;
  liked: boolean;
  onToggleLike: () => void;
  onAdd: () => void;
  onShare: () => void;
}

function RailButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex flex-col items-center gap-1.5 text-creme">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition ${
          active
            ? "bg-gold text-cacau-950"
            : "bg-cacau-950/50 ring-1 ring-gold/30 hover:bg-cacau-950/80 hover:text-gold"
        }`}
      >
        {children}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-creme/90">{label}</span>
    </button>
  );
}

export default function ShortSlide({
  item,
  video,
  isActive,
  liked,
  onToggleLike,
  onAdd,
  onShare,
}: ShortSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [added, setAdded] = useState(false);

  // Feedback temporário depois de adicionar ao cesto.
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(t);
  }, [added]);

  // Só o vídeo do slide visível é reproduzido.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  const handleAdd = () => {
    onAdd();
    setAdded(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-cacau-950">
      {/* Fotografia: fica por baixo do vídeo e serve de fallback */}
      <SafeImage
        src={item.image}
        fallback={item.fallbackImage}
        alt={item.name}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] ease-linear ${
          isActive ? "scale-110" : "scale-100"
        }`}
      />

      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onLoadedData={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-cacau-950 via-cacau-950/25 to-cacau-950/30" />

      {/* Informação do produto */}
      <div className="absolute inset-x-0 bottom-0 pb-10 pl-5 pr-20 md:pb-12">
        <span className="inline-block rounded-sm bg-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cacau-950">
          {item.category}
        </span>
        <h2 className="mt-3 font-display text-3xl leading-tight text-creme md:text-4xl">{item.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-creme/85">{item.description}</p>
        <p className="mt-4 text-lg font-semibold text-gold">{item.price}</p>
      </div>

      {/* Barra de ações (estilo TikTok) */}
      <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5 md:bottom-32">
        <RailButton label="Gostei" onClick={onToggleLike} active={liked}>
          <Heart size={22} fill={liked ? "currentColor" : "none"} />
        </RailButton>
        <RailButton label={added ? "Adicionado" : "Cesto"} onClick={handleAdd} active={added}>
          {added ? <Check size={22} /> : <ShoppingBag size={22} />}
        </RailButton>
        <RailButton label="Partilhar" onClick={onShare}>
          <Share2 size={21} />
        </RailButton>
      </div>
    </div>
  );
}
