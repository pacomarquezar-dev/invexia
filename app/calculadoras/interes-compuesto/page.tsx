import type { Metadata } from "next";
import CompoundInterestCalculator from "./CompoundInterestCalculator";

export const metadata: Metadata = {
  title: "Calculadora de interés compuesto",
  description:
    "Calcula cuánto puede crecer tu dinero con el interés compuesto. Introduce tu capital inicial, aportación mensual, tasa de interés y años, y consulta la evolución de tu capital.",
  alternates: {
    canonical: "/calculadoras/interes-compuesto",
  },
};

export default function InteresCompuestoPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Calculadora de interés compuesto
        </h1>
        <p className="max-w-2xl text-foreground/70">
          Introduce tu capital inicial, tu aportación mensual, la tasa de interés anual esperada
          y el número de años. Verás el capital final estimado y cómo evoluciona a lo largo del
          tiempo.
        </p>
      </div>

      <CompoundInterestCalculator />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Los resultados son estimaciones basadas en
        una tasa de interés constante y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
