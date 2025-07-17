import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthHeaderWrapper from "@/components/AuthHeaderWrapper";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OfertaFulger - Oferte Exclusive în România",
  description: "Descoperă cele mai bune oferte și promoții în restaurante, spa-uri, vacanțe și multe altele.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <AuthHeaderWrapper />
        <main className="bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
