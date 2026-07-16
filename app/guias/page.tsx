import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { guides } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guías",
  description:
    "Guías en español sobre finanzas personales e inversión: explicaciones a fondo más allá de una calculadora o una ficha de glosario.",
  alternates: {
    canonical: "/guias",
  },
};

export default function GuiasPage() {
  return (
    <main className="bg-dot-grid">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Guías" }]} />
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Guías</h1>
          <p className="max-w-2xl text-foreground/70">
            Explicaciones a fondo sobre finanzas personales e inversión, más allá de lo que cabe
            en una calculadora o en una ficha de glosario.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="group">
              <Link href={`/guias/${guide.slug}`} className="block h-full">
                <Card className="flex h-full flex-col gap-2 transition-colors group-hover:border-accent/40 group-hover:bg-foreground/5">
                  <h2 className="font-semibold text-foreground">{guide.title}</h2>
                  <p className="text-sm text-muted">{guide.description}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
