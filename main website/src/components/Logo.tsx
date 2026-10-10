export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M24 6c-7 6-10 14-9 22 .6 4.5 4 8 9 10 5-2 8.4-5.5 9-10 1-8-2-16-9-22z" />
        <path d="M24 12v30" />
        <path d="M24 20l-5-4M24 20l5-4M24 28l-6-4M24 28l6-4" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg text-gold md:text-xl">Chocolat</span>
        <span className="-mt-0.5 self-end font-display text-xs italic text-gold/80">Sarayi</span>
      </span>
    </div>
  );
}
