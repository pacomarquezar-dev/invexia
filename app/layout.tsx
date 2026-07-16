import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

/**
 * Desactivado a propósito mientras la cuenta de AdSense siga sin aprobar.
 * Sin aprobación no se sirve ningún anuncio real, así que cargar y ejecutar
 * adsbygoogle.js/show_ads_impl_fy2021.js + el CMP de Funding Choices no
 * aportaba nada: ~290 KiB de descarga y contención del hilo principal que
 * empeoraban el LCP en móvil sin ningún beneficio a cambio. Confirmado con
 * una prueba A/B real (PageSpeed Insights con y sin estos scripts).
 * Poner en "true" en Vercel en cuanto AdSense apruebe la cuenta — ver
 * NOTAS-DISENO.md para la tarea pendiente asociada (remedir rendimiento
 * tras reactivarlos con anuncios reales ya sirviendo contenido).
 */
const isAdsenseApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";

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
        {isAdsenseApproved && (
          <>
            {/*
              El "src" debe quedar como HTML estático literal (no via
              next/script) para que el rastreador de verificación de AdSense
              lo encuentre al hacer fetch de la página sin ejecutar JS.
              type="text/plain" evita que el navegador la descargue/ejecute
              automáticamente — el script de abajo la activa de verdad en
              cuanto el navegador queda inactivo tras el primer pintado, para
              no competir por el hilo principal con el LCP.
            */}
            <script
              type="text/plain"
              defer
              data-adsense-placeholder=""
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4889342992901227"
              suppressHydrationWarning
            />
            <script
              suppressHydrationWarning
            >{`(function(){function load(){var p=document.querySelector('script[data-adsense-placeholder]');if(!p)return;var s=document.createElement('script');s.src=p.getAttribute('src');s.crossOrigin='anonymous';s.async=true;document.head.appendChild(s);}if('requestIdleCallback'in window){requestIdleCallback(load,{timeout:3000});}else{window.addEventListener('load',function(){setTimeout(load,1);});}})();`}</script>
          </>
        )}
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
