import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateDcaVsLumpSum } from "@/lib/dcaVsLumpSum";
import { formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import DcaVsLumpSumCalculator from "./DcaVsLumpSumCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.invexia.es";

export const metadata: Metadata = {
  title: "DCA vs pago único",
  description:
    "Compara invertir todo tu capital de golpe frente a repartirlo en aportaciones periódicas (DCA). Introduce tu capital, horizonte temporal y rentabilidad esperada, y consulta cuál gana y por cuánto.",
  alternates: {
    canonical: "/calculadoras/dca-vs-pago-unico",
  },
};

const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const faqEntries = [
  {
    question: "¿Qué significa DCA?",
    answer:
      'DCA son las siglas de "dollar-cost averaging" (promediado del coste en dólares), una estrategia que consiste en invertir una cantidad fija de dinero a intervalos regulares en vez de invertirla toda de una vez.',
  },
  {
    question: "¿Es mejor el pago único o el DCA?",
    answer:
      "Estadísticamente, el pago único suele ganar más veces que el DCA en mercados que tienden a subir a largo plazo, porque el dinero pasa más tiempo invertido. Sin embargo, el DCA reduce el riesgo de invertir todo justo antes de una caída importante, lo que puede ser preferible si te importa más evitar el peor escenario que maximizar el resultado esperado.",
  },
  {
    question: "¿El DCA elimina el riesgo de las inversiones?",
    answer:
      "No. Reduce el riesgo de mal timing (invertir todo justo antes de una caída), pero no elimina el riesgo general del mercado ni garantiza rentabilidad positiva. Sigues expuesto a la volatilidad del activo en el que inviertas.",
  },
  {
    question: "¿Cuánto tiempo debería durar mi periodo de DCA?",
    answer:
      "No hay una regla fija, pero periodos habituales van de 6 a 24 meses. Periodos más largos diluyen más el riesgo de mal timing, pero también retrasan más el momento en que todo tu capital empieza a beneficiarse del interés compuesto.",
  },
  {
    question: "¿Puedo combinar ambas estrategias?",
    answer:
      "Sí. Muchas personas invierten de golpe la mayor parte de su capital y dejan una parte menor para ir aportando de forma periódica, combinando el beneficio esperado del pago único con parte de la protección psicológica del DCA.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/dca-vs-pago-unico`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function DcaVsPagoUnicoPage() {
  const example1 = calculateDcaVsLumpSum({ totalCapital: 12000, years: 10, annualRatePercent: 7 });
  const example2 = calculateDcaVsLumpSum({ totalCapital: 12000, years: 3, annualRatePercent: 7 });
  const example3 = calculateDcaVsLumpSum({ totalCapital: 12000, years: 20, annualRatePercent: 7 });

  const horizonTable = [3, 10, 20].map((years) => ({
    years,
    result: calculateDcaVsLumpSum({ totalCapital: 12000, years, annualRatePercent: 7 }),
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
            { label: "DCA vs pago único" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          DCA vs pago único
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Introduce el capital total que quieres invertir, el horizonte temporal y la
          rentabilidad anual esperada. Compara invertirlo todo de golpe frente a repartirlo en
          aportaciones mensuales iguales a lo largo del tiempo.
        </p>
      </div>

      <DcaVsLumpSumCalculator />

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Qué es el DCA (dollar-cost averaging) y por qué se compara con el pago único
          </h2>
          <p>
            Cuando tienes una cantidad de dinero disponible para invertir, hay dos formas básicas
            de hacerlo: invertirla toda de golpe (pago único, o &ldquo;lump sum&rdquo; en inglés),
            o repartirla en aportaciones periódicas a lo largo del tiempo (DCA, &ldquo;dollar-cost
            averaging&rdquo; o promediado del coste). Ninguna de las dos es universalmente mejor:
            depende de cómo se comporte el mercado durante ese periodo.
          </p>
          <p>
            Matemáticamente, el pago único suele ganar más veces de las que pierde a largo plazo,
            porque el dinero pasa más tiempo invertido y se beneficia antes del{" "}
            <Link href="/calculadoras/interes-compuesto" className="underline hover:text-foreground">
              interés compuesto
            </Link>
            . Pero el DCA tiene una ventaja distinta: reduce el riesgo de invertir todo justo
            antes de una{" "}
            <Link href="/glosario/volatilidad" className="underline hover:text-foreground">
              caída fuerte del mercado
            </Link>
            , repartiendo ese riesgo de mal timing entre varios momentos de compra. Es una
            decisión entre maximizar la rentabilidad esperada y minimizar el arrepentimiento en
            el peor escenario posible.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Cómo usar la calculadora</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Capital total a invertir:</strong> la cantidad
              de dinero que tienes disponible hoy.
            </li>
            <li>
              <strong className="text-foreground">Horizonte temporal:</strong> cuántos años vas a
              mantener la inversión (o, en el caso del DCA, cuántos años vas a tardar en meter
              todo el capital).
            </li>
            <li>
              <strong className="text-foreground">Rentabilidad anual esperada:</strong> el
              rendimiento medio que esperas del mercado durante ese periodo.
            </li>
          </ol>
          <p>
            La calculadora te muestra el capital final estimado en ambos escenarios y la
            diferencia entre ellos — recuerda que esta comparación asume una rentabilidad
            constante, y el mercado real no se comporta así; es una simplificación útil para
            entender el efecto del tiempo invertido, no una predicción.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Con los valores por defecto (12.000 € de capital, 10 años de horizonte y una
            rentabilidad anual del 7%), el pago único termina en {formatEUR(example1.lumpSumFinalCapital)}{" "}
            frente a los {formatEUR(example1.dcaFinalCapital)} del DCA: una diferencia de{" "}
            {formatEUR(example1.differenceAbsolute)} a favor del pago único, un{" "}
            {percentFormatter.format(example1.differencePercent)}% más.
          </p>
          <p>
            Con el mismo capital y rentabilidad pero un horizonte corto de solo 3 años, el pago
            único da {formatEUR(example2.lumpSumFinalCapital)} frente a{" "}
            {formatEUR(example2.dcaFinalCapital)} del DCA: la diferencia se reduce a{" "}
            {formatEUR(example2.differenceAbsolute)}, un {percentFormatter.format(example2.differencePercent)}%.
          </p>
          <p>
            Con un horizonte largo de 20 años, el pago único alcanza{" "}
            {formatEUR(example3.lumpSumFinalCapital)} frente a {formatEUR(example3.dcaFinalCapital)}{" "}
            del DCA: una diferencia de {formatEUR(example3.differenceAbsolute)}, un{" "}
            {percentFormatter.format(example3.differencePercent)}%. Los tres ejemplos muestran el
            mismo patrón: cuanto más largo es el horizonte, mayor es la ventaja del pago único
            sobre el DCA, tanto en euros como en porcentaje.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cuánto importa el horizonte temporal
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Pago único frente a DCA con 12.000 € y una rentabilidad anual del 7%, según el
                horizonte temporal
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Horizonte
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Pago único
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    DCA
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Diferencia
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
                    <td className="py-2 pr-4">{formatEUR(result.lumpSumFinalCapital)}</td>
                    <td className="py-2 pr-4">{formatEUR(result.dcaFinalCapital)}</td>
                    <td className="py-2">
                      {formatEUR(result.differenceAbsolute)} (
                      {percentFormatter.format(result.differencePercent)}%)
                    </td>
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

      <RelatedGlossaryTerms slugs={["dca", "volatilidad"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad constante y no
        tiene en cuenta la volatilidad real del mercado; los resultados son estimaciones y no
        constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
