import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { brand } from "@config/brand";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    template: brand.seo.titleTemplate,
    default: brand.seo.defaultTitle,
  },
  description: brand.description,
  keywords: [...brand.seo.keywords],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: brand.url,
    siteName: brand.name,
    images: [{ url: brand.ogImage, width: 1200, height: 630, alt: brand.name }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
