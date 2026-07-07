import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { glossaryTerms } from "@/lib/glossary";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.invexia.es";

interface PageProps {
  params: Promise<{ termino: string }>;
}

export function generateStaticParams() {
  return glossaryTerms.map((entry) => ({ termino: entry.slug }));
}

function findEntry(slug: string) {
  return glossaryTerms.find((entry) => entry.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { termino } = await params;
  const entry = findEntry(termino);

  if (!entry) {
    return {};
  }

  return {
    title: entry.term,
    description: entry.shortDefinition,
    alternates: {
      canonical: `/glosario/${entry.slug}`,
    },
  };
}

export default async function GlosarioTerminoPage({ params }: PageProps) {
  const { termino } = await params;
  const entry = findEntry(termino);

  if (!entry) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.definition,
    url: `${siteUrl}/glosario/${entry.slug}`,
    inDefinedTermSet: `${siteUrl}/glosario`,
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      {/* JSON-LD generado a partir de datos propios y estáticos, no de entrada de usuario */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Glosario", href: "/glosario" },
            { label: entry.term },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{entry.term}</h1>
      </div>

      <p className="whitespace-pre-line leading-7 text-foreground/80">{entry.definition}</p>

      <div className="rounded-lg border border-foreground/10 p-5">
        <p className="text-sm font-medium text-foreground/70">Ejemplo</p>
        <p className="mt-2 leading-7">{entry.example}</p>
      </div>

      {entry.relatedCalculator && (
        <Link
          href={entry.relatedCalculator.href}
          className="self-start rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Probar: {entry.relatedCalculator.label}
        </Link>
      )}
    </main>
  );
}
