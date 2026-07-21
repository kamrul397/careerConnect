import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";


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
           <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}