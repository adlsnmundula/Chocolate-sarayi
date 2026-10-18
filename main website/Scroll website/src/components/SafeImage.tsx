import { useEffect, useState } from "react";

interface SafeImageProps {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

// Mostra a imagem principal; se o ficheiro não existir, usa a imagem de reserva.
export default function SafeImage({ src, fallback, alt, className, loading }: SafeImageProps) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (fallback && current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
