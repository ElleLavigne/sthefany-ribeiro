import Link from "next/link";
import { Container } from "../Container/Container";
import { brand } from "@config/brand";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-brown border-t border-brand-warm/20 mt-auto">
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-brand-cream">
              {brand.name}
            </p>
            <p className="text-xs text-brand-cream/60 leading-relaxed max-w-xs">
              {brand.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-brand-cream/40 mb-4 font-semibold">
              Navegacao
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/collections", label: "Catalogo" },
                { href: "/sobre-nos", label: "Sobre Nos" },
                { href: "/bag", label: "Sacola" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-brand-cream/60 hover:text-brand-cream transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-brand-cream/40 mb-4 font-semibold">
              Contato
            </p>
            <div className="flex flex-col gap-3">
              {brand.contact.email && (
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="text-xs text-brand-cream/60 hover:text-brand-cream transition-colors"
                >
                  {brand.contact.email}
                </a>
              )}
              {brand.social.instagram && (
                <a
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-cream/60 hover:text-brand-cream transition-colors"
                  aria-label="Instagram da Sthefany Ribeiro"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-warm/20">
          <p className="text-[10px] text-brand-cream/30 tracking-widest uppercase">
            © {currentYear} {brand.name}. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
