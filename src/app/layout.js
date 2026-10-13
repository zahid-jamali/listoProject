import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";

export const metadata = {
  title: {
    default: "Listo",
    template: "%s | Listo",
  },
  description:
    "Find homes for sale, condos, pre-construction projects and real estate listings in Ontario with Listo.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-gray-100 pb-[72px] lg:pb-0 overflow-x-hidden w-full max-w-full"
        suppressHydrationWarning
      >
        <AuthProvider>
          <LocationProvider>
            <Navbar />
            <span></span>
            {children}
            <Toaster position="top-right" />
            <Footer />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
