import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Entiende tus finanzas personales
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-foreground/70">
        Invexia está en construcción: calculadoras interactivas, un glosario
        financiero y un asistente educativo para aprender a gestionar tu
        dinero, en español.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/calculadoras/interes-compuesto"
          className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Calculadora de interés compuesto
        </Link>
        <Link
          href="/calculadoras/dca-vs-pago-unico"
          className="rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          DCA vs pago único
        </Link>
      </div>
    </main>
  );
}
