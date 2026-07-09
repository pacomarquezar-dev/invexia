import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { calculators } from "@/lib/calculators";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-dot-grid px-6 py-24 text-center">
      <div
        aria-hidden="true"
        className="mark-silhouette pointer-events-none absolute -right-24 -top-24 h-[32rem] w-[29rem] text-muted opacity-[0.06] sm:h-[40rem] sm:w-[36rem]"
      />

      <div className="relative flex flex-col items-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Dale dirección a tu dinero
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          Calculadoras interactivas, un glosario claro y un asistente con IA
          para entender tus finanzas, sin tecnicismos.
        </p>

        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full bg-accent-secondary opacity-20 blur-3xl"
          />
          <Button href="/perfil-inversor">Descubre tu perfil de inversor</Button>
        </div>
      </div>

      <div className="relative mt-16 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-2">
        {calculators.map((calculator) => (
          <Card key={calculator.href} className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-foreground">
              {calculator.name}
            </h2>
            <p className="flex-1 text-sm text-muted">{calculator.description}</p>
            <Link
              href={calculator.href}
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Abrir calculadora →
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
