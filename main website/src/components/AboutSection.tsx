import { Link } from "react-router-dom";
import { Armchair, Award, Globe, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { photo } from "../data/site";

const VALUES: { icon: LucideIcon; label: string }[] = [
  { icon: Award, label: "Qualidade em cada detalhe" },
  { icon: Armchair, label: "Ambiente acolhedor" },
  { icon: Sparkles, label: "Sabor inesquecível" },
  { icon: Globe, label: "Tradição internacional" },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-cacau-900">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[360px] lg:min-h-[640px]">
          <img
            src={photo(33454120, 1400, 1100)}
            alt="Interior do café Chocolat Sarayi"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cacau-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 font-display text-4xl italic text-gold/90 md:text-5xl">
            Chocolat
            <span className="block text-right text-2xl not-italic text-gold/80">Sarayi</span>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Sobre Nós</p>
          <h2 className="mt-4 font-display text-4xl text-creme md:text-5xl">A nossa história</h2>
          <p className="mt-6 leading-relaxed text-creme/80">
            O Chocolat Sarayi nasceu em Istambul, na Turquia, em 2015, com a missão de tornar o chocolate uma
            experiência única e especial. Hoje, trazemos esse conceito para Luanda, oferecendo um espaço moderno e
            acolhedor, onde o sabor e a qualidade se encontram.
          </p>
          <p className="mt-4 leading-relaxed text-creme/70">
            Cada receita é preparada com ingredientes cuidadosamente selecionados, pensada para despertar os sentidos
            e criar memórias — seja numa pausa rápida ou numa longa conversa entre amigos.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {VALUES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <Icon className="text-gold" size={26} strokeWidth={1.5} />
                <span className="text-[11px] leading-snug text-creme/80">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/menu"
              className="inline-block rounded-sm border border-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-gold transition hover:bg-gold hover:text-cacau-950"
            >
              Conheça o nosso menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
