import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import CompoundInterestCalculator from "./CompoundInterestCalculator";

export const metadata: Metadata = {
  title: "Calculadora de interés compuesto",
  description:
    "Esta calculadora de interés compuesto muestra cuánto puede crecer tu dinero. Introduce tu capital inicial, aportación mensual, tasa de interés y años, y consulta la evolución de tu capital.",
  alternates: {
    canonical: "/calculadoras/interes-compuesto",
  },
};

export default function InteresCompuestoPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
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

      <CompoundInterestCalculator />

      <RelatedGlossaryTerms slugs={["interes-compuesto", "interes-simple", "tae", "tin"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Los resultados son estimaciones basadas en
        una tasa de interés constante y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
