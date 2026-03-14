# Stheany Ribeiro — Especificações do Projeto

> Documento vivo. Atualizado à medida que o projeto evolui.
> Criado em: 2026-03-13
> Metodologia: Specs-Driven Development + TDD

---

## 1. Visão Geral

### Objetivo
Site catálogo e vitrine digital da marca Stheany Ribeiro. Permite que clientes naveguem por coleções, visualizem produtos com fotos de alta qualidade, selecionem variações (tamanho e cor) e adicionem itens a uma sacola de compras.

### Escopo do MVP
- Exibição de coleções e produtos
- Detalhe do produto com galeria de imagens
- Sacola de compras com persistência local
- Design elegante, minimalista, focado nas imagens

### Fora do escopo (MVP)
- Checkout / pagamento real
- Cadastro de usuário / autenticação
- Painel administrativo
- Busca de produtos

---

## 2. Decisões de Arquitetura

### Stack
| Tecnologia | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSG nativo, performance, Vercel deployment zero-config |
| Linguagem | TypeScript | Type-safety, DX superior, refactoring seguro |
| Estilos | Tailwind CSS v4 | Utilitário, sem CSS custom desnecessário, responsivo |
| Estado global | React Context + useReducer | Sacola não requer solução pesada (Redux/Zustand) |
| Testes unitários | Jest + React Testing Library | Padrão da indústria para React |
| Testes E2E | Playwright | Multi-browser, rápido, moderna API |

### Estratégia de Dados
**Decisão: JSON local → Firebase (progressivo)**

Fase atual (MVP):
- Produtos e coleções em arquivos JSON (`/data/`)
- Next.js gera páginas estáticas em build time (SSG)
- Sacola persiste em `localStorage` via React Context
- Performance máxima: assets servidos da CDN Vercel

Quando migrar para Firebase:
- Necessidade de editar produtos sem novo deploy
- Gestão de pedidos reais
- Painel admin para a marca

Abstração: `src/lib/data/` encapsula o acesso a dados. Componentes nunca importam JSON diretamente — apenas chamam funções tipadas. A migração para Firestore ocorre apenas nessa camada.

### Rendering Strategy
| Rota | Estratégia | Motivo |
|---|---|---|
| `/` | SSG | Conteúdo estático, máxima performance |
| `/collections` | SSG | Lista imutável em build |
| `/collections/[slug]` | SSG com `generateStaticParams` | Pré-renderiza todas as coleções |
| `/products/[slug]` | SSG com `generateStaticParams` | Pré-renderiza todos os produtos |
| `/bag` | CSR | Estado dinâmico do localStorage |

### Deploy
- **Plataforma:** Vercel (zero config com Next.js)
- **Domínio:** A configurar
- **CI/CD:** Push para `main` → deploy automático

---

## 3. Estrutura de Rotas

```
/                          → Homepage
/collections               → Listagem de coleções
/collections/[slug]        → Produtos de uma coleção
/products/[slug]           → Detalhe do produto
/bag                       → Sacola de compras
```

---

## 4. Design System

### Identidade Visual
- **Marca:** Stheany Ribeiro
- **Estilo:** Minimalista, editorial, elegante
- **Inspirações:** COS, Zara, Acne Studios

### Paleta de Cores
| Token | Hex | Uso |
|---|---|---|
| `brand-black` | `#111111` | Texto principal, botões primários |
| `brand-white` | `#FFFFFF` | Fundo, texto em fundos escuros |
| `brand-accent` | `#C8A882` | Destaques, hover states, detalhes |
| `brand-muted` | `#F5F5F5` | Fundos de seção alternativos |
| `brand-border` | `#E5E5E5` | Bordas, divisores |

### Tipografia
| Família | Uso | Google Font |
|---|---|---|
| Cormorant Garamond | Títulos, display, logo | `--font-heading` |
| Inter | Corpo, UI, labels | `--font-body` |

### Escala Tipográfica
```
Display:  font-heading text-5xl md:text-7xl font-light tracking-widest uppercase
H1:       font-heading text-3xl md:text-4xl font-light
H2:       font-heading text-2xl font-light
H3:       font-heading text-xl font-light
Body:     font-body text-sm leading-relaxed text-brand-black/80
Label:    font-body text-xs tracking-widest uppercase text-brand-black/50
Price:    font-body text-base font-medium
```

### Espaçamento
```
Container max-width: 1400px
Container padding:   px-4 md:px-8 lg:px-16
Section padding:     py-16 md:py-24 lg:py-32
Card gap:            gap-4 md:gap-6
```

