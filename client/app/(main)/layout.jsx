import Footer from "@/components/home/Footer";
import Navbar from "@/components/layouts/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-teal-50/20 via-slate-50 to-teal-100/30 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-16rem)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
