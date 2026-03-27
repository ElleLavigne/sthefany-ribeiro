import Link from "next/link";
import { Container } from "@/components/layout/Container/Container";

export default function NotFound() {
  return (
    <div className="py-32 md:py-48">
      <Container>
        <div className="text-center">
          <p className="font-body text-[10px] tracking-widest uppercase text-[#111111]/40 mb-6">
            404
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-light tracking-widest uppercase mb-6">
            Página não encontrada
          </h1>
          <p className="font-body text-sm text-[#111111]/60 mb-12 max-w-sm mx-auto leading-relaxed">
            A página que você procura não existe ou foi movida.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#111111]/80 transition-colors font-body"
          >
            Voltar ao Início
          </Link>
        </div>
      </Container>
    </div>
  );
}
