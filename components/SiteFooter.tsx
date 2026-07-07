import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-8">
      <nav
        aria-label="Enlaces legales"
        className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/60"
      >
        <Link href="/legal/aviso-legal" className="hover:text-foreground hover:underline">
          Aviso legal
        </Link>
        <Link href="/legal/privacidad" className="hover:text-foreground hover:underline">
          Política de privacidad
        </Link>
        <Link href="/legal/cookies" className="hover:text-foreground hover:underline">
          Política de cookies
        </Link>
      </nav>
      <p className="mt-4 text-center text-xs text-foreground/40">
        © {new Date().getFullYear()} Invexia. Contenido educativo, no asesoramiento financiero regulado.
      </p>
    </footer>
  );
}
