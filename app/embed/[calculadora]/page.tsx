import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CompoundInterestCalculator from "@/app/(site)/calculadoras/interes-compuesto/CompoundInterestCalculator";
import DcaVsLumpSumCalculator from "@/app/(site)/calculadoras/dca-vs-pago-unico/DcaVsLumpSumCalculator";
import FeeImpactCalculator from "@/app/(site)/calculadoras/coste-comisiones/FeeImpactCalculator";
import SavingsGoalCalculator from "@/app/(site)/calculadoras/objetivo-ahorro/SavingsGoalCalculator";
import FireNumberCalculator from "@/app/(site)/calculadoras/numero-fire/FireNumberCalculator";
import InflationImpactCalculator from "@/app/(site)/calculadoras/inflacion-poder-adquisitivo/InflationImpactCalculator";

interface EmbedEntry {
  title: string;
  Component: ComponentType;
  /** Solo interés compuesto lee parámetros de la URL (useSearchParams) y necesita Suspense. */
  needsSuspense?: boolean;
}

const embedCalculators: Record<string, EmbedEntry> = {
  "interes-compuesto": {
    title: "Calculadora de interés compuesto",
    Component: CompoundInterestCalculator,
    needsSuspense: true,
  },
  "dca-vs-pago-unico": {
    title: "Calculadora de DCA vs pago único",
    Component: DcaVsLumpSumCalculator,
  },
  "coste-comisiones": {
    title: "Calculadora del coste real de las comisiones",
    Component: FeeImpactCalculator,
  },
  "objetivo-ahorro": {
    title: "Calculadora de objetivo de ahorro",
    Component: SavingsGoalCalculator,
  },
  "numero-fire": {
    title: "Calculadora del número FIRE",
    Component: FireNumberCalculator,
  },
  "inflacion-poder-adquisitivo": {
    title: "Calculadora de inflación y poder adquisitivo",
    Component: InflationImpactCalculator,
  },
};

interface PageProps {
  params: Promise<{ calculadora: string }>;
}

export function generateStaticParams() {
  return Object.keys(embedCalculators).map((calculadora) => ({ calculadora }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { calculadora } = await params;
  const entry = embedCalculators[calculadora];

  return {
    title: entry?.title ?? "Calculadora no encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function EmbedCalculadoraPage({ params }: PageProps) {
  const { calculadora } = await params;
  const entry = embedCalculators[calculadora];

  if (!entry) {
    notFound();
  }

  const { Component, needsSuspense } = entry;

  return (
    <main className="p-4">
      {needsSuspense ? (
        <Suspense fallback={null}>
          <Component />
        </Suspense>
      ) : (
        <Component />
      )}
    </main>
  );
}
