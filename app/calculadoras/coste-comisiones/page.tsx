import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FeeImpactCalculator from "./FeeImpactCalculator";

export const metadata: Metadata = {
  title: "Coste real de las comisiones a largo plazo",
  description:
    "Descubre cuánto te cuestan las comisiones de gestión a largo plazo. Compara tres escenarios de comisión anual (baja, media y alta) sobre el mismo capital y rentabilidad esperada.",
  alternates: {
    canonical: "/calculadoras/coste-comisiones",
  },
};

export default function CosteComisionesPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Coste real de las comisiones" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Coste real de las comisiones a largo plazo
        </h1>
        <p className="max-w-2xl text-foreground/70">
          Una comisión anual que parece pequeña puede suponer una diferencia enorme al cabo de
          los años. Introduce tu capital, la rentabilidad esperada y compara tres escenarios de
          comisión — bajo, medio y alto — para ver cuánto se lleva cada uno.
        </p>
      </div>

      <FeeImpactCalculator />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume que la comisión anual se resta
        directamente de la rentabilidad bruta cada año; los resultados son estimaciones y no
        constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
