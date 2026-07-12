import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.invexia.es";
// TEMP (diagnóstico A/B de rendimiento, ver abajo en <head>):
// const isAdsenseApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";

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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          TEMP — DESACTIVADO PARA DIAGNÓSTICO A/B DE RENDIMIENTO (2026-07-12).
          Ambos scripts de Google (verificación AdSense + activador que dispara
          adsbygoogle.js/show_ads_impl_fy2021.js/Funding Choices) quedan
          comentados a propósito para medir con PageSpeed Insights si son la
          causa real del LCP alto en producción, aislando esa variable. La
          cuenta de AdSense aún no está aprobada (no sirve anuncios reales), así
          que quitar temporalmente incluso la etiqueta de verificación no afecta
          a ningún usuario. REVERTIR (descomentar) en cuanto termine la medición
          A/B — no dejar esto desactivado permanentemente, porque la etiqueta de
          verificación la necesita el rastreador de aprobación de Google.

        <script
          type="text/plain"
          defer
          data-adsense-placeholder=""
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889342992901227"
          suppressHydrationWarning
        />
        {isAdsenseApproved && (
          <script
            suppressHydrationWarning
          >{`(function(){function load(){var p=document.querySelector('script[data-adsense-placeholder]');if(!p)return;var s=document.createElement('script');s.src=p.getAttribute('src');s.crossOrigin='anonymous';s.async=true;document.head.appendChild(s);}if('requestIdleCallback'in window){requestIdleCallback(load,{timeout:3000});}else{window.addEventListener('load',function(){setTimeout(load,1);});}})();`}</script>
        )}
        */}
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <ChatWidgetLoader />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
