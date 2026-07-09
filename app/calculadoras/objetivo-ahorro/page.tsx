import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SavingsGoalCalculator from "./SavingsGoalCalculator";

export const metadata: Metadata = {
  title: "Calculadora de objetivo de ahorro",
  description:
    "Calcula cuánto tienes que aportar cada mes para alcanzar tu objetivo de ahorro en el plazo que quieras, teniendo en cuenta el interés compuesto.",
  alternates: {
    canonical: "/calculadoras/objetivo-ahorro",
  },
};

export default function ObjetivoAhorroPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
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

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad anual constante;
        los resultados son estimaciones y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
