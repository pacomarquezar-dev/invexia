import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { calculators } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Calculadoras",
  description:
    "Calculadoras financieras interactivas y gratuitas: interés compuesto, DCA vs pago único y más.",
  alternates: {
    canonical: "/calculadoras",
  },
};

export default function CalculadorasPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Calculadoras" }]} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Calculadoras</h1>
        <p className="max-w-2xl text-foreground/70">
          Elige una calculadora para empezar a explorar tus finanzas.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {calculators.map((calculator) => (
          <li key={calculator.href}>
            <Link
              href={calculator.href}
              className="block h-full rounded-lg border border-foreground/10 p-5 transition-colors hover:bg-foreground/5"
            >
              <p className="font-medium">{calculator.name}</p>
              <p className="mt-1 text-sm text-foreground/70">{calculator.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
