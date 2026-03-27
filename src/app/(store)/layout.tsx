import { BagProvider } from "@/context/BagContext";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { BagSidebar } from "@/components/bag/BagSidebar/BagSidebar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BagProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BagSidebar />
    </BagProvider>
  );
}
