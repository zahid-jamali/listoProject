import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-gray-100 ">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
