import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "../components/SocialIcons";
import { CONTACT, EXTERNAL_LINKS } from "../data/site";

const fieldClass =
  "w-full rounded-sm border border-cacau-800/15 bg-papel px-4 py-3 text-sm text-cacau-800 placeholder:text-cacau-700/50 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

const SOCIALS = [
  { label: "Instagram", href: EXTERNAL_LINKS.instagram, icon: <InstagramIcon size={14} /> },
  { label: "Facebook", href: EXTERNAL_LINKS.facebook, icon: <FacebookIcon size={14} /> },
  { label: "TikTok", href: EXTERNAL_LINKS.tiktok, icon: <TikTokIcon size={14} /> },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <section className="bg-papel py-16 text-cacau-800 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Contacto</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Fale connosco</h1>
          <p className="mt-3 text-sm text-cacau-700 md:text-base">Estamos sempre disponíveis para si.</p>

          <ul className="mt-10 space-y-6">
            <li className="flex items-center gap-4">
              <Phone className="shrink-0 text-cacau-800" size={20} strokeWidth={1.6} />
              <a href={CONTACT.phoneHref} className="transition hover:text-gold">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="shrink-0 text-cacau-800" size={20} strokeWidth={1.6} />
              <a href={`mailto:${CONTACT.email}`} className="break-all transition hover:text-gold">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="mt-0.5 shrink-0 text-cacau-800" size={20} strokeWidth={1.6} />
              <div>
                <p>{CONTACT.address}</p>
                <p className="text-sm text-cacau-700">{CONTACT.city}</p>
              </div>
            </li>
          </ul>

          <div className="mt-10 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cacau-800/30 text-cacau-800 transition hover:bg-cacau-800 hover:text-creme"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-white p-6 shadow-lg ring-1 ring-cacau-800/5 md:p-10">
          {sent ? (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
              <p className="font-display text-2xl">Obrigado!</p>
              <p className="mt-3 max-w-sm text-sm text-cacau-700">
                A sua mensagem foi enviada. A nossa equipa responderá em breve.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-8 text-xs font-medium uppercase tracking-wider text-gold underline underline-offset-4"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-cacau-700">
                Nome
                <input required name="nome" type="text" placeholder="O seu nome" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-cacau-700">
                Email
                <input required name="email" type="email" placeholder="exemplo@email.com" className={fieldClass} />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-cacau-700">
                Mensagem
                <textarea
                  required
                  name="mensagem"
                  rows={6}
                  placeholder="Como podemos ajudar?"
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <button
                type="submit"
                className="mt-2 rounded-sm bg-cacau-800 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-950"
              >
                Enviar mensagem
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