### Componentes de UI Base
#### Botão Primário
```
bg-brand-black text-white px-8 py-3
text-xs tracking-widest uppercase
hover:bg-brand-black/80 transition-colors duration-200
disabled:opacity-50 disabled:cursor-not-allowed
```

#### Botão Secundário (outlined)
```
border border-brand-black text-brand-black px-8 py-3
text-xs tracking-widest uppercase
hover:bg-brand-black hover:text-white transition-all duration-200
```

#### Cards de Produto
```
Aspect ratio: aspect-[3/4] (retrato, foco na peça)
Hover imagem: group-hover:scale-[1.02] transition-transform duration-500
```

#### Animações
```
Sidebar sacola: translate-x-full → translate-x-0 (slide da direita, 300ms)
Fade in:        opacity-0 → opacity-100 (200ms)
Hover scale:    scale-[1.02] (500ms ease-out, sutil)
```

---

## 5. Modelos de Dados

### Product
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];          // ["100% Linho", "Lavar à mão", ...]
  price: number;              // Centavos. Ex: 59900 = R$ 599,00
  compareAtPrice: number | null; // Para exibir preço riscado em promoção
  images: string[];           // Paths em /public/images/products/
  sizes: string[];            // ["PP", "P", "M", "G", "GG"]
  colors: ProductColor[];
  collectionSlug: string;
  isNew: boolean;             // Badge "Novo" no card
  isFeatured: boolean;        // Aparece em destaques da homepage
  inStock: boolean;
  tags: string[];
  createdAt: string;          // ISO 8601
}

interface ProductColor {
  name: string;               // "Branco Off", "Areia"
  hex: string;                // "#F5F0E8"
}
```

### Collection
```typescript
interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;         // Path em /public/images/collections/
  order: number;              // Ordem de exibição
}
```

### BagItem
```typescript
interface BagItem {
  productId: string;
  slug: string;
  name: string;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  price: number;
  image: string;
}
```

### BagState
```typescript
interface BagState {
  items: BagItem[];
  isOpen: boolean;
}
```

---

## 6. Especificações de Componentes

### Button
**Props:** `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `disabled`, `loading`, `onClick`, `children`, `className`
**Estados:** default, hover, active, disabled, loading
**Critérios de aceite:**
- Renderiza com classe correta por variante
- Desabilitado não dispara onClick
- Loading exibe spinner e desabilita interação

### ProductCard
**Props:** `product: Product`
**Estados:** default, hover (overlay com botão "Ver Detalhes")
**Critérios de aceite:**
- Exibe imagem principal com aspect-ratio 3:4
- Exibe nome e preço formatado
- Badge "Novo" quando `product.isNew === true`
- Link navega para `/products/[slug]`
- Hover mostra overlay com CTA

### SizeSelector
**Props:** `sizes: string[]`, `selectedSize: string | null`, `onChange: (size: string) => void`
**Estados:** default, selected, hover, out-of-stock (futuro)
**Critérios de aceite:**
- Marca visualmente o tamanho selecionado
- Chama onChange ao clicar
- Acessível via teclado (Tab + Enter/Space)

### ColorSelector
**Props:** `colors: ProductColor[]`, `selectedColor: ProductColor | null`, `onChange: (color: ProductColor) => void`
**Critérios de aceite:**
- Exibe círculo colorido com tooltip do nome
- Marca visualmente a cor selecionada (anel/borda)
- Acessível (aria-label com nome da cor)

### AddToBagButton
**Props:** `product: Product`, `selectedSize: string | null`, `selectedColor: ProductColor | null`
**Estados:** default, disabled (sem seleção), loading, added
**Critérios de aceite:**
- Desabilitado se tamanho ou cor não selecionados
- Ao clicar, adiciona à sacola e abre BagSidebar
- Feedback visual de "Adicionado" por 2 segundos

### BagSidebar
**Props:** `isOpen: boolean`, `onClose: () => void`
**Critérios de aceite:**
- Slide da direita ao abrir (animação 300ms)
- Overlay escurece o fundo
- Fecha ao clicar no overlay ou no botão X
- Fecha com tecla Escape
- Lista todos os BagItems
- Exibe total calculado

### Header
**Props:** nenhuma (lê estado da sacola do Context)
**Critérios de aceite:**
- Logo linka para /
- Links de nav para /collections
- Ícone sacola exibe badge com quantidade de itens
- Clique no ícone abre BagSidebar
- Mobile: menu hambúrguer abre nav vertical
- Sticky no topo (position: sticky)

---

## 7. Fluxos de Usuário

