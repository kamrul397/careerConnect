import Footer from "@/components/home/Footer";
import Navbar from "@/components/layouts/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-100/75 via-slate-50 to-teal-200/60 min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Ambient Lighting for Bright Gradient Depth */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-300/35 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none -z-10" />

      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-16rem)] relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

