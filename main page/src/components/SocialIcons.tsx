import { EXTERNAL_LINKS } from "../data/site";

export function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.4 1.7 3.9 4 4.1v3.1c-1.4 0-2.8-.4-4-1.2v6.1c0 3.1-2.5 5.6-5.6 5.6S5.3 18.2 5.3 15.1s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.2-.9-.2-1.3 0-2.4 1.1-2.4 2.5s1.1 2.5 2.4 2.5 2.5-1.1 2.5-2.5V3h3.1z" />
    </svg>
  );
}

export function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.2V11H7v4h3v7h4v-7h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
    </svg>
  );
}

// Pequena linha de ícones sociais (usada no cabeçalho do menu em vídeo)
export function MiniSocialRow() {
  const items = [
    { label: "TikTok", href: EXTERNAL_LINKS.tiktok, icon: <TikTokIcon /> },
    { label: "Instagram", href: EXTERNAL_LINKS.instagram, icon: <InstagramIcon /> },
    { label: "Facebook", href: EXTERNAL_LINKS.facebook, icon: <FacebookIcon /> },
  ];
  return (
    <span className="pointer-events-auto flex items-center gap-1.5">
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="flex h-6 w-6 items-center justify-center rounded-sm border border-creme/25 text-creme/80 transition hover:border-gold hover:text-gold"
        >
          {s.icon}
        </a>
      ))}
    </span>
  );
}
