import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal de Invexia: identificación del titular, naturaleza del sitio y condiciones de uso del contenido y las calculadoras.",
  alternates: {
    canonical: "/legal/aviso-legal",
  },
};

export default function AvisoLegalPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Aviso legal" }]} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Aviso legal</h1>
      </div>

      <div className="flex flex-col gap-8 text-foreground/80">
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">1. Identificación del titular</h2>
          <p>
            En cumplimiento del deber de información recogido en el artículo 10 de la Ley
            34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
            Comercio Electrónico (LSSI-CE), se informa de que este sitio web,{" "}
            <span className="font-medium text-foreground">invexia.es</span>, es titularidad de:
          </p>
          {/* PLACEHOLDER: rellenar con los datos reales del titular antes de publicar */}
          <ul className="list-disc pl-5">
            <li>Nombre: [FRANCISCO MÁRQUEZ ARENAS]</li>
            <li>Correo de contacto: [franciscomarare8@gmail.com]</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">2. Naturaleza del sitio</h2>
          <p>
            Invexia es un proyecto personal de carácter educativo. Su objetivo es ayudar a
            entender conceptos de finanzas personales mediante calculadoras interactivas, un
            glosario de términos financieros y un asistente conversacional de apoyo. No es una
            entidad financiera, no presta servicios de inversión ni actúa como intermediario de
            ningún producto financiero.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Condiciones de uso y exención de responsabilidad
          </h2>
          <p>
            El acceso y uso de este sitio web atribuye la condición de usuario y supone la
            aceptación de las condiciones aquí recogidas. Todo el contenido, incluidas las
            calculadoras, el glosario y las respuestas del asistente conversacional, tiene una
            finalidad exclusivamente educativa e informativa. En ningún caso constituye
            asesoramiento financiero, fiscal o de inversión regulado, ni una recomendación
            personalizada sobre productos, activos o entidades concretas.
          </p>
          <p>
            El titular no se responsabiliza de las decisiones financieras que el usuario tome a
            partir de la información o los resultados obtenidos en este sitio. Antes de tomar
            cualquier decisión de inversión relevante, se recomienda consultar con un profesional
            debidamente habilitado.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">4. Propiedad intelectual</h2>
          <p>
            Los textos, el diseño, el código y demás elementos de este sitio son propiedad del
            titular o se utilizan con la correspondiente autorización, y están protegidos por la
            normativa de propiedad intelectual. No está permitida su reproducción total o parcial
            sin autorización expresa, salvo cita con enlace a la fuente original.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">5. Legislación aplicable</h2>
          <p>
            Las presentes condiciones se rigen por la legislación española. Cualquier
            controversia derivada del uso del sitio se someterá a los juzgados y tribunales que
            correspondan conforme a la normativa vigente en materia de protección de
            consumidores.
          </p>
        </section>
      </div>
    </main>
  );
}
