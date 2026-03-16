import Link from "next/link";
import Image from "next/image";

interface PromoCard {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  align?: "left" | "right";
}

const cards: PromoCard[] = [
  {
    title: "Vestidos",
    subtitle: "a partir de R$ 90,00",
    href: "/collections/verao-2025",
    image: "/images/promo/promo-vestidos.jpg",
    align: "left",
  },
  {
    title: "Conjuntos",
    subtitle: "a partir de R$ 90,00",
    href: "/collections/essenciais",
    image: "/images/promo/promo-conjuntos.jpg",
    align: "right",
  },
];

export function PromoCards() {
  return (
    <section aria-label="Promocoes em destaque" className="py-2 px-2 md:px-8 lg:px-16">
      <div className="max-w-362 mx-auto flex flex-col md:flex-row gap-2 justify-center">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative w-full md:w-179 aspect-716/909 overflow-hidden bg-brand-warm"
            aria-label={card.title}
          >
            {/* Imagem de fundo */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover object-center"
              sizes="716px"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
