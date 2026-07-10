import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { glossaryTerms } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glosario financiero",
  description:
    "Glosario de términos financieros explicados en español, con ejemplos numéricos sencillos: interés compuesto, TAE, diversificación, ETF y más.",
  alternates: {
    canonical: "/glosario",
  },
};

const sortedTerms = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term, "es"));

export default function GlosarioPage() {
  return (
    <main className="bg-dot-grid">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-3">
          <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Glosario" }]} />
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Glosario financiero
          </h1>
          <p className="max-w-2xl text-foreground/70">
            Términos financieros explicados en español, con ejemplos numéricos sencillos.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {sortedTerms.map((entry) => (
            <li key={entry.slug} className="group">
              <Link href={`/glosario/${entry.slug}`} className="block h-full">
                <Card className="flex h-full flex-col gap-2 transition-colors group-hover:border-accent/40 group-hover:bg-foreground/5">
                  <h2 className="font-semibold text-foreground">{entry.term}</h2>
                  <p className="text-sm text-muted">{entry.shortDefinition}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
