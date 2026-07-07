import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FireNumberCalculator from "./FireNumberCalculator";

export const metadata: Metadata = {
  title: "Calculadora del número FIRE",
  description:
    "Calcula tu número FIRE (independencia financiera): el capital que necesitas para vivir de tus inversiones, y cuántos años te faltan para alcanzarlo con tu ahorro y aportación actuales.",
  alternates: {
    canonical: "/calculadoras/numero-fire",
  },
};

export default function NumeroFirePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Número FIRE" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Calculadora del número FIRE
        </h1>
        <p className="max-w-2xl text-foreground/70">
          Introduce el gasto anual que quieres cubrir con tus inversiones y la tasa de retirada
          segura para calcular tu número FIRE. Con tu ahorro y aportación mensual actuales, te
          decimos cuántos años te faltan para alcanzarlo.
        </p>
      </div>

      <FireNumberCalculator />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad anual constante y
        una tasa de retirada fija; los resultados son estimaciones y no constituyen una
        recomendación de inversión.
      </p>
    </main>
  );
}
