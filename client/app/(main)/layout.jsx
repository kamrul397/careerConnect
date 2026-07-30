
import Footer from "@/components/home/Footer";
import Navbar from "@/components/layouts/Navbar";

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
