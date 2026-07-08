import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";
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
      <head>
        {/*
          Etiqueta de verificación de propiedad de Google AdSense. El "src" debe
          quedar como HTML estático literal (no via next/script) para que el
          rastreador de verificación lo encuentre al hacer fetch de la página
          sin ejecutar JS. type="text/plain" evita que el navegador la
          descargue/ejecute automáticamente: medido con Lighthouse, el motor de
          Auto-ads de Google ocupaba el hilo principal justo cuando el texto ya
          listo del hero debía pintarse (LCP), retrasándolo ~1.1s. El script de
          más abajo la activa de verdad en cuanto el navegador queda inactivo
          tras el primer pintado.
        */}
        <script
          type="text/plain"
          defer
          data-adsense-placeholder=""
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889342992901227"
        />
        <script
          suppressHydrationWarning
        >{`(function(){function load(){var p=document.querySelector('script[data-adsense-placeholder]');if(!p)return;var s=document.createElement('script');s.src=p.getAttribute('src');s.crossOrigin='anonymous';s.async=true;document.head.appendChild(s);}if('requestIdleCallback'in window){requestIdleCallback(load,{timeout:3000});}else{window.addEventListener('load',function(){setTimeout(load,1);});}})();`}</script>
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatWidgetLoader />
        <Analytics />
      </body>
    </html>
  );
}
