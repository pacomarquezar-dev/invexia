import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calculator, UserCheck } from "lucide-react";

const navLinkClasses =
  "flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-accent";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
      <nav className="flex items-center gap-6" aria-label="Navegación principal">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image
            src="/invexia-mark.png"
            alt=""
            width={31}
            height={34}
            className="h-7 w-auto"
            priority
          />
          Invexia
        </Link>
        <Link href="/calculadoras" className={navLinkClasses}>
          <Calculator aria-hidden="true" className="h-4 w-4" />
          Calculadoras
        </Link>
        <Link href="/perfil-inversor" className={navLinkClasses}>
          <UserCheck aria-hidden="true" className="h-4 w-4" />
          Test de perfil
        </Link>
        <Link href="/glosario" className={navLinkClasses}>
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          Glosario
        </Link>
      </nav>
    </header>
  );
}
