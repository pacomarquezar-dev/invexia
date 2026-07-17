"use client";

import { useId, useState } from "react";
import { Check, Code2 } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

interface EmbedCodeButtonProps {
  /** Slug de la ruta /embed/[slug] correspondiente. */
  slug: string;
  /** Nombre legible de la calculadora, usado en el title del iframe. */
  title: string;
  /** Alto por defecto en px, sugerido según el contenido natural del widget. */
  height: number;
}

const COPIED_TIMEOUT_MS = 2000;

export default function EmbedCodeButton({ slug, title, height }: EmbedCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();

  const embedUrl = `${siteUrl}/embed/${slug}`;
  const code = `<iframe src="${embedUrl}" title="${title} — Invexia" width="100%" height="${height}" style="border:0;border-radius:12px;max-width:480px" loading="lazy"></iframe>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    } catch {
      // Portapapeles no disponible (contexto no seguro, permisos, etc.): no hacemos nada.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="self-start"
      >
        <Code2 aria-hidden="true" className="h-4 w-4" />
        Insertar en tu web
      </Button>

      {isOpen && (
        <Card id={panelId} className="flex flex-col gap-3">
          <p className="text-sm text-foreground/80">
            Copia este código y pégalo en el HTML de tu web para insertar esta calculadora. Puedes
            ajustar el ancho a tu gusto; te recomendamos mantener al menos {height}px de alto para
            que se vea completa.
          </p>
          <pre className="overflow-x-auto rounded-xl bg-foreground/5 p-3 text-xs text-foreground/80">
            <code>{code}</code>
          </pre>
          <Button type="button" variant="ghost" onClick={handleCopy} className="self-start">
            {copied ? (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Code2 aria-hidden="true" className="h-4 w-4" />
                Copiar código
              </>
            )}
          </Button>
          <span aria-live="polite" className="sr-only">
            {copied ? "Copiado al portapapeles" : ""}
          </span>
        </Card>
      )}
    </div>
  );
}
