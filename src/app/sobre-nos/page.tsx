import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container/Container";
import { brand } from "@config/brand";

export const metadata: Metadata = {
  title: "Sobre nos",
  description: `Conheça a história e os valores da ${brand.name}.`,
};

export default function SobreNosPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero texto */}
        <div className="max-w-xl mb-16 md:mb-24">
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3 font-medium">
            Nossa historia
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-widest uppercase text-stone-950 mb-6">
            Sobre nos
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            A Stheany Ribeiro nasceu da vontade de criar roupas que respeitam
            o tempo de cada mulher — pecas duradouras, confortaveis e cheias
            de personalidade. Acreditamos que a moda deve ser um instrumento
            de autoexpressao, nao uma obrigacao.
          </p>
        </div>

        {/* Imagem + texto lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-20 md:mb-32">
          <div className="relative aspect-3/4 bg-brand-warm overflow-hidden">
            <Image
              src="/images/sobre/sobre-nos.jpg"
              alt="Stheany Ribeiro — atelier"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-widest uppercase text-stone-950 mb-3">
                Nosso proposito
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Cada peca da colecao e pensada com cuidado, desde a escolha
                do tecido ate o acabamento final. Trabalhamos com fornecedores
                nacionais comprometidos com praticas eticas de producao.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-widest uppercase text-stone-950 mb-3">
                Design atemporal
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Inspiradas em silhuetas classicas reinterpretadas com frescor
                contemporaneo, nossas pecas transitam com facilidade entre
                o dia a dia e os momentos especiais.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-widest uppercase text-stone-950 mb-3">
                Feito no Brasil
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Orgulhosamente brasileiro. Toda a producao acontece aqui,
                valorizando o trabalho artesanal e a industria local.
              </p>
            </div>
          </div>
        </div>

        {/* Valores em cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:mb-32">
          {[
            { icon: "◇", title: "Qualidade", text: "Tecidos selecionados e acabamento impecavel em cada peca." },
            { icon: "◈", title: "Autenticidade", text: "Design proprio, sem seguir modas passageiras." },
            { icon: "◉", title: "Responsabilidade", text: "Producao etica, com respeito ao trabalho e ao meio ambiente." },
          ].map((v) => (
            <div
              key={v.title}
              className="bg-stone-50 p-8 border-t-2 border-brand-olive"
            >
              <span className="text-2xl text-brand-olive mb-4 block">{v.icon}</span>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-stone-950 mb-2">
                {v.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-4 font-medium">
            Conheca nossas pecas
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 bg-brand-brown text-white px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-brand-olive transition-colors"
          >
            Ver Catalogo
          </Link>
        </div>
      </Container>
    </div>
  );
}
