import type { ReactNode } from "react";
import Card from "@/components/Card";

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
}

export default function ResultHighlight({ label, value, stats, children }: ResultHighlightProps) {
  return (
    <Card aria-live="polite" className="p-6 sm:p-8">
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
    </Card>
  );
}
