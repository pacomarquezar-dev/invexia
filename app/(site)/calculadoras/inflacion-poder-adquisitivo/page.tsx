import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import EmbedCodeButton from "@/components/EmbedCodeButton";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateInflationImpact } from "@/lib/inflationImpact";
import { formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import InflationImpactCalculator from "./InflationImpactCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

export const metadata: Metadata = {
  title: "Calculadora de inflación y poder adquisitivo",
  description:
    "Calcula cuánto poder adquisitivo real perderá tu dinero por la inflación en los próximos años. Descubre cuánto valdría hoy esa misma cantidad dentro de X años.",
  alternates: {
    canonical: "/calculadoras/inflacion-poder-adquisitivo",
  },
};

const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const faqEntries = [
  {
    question: "¿Cómo se mide la inflación en España?",
    answer:
      "La inflación se mide principalmente a través del IPC (Índice de Precios de Consumo), publicado mensualmente por el INE, que sigue la evolución de los precios de una cesta representativa de bienes y servicios.",
  },
  {
    question: "¿Qué diferencia hay entre rentabilidad nominal y rentabilidad real?",
    answer:
      "La rentabilidad nominal es el rendimiento que ves en tu inversión antes de descontar la inflación. La rentabilidad real es lo que realmente ganas en términos de poder de compra, una vez descontado el efecto de la inflación. Si tu inversión rinde un 5% nominal y la inflación es del 3%, tu rentabilidad real ronda el 2%.",
  },
  {
    question: "¿Es mala idea tener todos mis ahorros en efectivo o en una cuenta sin remunerar?",
    answer:
      "Depende del plazo y el propósito. Para un fondo de emergencia que necesitas tener disponible en cualquier momento, tiene sentido priorizar la disponibilidad sobre el rendimiento. Pero para dinero que no vas a necesitar a corto plazo, mantenerlo sin invertir durante muchos años significa perder poder adquisitivo de forma silenciosa pero constante.",
  },
  {
    question: "¿La inflación siempre sube al mismo ritmo?",
    answer:
      "No. La inflación varía de un año a otro según las condiciones económicas: ha habido periodos de inflación muy baja o incluso negativa (deflación), y periodos de inflación mucho más alta de lo habitual. Esta calculadora usa una tasa constante como simplificación para facilitar el cálculo, no como una predicción exacta del futuro.",
  },
  {
    question: "¿Cómo puedo proteger mis ahorros de la inflación?",
    answer:
      "La forma más habitual es buscar una rentabilidad esperada que supere a la inflación, ya sea a través de cuentas remuneradas competitivas o de inversión en activos como fondos indexados. Puedes comparar tu rentabilidad nominal esperada frente a la inflación con nuestra calculadora de interés compuesto.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/inflacion-poder-adquisitivo`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function InflacionPoderAdquisitivoPage() {
  const example1 = calculateInflationImpact({
    currentAmount: 10000,
    annualInflationRatePercent: 2.5,
    years: 10,
  });
  const example2 = calculateInflationImpact({
    currentAmount: 10000,
    annualInflationRatePercent: 2.5,
    years: 30,
  });
  const example3 = calculateInflationImpact({
    currentAmount: 10000,
    annualInflationRatePercent: 5,
    years: 10,
  });

  const horizonTable = [5, 10, 20, 30].map((years) => ({
    years,
    result: calculateInflationImpact({ currentAmount: 10000, annualInflationRatePercent: 2.5, years }),
  }));

  const inflationTable = [2, 4, 6].map((annualInflationRatePercent) => ({
    annualInflationRatePercent,
    result: calculateInflationImpact({ currentAmount: 10000, annualInflationRatePercent, years: 10 }),
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
            { label: "Inflación y poder adquisitivo" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadora de inflación y poder adquisitivo
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Introduce una cantidad de dinero, la inflación anual esperada y un número de años.
          Verás cuánto podrías comprar realmente con esa cantidad dentro de ese tiempo, en
          euros de hoy.
        </p>
      </div>

      <InflationImpactCalculator />

      <EmbedCodeButton
        slug="inflacion-poder-adquisitivo"
        title="Calculadora de inflación y poder adquisitivo"
        height={900}
      />

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Qué es el poder adquisitivo y por qué baja con el tiempo
          </h2>
          <p>
            El poder adquisitivo es lo que tu dinero puede comprar realmente, no la cifra que
            aparece en tu cuenta. Si tienes 10.000 € guardados y no generan ningún rendimiento,
            dentro de 10 años seguirás teniendo exactamente 10.000 €, pero podrás comprar con
            ellos menos cosas que hoy, porque los precios suben con el tiempo debido a la
            inflación.
          </p>
          <p>
            Esta calculadora te muestra ese efecto de forma directa: cuánto valdría hoy, en
            términos de lo que puedes comprar, una cantidad de dinero que se mantiene sin
            invertir durante un número determinado de años, a una tasa de inflación esperada. Es
            la razón por la que dejar dinero &ldquo;parado&rdquo; durante mucho tiempo tiene un
            coste real, aunque no lo veas reflejado en el saldo de tu cuenta.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Cómo usar la calculadora</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Cantidad de dinero actual:</strong> el importe
              que quieres analizar, en euros de hoy.
            </li>
            <li>
              <strong className="text-foreground">Tasa de inflación anual esperada:</strong> el
              porcentaje al que esperas que suban los precios cada año. Como referencia, el Banco
              Central Europeo tiene como objetivo una inflación cercana al 2% anual a largo
              plazo, aunque en la práctica ha habido periodos bastante por encima de esa cifra.
            </li>
            <li>
              <strong className="text-foreground">Años a futuro:</strong> el horizonte temporal
              que quieres analizar.
            </li>
          </ol>
          <p>
            La calculadora te muestra cuánto poder de compra conservaría esa cantidad al final
            del periodo, expresado en euros de hoy, y qué porcentaje de poder adquisitivo se
            habría perdido.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Con los valores por defecto (10.000 € a una inflación del 2,5% anual durante 10
            años), esa cantidad conservaría un poder de compra equivalente a{" "}
            {formatEUR(example1.adjustedValue)} de hoy: una pérdida del{" "}
            {percentFormatter.format(example1.purchasingPowerLossPercent)}%.
          </p>
          <p>
            Con el mismo capital y la misma inflación, pero en un horizonte de jubilación de 30
            años, el poder de compra equivalente baja a {formatEUR(example2.adjustedValue)}: una
            pérdida del {percentFormatter.format(example2.purchasingPowerLossPercent)}%, más del
            doble que a 10 años.
          </p>
          <p>
            Con el mismo capital y el mismo horizonte de 10 años del primer ejemplo, pero con una
            inflación del 5% en vez del 2,5%, el poder de compra equivalente baja a{" "}
            {formatEUR(example3.adjustedValue)}, una pérdida del{" "}
            {percentFormatter.format(example3.purchasingPowerLossPercent)}%. Aunque la inflación
            se duplica exactamente (del 2,5% al 5%), la pérdida de poder adquisitivo no llega a
            duplicarse: sube de {percentFormatter.format(example1.purchasingPowerLossPercent)}% a{" "}
            {percentFormatter.format(example3.purchasingPowerLossPercent)}%, un incremento
            importante pero no proporcional uno a uno.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            Cómo se acelera la pérdida según el horizonte y la inflación
          </h2>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Según el horizonte (10.000 € a una inflación fija del 2,5%)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Poder de compra equivalente y pérdida de poder adquisitivo de 10.000 € a una
                  inflación del 2,5% anual, según el horizonte temporal
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Horizonte
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Poder de compra equivalente
                    </th>
                    <th scope="col" className="py-2 font-semibold text-foreground">
                      Pérdida
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
                      <td className="py-2 pr-4">{formatEUR(result.adjustedValue)}</td>
                      <td className="py-2">
                        {percentFormatter.format(result.purchasingPowerLossPercent)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Según la tasa de inflación (10.000 € a 10 años)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Poder de compra equivalente y pérdida de poder adquisitivo de 10.000 € a 10
                  años, según la tasa de inflación anual
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Inflación
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Poder de compra equivalente
                    </th>
                    <th scope="col" className="py-2 font-semibold text-foreground">
                      Pérdida
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inflationTable.map(({ annualInflationRatePercent, result }, index) => (
                    <tr
                      key={annualInflationRatePercent}
                      className={
                        index < inflationTable.length - 1 ? "border-b border-border/60" : undefined
                      }
                    >
                      <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                        {annualInflationRatePercent}%
                      </th>
                      <td className="py-2 pr-4">{formatEUR(result.adjustedValue)}</td>
                      <td className="py-2">
                        {percentFormatter.format(result.purchasingPowerLossPercent)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Preguntas frecuentes</h2>
          <div className="flex flex-col divide-y divide-border">
            {faqEntries.map((entry, index) => (
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
                {index === faqEntries.length - 1 ? (
                  <p className="mt-2 leading-7">
                    La forma más habitual es buscar una rentabilidad esperada que supere a la
                    inflación, ya sea a través de cuentas remuneradas competitivas o de inversión
                    en activos como fondos indexados. Puedes comparar tu rentabilidad nominal
                    esperada frente a la inflación con nuestra{" "}
                    <Link href="/calculadoras/interes-compuesto" className="underline hover:text-foreground">
                      calculadora de interés compuesto
                    </Link>
                    .
                  </p>
                ) : (
                  <p className="mt-2 leading-7">{entry.answer}</p>
                )}
              </details>
            ))}
          </div>
        </Card>
      </div>

      <RelatedGlossaryTerms slugs={["inflacion", "rentabilidad-real-vs-nominal"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una inflación anual constante; los
        resultados son estimaciones y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
