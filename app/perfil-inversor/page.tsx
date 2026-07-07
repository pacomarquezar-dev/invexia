import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import InvestorProfileQuizLoader from "./InvestorProfileQuizLoader";

export const metadata: Metadata = {
  title: "Test de perfil de inversor",
  description:
    "Descubre tu perfil de inversor (conservador, moderado o agresivo) en 7 preguntas rápidas sobre tu tolerancia al riesgo y tu horizonte temporal.",
  alternates: {
    canonical: "/perfil-inversor",
  },
};

export default function PerfilInversorPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Test de perfil de inversor" }]} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Test de perfil de inversor
        </h1>
        <p className="max-w-xl text-foreground/70">
          Responde 7 preguntas rápidas sobre tu tolerancia al riesgo, tu horizonte temporal y tu
          experiencia. Al final verás si tu perfil es conservador, moderado o agresivo.
        </p>
      </div>

      <InvestorProfileQuizLoader />

      <p className="text-xs text-foreground/50">
        Este test es una herramienta educativa que orienta sobre tu perfil de riesgo. No es un
        test regulado ni sustituye el análisis de idoneidad de una entidad financiera, y no
        constituye una recomendación de inversión. El resultado se guarda solo en tu navegador.
      </p>
    </main>
  );
}
