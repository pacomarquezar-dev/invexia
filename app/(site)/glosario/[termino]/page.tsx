import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { glossaryTerms } from "@/lib/glossary";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

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
    <main className="bg-dot-grid">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {entry.term}
          </h1>
        </div>

        <p className="whitespace-pre-line leading-7 text-foreground/80">{entry.definition}</p>

        <Card className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted">Ejemplo</p>
          <p className="leading-7 text-foreground">{entry.example}</p>
        </Card>

        {entry.relatedCalculator && (
          <Button href={entry.relatedCalculator.href} className="self-start">
            Probar: {entry.relatedCalculator.label}
          </Button>
        )}
      </div>
    </main>
  );
}
