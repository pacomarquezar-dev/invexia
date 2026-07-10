"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import Button from "@/components/Button";

interface ShareButtonProps {
  /** Texto a compartir/copiar, sin la URL (se añade automáticamente la URL actual). */
  text: string;
  className?: string;
}

const COPIED_TIMEOUT_MS = 2000;

/**
 * En móvil (donde navigator.share suele estar disponible) abre la hoja de
 * compartir nativa. En escritorio hace fallback a copiar el texto al
 * portapapeles, con una confirmación visual breve ("Copiado").
 */
export default function ShareButton({ text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Invexia", text, url });
      } catch {
        // El usuario canceló el share nativo o no está permitido: no hacemos nada.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
    } catch {
      // Portapapeles no disponible (contexto no seguro, permisos, etc.): no hacemos nada.
    }
  }

  return (
    <>
      <Button type="button" variant="ghost" onClick={handleShare} className={className}>
        {copied ? (
          <>
            <Check aria-hidden="true" className="h-4 w-4" />
            Copiado
          </>
        ) : (
          <>
            <Share2 aria-hidden="true" className="h-4 w-4" />
            Compartir resultado
          </>
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copiado al portapapeles" : ""}
      </span>
    </>
  );
}
