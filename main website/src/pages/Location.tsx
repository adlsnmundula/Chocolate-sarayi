import { Clock, CreditCard, MapPin, Phone, Store, Trees, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTACT } from "../data/site";

const AMENITIES: { icon: LucideIcon; label: string }[] = [
  { icon: Store, label: "Takeaway" },
  { icon: Trees, label: "Esplanada" },
  { icon: Wifi, label: "Wi-Fi Gratuito" },
  { icon: CreditCard, label: "Aceitamos cartões" },
];

export default function Location() {
  return (
    <>
      <section className="bg-papel py-16 text-cacau-800 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Localização</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">Visite-nos em Luanda</h1>

            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 shrink-0 text-cacau-800" size={22} strokeWidth={1.6} />
                <div>
                  <p className="font-medium">{CONTACT.address}</p>
                  <p className="text-sm text-cacau-700">{CONTACT.city}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 shrink-0 text-cacau-800" size={22} strokeWidth={1.6} />
                <a href={CONTACT.phoneHref} className="font-medium transition hover:text-gold">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 shrink-0 text-cacau-800" size={22} strokeWidth={1.6} />
                <div>
                  <p className="font-medium">Todos os dias</p>
                  <p className="text-sm text-cacau-700">{CONTACT.hours}</p>
                </div>
              </li>
            </ul>

            <a
              href={CONTACT.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block rounded-sm bg-cacau-950 px-8 py-3.5 text-xs font-medium uppercase tracking-wider text-creme transition hover:bg-cacau-800"
            >
              Ver no Google Maps
            </a>
          </div>

          <div className="relative h-[380px] overflow-hidden rounded-md shadow-xl ring-1 ring-cacau-800/10 md:h-[460px]">
            <iframe
              title="Mapa de localização do Chocolat Sarayi"
              src={CONTACT.mapsEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gold/20 bg-cacau-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 lg:grid-cols-4 lg:px-8">
          {AMENITIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 text-creme/85">
              <Icon className="text-gold" size={20} strokeWidth={1.5} />
              <span className="text-xs tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
