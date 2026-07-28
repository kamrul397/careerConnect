import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/home/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-16rem)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