### Fluxo Principal: Descoberta → Compra
```
1. Landing na homepage
   → Vê hero section com imagem de destaque
   → Rola para coleções em destaque
   → Clica em uma coleção

2. Página da coleção (/collections/[slug])
   → Grid de produtos
   → Clica no produto de interesse

3. Página do produto (/products/[slug])
   → Visualiza galeria de imagens (scroll/click)
   → Lê descrição e detalhes
   → Seleciona tamanho
   → Seleciona cor
   → Clica "Adicionar à Sacola"
   → BagSidebar abre automaticamente

4. Sacola (/bag ou sidebar)
   → Revisa itens
   → Ajusta quantidade (ou remove)
   → Vê total
   → CTA: "Finalizar Compra" (futuro)
```

### Fluxo Mobile
- Menu hambúrguer substitui nav horizontal
- Imagens do produto em carousel
- BagSidebar ocupa tela cheia em mobile

---

## 8. Requisitos de Performance

| Métrica | Meta |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID / INP | < 100ms |
| Bundle JS (first load) | < 150KB gzipped |

**Estratégias:**
- SSG para todas as páginas de catálogo
- `next/image` com `priority` no hero e imagens acima da dobra
- Blur placeholder em todas as imagens de produto
- Fontes carregadas via `next/font` (auto-subset, sem FOUT)
- `loading="lazy"` para imagens abaixo da dobra

---

## 9. Requisitos de Acessibilidade

- WCAG 2.1 AA
- Navegação completa por teclado (Tab, Enter, Space, Escape)
- `aria-label` em todos os elementos interativos sem texto visível
- Contraste mínimo 4.5:1 para texto normal
- `role="dialog"` + `aria-modal="true"` no BagSidebar
- `alt` descritivo em todas as imagens de produto
- Focus visible (anel de foco visível em todos os elementos)

---

## 10. Estrutura de Testes

### Pirâmide de Testes
```
         /\
        /E2E\        ← Playwright: fluxos de usuário completos
       /------\
      /  Integr.\   ← RTL: componentes com Context
     /------------\
    /   Unitários   \ ← Jest: utils, hooks, lib/data
   /------------------\
```

### Convenções
- Testes co-localizados: `Component.test.tsx` ao lado de `Component.tsx`
- Nomenclatura: `describe('NomeDoComponente') { it('should [comportamento esperado]') }`
- Usar `userEvent` (não `fireEvent`) para interações realistas
- Não testar implementação interna — testar comportamento observável

### Cobertura Mínima
- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

### Testes E2E (Playwright)
| Spec | Cenários |
|---|---|
| `home.spec.ts` | Hero renderiza, coleções clicáveis, navegação funciona |
| `collections.spec.ts` | Lista carrega, filtros, navegação para produto |
| `product-detail.spec.ts` | Galeria, seleção de variações, adicionar à sacola |
| `bag.spec.ts` | Adicionar, alterar qtd, remover, persistência no reload |

---

## 11. Log de Decisões (ADR)

### ADR-001: JSON Local vs Firebase para MVP
- **Data:** 2026-03-13
- **Status:** Decidido
- **Decisão:** JSON local com abstração na camada `lib/data/`
- **Alternativas consideradas:** Firebase Firestore, Supabase, Sanity CMS
- **Motivo:** Zero custo, máxima performance com SSG, complexidade mínima para MVP. A abstração garante migração futura sem tocar nos componentes.

### ADR-002: React Context vs Zustand para Sacola
- **Data:** 2026-03-13
- **Status:** Decidido
- **Decisão:** React Context + useReducer
- **Motivo:** A sacola é o único estado global necessário no MVP. Adicionar Zustand/Redux seria over-engineering para um único store simples.

### ADR-003: Tailwind CSS v4
- **Data:** 2026-03-13
- **Status:** Decidido
- **Decisão:** Tailwind v4 (versão instalada pelo create-next-app)
- **Observação:** Tailwind v4 usa `@import "tailwindcss"` em vez de `@tailwind` directives. Configuração via CSS variables + `tailwind.config.ts` estendido.

---

## 12. Estrutura de Arquivos

```
site/
├── specs.md                    ← Este arquivo
├── config/brand.ts             ← Identidade da marca
├── data/
│   ├── collections.json        ← Dados das coleções
│   └── products.json           ← Dados dos produtos
├── src/
│   ├── types/                  ← Interfaces TypeScript
│   ├── lib/data/               ← Camada de acesso a dados
│   ├── lib/utils/              ← Utilitários (cn, formatPrice)
│   ├── context/BagContext.tsx  ← Estado global da sacola
│   ├── hooks/useBag.ts         ← Hook de interface para a sacola
│   ├── components/             ← Componentes React
│   └── app/                    ← Next.js App Router (páginas)
└── tests/e2e/                  ← Testes Playwright
```
