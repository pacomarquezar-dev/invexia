import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import EmbedCodeButton from "@/components/EmbedCodeButton";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateFeeImpact } from "@/lib/feeImpact";
import { formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import FeeImpactCalculator from "./FeeImpactCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

export const metadata: Metadata = {
  title: "Coste real de las comisiones a largo plazo",
  description:
    "Descubre cuánto te cuestan las comisiones de gestión a largo plazo. Compara tres escenarios de comisión anual (baja, media y alta) sobre el mismo capital y rentabilidad esperada.",
  alternates: {
    canonical: "/calculadoras/coste-comisiones",
  },
};

const faqEntries = [
  {
    question: "¿Qué es el TER o ratio de gastos de un fondo?",
    answer:
      "Es el coste total anual de gestionar un fondo de inversión, expresado como porcentaje del capital invertido. Ya está descontado del valor liquidativo del fondo, así que no lo ves como un cargo aparte, pero reduce tu rentabilidad neta cada año.",
  },
  {
    question: "¿Por qué los fondos indexados suelen tener comisiones más bajas?",
    answer:
      "Porque replican un índice de forma automática, sin necesidad de un equipo de gestores tomando decisiones activas de qué comprar y vender. Esa gestión pasiva reduce mucho los costes operativos, y esa diferencia se traslada a una comisión anual menor para el inversor.",
  },
  {
    question: "¿Una comisión más alta significa necesariamente peor rentabilidad?",
    answer:
      "No de forma automática: algunos fondos de gestión activa buscan compensar su comisión más alta con una rentabilidad bruta superior a la del mercado. Sin embargo, conseguir eso de forma consistente a largo plazo es difícil, y muchos estudios muestran que la mayoría de fondos activos no logran batir a sus índices de referencia una vez descontadas las comisiones.",
  },
  {
    question: "¿Dónde puedo ver la comisión exacta que pago en mi fondo o bróker?",
    answer:
      'Debe aparecer en el documento de datos fundamentales (DFI/KID) del fondo, normalmente bajo el nombre "gastos corrientes" o "TER". También suele estar disponible en la web del bróker o gestora donde tengas contratado el producto.',
  },
  {
    question: "¿Esta calculadora tiene en cuenta otros costes además de la comisión de gestión?",
    answer:
      "No, se centra solo en el efecto compuesto de la comisión de gestión anual sobre la rentabilidad. No incluye otros costes como comisiones de custodia, de compraventa, o impuestos, que también pueden afectar a tu rentabilidad final.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/coste-comisiones`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function CosteComisionesPage() {
  const example1 = calculateFeeImpact({
    initialCapital: 10000,
    grossAnnualRatePercent: 7,
    years: 20,
    lowFeePercent: 0.2,
    mediumFeePercent: 1,
    highFeePercent: 2,
  });
  const example2 = calculateFeeImpact({
    initialCapital: 50000,
    grossAnnualRatePercent: 7,
    years: 20,
    lowFeePercent: 0.2,
    mediumFeePercent: 1,
    highFeePercent: 2,
  });
  const example3 = calculateFeeImpact({
    initialCapital: 10000,
    grossAnnualRatePercent: 7,
    years: 30,
    lowFeePercent: 0.2,
    mediumFeePercent: 1,
    highFeePercent: 2,
  });

  const horizonTable = [10, 20, 30].map((years) => ({
    years,
    result: calculateFeeImpact({
      initialCapital: 10000,
      grossAnnualRatePercent: 7,
      years,
      lowFeePercent: 0.2,
      mediumFeePercent: 1,
      highFeePercent: 2,
    }),
  }));

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      {/* JSON-LD generado a partir de datos propios y estáticos, no de entrada de usuario */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Coste real de las comisiones" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Coste real de las comisiones a largo plazo
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Una comisión anual que parece pequeña puede suponer una diferencia enorme al cabo de
          los años. Introduce tu capital, la rentabilidad esperada y compara tres escenarios de
          comisión — bajo, medio y alto — para ver cuánto se lleva cada uno.
        </p>
      </div>

      <FeeImpactCalculator />

      <EmbedCodeButton
        slug="coste-comisiones"
        title="Calculadora del coste real de las comisiones"
        height={950}
      />

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Por qué unas décimas de comisión importan tanto a largo plazo
          </h2>
          <p>
            Una comisión anual del 1% o el 2% suena a poco cuando la ves como un número aislado,
            pero no se resta una sola vez: se resta cada año, sobre un capital cada vez mayor,
            durante todo el tiempo que mantengas la inversión. Es el mismo mecanismo que hace
            crecer tu dinero con el{" "}
            <Link href="/calculadoras/interes-compuesto" className="underline hover:text-foreground">
              interés compuesto
            </Link>
            , funcionando esta vez en tu contra.
          </p>
          <p>
            Dos personas que invierten exactamente el mismo capital, con la misma rentabilidad de
            mercado, pueden terminar con resultados muy distintos solo por la comisión que paga
            cada una. Cuanto más largo sea el horizonte de la inversión, mayor es esa diferencia:
            no es un coste lineal, es un coste que también compone.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Cómo usar la calculadora</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Capital inicial:</strong> la cantidad que
              inviertes hoy.
            </li>
            <li>
              <strong className="text-foreground">Rentabilidad anual esperada (antes de comisiones):</strong>{" "}
              el rendimiento bruto que esperas del mercado, antes de descontar ningún coste.
            </li>
            <li>
              <strong className="text-foreground">Horizonte temporal:</strong> cuántos años vas a
              mantener la inversión.
            </li>
            <li>
              <strong className="text-foreground">Comisión baja / media / alta:</strong> tres
              escenarios de comisión anual que puedes ajustar tú mismo. Por defecto usamos 0,2%
              (típico de un fondo indexado o{" "}
              <Link href="/glosario/etf" className="underline hover:text-foreground">
                ETF
              </Link>{" "}
              de bajo coste), 1% (habitual en muchos fondos de gestión activa) y 2% (frecuente en
              productos con comisiones más elevadas).
            </li>
          </ol>
          <p>
            La calculadora te muestra el capital final en cada uno de los tres escenarios y
            cuánto dinero exacto te cuesta, en euros, pagar la comisión más alta frente a la más
            baja.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Con los valores por defecto (10.000 € iniciales, 7% de rentabilidad bruta y 20 años),
            el capital final es de {formatEUR(example1.low.finalCapital)} con la comisión baja
            (0,2%), {formatEUR(example1.medium.finalCapital)} con la media (1%) y{" "}
            {formatEUR(example1.high.finalCapital)} con la alta (2%). Pagar la comisión más alta
            en vez de no pagar ninguna te cuesta {formatEUR(example1.highFeeCost)} en total.
          </p>
          <p>
            Con un capital inicial mayor, 50.000 €, y el mismo horizonte de 20 años, los capitales
            finales son {formatEUR(example2.low.finalCapital)}, {formatEUR(example2.medium.finalCapital)}{" "}
            y {formatEUR(example2.high.finalCapital)} respectivamente, y el coste de la comisión
            alta sube a {formatEUR(example2.highFeeCost)}: el coste crece en proporción directa
            al capital invertido.
          </p>
          <p>
            Con el mismo capital inicial del primer ejemplo (10.000 €) pero un horizonte de 30
            años en vez de 20, los capitales finales son {formatEUR(example3.low.finalCapital)},{" "}
            {formatEUR(example3.medium.finalCapital)} y {formatEUR(example3.high.finalCapital)}, y
            el coste de la comisión alta sube a {formatEUR(example3.highFeeCost)}: casi el triple
            que los {formatEUR(example1.highFeeCost)} del ejemplo con 20 años, solo por alargar
            el plazo 10 años más. El coste de la comisión no crece de forma lineal con el tiempo,
            sino cada vez más deprisa.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cuánto crece el coste de la comisión según el horizonte
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Coste de pagar una comisión anual del 2% frente a no pagar ninguna, con 10.000 €
                al 7% de rentabilidad bruta, según el horizonte temporal
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Horizonte
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Coste de la comisión alta (2%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {horizonTable.map(({ years, result }, index) => (
                  <tr
                    key={years}
                    className={index < horizonTable.length - 1 ? "border-b border-border/60" : undefined}
                  >
                    <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                      {years} años
                    </th>
                    <td className="py-2">{formatEUR(result.highFeeCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Preguntas frecuentes</h2>
          <div className="flex flex-col divide-y divide-border">
            {faqEntries.map((entry) => (
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
                <p className="mt-2 leading-7">{entry.answer}</p>
              </details>
            ))}
          </div>
        </Card>
      </div>

      <RelatedGlossaryTerms slugs={["comision-de-gestion", "fondo-indexado", "etf"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume que la comisión anual se resta
        directamente de la rentabilidad bruta cada año; los resultados son estimaciones y no
        constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
