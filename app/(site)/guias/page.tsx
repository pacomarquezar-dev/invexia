import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { guides, type Guide } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guías",
  description:
    "Guías en español sobre finanzas personales e inversión: explicaciones a fondo más allá de una calculadora o una ficha de glosario.",
  alternates: {
    canonical: "/guias",
  },
};

const CATEGORY_LABELS: Record<Guide["category"], string> = {
  guia: "Guías",
  articulo: "Artículos",
};

function GuideCardList({
  items,
  HeadingTag = "h2",
}: {
  items: Guide[];
  HeadingTag?: "h2" | "h3";
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((guide) => (
        <li key={guide.slug} className="group">
          <Link href={`/guias/${guide.slug}`} className="block h-full">
            <Card className="flex h-full flex-col gap-2 transition-colors group-hover:border-accent/40 group-hover:bg-foreground/5">
              <HeadingTag className="font-semibold text-foreground">{guide.title}</HeadingTag>
              <p className="text-sm text-muted">{guide.description}</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function GuiasPage() {
  const categories = Array.from(new Set(guides.map((guide) => guide.category)));
  const showCategorySections = categories.length > 1;

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

        {showCategorySections ? (
          <div className="flex flex-col gap-10">
            {(["guia", "articulo"] as const).map((category) => {
              const items = guides.filter((guide) => guide.category === category);
              if (items.length === 0) return null;

              return (
                <section key={category} className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {CATEGORY_LABELS[category]}
                  </h2>
                  <GuideCardList items={items} HeadingTag="h3" />
                </section>
              );
            })}
          </div>
        ) : (
          <GuideCardList items={guides} HeadingTag="h2" />
        )}
      </div>
    </main>
  );
}
