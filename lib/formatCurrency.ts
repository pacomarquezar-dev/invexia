/**
 * useGrouping: "always" es necesario porque, sin él, Intl.NumberFormat con
 * locale "es-ES" no agrupa los miles en números de exactamente 4 cifras
 * (ej. "1234 €" en vez de "1.234 €"), aunque sí lo hace a partir de 5 cifras.
 * Es un comportamiento real de los datos CLDR de esa variante del locale,
 * no un error de configuración — forzarlo evita esa inconsistencia visual.
 */
const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
  useGrouping: "always",
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: "always",
});

export function formatEuros(value: number): string {
  return currencyFormatter.format(value);
}

/** Misma moneda, sin decimales — para ejes y etiquetas donde no cabe tanto detalle. */
export function formatEurosCompact(value: number): string {
  return compactCurrencyFormatter.format(value);
}
