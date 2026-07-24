import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "CareerConnect",
  description: "Find your dream job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
            <Toaster richColors position="top-right" duration={1000}/>
        </AuthProvider>
      </body>
    </html>
  );
}