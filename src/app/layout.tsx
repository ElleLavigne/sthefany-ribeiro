import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { BagProvider } from "@/context/BagContext";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { BagSidebar } from "@/components/bag/BagSidebar/BagSidebar";
import { brand } from "@config/brand";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
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
        <BagProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BagSidebar />
        </BagProvider>
      </body>
    </html>
  );
}
