import Link from "next/link";
import { glossaryTerms } from "@/lib/glossary";

export default function RelatedGlossaryTerms({ slugs }: { slugs: string[] }) {
  const terms = glossaryTerms.filter((entry) => slugs.includes(entry.slug));

  if (terms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground/70">Términos relacionados</p>
      <div className="flex flex-wrap gap-2">
        {terms.map((entry) => (
          <Link
            key={entry.slug}
            href={`/glosario/${entry.slug}`}
            className="rounded-full border border-foreground/20 px-4 py-1.5 text-sm transition-colors hover:bg-foreground/5"
          >
            {entry.term}
          </Link>
        ))}
      </div>
    </div>
  );
}
