import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "Sobre Invexia",
  description:
    "Quién hay detrás de Invexia, por qué existe este proyecto, y qué principios sigue el contenido educativo sobre finanzas e inversión.",
  alternates: {
    canonical: "/sobre",
  },
};

export default function SobrePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Sobre Invexia" }]} />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Sobre Invexia
        </h1>
      </div>

      <div className="flex flex-col gap-6 text-foreground/80">
        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Quién soy</h2>
          <p>
            Soy Paco, estudiante en España aprendiendo desarrollo web a través de proyectos
            reales. Invexia nació en julio de 2026 como un proyecto para aprender construyendo
            algo útil de verdad, no como un ejercicio de práctica sin propósito.
          </p>
          <p>
            No soy asesor financiero ni tengo formación profesional en finanzas — soy alguien
            aprendiendo a programar a quien también le interesan las finanzas personales, y
            Invexia es el resultado de combinar ambas cosas.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Por qué existe Invexia</h2>
          <p>
            Quería una herramienta en español, adaptada a la fiscalidad y la realidad española —
            no calculadoras genéricas traducidas de Estados Unidos — que explicara los conceptos
            con el mismo rigor con el que me hubiera gustado que me los explicaran a mí cuando
            empecé a interesarme por invertir.
          </p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Cómo se construye el contenido
          </h2>
          <p>
            Cada calculadora usa fórmulas matemáticas estándar (interés compuesto, la regla del
            4%, la ecuación de Fisher para inflación), verificables y documentadas en el propio
            código, que es público en GitHub. Los datos fiscales y de mercado citados en las
            guías y artículos (tramos de IRPF, tipos de interés de referencia) se verifican
            contra fuentes oficiales o de referencia del sector en el momento de publicación, y
            se procura mantenerlos actualizados.
          </p>
          <p>Todo el contenido es educativo, no asesoramiento financiero personalizado.</p>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Qué es Invexia y qué no es</h2>
          <ul className="list-disc pl-5">
            <li>Es una herramienta educativa gratuita, sin necesidad de registro</li>
            <li>No es asesoramiento financiero, fiscal ni de inversión personalizado</li>
            <li>
              No vende ningún producto financiero ni recibe comisión por recomendar bancos,
              brokers o fondos concretos
            </li>
            <li>
              El código es{" "}
              <a
                href="https://github.com/pacomarquezar-dev/invexia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                abierto y público en GitHub
              </a>
              , para quien quiera verificar cómo funcionan los cálculos
            </li>
          </ul>
        </Card>

        <Card as="section" className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">Contacto</h2>
          <p>
            Para dudas, sugerencias o si detectas un error, puedes contactar a través de los
            datos del{" "}
            <Link href="/legal/aviso-legal" className="underline hover:text-foreground">
              aviso legal
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
