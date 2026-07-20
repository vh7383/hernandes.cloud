import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://hernandes.cloud";
const SITE_DESCRIPTION =
  "Portfolio de Vincent Hernandes, spécialisé en architecture et ingénierie des systèmes et logiciels : projets, compétences techniques et système auto-hébergé (Docker, monitoring, IA locale). Découvrez mes réalisations et contactez-moi pour toute collaboration.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vincent Hernandes — hernandes.cloud",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Vincent Hernandes — hernandes.cloud",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "hernandes.cloud",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 627,
        alt: "Vincent Hernandes — Architecture & ingénierie systèmes/logiciels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Hernandes — hernandes.cloud",
    description: SITE_DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
