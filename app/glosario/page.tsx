import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
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
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
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
          <li key={entry.slug}>
            <Link
              href={`/glosario/${entry.slug}`}
              className="block h-full rounded-lg border border-foreground/10 p-5 transition-colors hover:bg-foreground/5"
            >
              <p className="font-medium">{entry.term}</p>
              <p className="mt-1 text-sm text-foreground/70">{entry.shortDefinition}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
