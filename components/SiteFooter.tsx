import Link from "next/link";
import { Coffee } from "lucide-react";
import Button from "@/components/Button";
import { KOFI_URL } from "@/lib/kofi";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <nav
        aria-label="Enlaces legales"
        className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted"
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

      <div className="mt-5 flex justify-center">
        <Button
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
        >
          <Coffee aria-hidden="true" className="h-4 w-4" />
          Invítame a un café
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted/70">
        © {new Date().getFullYear()} Invexia. Contenido educativo, no asesoramiento financiero regulado.
      </p>
    </footer>
  );
}
