"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Card from "@/components/Card";
import { KOFI_URL } from "@/lib/kofi";

const STORAGE_KEY = "invexia:kofi-callout-dismissed";

/**
 * Empieza oculta (evita el parpadeo de "aparece y desaparece" para quien ya
 * la cerró antes) y solo se muestra si, tras comprobar localStorage en el
 * cliente, no se había descartado previamente en este navegador.
 */
export default function SupportCallout() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  function handleDismiss() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Card className="flex items-center justify-between gap-3 px-4 py-3">
      <p className="text-sm text-muted">¿Te ha sido útil? Invítame a un café ☕</p>
      <div className="flex shrink-0 items-center gap-1">
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-accent transition duration-150 ease-out hover:scale-[1.04] hover:bg-accent/10"
        >
          Invitar
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Cerrar aviso de apoyo"
          className="rounded-md p-1.5 text-muted transition-colors hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
