import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o se ha movido.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium text-foreground/60">Error 404</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        No hemos encontrado esta página
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-foreground/70">
        Puede que el enlace esté roto o que la página se haya movido. Vuelve
        al inicio para seguir explorando las calculadoras y el glosario.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
