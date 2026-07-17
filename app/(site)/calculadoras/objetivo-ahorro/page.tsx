import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import EmbedCodeButton from "@/components/EmbedCodeButton";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateSavingsGoal } from "@/lib/savingsGoal";
import { formatEuros, formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import SavingsGoalCalculator from "./SavingsGoalCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

export const metadata: Metadata = {
  title: "Calculadora de objetivo de ahorro",
  description:
    "Calcula cuánto tienes que aportar cada mes para alcanzar tu objetivo de ahorro en el plazo que quieras, teniendo en cuenta el interés compuesto.",
  alternates: {
    canonical: "/calculadoras/objetivo-ahorro",
  },
};

const faqEntries = [
  {
    question: "¿Qué diferencia hay entre esta calculadora y la de interés compuesto?",
    answer:
      "La calculadora de interés compuesto parte de cuánto ahorras (capital inicial y aportación mensual) para decirte en qué se convertirá con el tiempo. Esta calculadora funciona al revés: parte del resultado que quieres alcanzar para decirte cuánto tienes que aportar cada mes para llegar ahí.",
  },
  {
    question: "¿Qué rentabilidad debería usar si voy a guardar el dinero en una cuenta sin invertir?",
    answer:
      "Si el dinero va a estar en una cuenta corriente o de ahorro sin remunerar, usa 0% o el interés real de tu cuenta (normalmente entre el 0% y el 3% actualmente). Si vas a invertirlo, puedes usar una rentabilidad esperada más alta, pero recuerda que entonces asumes también más riesgo y volatilidad.",
  },
  {
    question: "¿Es realista este cálculo para un fondo de emergencia?",
    answer:
      "Para un fondo de emergencia, que necesitas poder usar en cualquier momento, lo habitual es usar una rentabilidad baja o nula (cuenta remunerada de bajo riesgo), ya que la prioridad es tener el dinero disponible sin depender de que el mercado esté en buen momento cuando lo necesites.",
  },
  {
    question: "¿Qué pasa si no puedo permitirme la aportación mensual que me indica la calculadora?",
    answer:
      "Tienes varias opciones: ampliar el plazo (años disponibles), reducir la cantidad objetivo, buscar una rentabilidad mayor asumiendo más riesgo, o aumentar tu capital inicial antes de empezar. La calculadora te permite probar distintas combinaciones para encontrar una que se ajuste a tu situación real.",
  },
  {
    question: "¿La aportación mensual que me da es constante durante todo el plazo?",
    answer:
      "Sí, el cálculo asume una aportación mensual fija durante todo el periodo. En la práctica, muchas personas ajustan la aportación con el tiempo (por ejemplo, aumentándola si sus ingresos suben), lo que podría permitir llegar antes o aportar menos al principio.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/objetivo-ahorro`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function ObjetivoAhorroPage() {
  const example1 = calculateSavingsGoal({
    targetAmount: 30000,
    years: 10,
    annualRatePercent: 7,
    initialCapital: 0,
  });
  const example2 = calculateSavingsGoal({
    targetAmount: 6000,
    years: 2,
    annualRatePercent: 2,
    initialCapital: 0,
  });
  const example3 = calculateSavingsGoal({
    targetAmount: 40000,
    years: 5,
    annualRatePercent: 5,
    initialCapital: 8000,
  });

  const horizonTable = [5, 10, 20].map((years) => ({
    years,
    result: calculateSavingsGoal({
      targetAmount: 30000,
      years,
      annualRatePercent: 7,
      initialCapital: 0,
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
            { label: "Objetivo de ahorro" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadora de objetivo de ahorro
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Introduce la cantidad que quieres alcanzar, el plazo del que dispones, la
          rentabilidad anual esperada y lo que ya tengas ahorrado. Te decimos cuánto tienes que
          aportar cada mes para llegar a tu objetivo.
        </p>
      </div>

      <SavingsGoalCalculator />

      <EmbedCodeButton
        slug="objetivo-ahorro"
        title="Calculadora de objetivo de ahorro"
        height={900}
      />

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Qué es esta calculadora y para qué sirve
          </h2>
          <p>
            A diferencia de otras calculadoras que parten de cuánto ahorras para saber en qué te
            convertirás, esta funciona al revés: le dices cuánto dinero quieres tener (tu
            objetivo) y en cuántos años quieres conseguirlo, y ella te dice cuánto tienes que
            aportar cada mes para llegar exactamente ahí, teniendo en cuenta la rentabilidad que
            esperas obtener por el camino.
          </p>
          <p>
            Es la herramienta ideal cuando ya tienes un objetivo concreto en mente:{" "}
            <Link href="/glosario/liquidez" className="underline hover:text-foreground">
              un fondo de emergencia
            </Link>
            , la entrada de una vivienda, un fondo para la educación de un hijo, o simplemente
            una cifra que te has propuesto alcanzar en un plazo determinado.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Cómo usar la calculadora</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Cantidad objetivo:</strong> la cifra final que
              quieres alcanzar.
            </li>
            <li>
              <strong className="text-foreground">Años disponibles:</strong> el plazo que te das
              para conseguirlo.
            </li>
            <li>
              <strong className="text-foreground">Rentabilidad anual esperada:</strong> el
              rendimiento que esperas obtener de tu dinero mientras ahorras (0% si simplemente lo
              guardas en una cuenta sin remunerar, o el rendimiento esperado de tu inversión si
              lo inviertes).
            </li>
            <li>
              <strong className="text-foreground">Capital inicial:</strong> cuánto tienes ya
              ahorrado hacia ese objetivo, si es que tienes algo.
            </li>
          </ol>
          <p>
            La calculadora te devuelve la aportación mensual exacta que necesitas hacer. Si el
            capital inicial ya es suficiente por sí solo para alcanzar el objetivo en ese plazo,
            te lo indicará y la aportación requerida será 0 €.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Con los valores por defecto (objetivo de {formatEUR(30000)} en 10 años, al 7% anual,
            sin capital inicial), la aportación mensual necesaria es de{" "}
            {formatEuros(example1.requiredMonthlyContribution)}.
          </p>
          <p>
            Para un fondo de emergencia de {formatEUR(6000)} en solo 2 años, guardado sin
            invertir (2% anual, el interés típico de una cuenta remunerada), harían falta{" "}
            {formatEuros(example2.requiredMonthlyContribution)} al mes.
          </p>
          <p>
            Para la entrada de una vivienda de {formatEUR(40000)} en 5 años, partiendo ya de{" "}
            {formatEUR(8000)} ahorrados y con una rentabilidad del 5% anual, la aportación
            mensual necesaria baja a {formatEuros(example3.requiredMonthlyContribution)}, gracias
            al capital inicial y a la rentabilidad esperada.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cuánto cambia la aportación necesaria según el plazo
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Aportación mensual necesaria para alcanzar 30.000 € al 7% anual, según los años
                disponibles
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Plazo
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Aportación mensual necesaria
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
                    <td className="py-2">{formatEuros(result.requiredMonthlyContribution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {index === 0 ? (
                  <p className="mt-2 leading-7">
                    La calculadora de{" "}
                    <Link href="/calculadoras/interes-compuesto" className="underline hover:text-foreground">
                      interés compuesto
                    </Link>{" "}
                    parte de cuánto ahorras (capital inicial y aportación mensual) para decirte
                    en qué se convertirá con el tiempo. Esta calculadora funciona al revés: parte
                    del resultado que quieres alcanzar para decirte cuánto tienes que aportar
                    cada mes para llegar ahí.
                  </p>
                ) : (
                  <p className="mt-2 leading-7">{entry.answer}</p>
                )}
              </details>
            ))}
          </div>
        </Card>
      </div>

      <RelatedGlossaryTerms slugs={["interes-compuesto", "liquidez"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad anual constante;
        los resultados son estimaciones y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
