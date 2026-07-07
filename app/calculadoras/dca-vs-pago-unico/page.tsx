import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import DcaVsLumpSumCalculator from "./DcaVsLumpSumCalculator";

export const metadata: Metadata = {
  title: "DCA vs pago único",
  description:
    "Compara invertir todo tu capital de golpe frente a repartirlo en aportaciones periódicas (DCA). Introduce tu capital, horizonte temporal y rentabilidad esperada, y consulta cuál gana y por cuánto.",
  alternates: {
    canonical: "/calculadoras/dca-vs-pago-unico",
  },
};

export default function DcaVsPagoUnicoPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "DCA vs pago único" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          DCA vs pago único
        </h1>
        <p className="max-w-2xl text-foreground/70">
          Introduce el capital total que quieres invertir, el horizonte temporal y la
          rentabilidad anual esperada. Compara invertirlo todo de golpe frente a repartirlo en
          aportaciones mensuales iguales a lo largo del tiempo.
        </p>
      </div>

      <DcaVsLumpSumCalculator />

      <RelatedGlossaryTerms slugs={["dca"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una rentabilidad constante y no
        tiene en cuenta la volatilidad real del mercado; los resultados son estimaciones y no
        constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
