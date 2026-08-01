import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "CareerConnect",
  description: "Find your dream job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="antialiased text-gray-800 overflow-y-scroll">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" duration={500} />
        </AuthProvider>
      </body>
    </html>
  );
}