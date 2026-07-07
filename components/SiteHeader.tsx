import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background px-6 py-4">
      <nav className="flex items-center gap-6" aria-label="Navegación principal">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Invexia
        </Link>
        <Link
          href="/calculadoras"
          className="text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          Calculadoras
        </Link>
      </nav>
    </header>
  );
}
