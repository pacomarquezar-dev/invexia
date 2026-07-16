import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateCompoundInterest } from "@/lib/compoundInterest";
import { formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import CompoundInterestCalculator from "./CompoundInterestCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

export const metadata: Metadata = {
  title: "Calculadora de interés compuesto",
  description:
    "Esta calculadora de interés compuesto muestra cuánto puede crecer tu dinero. Introduce tu capital inicial, aportación mensual, tasa de interés y años, y consulta la evolución de tu capital.",
  alternates: {
    canonical: "/calculadoras/interes-compuesto",
  },
};

const faqEntries = [
  {
    question: "¿Cómo se calcula el interés compuesto?",
    answer:
      "Se calcula con la fórmula A = P × (1 + r/n)^(n×t), donde P es el capital inicial, r es la tasa de interés anual, n es el número de veces que se capitaliza por año y t es el número de años. Si además hay aportaciones periódicas, el cálculo se hace mes a mes sumando cada nueva aportación antes de aplicar el interés del periodo siguiente.",
  },
  {
    question: "¿Cada cuánto se capitaliza el interés compuesto?",
    answer:
      "Depende del producto: las cuentas remuneradas suelen capitalizar mensual o diariamente, los fondos de inversión reinvierten los rendimientos de forma continua, y algunos bonos capitalizan semestral o anualmente. Cuanto más frecuente es la capitalización, mayor es el rendimiento final, aunque la diferencia suele ser pequeña salvo con tipos muy altos.",
  },
  {
    question: "¿Qué rentabilidad debo poner en la calculadora?",
    answer:
      'No hay una cifra "correcta": depende de dónde inviertas. Como referencia orientativa, un fondo indexado global ha rentado históricamente entre el 6% y el 8% anual a largo plazo, una cuenta remunerada actual ronda el 2-3%, y la renta fija suele estar por debajo. Recuerda que la rentabilidad pasada no garantiza la futura.',
  },
  {
    question: "¿Es mejor invertir una cantidad grande de golpe o aportar poco a poco cada mes?",
    answer:
      "Ambas estrategias tienen sentido según tu situación. Puedes comparar los dos escenarios exactos con la calculadora de DCA vs. pago único de Invexia.",
  },
  {
    question: "¿El interés compuesto también funciona en contra mía?",
    answer:
      "Sí. La deuda con intereses altos, como la de las tarjetas de crédito, se capitaliza de la misma forma: si solo pagas el mínimo, los intereses no pagados se suman al capital pendiente y generan nuevos intereses, haciendo que la deuda crezca de forma exponencial igual que crecería una inversión.",
  },
  {
    question: "¿Cuánto tiempo tarda mi dinero en duplicarse con interés compuesto?",
    answer:
      'Puedes estimarlo con la "regla del 72": divide 72 entre la rentabilidad anual esperada. Por ejemplo, al 6% anual, tu dinero tardaría aproximadamente 72 ÷ 6 = 12 años en duplicarse.',
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/interes-compuesto`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function InteresCompuestoPage() {
  const example1 = calculateCompoundInterest({
    initialCapital: 0,
    monthlyContribution: 100,
    annualRatePercent: 7,
    years: 40,
  });
  const example2 = calculateCompoundInterest({
    initialCapital: 5000,
    monthlyContribution: 200,
    annualRatePercent: 6,
    years: 20,
  });
  const example3 = calculateCompoundInterest({
    initialCapital: 0,
    monthlyContribution: 100,
    annualRatePercent: 7,
    years: 30,
  });
  const lateStartDifference = example1.finalCapital - example3.finalCapital;

  const comparisonCompound = calculateCompoundInterest({
    initialCapital: 10000,
    monthlyContribution: 0,
    annualRatePercent: 6,
    years: 20,
  }).finalCapital;
  const comparisonSimple = 10000 * (1 + 0.06 * 20);

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
            { label: "Calculadora de interés compuesto" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadora de interés compuesto
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Introduce tu capital inicial, tu aportación mensual, la tasa de interés anual esperada
          y el número de años. Verás el capital final estimado y cómo evoluciona a lo largo del
          tiempo.
        </p>
      </div>

      <Suspense fallback={null}>
        <CompoundInterestCalculator />
      </Suspense>

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Qué es el interés compuesto</h2>
          <p>
            El interés compuesto es el interés que se calcula no solo sobre el capital que
            invertiste al principio, sino también sobre todos los intereses que ese capital ha
            ido generando con el tiempo. Dicho de otra forma: tus ganancias empiezan a generar
            sus propias ganancias.
          </p>
          <p>
            Imagina que inviertes 10.000 € a un 6% anual. El primer año ganas 600 €, y tu capital
            pasa a ser 10.600 €. El segundo año, el 6% ya no se calcula sobre los 10.000 €
            iniciales, sino sobre los 10.600 €, así que ganas 636 €. Parece poca diferencia, pero
            repetida durante 20 o 30 años, esa diferencia se multiplica de forma muy
            significativa.
          </p>
          <p>
            Cuanto más tiempo mantengas el dinero invertido, más fuerte es el efecto. Por eso, en
            interés compuesto, el factor más importante no es cuánto inviertes, sino durante
            cuánto tiempo lo mantienes invertido.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cómo usar la calculadora de interés compuesto
          </h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Capital inicial:</strong> introduce la cantidad
              de dinero que tienes disponible para invertir hoy. Puede ser 0 € si vas a empezar
              solo con aportaciones periódicas.
            </li>
            <li>
              <strong className="text-foreground">Aportación mensual:</strong> indica cuánto
              piensas aportar cada mes.
            </li>
            <li>
              <strong className="text-foreground">Rentabilidad anual esperada:</strong> el
              porcentaje de rentabilidad que esperas obtener cada año. Como referencia, un fondo
              indexado global ha rentado históricamente entre el 6% y el 8% anual a largo plazo
              (sin garantía de que se repita en el futuro).
            </li>
            <li>
              <strong className="text-foreground">Años de inversión:</strong> el número de años
              que vas a mantener el dinero invertido.
            </li>
            <li>Pulsa &ldquo;Calcular&rdquo; y verás el gráfico con la evolución de tu capital.</li>
          </ol>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Si empiezas sin capital inicial, aportas 100 €/mes y consigues una rentabilidad media
            del 7% anual durante 40 años, terminarías con {formatEUR(example1.finalCapital)}.
            Habrás aportado {formatEUR(example1.totalContributed)} de tu bolsillo; el resto,{" "}
            {formatEUR(example1.totalInterest)}, son intereses generados por el propio interés
            compuesto.
          </p>
          <p>
            Si partes de 5.000 € ya invertidos y añades 200 €/mes a un 6% anual durante 20 años,
            tu capital final sería de {formatEUR(example2.finalCapital)}: de esa cantidad,{" "}
            {formatEUR(example2.totalContributed)} corresponden a lo aportado y{" "}
            {formatEUR(example2.totalInterest)} a intereses acumulados.
          </p>
          <p>
            Si el mismo plan del primer ejemplo (0 € inicial, 100 €/mes al 7% anual) lo empiezas
            10 años más tarde y por tanto inviertes durante 30 años en lugar de 40, tu capital
            final sería de {formatEUR(example3.finalCapital)} en vez de{" "}
            {formatEUR(example1.finalCapital)}: una diferencia de{" "}
            {formatEUR(lateStartDifference)} solo por haber esperado una década de más para
            empezar.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Interés compuesto vs interés simple
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparativa entre interés simple e interés compuesto
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Característica
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Interés simple
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Interés compuesto
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60">
                  <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                    Se calcula sobre
                  </th>
                  <td className="py-2 pr-4">Solo el capital inicial</td>
                  <td className="py-2">Capital inicial + intereses acumulados</td>
                </tr>
                <tr className="border-b border-border/60">
                  <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                    Crecimiento
                  </th>
                  <td className="py-2 pr-4">Lineal</td>
                  <td className="py-2">Exponencial</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                    Ejemplo con 10.000 € al 6% en 20 años
                  </th>
                  <td className="py-2 pr-4">{formatEUR(comparisonSimple)}</td>
                  <td className="py-2">{formatEUR(comparisonCompound)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Preguntas frecuentes</h2>
          <div className="flex flex-col divide-y divide-border">
            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿Cómo se calcula el interés compuesto?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                Se calcula con la fórmula A = P × (1 + r/n)^(n×t), donde P es el capital inicial,
                r es la tasa de interés anual, n es el número de veces que se capitaliza por año
                y t es el número de años. Si además hay aportaciones periódicas, el cálculo se
                hace mes a mes sumando cada nueva aportación antes de aplicar el interés del
                periodo siguiente.
              </p>
            </details>

            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿Cada cuánto se capitaliza el interés compuesto?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                Depende del producto: las cuentas remuneradas suelen capitalizar mensual o
                diariamente, los fondos de inversión reinvierten los rendimientos de forma
                continua, y algunos bonos capitalizan semestral o anualmente. Cuanto más
                frecuente es la capitalización, mayor es el rendimiento final, aunque la
                diferencia suele ser pequeña salvo con tipos muy altos.
              </p>
            </details>

            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿Qué rentabilidad debo poner en la calculadora?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                No hay una cifra &ldquo;correcta&rdquo;: depende de dónde inviertas. Como
                referencia orientativa, un fondo indexado global ha rentado históricamente entre
                el 6% y el 8% anual a largo plazo, una cuenta remunerada actual ronda el 2-3%, y
                la renta fija suele estar por debajo. Recuerda que la rentabilidad pasada no
                garantiza la futura.
              </p>
            </details>

            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿Es mejor invertir una cantidad grande de golpe o aportar poco a poco cada mes?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                Ambas estrategias tienen sentido según tu situación — puedes comparar los dos
                escenarios exactos con nuestra{" "}
                <Link href="/calculadoras/dca-vs-pago-unico" className="underline hover:text-foreground">
                  calculadora de DCA vs. pago único
                </Link>
                .
              </p>
            </details>

            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿El interés compuesto también funciona en contra mía?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                Sí. La deuda con intereses altos, como la de las tarjetas de crédito, se
                capitaliza de la misma forma: si solo pagas el mínimo, los intereses no pagados
                se suman al capital pendiente y generan nuevos intereses, haciendo que la deuda
                crezca de forma exponencial igual que crecería una inversión.
              </p>
            </details>

            <details className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                ¿Cuánto tiempo tarda mi dinero en duplicarse con interés compuesto?
                <span
                  aria-hidden="true"
                  className="shrink-0 text-foreground/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-7">
                Puedes estimarlo con la &ldquo;regla del 72&rdquo;: divide 72 entre la
                rentabilidad anual esperada. Por ejemplo, al 6% anual, tu dinero tardaría
                aproximadamente 72 ÷ 6 = 12 años en duplicarse.
              </p>
            </details>
          </div>
        </Card>
      </div>

      <RelatedGlossaryTerms slugs={["interes-compuesto", "interes-simple", "tae", "tin"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Los resultados son estimaciones basadas en
        una tasa de interés constante y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
