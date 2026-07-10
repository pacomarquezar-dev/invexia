import type { ReactNode } from "react";
import Card from "@/components/Card";
import ShareButton from "@/components/ShareButton";

export interface ResultStat {
  label: string;
  value: string;
}

interface ResultHighlightProps {
  /** Etiqueta corta encima del número (ej. "Capital final estimado"). */
  label: string;
  /** El resultado principal, ya formateado (euros o años) — el elemento dominante de la página. */
  value: string;
  /** Pares etiqueta/valor secundarios, en rejilla de 2 columnas. */
  stats?: ResultStat[];
  /** Contenido libre adicional (frases condicionales, desgloses a medida, etc.). */
  children?: ReactNode;
  /** Si se pasa, muestra un botón "Compartir resultado" con este texto (sin URL, se añade sola). */
  shareText?: string;
}

export default function ResultHighlight({
  label,
  value,
  stats,
  children,
  shareText,
}: ResultHighlightProps) {
  return (
    <Card aria-live="polite" className="animate-result-fade-in p-6 sm:p-8">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="result-glow mt-1 text-5xl font-bold tracking-tight text-chart-green sm:text-6xl">
        {value}
      </p>

      {stats && stats.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted">
          {stats.map((stat) => (
            <div key={stat.label} className="contents">
              <dt>{stat.label}</dt>
              <dd className="text-right font-medium text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children}

      {shareText && (
        <div className="mt-5">
          <ShareButton text={shareText} className="-ml-5" />
        </div>
      )}
    </Card>
  );
}
