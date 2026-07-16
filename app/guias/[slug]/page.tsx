import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { guides } from "@/lib/guias";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.invexia.es";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guias/${guide.slug}`,
    },
  };
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = findGuide(slug);

  if (!guide) {
    notFound();
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/guias/${guide.slug}`,
    mainEntity: guide.faqEntries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      {/* JSON-LD generado a partir de datos propios y estáticos, no de entrada de usuario */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Guías", href: "/guias" },
            { label: guide.title },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {guide.title}
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">{guide.description}</p>
      </div>

      <div className="flex flex-col gap-6 text-foreground/80">
        {guide.sections.map((section) => (
          <Card key={section.heading} as="section" className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="leading-7">
                {paragraph}
              </p>
            ))}
          </Card>
        ))}

        {guide.faqEntries.length > 0 && (
          <Card as="section" className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-foreground">Preguntas frecuentes</h2>
            <div className="flex flex-col divide-y divide-border">
              {guide.faqEntries.map((entry) => (
                <details key={entry.question} className="group py-4 first:pt-0 last:pb-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-2 leading-7">{entry.answer}</p>
                </details>
              ))}
            </div>
          </Card>
        )}
      </div>

      <RelatedGlossaryTerms slugs={guide.relatedGlossarySlugs} />

      <p className="text-xs text-foreground/50">
        Este contenido es educativo y no constituye asesoramiento financiero personalizado.
      </p>
    </main>
  );
}
