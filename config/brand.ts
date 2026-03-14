/**
 * Configuração central da marca Stheany Ribeiro.
 * Fonte única de verdade para identidade visual, SEO e dados de contato.
 * Altere aqui — todos os componentes herdam automaticamente.
 */
export const brand = {
  name: "Stheany Ribeiro",
  tagline: "",
  description:
    "Moda contemporânea com design elegante e minimalista. Peças criadas para mulheres que valorizam estilo e autenticidade.",

  contact: {
    email: "contato@stheanyribeiro.com",
    whatsapp: "+558698345521",
    address: {
      city: "Brasil",
    },
  },

  social: {
    instagram: "https://instagram.com/stheanyribeiro",
    tiktok: "",
    pinterest: "",
  },

  url: "https://www.stheanyribeiro.com",
  ogImage: "/images/og-default.jpg",

  colors: {
    cream: "#FFF9ED",
    slate: "#97A0A5",
    olive: "#6F6134",
    brown: "#5A483A",
    warm: "#ABA59A",
    stone50: "#fafaf9",
    stone400: "#a8a29e",
    stone600: "#57534e",
    stone950: "#0c0a09",
    red700: "#b91c1c",
  },

  fonts: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
  },

  currency: {
    code: "BRL",
    symbol: "R$",
    locale: "pt-BR",
  },

  shipping: {
    freeAbove: 30000, // Centavos: R$ 300,00
    estimatedDays: "3 a 7 dias úteis",
  },

  seo: {
    titleTemplate: "%s | Stheany Ribeiro",
    defaultTitle: "Stheany Ribeiro — Moda Contemporânea",
    keywords: [
      "moda feminina",
      "roupas elegantes",
      "moda contemporânea",
      "Stheany Ribeiro",
      "roupas minimalistas",
    ],
  },
} as const;

export type Brand = typeof brand;
