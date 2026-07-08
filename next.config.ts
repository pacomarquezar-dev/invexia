import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// React needs eval() in development for debugging features (e.g. reconstructing
// component stacks); it never uses eval() in production builds.
const scriptSrc = isDev
  ? "'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com"
  : "'self' 'unsafe-inline' https://pagead2.googlesyndication.com";

const securityHeaders = [
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
    value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
