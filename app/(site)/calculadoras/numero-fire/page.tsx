import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import EmbedCodeButton from "@/components/EmbedCodeButton";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import { calculateFireNumber } from "@/lib/fireNumber";
import { formatEurosCompact as formatEUR } from "@/lib/formatCurrency";
import FireNumberCalculator from "./FireNumberCalculator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invexia.app";

export const metadata: Metadata = {
  title: "Calculadora de jubilación anticipada (número FIRE)",
  description:
    "Calcula tu número FIRE: el capital que necesitas para tu jubilación anticipada y cuántos años te faltan para alcanzarlo con tu ahorro y aportación mensual actuales.",
  alternates: {
    canonical: "/calculadoras/numero-fire",
  },
};

const yearsFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const withdrawalRateFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
});

const faqEntries = [
  {
    question: "¿Qué significa FIRE?",
    answer:
      'FIRE son las siglas de "Financial Independence, Retire Early" (independencia financiera, jubilación anticipada). Es un movimiento centrado en ahorrar e invertir de forma agresiva para alcanzar la independencia financiera mucho antes de la edad de jubilación tradicional.',
  },
  {
    question: "¿Es lo mismo FIRE que un plan de jubilación tradicional?",
    answer:
      "No exactamente. Un plan de jubilación tradicional (plan de pensiones, jubilación pública) suele estar ligado a una edad fija establecida por ley o por el propio producto financiero, y normalmente sigues trabajando hasta llegar a esa edad. FIRE es un enfoque distinto: en vez de fijar una edad, fija un número de capital, y una vez lo alcanzas puedes dejar de depender de un salario, sea a los 35, 45 o 60 años. No son excluyentes: muchas personas combinan ambos, siguen contribuyendo a su plan de pensiones tradicional mientras además construyen su número FIRE por su cuenta.",
  },
  {
    question: "¿Por qué se usa el 4% como tasa de retirada segura?",
    answer:
      'Viene del "Trinity Study", una investigación sobre carteras de inversión en EE. UU. que encontró que retirar un 4% del capital cada año, ajustado por inflación, tenía una probabilidad alta de que el capital durara al menos 30 años. No es una garantía matemática, sino una guía orientativa basada en datos históricos, que no garantizan el comportamiento futuro de los mercados.',
  },
  {
    question: "¿Es mejor usar una tasa de retirada más baja que el 4%?",
    answer:
      "Una tasa más conservadora (3% o 3,5%) reduce el riesgo de quedarte sin capital, especialmente si tu jubilación va a ser muy larga, pero exige acumular un número FIRE más alto y por tanto tarda más en alcanzarse. Es una decisión de equilibrio entre seguridad y tiempo.",
  },
  {
    question: "¿Cómo afecta la inflación a mi número FIRE?",
    answer:
      "La inflación reduce tu poder adquisitivo con el tiempo, así que tu rentabilidad real (lo que realmente importa) es tu rentabilidad nominal menos la inflación. Esta calculadora ya tiene esto en cuenta al mostrarte tu rentabilidad real estimada, así que los años que te muestra son una estimación más honesta que si solo se usara la rentabilidad nominal.",
  },
  {
    question: "¿El número FIRE es el mismo para todo el mundo?",
    answer:
      "No. Depende directamente de tu gasto anual: cuanto menos necesites gastar para vivir como quieres, menor será tu número FIRE. Por eso reducir gastos innecesarios tiene un efecto doble: necesitas menos capital y puedes ahorrar más para llegar antes.",
  },
  {
    question: "¿Qué pasa si no llego a mi número FIRE con mis aportaciones actuales?",
    answer:
      "La calculadora te indica si es alcanzable con tu ritmo actual. Si no lo es, las palancas que tienes son: aumentar tu aportación mensual, buscar una rentabilidad mayor (asumiendo más riesgo), reducir tu gasto anual objetivo, o aceptar un plazo más largo.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${siteUrl}/calculadoras/numero-fire`,
  mainEntity: faqEntries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function NumeroFirePage() {
  const example1 = calculateFireNumber({
    annualExpenses: 24000,
    safeWithdrawalRatePercent: 4,
    currentSavings: 10000,
    monthlyContribution: 500,
    annualRatePercent: 7,
    annualInflationRatePercent: 2.5,
  });
  const example2 = calculateFireNumber({
    annualExpenses: 36000,
    safeWithdrawalRatePercent: 4,
    currentSavings: 20000,
    monthlyContribution: 800,
    annualRatePercent: 7,
    annualInflationRatePercent: 2.5,
  });
  const example3 = calculateFireNumber({
    annualExpenses: 24000,
    safeWithdrawalRatePercent: 3.5,
    currentSavings: 10000,
    monthlyContribution: 500,
    annualRatePercent: 7,
    annualInflationRatePercent: 2.5,
  });

  const withdrawalRateTable = [4, 3.5, 3].map((safeWithdrawalRatePercent) => ({
    safeWithdrawalRatePercent,
    result: calculateFireNumber({
      annualExpenses: 24000,
      safeWithdrawalRatePercent,
      currentSavings: 10000,
      monthlyContribution: 500,
      annualRatePercent: 7,
      annualInflationRatePercent: 2.5,
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
            { label: "Calculadora de jubilación anticipada (número FIRE)" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadora de jubilación anticipada (número FIRE)
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          Introduce el gasto anual que quieres cubrir con tus inversiones y la tasa de retirada
          segura para calcular el capital que necesitas. Con tu ahorro y aportación mensual
          actuales, te decimos cuántos años te faltan para alcanzar tu independencia financiera
          y poder dejar de depender de un sueldo.
        </p>
      </div>

      <FireNumberCalculator />

      <EmbedCodeButton
        slug="numero-fire"
        title="Calculadora del número FIRE"
        height={850}
      />

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Qué es el número FIRE</h2>
          <p>
            Todo plan de jubilación necesita responder a una pregunta central: ¿cuánto capital
            hace falta para poder dejar de depender de un salario? El movimiento FIRE responde
            con un enfoque concreto y una cifra objetivo:{" "}
            <Link href="/glosario/fire" className="underline hover:text-foreground">
              el número FIRE
            </Link>{" "}
            es la cantidad de dinero que necesitas tener invertida para poder vivir de tus
            inversiones sin depender de un salario. Se calcula con una fórmula sencilla: tu gasto
            anual dividido entre tu tasa de retirada segura. Por ejemplo, si gastas 24.000 € al
            año y usas una tasa de retirada del 4% (la más habitual, conocida como{" "}
            <Link href="/glosario/regla-del-4-por-ciento" className="underline hover:text-foreground">
              regla del 4%
            </Link>
            ), tu número FIRE sería 600.000 €.
          </p>
          <p>
            FIRE son las siglas de &ldquo;Financial Independence, Retire Early&rdquo; —
            independencia financiera, jubilación anticipada. No implica necesariamente dejar de
            trabajar del todo: para muchas personas significa simplemente tener la opción de
            hacerlo, sin que el dinero sea el motivo para seguir trabajando.
          </p>
          <p>
            Esta calculadora también tiene en cuenta la{" "}
            <Link href="/glosario/inflacion" className="underline hover:text-foreground">
              inflación
            </Link>
            : te muestra tu{" "}
            <Link
              href="/glosario/rentabilidad-real-vs-nominal"
              className="underline hover:text-foreground"
            >
              rentabilidad real
            </Link>{" "}
            (la nominal descontando la inflación esperada), porque lo que importa no es cuánto
            dinero tendrás en el futuro, sino cuánto podrás comprar con él.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cómo usar la calculadora del número FIRE
          </h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="text-foreground">Gasto anual:</strong> cuánto necesitas gastar
              al año para vivir como quieres vivir (incluye vivienda, comida, ocio, todo). Sé
              realista, no optimista.
            </li>
            <li>
              <strong className="text-foreground">Tasa de retirada segura:</strong> el porcentaje
              de tu capital que planeas retirar cada año. El 4% es el punto de partida más
              habitual (basado en el &ldquo;Trinity Study&rdquo;), pero algunas personas usan un
              3-3,5% para tener más margen de seguridad, especialmente si planean una jubilación
              muy larga.
            </li>
            <li>
              <strong className="text-foreground">Ahorro/inversión actual:</strong> el capital
              que ya tienes invertido hoy.
            </li>
            <li>
              <strong className="text-foreground">Aportación mensual:</strong> cuánto inviertes
              cada mes actualmente.
            </li>
            <li>
              <strong className="text-foreground">Rentabilidad anual esperada:</strong> el
              rendimiento nominal que esperas de tus inversiones (antes de descontar inflación).
            </li>
            <li>
              <strong className="text-foreground">Inflación anual esperada:</strong> normalmente
              entre el 2% y el 3% a largo plazo.
            </li>
          </ol>
          <p>
            La calculadora te dirá tu número FIRE, si es alcanzable con tus aportaciones actuales,
            y cuántos años te faltan para llegar. Por debajo, usa el mismo motor de cálculo que
            nuestra{" "}
            <Link href="/calculadoras/interes-compuesto" className="underline hover:text-foreground">
              calculadora de interés compuesto
            </Link>
            , aplicado a tu objetivo de independencia financiera.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Ejemplos con euros reales</h2>
          <p>
            Con los valores por defecto de la calculadora (24.000 €/año de gasto, tasa de
            retirada del 4%, 10.000 € ya invertidos, 500 €/mes de aportación, 7% de rentabilidad
            nominal y 2,5% de inflación esperada), el número FIRE es de{" "}
            {formatEUR(example1.fireNumber)} y, a este ritmo, se alcanzaría en unos{" "}
            {yearsFormatter.format(example1.yearsToTarget ?? 0)} años (con una rentabilidad real
            aplicada del {percentFormatter.format(example1.realAnnualRatePercent)}% anual, ya
            descontada la inflación).
          </p>
          <p>
            Alguien con un gasto anual de 36.000 €, 20.000 € ya invertidos y una aportación
            mensual de 800 € (misma tasa de retirada, rentabilidad e inflación) tiene un número
            FIRE mayor, de {formatEUR(example2.fireNumber)}, pero gracias a la aportación más
            alta lo alcanzaría en un plazo similar: unos{" "}
            {yearsFormatter.format(example2.yearsToTarget ?? 0)} años.
          </p>
          <p>
            Si esa misma persona del primer ejemplo prefiere ser más conservadora y usa una tasa
            de retirada del 3,5% en lugar del 4%, su número FIRE sube a{" "}
            {formatEUR(example3.fireNumber)} (frente a los {formatEUR(example1.fireNumber)}{" "}
            anteriores) y el tiempo necesario para alcanzarlo aumenta a unos{" "}
            {yearsFormatter.format(example3.yearsToTarget ?? 0)} años: casi tres años más solo
            por elegir un margen de seguridad mayor.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            El impacto de la tasa de retirada segura
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Número FIRE y años estimados según la tasa de retirada, para el mismo perfil de
                ahorro
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Tasa de retirada
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Número FIRE
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Años estimados
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawalRateTable.map(({ safeWithdrawalRatePercent, result }, index) => (
                  <tr
                    key={safeWithdrawalRatePercent}
                    className={index < withdrawalRateTable.length - 1 ? "border-b border-border/60" : undefined}
                  >
                    <th scope="row" className="py-2 pr-4 font-medium text-foreground">
                      {withdrawalRateFormatter.format(safeWithdrawalRatePercent)}%
                    </th>
                    <td className="py-2 pr-4">{formatEUR(result.fireNumber)}</td>
                    <td className="py-2">
                      {yearsFormatter.format(result.yearsToTarget ?? 0)} años
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

      <RelatedGlossaryTerms
        slugs={["fire", "regla-del-4-por-ciento", "rentabilidad-real-vs-nominal", "inflacion"]}
      />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad anual constante y
        una tasa de retirada fija; los resultados son estimaciones y no constituyen una
        recomendación de inversión.
      </p>
    </main>
  );
}
