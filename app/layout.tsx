import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.invexia.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Invexia — Entiende tus finanzas personales",
    template: "%s | Invexia",
  },
  description:
    "Calculadoras financieras interactivas, glosario y guía para entender tus finanzas personales en español.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Invexia",
    title: "Invexia — Entiende tus finanzas personales",
    description:
      "Calculadoras financieras interactivas, glosario y guía para entender tus finanzas personales en español.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invexia — Entiende tus finanzas personales",
    description:
      "Calculadoras financieras interactivas, glosario y guía para entender tus finanzas personales en español.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
