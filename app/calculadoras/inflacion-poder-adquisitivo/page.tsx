import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGlossaryTerms from "@/components/RelatedGlossaryTerms";
import InflationImpactCalculator from "./InflationImpactCalculator";

export const metadata: Metadata = {
  title: "Calculadora de inflación y poder adquisitivo",
  description:
    "Calcula cuánto poder adquisitivo real perderá tu dinero por la inflación en los próximos años. Descubre cuánto valdría hoy esa misma cantidad dentro de X años.",
  alternates: {
    canonical: "/calculadoras/inflacion-poder-adquisitivo",
  },
};

export default function InflacionPoderAdquisitivoPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Calculadoras", href: "/calculadoras" },
            { label: "Inflación y poder adquisitivo" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Calculadora de inflación y poder adquisitivo
        </h1>
        <p className="max-w-2xl text-foreground/70">
          Introduce una cantidad de dinero, la inflación anual esperada y un número de años.
          Verás cuánto podrías comprar realmente con esa cantidad dentro de ese tiempo, en
          euros de hoy.
        </p>
      </div>

      <InflationImpactCalculator />

      <RelatedGlossaryTerms slugs={["inflacion", "rentabilidad-real-vs-nominal"]} />

      <p className="text-xs text-foreground/50">
        Esta calculadora es una herramienta educativa. Asume una inflación anual constante; los
        resultados son estimaciones y no constituyen una recomendación de inversión.
      </p>
    </main>
  );
}
