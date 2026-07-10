import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o se ha movido.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Página no encontrada" }]} />
      </div>
      <p className="text-sm font-medium text-muted">Error 404</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        No hemos encontrado esta página
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
        Puede que el enlace esté roto o que la página se haya movido. Vuelve
        al inicio para seguir explorando las calculadoras y el glosario.
      </p>
      <div className="mt-8">
        <Button href="/">Volver al inicio</Button>
      </div>
    </main>
  );
}
