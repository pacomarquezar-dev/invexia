import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import StudyHeadlineStat from "@/components/StudyHeadlineStat";
import { guides, type GuideBlock } from "@/lib/guias";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";
const DEFAULT_DISCLAIMER =
  "Este contenido es educativo y no constituye asesoramiento financiero personalizado.";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

/** Convierte enlaces en formato `[texto](href)` dentro de un texto en <Link>. */
function renderInlineLinks(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={key++} href={match[2]} className="underline hover:text-foreground">
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function GuideBlockContent({ block }: { block: GuideBlock }) {
  if (block.type === "paragraph") {
    return <p className="leading-7">{renderInlineLinks(block.text)}</p>;
  }

  if (block.type === "list") {
    return (
      <ul className="flex list-disc flex-col gap-1 pl-5">
        {block.items.map((item, index) => (
          <li key={index}>{renderInlineLinks(item)}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{block.caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {block.headers.map((header) => (
              <th key={header} scope="col" className="py-2 pr-4 font-semibold text-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr
              key={row[0]}
              className={rowIndex < block.rows.length - 1 ? "border-b border-border/60" : undefined}
            >
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row" className="py-2 pr-4 font-medium text-foreground">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} className="py-2">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
        <p className="text-sm text-foreground/50">
          {(guide.category === "articulo" || guide.category === "estudio") &&
            `Publicado: ${guide.publishedDate} · `}
          Última actualización: {guide.lastUpdated}
        </p>
      </div>

      {guide.category === "estudio" && <StudyHeadlineStat {...guide.headlineStat} />}

      <div className="flex flex-col gap-6 text-foreground/80">
        {guide.sections.map((section) => (
          <Card key={section.heading} as="section" className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
            {section.blocks.map((block, index) => (
              <GuideBlockContent key={index} block={block} />
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
                  <p className="mt-2 leading-7">{renderInlineLinks(entry.answer)}</p>
                </details>
              ))}
            </div>
          </Card>
        )}
      </div>

      <RelatedGlossaryTerms slugs={guide.relatedGlossarySlugs} />

      <p className="text-xs text-foreground/50">{guide.disclaimer ?? DEFAULT_DISCLAIMER}</p>
    </main>
  );
}
