const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuros(value: number): string {
  return currencyFormatter.format(value);
}

/** Misma moneda, sin decimales — para ejes y etiquetas donde no cabe tanto detalle. */
export function formatEurosCompact(value: number): string {
  return compactCurrencyFormatter.format(value);
}
