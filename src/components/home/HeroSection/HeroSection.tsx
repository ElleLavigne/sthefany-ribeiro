import Link from "next/link";
import Image from "next/image";
import { brand } from "@config/brand";

export function HeroSection() {
  return (
    <section
      aria-label="Destaque principal"
      className="relative h-[80vh] min-h-120 overflow-hidden bg-brand-warm"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-principal.jpg"
          alt="Colecao Sthefany Ribeiro"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/50 to-transparent" />
      </div>

      <div className="relative h-full flex items-end">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 pb-14 md:pb-20 w-full">
          <div className="max-w-md">
            <p className="text-white/70 text-[10px] tracking-widest uppercase mb-3 font-medium">
              Nova Colecao
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-widest uppercase mb-4 leading-tight">
              {brand.name}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed mb-7 max-w-xs font-light">
              Pecas criadas para mulheres que valorizam estilo e autenticidade.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 bg-brand-cream text-brand-brown px-8 py-3 text-xs tracking-widest uppercase font-semibold hover:bg-white transition-colors"
            >
              Ver Catalogo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
