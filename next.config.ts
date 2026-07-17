import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// React needs eval() in development for debugging features (e.g. reconstructing
// component stacks); it never uses eval() in production builds.
// @vercel/analytics is same-origin in production (/_vercel/insights/script.js,
// already covered by 'self'); only its local dev debug build comes from
// va.vercel-scripts.com, so that domain is only needed in the dev CSP.
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://va.vercel-scripts.com"
  : "'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com";
const frameSrc = "'self' https://fundingchoicesmessages.google.com";
const connectSrc = "'self' https://fundingchoicesmessages.google.com";

function buildSecurityHeaders(frameAncestors: string) {
  return [
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    {
      key: "Content-Security-Policy",
      value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src ${frameSrc}; connect-src ${connectSrc}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors ${frameAncestors};`,
    },
  ];
}

const securityHeaders = buildSecurityHeaders("'none'");
// Las páginas /embed/* están pensadas para insertarse en webs de terceros vía
// <iframe> — ese es el propósito de la función, así que aquí sí se permite
// explícitamente ser enmarcado por cualquier origen. El resto del sitio
// mantiene frame-ancestors 'none' para protegerse de clickjacking.
const embedSecurityHeaders = buildSecurityHeaders("*");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/embed/:path*",
        headers: embedSecurityHeaders,
      },
    ];
  },
};

export default nextConfig;
