import Link from "next/link";
import Image from "next/image";
import { getLowestPriceByTag } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/formatPrice";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll/RevealOnScroll";

interface PromoCardData {
  title: string;
  tag: string;
  href: string;
  image: string;
}

const cards: PromoCardData[] = [
  {
    title: "Vestidos",
    tag: "vestido",
    href: "/collections/verao-2025",
    image: "/images/promo/promo-vestidos.jpg",
  },
  {
    title: "Conjuntos",
    tag: "conjunto",
    href: "/collections/essenciais",
    image: "/images/promo/promo-conjuntos.jpg",
  },
];

export async function PromoCards() {
  const prices = await Promise.all(cards.map((card) => getLowestPriceByTag(card.tag)));

  return (
    <section aria-label="Promocoes em destaque" className="py-2 px-2 md:px-8 lg:px-16">
      <div className="max-w-362 mx-auto flex flex-col md:flex-row gap-2 justify-center">
        {cards.map((card, index) => {
          const lowestPrice = prices[index];

          return (
            <RevealOnScroll key={card.title} delay={index * 150}>
              <Link
                href={card.href}
                className="group relative block w-full md:w-179 aspect-716/909 overflow-hidden bg-brand-warm"
                aria-label={card.title}
              >
                {/* Imagem de fundo */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 716px"
                />

                {/* Texto sobre a imagem */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-6 pb-8 pt-20">
                  <h3 className="text-white text-xl md:text-2xl font-semibold tracking-widest uppercase">
                    {card.title}
                  </h3>
                  {lowestPrice !== null && (
                    <p className="text-white/80 text-sm mt-1">
                      a partir de {formatPrice(lowestPrice)}
                    </p>
                  )}
                </div>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
